import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export function getSubdomainFromRequest(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || '';
  
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // If we have more than 2 parts, the first part is the subdomain
  if (parts.length > 2) {
    return parts[0];
  }
  
  return null;
}

export async function getSubdomainId(request: NextRequest): Promise<string | null> {
  const subdomain = getSubdomainFromRequest(request);
  
  if (!subdomain || subdomain === 'www' || subdomain === 'mahagp') {
    return null;
  }

  try {
    const subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      select: { id: true, isActive: true }
    });

    if (!subdomainData || !subdomainData.isActive) {
      return null;
    }

    return subdomainData.id;
  } catch (error) {
    console.error('Error fetching subdomain:', error);
    return null;
  }
}

export async function validateSubdomain(request: NextRequest): Promise<{ isValid: boolean; subdomainId: string | null; subdomain: string | null }> {
  const subdomain = getSubdomainFromRequest(request);
  
  if (!subdomain || subdomain === 'www' || subdomain === 'mahagp') {
    return { isValid: false, subdomainId: null, subdomain: null };
  }

  try {
    const subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      select: { id: true, isActive: true }
    });

    if (!subdomainData || !subdomainData.isActive) {
      return { isValid: false, subdomainId: null, subdomain };
    }

    return { isValid: true, subdomainId: subdomainData.id, subdomain };
  } catch (error) {
    console.error('Error validating subdomain:', error);
    return { isValid: false, subdomainId: null, subdomain };
  }
}
