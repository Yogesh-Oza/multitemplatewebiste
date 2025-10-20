import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { Download, Calendar, Building, FileText } from 'lucide-react';

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

  // Fetch government resolutions separately
  const resolutions = await prisma.governmentResolution.findMany({
    where: { 
      subdomainId: subdomainData.id
    },
    orderBy: { createdAt: 'desc' }
  });

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
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-12">
          {resolutions.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                अद्याप कोणतेही शासकीय निर्णय उपलब्ध नाहीत
              </h3>
              <p className="text-gray-500">
                नवीन निर्णय आल्यावर ते येथे प्रदर्शित केले जातील
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {resolutions.map((resolution: any) => (
                <div key={resolution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <Building className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                          {resolution.department}
                        </span>
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                          {resolution.category}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {resolution.title}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(resolution.date).toLocaleDateString('mr-IN')}</span>
                        </div>
                        <span className="font-medium">नंबर: {resolution.number}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={resolution.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="h-4 w-4" />
                        डाउनलोड करा
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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
