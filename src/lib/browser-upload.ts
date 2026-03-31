'use client';

export type BrowserUploadResult = {
  url: string;
  imageUrl: string;
};

type PresignedUploadResponse = BrowserUploadResult & {
  method: 'PUT';
  uploadUrl: string;
  headers?: Record<string, string>;
};

export async function uploadFileFromBrowser(file: File): Promise<BrowserUploadResult> {
  const presignedResponse = await fetch('/api/upload/presigned', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
    }),
  });

  const presignedData = (await presignedResponse.json().catch(() => null)) as PresignedUploadResponse | { error?: string } | null;

  if (!presignedResponse.ok || !presignedData || !('uploadUrl' in presignedData)) {
    throw new Error(
      presignedData && 'error' in presignedData && presignedData.error
        ? presignedData.error
        : 'Failed to prepare upload'
    );
  }

  const uploadResponse = await fetch(presignedData.uploadUrl, {
    method: presignedData.method,
    headers: presignedData.headers,
    body: file,
  });

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file to storage');
  }

  return {
    url: presignedData.url,
    imageUrl: presignedData.imageUrl,
  };
}
