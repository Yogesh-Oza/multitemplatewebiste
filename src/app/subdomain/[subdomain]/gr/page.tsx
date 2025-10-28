import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { Download, Calendar, Building, FileText, Search, Filter, Eye, Clock, CheckCircle, AlertCircle } from 'lucide-react';

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

  // Static data for Government Resolutions
  const staticResolutions = [
    {
      id: 1,
      number: 'मुसपंअ-२०२५/प्र.क्र.१५२/यो-११',
      title: 'मुख्यमंत्री समृद्ध पंचायतराज अभियान',
      titleEn: 'Chief Minister Prosperous Panchayati Raj Campaign',
      department: 'ग्राम विकास विभाग',
      departmentEn: 'Rural Development Department',
      date: '2024-10-16',
      category: 'अभियान',
      categoryEn: 'Campaign',
      status: 'सक्रिय',
      statusEn: 'Active',
      description: 'ग्रामपंचायतींच्या विकासासाठी महत्त्वाकांक्षी अभियान',
      descriptionEn: 'Ambitious campaign for development of Gram Panchayats',
      pdfUrl: '/documents/gr-2025-152.pdf',
      priority: 'उच्च',
      priorityEn: 'High'
    },
    {
      id: 2,
      number: 'मुसपंअ-२०२५/प्र.क्र.१४८/यो-१०',
      title: 'स्वच्छता अभियान निर्देश',
      titleEn: 'Sanitation Campaign Guidelines',
      department: 'स्वच्छता विभाग',
      departmentEn: 'Sanitation Department',
      date: '2024-10-10',
      category: 'निर्देश',
      categoryEn: 'Guidelines',
      status: 'सक्रिय',
      statusEn: 'Active',
      description: 'गावातील स्वच्छता सुधारण्यासाठी निर्देश',
      descriptionEn: 'Guidelines for improving village sanitation',
      pdfUrl: '/documents/gr-2025-148.pdf',
      priority: 'मध्यम',
      priorityEn: 'Medium'
    },
    {
      id: 3,
      number: 'मुसपंअ-२०२५/प्र.क्र.१४५/यो-०९',
      title: 'डिजिटल साक्षरता कार्यक्रम',
      titleEn: 'Digital Literacy Program',
      department: 'तंत्रज्ञान विभाग',
      departmentEn: 'Technology Department',
      date: '2024-10-05',
      category: 'कार्यक्रम',
      categoryEn: 'Program',
      status: 'सक्रिय',
      statusEn: 'Active',
      description: 'ग्रामीण भागात डिजिटल साक्षरता वाढवण्यासाठी',
      descriptionEn: 'To increase digital literacy in rural areas',
      pdfUrl: '/documents/gr-2025-145.pdf',
      priority: 'उच्च',
      priorityEn: 'High'
    },
    {
      id: 4,
      number: 'मुसपंअ-२०२५/प्र.क्र.१४०/यो-०८',
      title: 'पर्यावरण संवर्धन योजना',
      titleEn: 'Environmental Conservation Scheme',
      department: 'पर्यावरण विभाग',
      departmentEn: 'Environment Department',
      date: '2024-09-28',
      category: 'योजना',
      categoryEn: 'Scheme',
      status: 'सक्रिय',
      statusEn: 'Active',
      description: 'गावातील पर्यावरण संवर्धनासाठी योजना',
      descriptionEn: 'Scheme for environmental conservation in villages',
      pdfUrl: '/documents/gr-2025-140.pdf',
      priority: 'मध्यम',
      priorityEn: 'Medium'
    },
    {
      id: 5,
      number: 'मुसपंअ-२०२५/प्र.क्र.१३५/यो-०७',
      title: 'महिला सशक्तीकरण उपक्रम',
      titleEn: 'Women Empowerment Initiative',
      department: 'महिला व बाल विकास विभाग',
      departmentEn: 'Women & Child Development Department',
      date: '2024-09-20',
      category: 'उपक्रम',
      categoryEn: 'Initiative',
      status: 'सक्रिय',
      statusEn: 'Active',
      description: 'ग्रामीण महिलांच्या सशक्तीकरणासाठी उपक्रम',
      descriptionEn: 'Initiative for empowerment of rural women',
      pdfUrl: '/documents/gr-2025-135.pdf',
      priority: 'उच्च',
      priorityEn: 'High'
    }
  ];

  const categories = [
    { value: 'all', label: 'सर्व', labelEn: 'All' },
    { value: 'अभियान', label: 'अभियान', labelEn: 'Campaign' },
    { value: 'निर्देश', label: 'निर्देश', labelEn: 'Guidelines' },
    { value: 'कार्यक्रम', label: 'कार्यक्रम', labelEn: 'Program' },
    { value: 'योजना', label: 'योजना', labelEn: 'Scheme' },
    { value: 'उपक्रम', label: 'उपक्रम', labelEn: 'Initiative' }
  ];

  const priorities = [
    { value: 'all', label: 'सर्व', labelEn: 'All' },
    { value: 'उच्च', label: 'उच्च', labelEn: 'High' },
    { value: 'मध्यम', label: 'मध्यम', labelEn: 'Medium' },
    { value: 'कमी', label: 'कमी', labelEn: 'Low' }
  ];

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

        {/* Stats Section */}
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {staticResolutions.length}
              </div>
              <div className="text-gray-600">एकूण निर्णय</div>
              <div className="text-sm text-gray-500">Total Resolutions</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {staticResolutions.filter(r => r.status === 'सक्रिय').length}
              </div>
              <div className="text-gray-600">सक्रिय</div>
              <div className="text-sm text-gray-500">Active</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {staticResolutions.filter(r => r.priority === 'उच्च').length}
              </div>
              <div className="text-gray-600">उच्च प्राधान्य</div>
              <div className="text-sm text-gray-500">High Priority</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {new Set(staticResolutions.map(r => r.department)).size}
              </div>
              <div className="text-gray-600">विभाग</div>
              <div className="text-sm text-gray-500">Departments</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="container py-8">
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-600" />
              फिल्टर (Filters)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">श्रेणी</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.labelEn})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">प्राधान्य</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {priorities.map((priority) => (
                    <option key={priority.value} value={priority.value}>
                      {priority.label} ({priority.labelEn})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">शोध</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="निर्णय शोधा..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="container py-8">
          <div className="space-y-6">
            {staticResolutions.map((resolution) => (
              <div key={resolution.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {resolution.number}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        resolution.priority === 'उच्च' ? 'bg-red-100 text-red-800' :
                        resolution.priority === 'मध्यम' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {resolution.priority}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {resolution.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{resolution.titleEn}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <span>{resolution.department}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(resolution.date).toLocaleDateString('mr-IN')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      पहा
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      डाउनलोड
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {resolution.description}
                </p>
                
                <div className="flex items-center gap-4 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {resolution.category}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    {resolution.status}
                  </span>
                  <span className="text-gray-500">
                    PDF: {resolution.pdfUrl.split('/').pop()}
                  </span>
                </div>
              </div>
            ))}
          </div>
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
