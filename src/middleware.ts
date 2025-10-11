import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  const secret = process.env.NEXTAUTH_SECRET;
  
  // Skip middleware for API routes, static files
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname === '/subdomain-register'
  ) {
    return NextResponse.next();
  }

  // Protect super admin routes
  const isSuperAdmin = pathname.startsWith('/super-admin');
  const isSuperAdminLogin = pathname === '/super-admin-login';

  if (isSuperAdmin && !isSuperAdminLogin) {
    const token = await getToken({ req: request as any, secret });
    if (!token || (token as any).role !== 'super_admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/super-admin-login';
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes (but allow the login page)
  const isAdminBase = pathname.startsWith('/admin');
  const isAdminLogin = pathname === '/admin/login' || pathname === '/admin-login';
  const isSubdomainAdmin = /^\/subdomain\/[^/]+\/admin(\/.*)?$/.test(pathname);

  if ((isAdminBase && !isAdminLogin) || isSubdomainAdmin) {
    const token = await getToken({ req: request as any, secret });
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin-login';
      url.searchParams.set('callbackUrl', request.nextUrl.pathname);
      return NextResponse.redirect(url);
    }

    // Additional subdomain validation for admin routes
    const subdomain = getSubdomain(hostname);
    if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
      console.log('Validating subdomain access:', { subdomain, userSubdomainId: (token as any).subdomainId });
      
      // Check if the authenticated user belongs to this subdomain
      const userSubdomainId = (token as any).subdomainId;
      if (!userSubdomainId) {
        console.log('User has no subdomain association');
        // User doesn't have a subdomain association, redirect to login with error
        const url = request.nextUrl.clone();
        url.pathname = '/admin-login';
        url.searchParams.set('error', 'subdomain_mismatch');
        url.searchParams.set('callbackUrl', request.nextUrl.pathname);
        return NextResponse.redirect(url);
      }

      // Basic validation - user has a subdomain ID, allow access
      // Detailed validation will be done in the admin layout
      console.log('Subdomain validation - user has subdomain ID, allowing access');
    }
  }

  // Check if this is a subdomain request
  const subdomain = getSubdomain(hostname);
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
    // For admin routes on subdomains, don't rewrite - let them use the main admin routes
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    
    // For other subdomain requests, rewrite to subdomain route
    const url = request.nextUrl.clone();
    url.pathname = `/subdomain/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

function getSubdomain(hostname: string): string | null {
  // Remove port if present
  const host = hostname.split(':')[0];
  
  // Split by dots
  const parts = host.split('.');
  
  // For localhost development, check if first part is not 'www' or 'localhost'
  if (parts.length >= 2 && parts[0] !== 'www' && parts[0] !== 'localhost') {
    return parts[0];
  }
  
  return null;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
