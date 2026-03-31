import { uploadFileToS3 } from '@/lib/s3-storage';

export async function uploadFile(file: File): Promise<string> {
  try {
    return await uploadFileToS3(file);
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file');
  }
}

export async function uploadImage(imageFile: File): Promise<string> {
  // Validate file type
  if (!imageFile.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 10MB)
  if (imageFile.size > 10 * 1024 * 1024) {
    throw new Error('File size must be less than 10MB');
  }

  return uploadFile(imageFile);
}

export async function uploadPdf(pdfFile: File): Promise<string> {
  const ok =
    pdfFile.type === 'application/pdf' || pdfFile.name.toLowerCase().endsWith('.pdf');
  if (!ok) {
    throw new Error('File must be a PDF');
  }
  if (pdfFile.size > 15 * 1024 * 1024) {
    throw new Error('File size must be less than 15MB');
  }
  return uploadFile(pdfFile);
}
