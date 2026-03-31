import { NextRequest, NextResponse } from 'next/server';
import { UploadError, uploadPdf } from '@/lib/upload';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const url = await uploadPdf(file);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('PDF upload error:', error);
    if (error instanceof UploadError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : 'Failed to upload PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
