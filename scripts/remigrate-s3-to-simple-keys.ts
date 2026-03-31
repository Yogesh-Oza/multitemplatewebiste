import { mkdir, readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';
import { GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { MODEL_MIGRATION_SPECS, type ModelMigrationSpec } from '../src/lib/blob-url-migration';
import {
  buildPublicS3Url,
  buildSimpleRemigrationObjectKey,
  getS3Client,
  requireStorageEnv,
} from '../src/lib/s3-storage';

type Mode = 'dry-run' | 'copy-only' | 'rewrite-only' | 'full';

interface ParsedArgs {
  mode: Mode;
  mappingFile: string;
}

interface MappingFile {
  createdAt: string;
  updatedAt: string;
  mappings: Record<string, string>;
}

interface FailureEntry {
  model?: string;
  recordId?: string;
  field?: string;
  url?: string;
  reason: string;
}

interface FieldSummary {
  field: string;
  recordsWithLegacyUrls: number;
  legacyUrlCount: number;
  uniqueLegacyUrlCount: number;
}

interface ModelSummary {
  model: string;
  delegate: string;
  recordsScanned: number;
  recordsUpdated: number;
  fields: FieldSummary[];
}

const prisma = new PrismaClient();

function parseArgs(argv: string[]): ParsedArgs {
  let mode: Mode = 'dry-run';
  let mappingFile = join(process.cwd(), 'outputs', 'runtime', 's3-migration', 's3-simple-url-map.json');

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

function getPublicS3Host(): string {
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;
  if (publicBaseUrl) {
    try {
      return new URL(publicBaseUrl).host;
    } catch {
      // fallback to bucket host
    }
  }

  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const region = requireStorageEnv('AWS_REGION');
  return `${bucket}.s3.${region}.amazonaws.com`;
}

function isLegacyMigratedS3Url(value: string, host: string): boolean {
  try {
    const url = new URL(value);
    return url.host === host && url.pathname.startsWith('/migrated/vercel-blob/');
  } catch {
    return false;
  }
}

function collectLegacyUrls(value: unknown, host: string): string[] {
  if (typeof value === 'string') {
    return isLegacyMigratedS3Url(value, host) ? [value] : [];
  }
  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectLegacyUrls(entry, host));
  }
  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap((entry) => collectLegacyUrls(entry, host));
  }
  return [];
}

function rewriteLegacyUrls(
  value: unknown,
  host: string,
  mapper: (url: string) => string | undefined
): { value: unknown; changed: boolean; changedUrls: string[] } {
  if (typeof value === 'string') {
    if (!isLegacyMigratedS3Url(value, host)) {
      return { value, changed: false, changedUrls: [] };
    }
    const mapped = mapper(value);
    if (!mapped || mapped === value) {
      return { value, changed: false, changedUrls: [] };
    }
    return { value: mapped, changed: true, changedUrls: [value] };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const changedUrls: string[] = [];
    const next = value.map((entry) => {
      const result = rewriteLegacyUrls(entry, host, mapper);
      changed ||= result.changed;
      changedUrls.push(...result.changedUrls);
      return result.value;
    });
    return { value: changed ? next : value, changed, changedUrls };
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const changedUrls: string[] = [];
    const nextEntries = Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      const result = rewriteLegacyUrls(entry, host, mapper);
      changed ||= result.changed;
      changedUrls.push(...result.changedUrls);
      return [key, result.value] as const;
    });
    return {
      value: changed ? Object.fromEntries(nextEntries) : value,
      changed,
      changedUrls,
    };
  }

  return { value, changed: false, changedUrls: [] };
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

async function streamToBuffer(stream: any): Promise<Buffer> {
  if (!stream) return Buffer.alloc(0);
  const chunks: Buffer[] = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

async function copyLegacyObjectToSimpleKey(url: string): Promise<string> {
  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const key = new URL(url).pathname.replace(/^\/+/, '');
  const client = getS3Client();
  const getResult = await client.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const body = await streamToBuffer(getResult.Body);
  const newKey = buildSimpleRemigrationObjectKey(url, getResult.ContentType);

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: newKey,
      Body: body,
      ContentType: getResult.ContentType || 'application/octet-stream',
      CacheControl: getResult.CacheControl || 'public, max-age=31536000, immutable',
    })
  );

  return buildPublicS3Url(newKey);
}

