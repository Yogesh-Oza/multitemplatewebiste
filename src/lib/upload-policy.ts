const DEFAULT_ALLOWED_FILE_TYPES = [
  'image/*',
  'video/*',
  'application/pdf',
  '.pdf',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.ppt',
  '.pptx',
  '.zip',
  '.txt',
  '.csv',
  '.json',
  '.rtf',
].join(',');

const DEFAULT_BLOCKED_EXTENSIONS = [
  '.exe',
  '.bat',
  '.cmd',
  '.msi',
  '.sh',
  '.ps1',
  '.scr',
  '.com',
  '.jar',
  '.vb',
  '.vbs',
  '.jse',
  '.wsf',
  '.wsh',
  '.cpl',
].join(',');

const DEFAULT_MAX_FILE_SIZE_MB = 50;

function splitCsv(value: string): string[] {
  return value
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getEnvValue(serverName: string, publicName: string, fallback: string): string {
  return process.env[serverName] || process.env[publicName] || fallback;
}

export const UPLOAD_ACCEPT_ATTR = getEnvValue(
  'UPLOAD_ALLOWED_FILE_TYPES',
  'NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES',
  DEFAULT_ALLOWED_FILE_TYPES
);

export const UPLOAD_ALLOWED_FILE_TYPES = splitCsv(UPLOAD_ACCEPT_ATTR);

export const UPLOAD_BLOCKED_EXTENSIONS = splitCsv(
  getEnvValue(
    'UPLOAD_BLOCKED_EXTENSIONS',
    'NEXT_PUBLIC_UPLOAD_BLOCKED_EXTENSIONS',
    DEFAULT_BLOCKED_EXTENSIONS
  )
);

const rawMaxSize = Number(
  getEnvValue(
    'UPLOAD_MAX_FILE_SIZE_MB',
    'NEXT_PUBLIC_UPLOAD_MAX_FILE_SIZE_MB',
    String(DEFAULT_MAX_FILE_SIZE_MB)
  )
);

export const UPLOAD_MAX_FILE_SIZE_MB =
  Number.isFinite(rawMaxSize) && rawMaxSize > 0 ? rawMaxSize : DEFAULT_MAX_FILE_SIZE_MB;

export const UPLOAD_MAX_FILE_SIZE_BYTES = UPLOAD_MAX_FILE_SIZE_MB * 1024 * 1024;

export function getFileExtension(fileName: string): string {
  const trimmed = fileName.trim().toLowerCase();
  const lastDot = trimmed.lastIndexOf('.');
  return lastDot >= 0 ? trimmed.slice(lastDot) : '';
}

export function isBlockedUpload(fileName: string): boolean {
  const extension = getFileExtension(fileName);
  return !!extension && UPLOAD_BLOCKED_EXTENSIONS.includes(extension);
}

function matchesAllowedType(file: { name: string; type: string }, allowedType: string): boolean {
  const mimeType = file.type.toLowerCase();
  const extension = getFileExtension(file.name);

  if (allowedType.startsWith('.')) {
    return extension === allowedType;
  }

  if (allowedType.endsWith('/*')) {
    return mimeType.startsWith(allowedType.slice(0, -1));
  }

  return mimeType === allowedType;
}

export function isAllowedUpload(file: { name: string; type: string }): boolean {
  if (isBlockedUpload(file.name)) {
    return false;
  }

  if (!UPLOAD_ALLOWED_FILE_TYPES.length) {
    return true;
  }

  return UPLOAD_ALLOWED_FILE_TYPES.some((allowedType) => matchesAllowedType(file, allowedType));
}

export function validateUploadFile(file: { name: string; type: string; size: number }): string | null {
  if (isBlockedUpload(file.name)) {
    return 'This file type is not allowed';
  }

  if (!isAllowedUpload(file)) {
    return 'This file type is not supported';
  }

  if (file.size > UPLOAD_MAX_FILE_SIZE_BYTES) {
    return `File size must be less than ${UPLOAD_MAX_FILE_SIZE_MB}MB`;
  }

  return null;
}
