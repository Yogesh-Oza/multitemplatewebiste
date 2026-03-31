import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import {
  MODEL_MIGRATION_SPECS,
  collectBlobUrls,
  rewriteBlobUrls,
  type ModelMigrationSpec,
} from '../src/lib/blob-url-migration';
import {
  buildMigrationObjectKey,
  buildPublicS3Url,
  getS3Client,
  requireStorageEnv,
} from '../src/lib/s3-storage';

type Mode = 'dry-run' | 'copy-only' | 'rewrite-only' | 'full';

interface ParsedArgs {
  mode: Mode;
  mappingFile: string;
}

interface FieldSummary {
  field: string;
  recordsWithBlobUrls: number;
  blobUrlCount: number;
  uniqueBlobUrlCount: number;
}

interface ModelSummary {
  model: string;
  delegate: string;
  recordsScanned: number;
  recordsUpdated: number;
  fields: FieldSummary[];
}

interface FailureEntry {
  model?: string;
  recordId?: string;
  field?: string;
  url?: string;
  reason: string;
}

interface MappingFile {
  createdAt: string;
  updatedAt: string;
  mappings: Record<string, string>;
}

const prisma = new PrismaClient();

function parseArgs(argv: string[]): ParsedArgs {
  let mode: Mode = 'dry-run';
  let mappingFile = join(process.cwd(), 'outputs', 'runtime', 's3-migration', 'blob-to-s3-url-map.json');

  for (const arg of argv) {
    if (arg.startsWith('--mode=')) {
      const value = arg.slice('--mode='.length) as Mode;
      if (value === 'dry-run' || value === 'copy-only' || value === 'rewrite-only' || value === 'full') {
        mode = value;
      }
    } else if (arg.startsWith('--mapping-file=')) {
      mappingFile = arg.slice('--mapping-file='.length);
    }
  }

  return { mode, mappingFile };
}

async function ensureParentDirectory(filePath: string) {
  await mkdir(dirname(filePath), { recursive: true });
}

async function readMappingFile(filePath: string): Promise<MappingFile> {
  try {
    const raw = await readFile(filePath, 'utf8');
    const parsed = JSON.parse(raw) as Partial<MappingFile>;
    return {
      createdAt: parsed.createdAt || new Date().toISOString(),
      updatedAt: parsed.updatedAt || new Date().toISOString(),
      mappings: parsed.mappings || {},
    };
  } catch {
    return {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      mappings: {},
    };
  }
}

async function writeMappingFile(filePath: string, data: MappingFile) {
  await ensureParentDirectory(filePath);
  await writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

function getDelegate(delegate: string): any {
  return (prisma as any)[delegate];
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)];
}

