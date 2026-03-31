import { NextRequest, NextResponse } from 'next/server';
import { UploadError, uploadImage } from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const imageUrl = await uploadImage(file);
    
    return NextResponse.json({ 
      success: true, 
      imageUrl,
      url: imageUrl,
      message: 'File uploaded successfully' 
    });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof UploadError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    const message = error instanceof Error ? error.message : 'Failed to upload file';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
