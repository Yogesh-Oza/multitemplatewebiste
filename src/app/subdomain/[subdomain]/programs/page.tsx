import { ProgramsSection } from '@/components/sections/programs-section';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

interface ProgramsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function SubdomainProgramsPage({ params }: ProgramsPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      programs: {
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
      <ProgramsSection programs={subdomainData.programs} />
    </div>
  );
}
