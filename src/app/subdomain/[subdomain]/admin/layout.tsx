import { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminHeader } from '@/components/admin/admin-header';
import { Toaster } from 'sonner';
import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import { Providers } from '@/components/providers/session-provider';

const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ subdomain: string }> }): Promise<Metadata> {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Admin Panel - Village Not Found',
    };
  }

  return {
    title: `${subdomainData.villageName} - प्रशासन पैनल`,
    description: `${subdomainData.villageName} ग्रामपंचायत वेबसाइट प्रशासन पैनल`,
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default async function SubdomainAdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = await params;

  // Verify subdomain exists and is active
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  return (
    <Providers>
      <div className="min-h-screen bg-gray-50">
        <AdminHeader villageName={subdomainData.villageName} />
        <div className="flex">
          <AdminSidebar subdomain={subdomain} />
          <main className="flex-1 p-6 ml-80">
            {children}
          </main>
        </div>
        <Toaster position="top-right" richColors />
      </div>
    </Providers>
  );
}
