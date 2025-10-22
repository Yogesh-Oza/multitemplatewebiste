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

  return (
    <div className="min-h-screen">
      <AboutSection villageInfo={subdomainData.villageInfo} />
    </div>
  );
}
