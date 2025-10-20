import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { Calendar, DollarSign, Users, TrendingUp, CheckCircle, Clock, Star } from 'lucide-react';

const prisma = new PrismaClient();

interface ProjectsPageProps {
  params: Promise<{
    subdomain: string;
  }>;
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { subdomain } = await params;

  // Fetch subdomain data
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData || !subdomainData.isActive) {
    notFound();
  }

  // Fetch projects separately
  const projects = await prisma.project.findMany({
    where: { 
      subdomainId: subdomainData.id
    },
    orderBy: { order: 'asc' }
  });
  const featuredProjects = projects.filter((p: any) => p.isFeatured);
  const ongoingProjects = projects.filter((p: any) => p.status === 'ongoing');
  const completedProjects = projects.filter((p: any) => p.status === 'completed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'ongoing':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <SubdomainValidator subdomain={subdomain}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-teal-700 text-white py-16">
          <div className="container">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">
                प्रमुख प्रकल्प आणि उपक्रम
              </h1>
              <p className="text-xl text-green-100 max-w-3xl mx-auto">
                गावाच्या विकासासाठी चालू असलेले आणि पूर्ण झालेले प्रकल्प
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="container py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedProjects.length}
              </div>
              <div className="text-gray-600">पूर्ण प्रकल्प</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {ongoingProjects.length}
              </div>
              <div className="text-gray-600">चालू प्रकल्प</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {projects.filter((p: any) => p.status === 'upcoming').length}
              </div>
              <div className="text-gray-600">आगामी प्रकल्प</div>
            </div>
          </div>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="container py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Star className="h-6 w-6 text-yellow-500" />
              प्रमुख प्रकल्प
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {featuredProjects.map((project: any) => (
                <div key={project.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-2">
                          {project.status === 'completed' ? 'पूर्ण' : 
                           project.status === 'ongoing' ? 'चालू' : 'आगामी'}
                        </span>
                      </span>
                      <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {project.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>सुरु: {new Date(project.startDate).toLocaleDateString('mr-IN')}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>समाप्त: {new Date(project.endDate).toLocaleDateString('mr-IN')}</span>
                        </div>
                      )}
                    </div>
                    
                    {project.budget && (
                      <div className="flex items-center gap-1 text-sm text-gray-600 mb-4">
                        <DollarSign className="h-4 w-4" />
                        <span>बजेट: ₹{project.budget.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    
                    {/* Impact Metrics */}
                    {project.impactMetrics && Array.isArray(project.impactMetrics) && project.impactMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-4">
                        {project.impactMetrics.slice(0, 4).map((metric: any, index: number) => (
                          <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                            <div className="text-sm text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Projects */}
        <div className="container py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            सर्व प्रकल्प
          </h2>
          
          {projects.length === 0 ? (
            <div className="text-center py-16">
              <TrendingUp className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                अद्याप कोणतेही प्रकल्प उपलब्ध नाहीत
              </h3>
              <p className="text-gray-500">
                नवीन प्रकल्प सुरू झाल्यावर ते येथे प्रदर्शित केले जातील
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                      {getStatusIcon(project.status)}
                      <span className="ml-2">
                        {project.status === 'completed' ? 'पूर्ण' : 
                         project.status === 'ongoing' ? 'चालू' : 'आगामी'}
                      </span>
                    </span>
                    {project.isFeatured && (
                      <Star className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {project.description}
                  </p>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(project.startDate).toLocaleDateString('mr-IN')}</span>
                    </div>
                    {project.budget && (
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>₹{project.budget.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                    <div className="text-gray-500 text-xs">
                      {project.category}
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

export async function generateMetadata({ params }: ProjectsPageProps) {
  const { subdomain } = await params;
  
  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain }
  });

  if (!subdomainData) {
    return {
      title: 'Projects Not Found',
      description: 'The requested projects could not be found.'
    };
  }

  return {
    title: `प्रमुख प्रकल्प - ${subdomainData.villageName}`,
    description: `गावाच्या विकासासाठी चालू असलेले आणि पूर्ण झालेले प्रकल्प ${subdomainData.villageName} ग्रामपंचायत`,
    keywords: `${subdomainData.villageName}, Projects, Development, Gram Panchayat, Maharashtra`,
  };
}
