import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { GRContent } from './gr-content';
import { GOVERNMENT_RESOLUTION_DEMO_DATA } from '@/lib/demo-government-resolutions';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

interface GRPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function GRPage({ params }: GRPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  // Fetch government resolutions from database
  const resolutions = await prisma.governmentResolution.findMany({
    where: { 
      subdomainId: subdomainData.id,
      isActive: true
    },
    orderBy: { date: 'desc' }
  });
  const isUsingDemoData = resolutions.length === 0;

  // Transform resolutions for client component, or use demo data if empty
  const resolutionsData = !isUsingDemoData
    ? resolutions.map(resolution => ({
        id: resolution.id,
        number: resolution.number,
        title: resolution.title,
        titleEn: resolution.titleEn,
        department: resolution.department,
        departmentEn: resolution.departmentEn,
        date: resolution.date.toISOString(),
        category: resolution.category,
        categoryEn: resolution.categoryEn,
        priority: resolution.priority || 'मध्यम',
        priorityEn: resolution.priorityEn || 'Medium',
        description: resolution.description || '',
        descriptionEn: resolution.descriptionEn || '',
        fileUrl: resolution.fileUrl || '',
        isActive: resolution.isActive
      }))
    : GOVERNMENT_RESOLUTION_DEMO_DATA;

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                शासकीय निर्णय (Government Resolutions)
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                महाराष्ट्र शासनाचे निर्णय, परिपत्रके आणि आदेश येथे उपलब्ध आहेत
              </p>
              <p className="text-lg text-blue-200 mt-2">
                Maharashtra Government Resolutions, Circulars and Orders Available Here
              </p>
            </div>
          </div>
        </div>

        {/* Client Component for Dynamic Content */}
        <GRContent initialResolutions={resolutionsData} isDemoData={isUsingDemoData} />
      </div>
    </SubdomainValidator>
  );
}

export async function generateMetadata({ params }: GRPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Government Resolutions Not Found',
      description: 'The requested government resolutions could not be found.'
    };
  }

  return {
    title: `शासकीय निर्णय - ${subdomainData.villageName}`,
    description: `महाराष्ट्र शासनाचे निर्णय, परिपत्रके आणि आदेश ${subdomainData.villageName} ग्रामपंचायत`,
    keywords: `${subdomainData.villageName}, Government Resolutions, GR, Maharashtra, Gram Panchayat`,
  };
}
