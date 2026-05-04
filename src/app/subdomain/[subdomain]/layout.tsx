import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { prisma } from '@/lib/prisma';

interface SubdomainLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainLayout({
  children,
  params,
}: SubdomainLayoutProps) {
  const { subdomain } = await params;

  // Fetch subdomain data for Header and Footer
  let subdomainData: any = null;
  try {
    subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      include: {
        villageInfo: true,
        footerContent: true
      }
    });
  } catch (e) {
    console.error('Failed to read subdomain from DB:', e);
  }

  if (!subdomainData || !subdomainData.isActive) {
    // This should not happen as the page already validates, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Service temporarily unavailable. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        villageName={subdomainData.villageName}
        villageNameEn={subdomainData.villageNameEn}
        villageData={{
          villageLogo: subdomainData.villageInfo?.[0]?.villageLogo || undefined,
          villageName: subdomainData.villageInfo?.[0]?.villageName || undefined,
          villageNameEn: subdomainData.villageInfo?.[0]?.villageNameEn || undefined,
          satyamevJayateLogoUrl: subdomainData.villageInfo?.[0]?.satyamevJayateLogoUrl || undefined,
          digitalIndiaLogoUrl: subdomainData.villageInfo?.[0]?.digitalIndiaLogoUrl || undefined,
          govDeptText: subdomainData.villageInfo?.[0]?.govDeptText || undefined,
          officialSiteText: subdomainData.villageInfo?.[0]?.officialSiteText || undefined,
          publicQuickLinks: subdomainData.villageInfo?.[0]?.publicQuickLinks ?? undefined,
        }}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer footerContent={subdomainData.footerContent?.[0] ? {
        ...subdomainData.footerContent[0],
        socialMedia: Array.isArray(subdomainData.footerContent[0].socialMedia) 
          ? subdomainData.footerContent[0].socialMedia as any[]
          : []
      } : null} />
    </div>
  );
}
