import { notFound, redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { AnnouncementsSection } from '@/components/sections/announcements-section';
import { HistorySection } from '@/components/sections/history-section';
import { CulturalHeritageSection } from '@/components/sections/cultural-heritage-section';
import { SubdomainValidator } from '@/components/subdomain-validator';

const prisma = new PrismaClient();

interface SubdomainPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      announcements: {
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
        take: 6
      },
      culturalHeritage: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      heroImages: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
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

  return (
    <SubdomainValidator subdomain={subdomain}>
      <HeroSection />
      
      <AboutSection />
      
      <AnnouncementsSection />
      
      <HistorySection />
      
      <CulturalHeritageSection />
    </SubdomainValidator>
  );
}

export async function generateMetadata({ params }: SubdomainPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Village Not Found',
      description: 'The requested village website could not be found.'
    };
  }

  return {
    title: `${subdomainData.villageName} - Gram Panchayat Website`,
    description: subdomainData.description || `Official website of ${subdomainData.villageName} Gram Panchayat`,
    keywords: `${subdomainData.villageName}, Gram Panchayat, Village Website, Maharashtra`,
    openGraph: {
      title: `${subdomainData.villageName} - Gram Panchayat`,
      description: subdomainData.description || `Official website of ${subdomainData.villageName} Gram Panchayat`,
      type: 'website',
      url: `https://${subdomain}.mahagp.in`,
    }
  };
}
