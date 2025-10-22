import { AnnouncementsSection } from '@/components/sections/announcements-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

interface AnnouncementsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainAnnouncementsPage({ params }: AnnouncementsPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      announcements: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  return (
    <div className="min-h-screen">
      <AnnouncementsSection announcements={subdomainData.announcements} />
    </div>
  );
}
