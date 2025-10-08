import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get('host') || '';
  
  // Skip middleware for API routes, static files, and admin routes
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.startsWith('/admin') ||
    pathname === '/subdomain-register'
  ) {
    return NextResponse.next();
  }

  // Check if this is a subdomain request
  const subdomain = getSubdomain(hostname);
  
  if (subdomain && subdomain !== 'www' && subdomain !== 'mahagp') {
    // This is a subdomain request
    const url = request.nextUrl.clone();
    
    // Add subdomain to the URL path for the page to access
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
  
  // If we have more than 2 parts, the first part is the subdomain
  if (parts.length > 2) {
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
