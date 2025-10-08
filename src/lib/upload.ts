import { put } from '@vercel/blob';

export async function uploadFile(file: File): Promise<string> {
  try {
    const blob = await put(file.name, file, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
      addRandomSuffix: true, // Generate unique filename to avoid conflicts
    });
    
    return blob.url;
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