async function processModel(
  spec: ModelMigrationSpec,
  mode: Mode,
  host: string,
  mapping: MappingFile,
  failures: FailureEntry[],
  copiedUrls: Set<string>,
  rewrittenUrls: Set<string>
): Promise<ModelSummary> {
  const delegate = getDelegate(spec.delegate);
  if (!delegate || typeof delegate.findMany !== 'function') {
    failures.push({ model: spec.model, reason: `Prisma delegate "${spec.delegate}" not found` });
    return {
      model: spec.model,
      delegate: spec.delegate,
      recordsScanned: 0,
      recordsUpdated: 0,
      fields: spec.fields.map((field) => ({
        field: field.field,
        recordsWithLegacyUrls: 0,
        legacyUrlCount: 0,
        uniqueLegacyUrlCount: 0,
      })),
    };
  }

  const records = await delegate.findMany();
  const fieldSummaries = new Map<string, FieldSummary>();
  let recordsUpdated = 0;

  for (const field of spec.fields) {
    fieldSummaries.set(field.field, {
      field: field.field,
      recordsWithLegacyUrls: 0,
      legacyUrlCount: 0,
      uniqueLegacyUrlCount: 0,
    });
  }

  for (const record of records) {
    const updateData: Record<string, unknown> = {};

    for (const field of spec.fields) {
      const currentValue = record[field.field];
      const legacyUrls = collectLegacyUrls(currentValue, host);
      const uniqueLegacyUrls = uniqueStrings(legacyUrls);
      const summary = fieldSummaries.get(field.field)!;

      if (uniqueLegacyUrls.length > 0) {
        summary.recordsWithLegacyUrls += 1;
        summary.legacyUrlCount += legacyUrls.length;
        summary.uniqueLegacyUrlCount += uniqueLegacyUrls.length;
      }

      if ((mode === 'copy-only' || mode === 'full') && uniqueLegacyUrls.length > 0) {
        for (const legacyUrl of uniqueLegacyUrls) {
          if (mapping.mappings[legacyUrl]) continue;
          try {
            mapping.mappings[legacyUrl] = await copyLegacyObjectToSimpleKey(legacyUrl);
            mapping.updatedAt = new Date().toISOString();
            copiedUrls.add(legacyUrl);
          } catch (error) {
            failures.push({
              model: spec.model,
              recordId: record.id,
              field: field.field,
              url: legacyUrl,
              reason: error instanceof Error ? error.message : 'Failed copying legacy S3 object',
            });
          }
        }
      }

      if (mode === 'rewrite-only' || mode === 'full') {
        const rewriteResult = rewriteLegacyUrls(currentValue, host, (legacyUrl) => mapping.mappings[legacyUrl]);
        if (rewriteResult.changed) {
          updateData[field.field] = rewriteResult.value;
          rewriteResult.changedUrls.forEach((legacyUrl) => rewrittenUrls.add(legacyUrl));
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
  const startedAt = new Date().toISOString();
  const host = getPublicS3Host();
  const mapping = await readMappingFile(mappingFile);
  const failures: FailureEntry[] = [];
  const copiedUrls = new Set<string>();
  const rewrittenUrls = new Set<string>();
  const modelSummaries: ModelSummary[] = [];

  if (mode === 'copy-only' || mode === 'full') {
    requireStorageEnv('AWS_REGION');
    requireStorageEnv('AWS_ACCESS_KEY_ID');
    requireStorageEnv('AWS_SECRET_ACCESS_KEY');
    requireStorageEnv('AWS_S3_BUCKET');
  }

  for (const spec of MODEL_MIGRATION_SPECS) {
    modelSummaries.push(await processModel(spec, mode, host, mapping, failures, copiedUrls, rewrittenUrls));
  }

  if (mode === 'copy-only' || mode === 'full') {
    await writeMappingFile(mappingFile, mapping);
  }

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    mode,
    mappingFile,
    host,
    scannedModels: modelSummaries.length,
    scannedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsScanned, 0),
    updatedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsUpdated, 0),
    copiedLegacyUrlCount: copiedUrls.size,
    rewrittenLegacyUrlCount: rewrittenUrls.size,
    existingMappingCount: Object.keys(mapping.mappings).length,
    failures,
    models: modelSummaries,
  };

  const reportPath = join(
    process.cwd(),
    'outputs',
    'runtime',
    's3-migration',
    `s3-simple-remigration-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  await ensureParentDirectory(reportPath);
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');

  console.log(`Mode: ${mode}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Mapping file: ${mappingFile}`);
  console.log(`Records scanned: ${report.scannedRecords}`);
  console.log(`Records updated: ${report.updatedRecords}`);
  console.log(`Legacy URLs copied: ${report.copiedLegacyUrlCount}`);
  console.log(`Legacy URLs rewritten: ${report.rewrittenLegacyUrlCount}`);
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
