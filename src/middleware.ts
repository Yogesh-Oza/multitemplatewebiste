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
  }

  // Check if this is a subdomain request
  const subdomain = getSubdomain(hostname);
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
    // This is a subdomain request - rewrite to subdomain route
    // The subdomain page will handle validation and redirect if needed
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
