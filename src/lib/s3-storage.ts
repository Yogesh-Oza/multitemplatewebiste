import { randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

const MAX_FILE_NAME_LENGTH = 120;

export function requireStorageEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

export function getS3Client(): S3Client {
  const region = requireStorageEnv('AWS_REGION');
  const endpoint = process.env.AWS_S3_ENDPOINT;

  return new S3Client({
    region,
    endpoint,
    forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: requireStorageEnv('AWS_ACCESS_KEY_ID'),
      secretAccessKey: requireStorageEnv('AWS_SECRET_ACCESS_KEY'),
    },
  });
}

function sanitizePathSegment(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function splitFileName(fileName: string): { baseName: string; extension: string } {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf('.');

  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return { baseName: trimmed || 'upload', extension: '' };
  }

  return {
    baseName: trimmed.slice(0, lastDot),
    extension: trimmed.slice(lastDot).toLowerCase(),
  };
}

function buildObjectKey(fileName: string): string {
  const { baseName, extension } = splitFileName(fileName);
  const safeBaseName = sanitizePathSegment(baseName).slice(0, MAX_FILE_NAME_LENGTH) || 'upload';
  const prefix = process.env.AWS_S3_UPLOAD_PREFIX?.replace(/^\/+|\/+$/g, '') || 'uploads';
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${prefix}/${year}/${month}/${safeBaseName}-${randomUUID()}${extension}`;
}

export function buildPublicS3Url(key: string): string {
  const publicBaseUrl = process.env.AWS_S3_PUBLIC_BASE_URL;
  if (publicBaseUrl) {
    return `${normalizeBaseUrl(publicBaseUrl)}/${key}`;
  }

  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const endpoint = process.env.AWS_S3_ENDPOINT;
  if (endpoint) {
    const normalized = normalizeBaseUrl(endpoint);
    const forcePathStyle = process.env.AWS_S3_FORCE_PATH_STYLE === 'true';
    return forcePathStyle ? `${normalized}/${bucket}/${key}` : `${normalized}/${key}`;
  }

  const region = requireStorageEnv('AWS_REGION');
  return `https://${bucket}.s3.${region}.amazonaws.com/${key}`;
}

export function buildMigrationObjectKey(sourceUrl: string): string {
  const url = new URL(sourceUrl);
  const pathname = url.pathname.replace(/^\/+/, '');
  const prefix = process.env.AWS_S3_MIGRATION_PREFIX?.replace(/^\/+|\/+$/g, '') || 'migrated/vercel-blob';
  const host = sanitizePathSegment(url.hostname) || 'blob';
  return `${prefix}/${host}/${pathname}`;
}

export async function uploadFileToS3(file: File): Promise<string> {
  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const key = buildObjectKey(file.name);
  const body = Buffer.from(await file.arrayBuffer());
  const client = getS3Client();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: file.type || 'application/octet-stream',
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  return buildPublicS3Url(key);
}
