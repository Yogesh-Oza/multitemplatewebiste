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
  
  if (isAdminRoute || isSubdomainRegister || isBusinessLanding) {
    // For admin routes, subdomain-register, and business landing page, render children without header/footer
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
