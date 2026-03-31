import { NextRequest, NextResponse } from 'next/server';
import { UploadError } from '@/lib/upload';
import { createPresignedUpload } from '@/lib/s3-storage';
import { validateUploadFile } from '@/lib/upload-policy';

export const runtime = 'nodejs';

type UploadRequestBody = {
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as UploadRequestBody;
    const fileName = body.fileName?.trim();
    const fileType = body.fileType?.trim() || 'application/octet-stream';
    const fileSize = Number(body.fileSize);

    if (!fileName || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ error: 'Invalid upload request' }, { status: 400 });
    }

    const validationError = validateUploadFile({
      name: fileName,
      type: fileType,
      size: fileSize,
    });

    if (validationError) {
      throw new UploadError(validationError);
    }

    const signedUpload = await createPresignedUpload(fileName, fileType);

    return NextResponse.json({
      success: true,
      method: 'PUT',
      uploadUrl: signedUpload.uploadUrl,
      url: signedUpload.publicUrl,
      imageUrl: signedUpload.publicUrl,
      headers: signedUpload.headers,
    });
  } catch (error) {
    console.error('Presigned upload error:', error);
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : 'Failed to prepare upload';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
