'use client';

import { useEffect } from 'react';
import { uploadFileFromBrowser } from '@/lib/browser-upload';

const UPLOAD_ENDPOINTS = new Set(['/api/upload', '/api/upload/pdf']);

function getRequestUrl(input: RequestInfo | URL): string | null {
  if (typeof input === 'string') {
    return input;
  }

  if (input instanceof URL) {
    return input.toString();
  }

  if (typeof Request !== 'undefined' && input instanceof Request) {
    return input.url;
  }

  return null;
}

function toPathname(url: string): string {
  try {
    return new URL(url, window.location.origin).pathname;
  } catch {
    return url;
  }
}

export function UploadFetchShim() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = getRequestUrl(input);
      const pathname = url ? toPathname(url) : null;
      const method = (init?.method || 'GET').toUpperCase();
      const body = init?.body;

      if (pathname && UPLOAD_ENDPOINTS.has(pathname) && method === 'POST' && body instanceof FormData) {
        const file = body.get('file');

        if (!(file instanceof File)) {
          return new Response(JSON.stringify({ error: 'No file provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          });
        }

        try {
          const result = await uploadFileFromBrowser(file);
          return new Response(
            JSON.stringify({
              success: true,
              url: result.url,
              imageUrl: result.imageUrl,
              message: 'File uploaded successfully',
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : 'Upload failed',
            }),
            {
              status: 400,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }
      }

      return originalFetch(input, init);
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  return null;
}
