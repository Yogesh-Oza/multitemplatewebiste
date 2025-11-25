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
  const timelineItemsData = await prisma.timelineItem.findMany({
    where: { subdomainId: subdomainData.id, isActive: true },
    orderBy: { order: 'asc' }
  });

  const timelineItems = timelineItemsData.map(item => ({
    id: item.id,
    year: item.year,
    title: item.title,
    titleEn: item.titleEn,
    description: item.description,
    descriptionEn: item.descriptionEn,
    imageUrl: item.imageUrl ?? undefined,
    side: item.side,
  }));

  return (
    <div className="min-h-screen">
      <HistorySection 
        historyCards={subdomainData.historyCards} 
        timelineItems={timelineItems} 
      />
    </div>
  );
}
