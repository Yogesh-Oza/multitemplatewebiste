import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true,
      footerContent: true
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // This should not happen as the page already validates, but just in case
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid subdomain</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        villageName={subdomainData.villageName}
        villageNameEn={subdomainData.villageNameEn}
        villageData={{
          villageLogo: subdomainData.villageInfo?.villageLogo,
          villageName: subdomainData.villageInfo?.villageName,
          villageNameEn: subdomainData.villageInfo?.villageNameEn,
          satyamevJayateLogoUrl: subdomainData.villageInfo?.satyamevJayateLogoUrl,
          digitalIndiaLogoUrl: subdomainData.villageInfo?.digitalIndiaLogoUrl,
          govDeptText: subdomainData.villageInfo?.govDeptText,
          officialSiteText: subdomainData.villageInfo?.officialSiteText,
        }}
      />
      <main className="flex-1">
        {children}
      </main>
      <Footer footerContent={subdomainData.footerContent} />
    </div>
  );
}
