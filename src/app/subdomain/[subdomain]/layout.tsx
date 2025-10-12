'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { useEffect, useState } from 'react';
import { shouldRenderSubdomainLayout } from '@/lib/subdomain-detection';

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldRenderLayout, setShouldRenderLayout] = useState(true);

  useEffect(() => {
    // Use robust subdomain detection
    const shouldRender = shouldRenderSubdomainLayout(window.location.hostname);
    setShouldRenderLayout(shouldRender);
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
