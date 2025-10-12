'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';

export default function SubdomainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Since this layout is only used for subdomain routes (rewritten by middleware),
  // we should always render header and footer
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
