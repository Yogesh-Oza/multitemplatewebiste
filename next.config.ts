import type { NextConfig } from "next";

function createRemotePattern(urlString?: string) {
  if (!urlString) return null;

  try {
    const url = new URL(urlString);
    return {
      protocol: url.protocol.replace(':', '') as 'http' | 'https',
      hostname: url.hostname,
      port: url.port,
      pathname: `${url.pathname.replace(/\/$/, '') || ''}/**`,
    };
  } catch {
    return null;
  }
}

const s3PublicBasePattern = createRemotePattern(process.env.AWS_S3_PUBLIC_BASE_URL);
const s3EndpointPattern = createRemotePattern(process.env.AWS_S3_ENDPOINT);
const s3Bucket = process.env.AWS_S3_BUCKET;
const s3Region = process.env.AWS_REGION;
const defaultAwsPattern =
  s3Bucket && s3Region
    ? {
        protocol: 'https' as const,
        hostname: `${s3Bucket}.s3.${s3Region}.amazonaws.com`,
        port: '',
        pathname: '/**',
      }
    : null;

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdnbbsr.s3waas.gov.in',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.qrserver.com',
        port: '',
        pathname: '/**',
      },
      ...(s3PublicBasePattern ? [s3PublicBasePattern] : []),
      ...(s3EndpointPattern ? [s3EndpointPattern] : []),
      ...(defaultAwsPattern ? [defaultAwsPattern] : []),
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
