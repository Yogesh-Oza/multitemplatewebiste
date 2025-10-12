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
  
  // Localhost detection - only exact localhost, not subdomains
  const isLocalhost = currentHostname === 'localhost' || currentHostname === '127.0.0.1';
  
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
  
  // Subdomain routes - DON'T show header/footer here (SubdomainLayout handles it)
  if (subdomainInfo.isSubdomain) {
    return false;
  }
  
  // Subdomain routes (rewritten by middleware) - DON'T show header/footer here (SubdomainLayout handles it)
  if (pathname.startsWith('/subdomain/')) {
    return false;
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
