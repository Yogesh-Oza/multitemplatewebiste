import { NextRequest, NextResponse } from 'next/server';
import { uploadPdf } from '@/lib/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    const url = await uploadPdf(file);
    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error('PDF upload error:', error);
    const message = error instanceof Error ? error.message : 'Failed to upload PDF';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
