'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { shouldShowHeaderFooter } from '@/lib/subdomain-detection';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const [shouldShow, setShouldShow] = useState(true);
  
  useEffect(() => {
    // Use robust subdomain detection
    const show = shouldShowHeaderFooter(pathname, window.location.hostname);
    setShouldShow(show);
  }, [pathname]);
  
  if (!shouldShow) {
    // For routes that shouldn't show header/footer, render children without them
    return <>{children}</>;
  }
  
  // For routes that should show header/footer, render with them
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
