import { uploadFileToS3 } from '@/lib/s3-storage';

export class UploadError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'UploadError';
    this.status = status;
  }
}

export async function uploadFile(file: File): Promise<string> {
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
  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    throw new UploadError('File must be an image');
  }

  // Validate file size (max 10MB)
  if (imageFile.size > 10 * 1024 * 1024) {
    throw new UploadError('File size must be less than 10MB');
  }

  return uploadFile(imageFile);
}

export async function uploadPdf(pdfFile: File): Promise<string> {
  const ok =
    pdfFile.type === 'application/pdf' || pdfFile.name.toLowerCase().endsWith('.pdf');
  if (!ok) {
    throw new UploadError('File must be a PDF');
  }
  if (pdfFile.size > 15 * 1024 * 1024) {
    throw new UploadError('File size must be less than 15MB');
  }
  return uploadFile(pdfFile);
}
