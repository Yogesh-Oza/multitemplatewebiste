'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [isSubdomainAccess, setIsSubdomainAccess] = useState(false);
  
  useEffect(() => {
    // Check if we're accessing through a subdomain
    const hostname = window.location.hostname;
    const isSubdomain = hostname.includes('.') && 
      !hostname.includes('localhost:3000') && 
      !hostname.includes('mahagp.in') &&
      hostname !== 'localhost';
    setIsSubdomainAccess(isSubdomain);
  }, []);
  
  // Check if we're on an admin route
  const isAdminRoute = pathname.startsWith('/admin');
  
  // Check if we're on super admin routes
  const isSuperAdminRoute = pathname.startsWith('/super-admin') || pathname === '/super-admin-login';
  
  // Check if we're on subdomain-register page
  const isSubdomainRegister = pathname === '/subdomain-register';
  
  // Check if we're on the root business landing page
  const isBusinessLanding = pathname === '/';
  
  // Check if we're on a subdomain route (subdomain pages have their own layout)
  const isSubdomainRoute = pathname.startsWith('/subdomain/');
  
  if (isAdminRoute || isSuperAdminRoute || isSubdomainRegister || isBusinessLanding || isSubdomainRoute || isSubdomainAccess) {
    // For admin routes, super admin routes, subdomain-register, business landing page, subdomain routes, and subdomain access, render children without header/footer
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
