import { mkdir, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { PrismaClient } from '@prisma/client';
import { MODEL_MIGRATION_SPECS, type ModelMigrationSpec } from '../src/lib/blob-url-migration';

type Mode = 'dry-run' | 'apply';

interface ParsedArgs {
  mode: Mode;
}

interface FieldSummary {
  field: string;
  revertedValues: number;
  scannedRecords: number;
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
  for (const arg of argv) {
    if (arg.startsWith('--mode=')) {
      const value = arg.slice('--mode='.length);
      if (value === 'apply' || value === 'dry-run') {
        mode = value;
      }
    }
  }
  return { mode };
}

function getPublicS3Host(): string {
  const bucket = process.env.AWS_S3_BUCKET;
  const region = process.env.AWS_REGION;
  if (!bucket || !region) {
    throw new Error('AWS_S3_BUCKET and AWS_REGION are required');
  }
  return `${bucket}.s3.${region}.amazonaws.com`;
}

function shouldRevert(value: string, s3Host: string): boolean {
  try {
    const url = new URL(value);
    if (url.host !== s3Host) return false;
    if (!url.pathname.startsWith('/migrated/vercel-blob/')) return false;
    return url.pathname.includes('%25');
  } catch {
    return false;
  }
}

function revertUrl(value: string): string {
  const url = new URL(value);
  url.pathname = url.pathname.replace(/%25/g, '%');
  return url.toString();
}

function rewrite(value: unknown, s3Host: string): { value: unknown; changed: boolean; changedCount: number } {
  if (typeof value === 'string') {
    if (!shouldRevert(value, s3Host)) {
      return { value, changed: false, changedCount: 0 };
    }
    return { value: revertUrl(value), changed: true, changedCount: 1 };
  }

  if (Array.isArray(value)) {
    let changed = false;
    let changedCount = 0;
    const next = value.map((entry) => {
      const result = rewrite(entry, s3Host);
      changed ||= result.changed;
      changedCount += result.changedCount;
      return result.value;
    });
    return { value: changed ? next : value, changed, changedCount };
  }

  if (value && typeof value === 'object') {
    let changed = false;
    let changedCount = 0;
    const nextEntries = Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      const result = rewrite(entry, s3Host);
      changed ||= result.changed;
      changedCount += result.changedCount;
      return [key, result.value] as const;
    });
    return {
      value: changed ? Object.fromEntries(nextEntries) : value,
      changed,
      changedCount,
    };
  }

  return { value, changed: false, changedCount: 0 };
}

function getDelegate(delegate: string): any {
  return (prisma as any)[delegate];
}

async function processModel(spec: ModelMigrationSpec, mode: Mode, s3Host: string): Promise<ModelSummary> {
  const delegate = getDelegate(spec.delegate);
  if (!delegate || typeof delegate.findMany !== 'function') {
    return {
      model: spec.model,
      delegate: spec.delegate,
      recordsScanned: 0,
      recordsUpdated: 0,
      fields: spec.fields.map((field) => ({ field: field.field, revertedValues: 0, scannedRecords: 0 })),
    };
  }

  const records = await delegate.findMany();
  const fieldSummaries = new Map<string, FieldSummary>();
  let recordsUpdated = 0;

  for (const field of spec.fields) {
    fieldSummaries.set(field.field, { field: field.field, revertedValues: 0, scannedRecords: records.length });
  }

  for (const record of records) {
    const updateData: Record<string, unknown> = {};

    for (const field of spec.fields) {
      const result = rewrite(record[field.field], s3Host);
      if (result.changed) {
        updateData[field.field] = result.value;
        fieldSummaries.get(field.field)!.revertedValues += result.changedCount;
      }
    }

    if (Object.keys(updateData).length > 0) {
      if (mode === 'apply') {
        await delegate.update({
          where: { id: record.id },
          data: updateData,
        });
      }
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

async function writeReport(report: unknown): Promise<string> {
  const reportPath = join(
    process.cwd(),
    'outputs',
    'runtime',
    's3-migration',
    `s3-url-encoding-revert-${new Date().toISOString().replace(/[:.]/g, '-')}.json`
  );
  await mkdir(dirname(reportPath), { recursive: true });
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  return reportPath;
}

async function main() {
  const { mode } = parseArgs(process.argv.slice(2));
  const startedAt = new Date().toISOString();
  const s3Host = getPublicS3Host();
  const modelSummaries: ModelSummary[] = [];

  for (const spec of MODEL_MIGRATION_SPECS) {
    modelSummaries.push(await processModel(spec, mode, s3Host));
  }

  const report = {
    startedAt,
    finishedAt: new Date().toISOString(),
    mode,
    s3Host,
    scannedModels: modelSummaries.length,
    scannedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsScanned, 0),
    updatedRecords: modelSummaries.reduce((sum, item) => sum + item.recordsUpdated, 0),
    revertedValues: modelSummaries.reduce(
      (sum, item) => sum + item.fields.reduce((inner, field) => inner + field.revertedValues, 0),
      0
    ),
    models: modelSummaries,
  };

  const reportPath = await writeReport(report);
  console.log(`Mode: ${mode}`);
  console.log(`S3 host: ${s3Host}`);
  console.log(`Report: ${reportPath}`);
  console.log(`Records scanned: ${report.scannedRecords}`);
  console.log(`Records updated: ${report.updatedRecords}`);
  console.log(`Reverted values: ${report.revertedValues}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
