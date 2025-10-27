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
import { QuickInfoSection } from '@/components/sections/quick-info-section';
import { LeadershipSection } from '@/components/sections/leadership-section';
import { ProjectsSection } from '@/components/sections/projects-section';
import { SchemesSection } from '@/components/sections/schemes-section';

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
      },
      leadership: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      projects: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      },
      schemes: {
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }
    }
  });

  // Fetch additional data needed by sections
  const [homepageSettings, timelineItems, dashboardMetrics] = await Promise.all([
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

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  return (
    <>
      {/* Section 1: Hero Banner */}
      <HeroSection 
        heroImages={subdomainData.heroImages} 
        homepageSettings={homepageSettings} 
      />
      
      {/* Section 2: Quick Info Dashboard */}
      <QuickInfoSection 
        villageStats={{
          population: 1958,
          families: 227,
          area: 654.40,
          literacyRate: 85,
          waterSources: 12
        }}
        weather={{
          temperature: 28,
          condition: 'Partly Cloudy',
          humidity: 65
        }}
        dailyQuote="एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव"
      />
      
      {/* Section 3: Welcome Video & Progress Meter */}
      <WelcomeVideoSection homepageSettings={homepageSettings ? {
        welcomeVideo: {
          url: '',
          title: homepageSettings.mainHeading,
          description: homepageSettings.subtitle
        }
      } : null} />
      
      <PragatiMeterSection dashboardMetrics={dashboardMetrics.map(metric => ({
        ...metric,
        target: 100, // Default target value
        icon: 'TrendingUp', // Default icon
        color: 'blue' // Default color
      }))} />
      
      {/* Section 4: Latest News & Announcements */}
      <AnnouncementsSection announcements={subdomainData.announcements} />
      
      {/* Section 5: About Gram Panchayat */}
      <AboutSection villageInfo={subdomainData.villageInfo?.[0] ? {
        ...subdomainData.villageInfo[0],
        stats: Array.isArray(subdomainData.villageInfo[0].stats) 
          ? subdomainData.villageInfo[0].stats as any[]
          : []
      } : null} />
      
      {/* Section 6: Meet Your Leaders */}
      <LeadershipSection leadership={subdomainData.leadership} />
      
      {/* Section 7: Key Projects & Initiatives */}
      <ProjectsSection projects={subdomainData.projects} />
      
      {/* Section 8: Schemes & Beneficiaries */}
      <SchemesSection schemes={subdomainData.schemes} />
      
      {/* Section 9: Village Infrastructure - Placeholder */}
      <div id="infrastructure" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">पायाभूत सुविधा</h2>
          <p className="text-gray-600">Infrastructure section coming soon...</p>
        </div>
      </div>
      
      {/* Section 10: Finance & Budget Transparency */}
      <div id="finance" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">अर्थसंकल्प आणि पारदर्शकता</h2>
          <p className="text-gray-600">Finance section coming soon...</p>
        </div>
      </div>
      
      {/* Section 11: Citizen Services - Placeholder */}
      <div id="citizenServices" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">नागरिक सेवा</h2>
          <p className="text-gray-600">Citizen Services section coming soon...</p>
        </div>
      </div>
      
      {/* Section 12: Our Village – Identity & Culture */}
      <CulturalHeritageSection culturalHeritage={subdomainData.culturalHeritage.map(item => ({
        ...item,
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString()
      }))} />
      
      {/* Section 13: Employment & Skill Development - Placeholder */}
      <div id="employment" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">रोजगार आणि कौशल्य विकास</h2>
          <p className="text-gray-600">Employment section coming soon...</p>
        </div>
      </div>
      
      {/* Section 14: Education & Youth Corner - Placeholder */}
      <div id="education" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">शिक्षण आणि युवा कोपरा</h2>
          <p className="text-gray-600">Education section coming soon...</p>
        </div>
      </div>
      
      {/* Section 15: Grievance Redressal - Placeholder */}
      <div id="grievance" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">तक्रार निवारण</h2>
          <p className="text-gray-600">Grievance section coming soon...</p>
        </div>
      </div>
      
      {/* Section 16: Environment & Sustainability - Placeholder */}
      <div id="environment" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">पर्यावरण आणि स्थिरता</h2>
          <p className="text-gray-600">Environment section coming soon...</p>
        </div>
      </div>
      
      {/* Section 17: Gallery & Media */}
      <div id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">गॅलरी आणि मीडिया</h2>
          <p className="text-gray-600">Gallery section coming soon...</p>
        </div>
      </div>
      
      {/* Section 18: Contact & Collaboration */}
      <div id="contact" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">संपर्क आणि सहकार्य</h2>
          <p className="text-gray-600">Contact section coming soon...</p>
        </div>
      </div>
      
      {/* Additional sections for history and programs */}
      <HistorySection 
        historyCards={subdomainData.historyCards} 
        timelineItems={timelineItems} 
      />
      
      <div id="programs" className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">कार्यक्रम</h2>
          <p className="text-gray-600">Programs section coming soon...</p>
        </div>
      </div>
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
