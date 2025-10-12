/**
 * Utility functions for detecting subdomain access
 */

export interface SubdomainInfo {
  isSubdomain: boolean;
  isMainDomain: boolean;
  isLocalhost: boolean;
  subdomain: string | null;
  domain: string;
}

/**
 * Detects if the current hostname is a subdomain
 * @param hostname - The hostname to check (defaults to window.location.hostname)
 * @returns SubdomainInfo object with detection results
 */
export function detectSubdomain(hostname?: string): SubdomainInfo {
  const currentHostname = hostname || (typeof window !== 'undefined' ? window.location.hostname : '');
  
  // Localhost detection
  const isLocalhost = currentHostname.includes('localhost') || currentHostname === '127.0.0.1';
  
  // Main domain detection (mahagp.in) - only exact match
  const isMainDomain = currentHostname === 'mahagp.in' || currentHostname === 'localhost';
  
  // Subdomain detection - more robust logic
  const isSubdomain = currentHostname.includes('.') && 
    !isLocalhost && 
    !isMainDomain &&
    currentHostname !== 'mahagp.in' &&
    currentHostname !== 'localhost';
  
  // Extract subdomain name
  let subdomain: string | null = null;
  if (isSubdomain && currentHostname.includes('.')) {
    const parts = currentHostname.split('.');
    if (parts.length > 2) {
      subdomain = parts[0];
    }
  }
  
  return {
    isSubdomain,
    isMainDomain,
    isLocalhost,
    subdomain,
    domain: currentHostname
  };
}

/**
 * Determines if header and footer should be shown
 * @param pathname - The current pathname
 * @param hostname - The current hostname (optional)
 * @returns boolean indicating if header/footer should be shown
 */
export function shouldShowHeaderFooter(pathname: string, hostname?: string): boolean {
  const subdomainInfo = detectSubdomain(hostname);
  
  // Debug logging in development
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    console.log('Subdomain Detection Debug:', {
      hostname: hostname || window.location.hostname,
      pathname,
      subdomainInfo,
      isMainDomain: subdomainInfo.isMainDomain,
      isSubdomain: subdomainInfo.isSubdomain,
      isLocalhost: subdomainInfo.isLocalhost
    });
  }
  
  // Admin routes - no header/footer
  if (pathname.startsWith('/admin') || 
      pathname.startsWith('/super-admin') || 
      pathname === '/super-admin-login' ||
      pathname === '/subdomain-register') {
    return false;
  }
  
  // Main domain root page - no header/footer (business landing page)
  if (subdomainInfo.isMainDomain && pathname === '/') {
    return false;
  }
  
  // Subdomain routes - show header/footer
  if (subdomainInfo.isSubdomain) {
    return true;
  }
  
  // Localhost subdomain routes - show header/footer
  if (subdomainInfo.isLocalhost && pathname.startsWith('/subdomain/')) {
    return true;
  }
  
  // Default: show header/footer for other routes
  return true;
}

/**
 * Determines if subdomain layout should be rendered
 * @param hostname - The current hostname (optional)
 * @returns boolean indicating if subdomain layout should be rendered
 */
export function shouldRenderSubdomainLayout(hostname?: string): boolean {
  const subdomainInfo = detectSubdomain(hostname);
  return subdomainInfo.isSubdomain;
}
