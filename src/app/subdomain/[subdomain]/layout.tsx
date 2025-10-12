'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(true);

  useEffect(() => {
    // Check if we're accessing through a subdomain
    const hostname = window.location.hostname;
    const isSubdomain = hostname.includes('.') && 
      !hostname.includes('localhost:3000') && 
      !hostname.includes('mahagp.in') &&
      hostname !== 'localhost';
    
    // Only render layout if we're actually on a subdomain
    setShouldRenderLayout(isSubdomain);
  }, []);

  if (!shouldRenderLayout) {
    return <>{children}</>;
  }

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
