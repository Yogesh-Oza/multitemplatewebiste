'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  
  // Check if we're on an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  // Check if we're on subdomain-register page
  const isSubdomainRegister = pathname === '/subdomain-register';
  
  // Check if we're on the root business landing page
  const isBusinessLanding = pathname === '/';
  
  // Check if we're on a subdomain route (subdomain pages have their own layout)
  const isSubdomainRoute = pathname.startsWith('/subdomain/');
  
  // Check if we're accessing through a subdomain (when hostname contains a subdomain)
  const isSubdomainAccess = typeof window !== 'undefined' && 
    window.location.hostname.includes('.') && 
    !window.location.hostname.includes('localhost:3000') && 
    !window.location.hostname.includes('mahagp.in') &&
    window.location.hostname !== 'localhost';
  
  if (isAdminRoute || isSubdomainRegister || isBusinessLanding || isSubdomainRoute || isSubdomainAccess) {
    // For admin routes, subdomain-register, business landing page, subdomain routes, and subdomain access, render children without header/footer
    return <>{children}</>;
  }
  
  // For public routes, render with header/footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