async function copyBlobToS3(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download source file (${response.status})`);
  }

  const body = Buffer.from(await response.arrayBuffer());
  const key = buildMigrationObjectKey(url);
  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const cacheControl = response.headers.get('cache-control') || 'public, max-age=31536000, immutable';
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: cacheControl,
    })
  );

  return buildPublicS3Url(key);
}

async function processModel(
  spec: ModelMigrationSpec,
  mode: Mode,
  mapping: MappingFile,
  failures: FailureEntry[],
  copiedUrls: Set<string>,
  rewrittenUrls: Set<string>
): Promise<ModelSummary> {
  const delegate = getDelegate(spec.delegate);
  if (!delegate || typeof delegate.findMany !== 'function') {
    failures.push({
      model: spec.model,
      reason: `Prisma delegate "${spec.delegate}" was not found`,
    });
    return {
      model: spec.model,
      delegate: spec.delegate,
      recordsScanned: 0,
      recordsUpdated: 0,
      fields: spec.fields.map((field) => ({
        field: field.field,
        recordsWithBlobUrls: 0,
        blobUrlCount: 0,
        uniqueBlobUrlCount: 0,
      })),
    };
  }

  const records = await delegate.findMany();
  const fieldSummaries = new Map<string, FieldSummary>();
  let recordsUpdated = 0;

  for (const field of spec.fields) {
    fieldSummaries.set(field.field, {
      field: field.field,
      recordsWithBlobUrls: 0,
      blobUrlCount: 0,
      uniqueBlobUrlCount: 0,
    });
  }

  for (const record of records) {
    const updateData: Record<string, unknown> = {};

    for (const field of spec.fields) {
      const currentValue = record[field.field];
      const blobUrls = collectBlobUrls(currentValue);
      const uniqueBlobUrls = uniqueStrings(blobUrls);
      const summary = fieldSummaries.get(field.field)!;

      if (uniqueBlobUrls.length > 0) {
        summary.recordsWithBlobUrls += 1;
        summary.blobUrlCount += blobUrls.length;
        summary.uniqueBlobUrlCount += uniqueBlobUrls.length;
      }

      if ((mode === 'copy-only' || mode === 'full') && uniqueBlobUrls.length > 0) {
        for (const blobUrl of uniqueBlobUrls) {
          if (mapping.mappings[blobUrl]) {
            continue;
          }

          try {
            mapping.mappings[blobUrl] = await copyBlobToS3(blobUrl);
            mapping.updatedAt = new Date().toISOString();
            copiedUrls.add(blobUrl);
          } catch (error) {
            failures.push({
              model: spec.model,
              recordId: record.id,
              field: field.field,
              url: blobUrl,
              reason: error instanceof Error ? error.message : 'Failed to copy blob URL',
            });
          }
        }
      }

      if (mode === 'rewrite-only' || mode === 'full') {
        const rewriteResult = rewriteBlobUrls(currentValue, (url) => mapping.mappings[url]);
        if (rewriteResult.changed) {
          updateData[field.field] = rewriteResult.value;
          rewriteResult.changedUrls.forEach((url) => rewrittenUrls.add(url));
        } else if (uniqueBlobUrls.length > 0) {
          const unresolved = uniqueBlobUrls.filter((url) => !mapping.mappings[url]);
          for (const url of unresolved) {
            failures.push({
              model: spec.model,
              recordId: record.id,
              field: field.field,
              url,
              reason: 'No S3 mapping exists for this Blob URL',
            });
          }
        }
      }
    }

    if ((mode === 'rewrite-only' || mode === 'full') && Object.keys(updateData).length > 0) {
      await delegate.update({
        where: { id: record.id },
        data: updateData,
      });
      recordsUpdated += 1;
    }
  }

  return {
    model: spec.model,
    delegate: spec.delegate,
    recordsScanned: records.length,
    recordsUpdated,
    fields: [...fieldSummaries.values()],
  };
}

async function main() {
  const { mode, mappingFile } = parseArgs(process.argv.slice(2));
  const startTime = new Date().toISOString();

  if (mode === 'copy-only' || mode === 'full') {
    requireStorageEnv('AWS_REGION');
    requireStorageEnv('AWS_ACCESS_KEY_ID');
    requireStorageEnv('AWS_SECRET_ACCESS_KEY');
    requireStorageEnv('AWS_S3_BUCKET');
  }

  const mapping = await readMappingFile(mappingFile);
  const failures: FailureEntry[] = [];
  const copiedUrls = new Set<string>();
  const rewrittenUrls = new Set<string>();
  const modelSummaries: ModelSummary[] = [];

  for (const spec of MODEL_MIGRATION_SPECS) {
    modelSummaries.push(await processModel(spec, mode, mapping, failures, copiedUrls, rewrittenUrls));
  }

  if (mode === 'copy-only' || mode === 'full') {
    await writeMappingFile(mappingFile, mapping);
  }

  const report = {
    startedAt: startTime,
    finishedAt: new Date().toISOString(),
    mode,
    mappingFile,
    scannedModels: modelSummaries.length,
    scannedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsScanned, 0),
    updatedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsUpdated, 0),
    copiedBlobUrlCount: copiedUrls.size,
    rewrittenBlobUrlCount: rewrittenUrls.size,
    existingMappingCount: Object.keys(mapping.mappings).length,
    failures,
    models: modelSummaries,
  };

  const reportPath = join(
    process.cwd(),
    'outputs',
    'runtime',
    's3-migration',
    `blob-to-s3-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );

  await ensureParentDirectory(reportPath);
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Mode: ${mode}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Mapping file: ${mappingFile}`);
  console.log(`Records scanned: ${report.scannedRecords}`);
  console.log(`Records updated: ${report.updatedRecords}`);
  console.log(`Blob URLs copied: ${report.copiedBlobUrlCount}`);
  console.log(`Blob URLs rewritten: ${report.rewrittenBlobUrlCount}`);
  console.log(`Failures: ${report.failures.length}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
