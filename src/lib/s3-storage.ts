import { createHash, randomUUID } from 'crypto';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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

function splitFileName(fileName: string): { extension: string } {
  const trimmed = fileName.trim();
  const lastDot = trimmed.lastIndexOf('.');

  if (lastDot <= 0 || lastDot === trimmed.length - 1) {
    return { extension: '' };
  }

  return {
    extension: trimmed.slice(lastDot).toLowerCase(),
  };
}

export function buildObjectKey(fileName: string): string {
  const { extension } = splitFileName(fileName);
  const prefix = process.env.AWS_S3_UPLOAD_PREFIX?.replace(/^\/+|\/+$/g, '') || 'uploads';
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');

  return `${prefix}/${year}/${month}/${randomUUID()}${extension}`;
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
  const host = url.hostname
    .normalize('NFKD')
    .replace(/[^\w.-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'blob';
  return `${prefix}/${host}/${pathname}`;
}

export function buildSimpleRemigrationObjectKey(sourceUrl: string, contentType?: string): string {
  const source = new URL(sourceUrl);
  const legacyPath = source.pathname.replace(/^\/+/, '');
  const prefix = process.env.AWS_S3_REMIGRATION_PREFIX?.replace(/^\/+|\/+$/g, '') || 'migrated/simple';
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const digest = createHash('sha1').update(legacyPath).digest('hex').slice(0, 16);

  const pathname = source.pathname;
  const lastDot = pathname.lastIndexOf('.');
  const extFromPath = lastDot > -1 ? pathname.slice(lastDot).toLowerCase() : '';
  const extFromType = contentType?.includes('/') ? `.${contentType.split('/')[1].split(';')[0].toLowerCase()}` : '';
  const extension = extFromPath || extFromType || '.bin';

  return `${prefix}/${year}/${month}/${digest}-${randomUUID()}${extension}`;
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

export async function createPresignedUpload(fileName: string, contentType?: string) {
  const bucket = requireStorageEnv('AWS_S3_BUCKET');
  const key = buildObjectKey(fileName);
  const client = getS3Client();

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: contentType || 'application/octet-stream',
    CacheControl: 'public, max-age=31536000, immutable',
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 900 });

  return {
    key,
    uploadUrl,
    publicUrl: buildPublicS3Url(key),
    headers: {
      'Content-Type': contentType || 'application/octet-stream',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  };
}
