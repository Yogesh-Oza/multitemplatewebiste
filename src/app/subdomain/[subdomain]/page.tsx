import { notFound, redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { AnnouncementsSection } from '@/components/sections/announcements-section';
import { HistorySection } from '@/components/sections/history-section';
import { CulturalHeritageSection } from '@/components/sections/cultural-heritage-section';
import { WelcomeVideoSection } from '@/components/sections/welcome-video-section';
import { WeatherSection } from '@/components/sections/weather-section';
import { PragatiMeterSection } from '@/components/sections/pragati-meter-section';
import { NewsUpdatesSection } from '@/components/sections/news-updates-section';
import { DailyMessageSection } from '@/components/sections/daily-message-section';
import { LeadersHierarchySection } from '@/components/sections/leaders-hierarchy-section';
import { QRTaxPaymentSection } from '@/components/sections/qr-tax-payment-section';
import { WaterSanitationSection } from '@/components/sections/water-sanitation-section';

const prisma = new PrismaClient();

interface SubdomainPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainPage({ params }: SubdomainPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data with all required data for sections
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

  // Fetch additional data needed by sections
  const [homepageSettings, timelineItemsData, dashboardMetrics] = await Promise.all([
    prisma.homepageSettings.findFirst({
      where: { subdomainId: subdomainData?.id }
    }),
    prisma.timelineItem.findMany({
      where: { subdomainId: subdomainData?.id, isActive: true },
      orderBy: { year: 'asc' }
    }),
    prisma.dashboardMetric.findMany({
      where: { subdomainId: subdomainData?.id },
      orderBy: { order: 'asc' }
    })
  ]);

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

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  return (
    <>
      <div id="hero">
        <HeroSection 
          heroImages={subdomainData.heroImages} 
          homepageSettings={homepageSettings} 
        />
      </div>
      
      <div id="weather">
        <WeatherSection />
      </div>

      <div id="language-switch" className="sr-only" aria-hidden="true">
        भाषा बदल
      </div>
      
      <div id="quick-info">
        <AboutSection villageInfo={subdomainData.villageInfo?.[0] ? {
          ...subdomainData.villageInfo[0],
          stats: Array.isArray(subdomainData.villageInfo[0].stats) 
            ? subdomainData.villageInfo[0].stats as any[]
            : []
        } : null} />
      </div>
      
      {/* Leaders and hierarchy section (CM, DCMs, Ministers, Officials) */}
      <div id="know-leaders">
        <LeadersHierarchySection />
      </div>
      
      <div id="progress-meter">
        <PragatiMeterSection />
      </div>
      
      <WaterSanitationSection />
      
      <div id="welcome-video">
        <WelcomeVideoSection homepageSettings={subdomainData.villageInfo?.[0]?.welcomeVideo ? {
          welcomeVideo: subdomainData.villageInfo[0].welcomeVideo as any
        } : homepageSettings && homepageSettings.mainHeading ? {
          welcomeVideo: {
            title: homepageSettings.mainHeading,
            description: homepageSettings.subtitle
          } as any
        } : null} />
      </div>

      {/* Demo QR Tax Payment Section */}
      <QRTaxPaymentSection />
      
      <div id="news-updates">
        <NewsUpdatesSection />
      </div>
      
      <div id="daily-message">
        <DailyMessageSection />
      </div>
      
      <AnnouncementsSection announcements={subdomainData.announcements} />
      
      <div id="village-history">
        <HistorySection 
          historyCards={subdomainData.historyCards} 
          timelineItems={timelineItems} 
        />
      </div>
      
      <CulturalHeritageSection culturalHeritage={subdomainData.culturalHeritage.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }))} />
    </>
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
