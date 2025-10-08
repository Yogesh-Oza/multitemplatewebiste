import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export function getSubdomainFromHostname(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // If we have at least 3 parts (subdomain.domain.tld), return the subdomain
  if (parts.length >= 3) {
    return parts[0];
  }
  
  return null;
}

export async function validateSubdomainAccess() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/admin-login');
  }

  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const subdomain = getSubdomainFromHostname(hostname);

  // If this is a subdomain request, validate that the user belongs to this subdomain
  if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
    const userSubdomain = (session.user as any)?.subdomain;
    
    if (!userSubdomain || userSubdomain !== subdomain) {
      // User doesn't belong to this subdomain, redirect to login with error
      redirect('/admin-login?error=subdomain_mismatch');
    }
  }

  return { session, subdomain };
}
