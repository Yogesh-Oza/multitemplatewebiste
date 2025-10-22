import { AboutSection } from '@/components/sections/about-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

interface AboutPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainAboutPage({ params }: AboutPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      villageInfo: true
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    // Redirect to main site for invalid subdomains
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  // Transform the data to match the expected interface
  const villageInfo = subdomainData.villageInfo?.[0] ? {
    ...subdomainData.villageInfo[0],
    stats: Array.isArray(subdomainData.villageInfo[0].stats) 
      ? subdomainData.villageInfo[0].stats as any[]
      : []
  } : null;

  return (
    <div className="min-h-screen">
      <AboutSection villageInfo={villageInfo} />
    </div>
  );
}
