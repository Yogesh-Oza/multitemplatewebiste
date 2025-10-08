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

  const headersList = headers();
  const hostname = headersList.get('host') || '';
  const subdomain = getSubdomainFromHostname(hostname);

  // If this is a subdomain request, validate that the user belongs to this subdomain
  if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
    const userSubdomainId = (session.user as any)?.subdomainId;
    
    if (!userSubdomainId) {
      // User doesn't have a subdomain association, redirect to login with error
      redirect('/admin-login?error=subdomain_mismatch');
    }

    // For now, we'll do basic validation - check if user has a subdomain ID
    // More detailed validation can be added later if needed
    console.log('Subdomain validation in layout:', { subdomain, userSubdomainId });
    
    // TODO: Add proper subdomain validation via API route if needed
    // For now, we'll allow access if user has a subdomain ID
  }

  return { session, subdomain };
}
