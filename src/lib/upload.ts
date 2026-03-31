import { uploadFileToS3 } from '@/lib/s3-storage';
import { validateUploadFile } from '@/lib/upload-policy';

export class UploadError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UploadError';
    this.status = status;
  }
}

export async function uploadFile(file: File): Promise<string> {
  const validationError = validateUploadFile(file);
  if (validationError) {
    throw new UploadError(validationError);
  }

  try {
    return await uploadFileToS3(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    if (error instanceof UploadError) {
      throw error;
    }
    if (error instanceof Error && error.message.startsWith('Missing required environment variable:')) {
      throw new UploadError('Upload storage is not configured', 500);
    }
    throw new UploadError('Failed to upload file', 500);
  }
}

export async function uploadImage(imageFile: File): Promise<string> {
  return uploadFile(imageFile);
}

export async function uploadPdf(pdfFile: File): Promise<string> {
  return uploadFile(pdfFile);
}
