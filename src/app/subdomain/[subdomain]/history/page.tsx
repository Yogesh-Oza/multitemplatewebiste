import { HistorySection } from '@/components/sections/history-section';
import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';

const prisma = new PrismaClient();

interface HistoryPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainHistoryPage({ params }: HistoryPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      historyCards: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  // Fetch timeline items
  const timelineItems = await prisma.timelineItem.findMany({
    where: { subdomainId: subdomainData.id, isActive: true },
    orderBy: { order: 'asc' }
  });

  return (
    <div className="min-h-screen">
      <HistorySection 
        historyCards={subdomainData.historyCards} 
        timelineItems={timelineItems} 
      />
    </div>
  );
}
