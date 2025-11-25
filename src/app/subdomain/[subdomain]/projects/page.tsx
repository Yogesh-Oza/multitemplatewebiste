import { notFound } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { SubdomainValidator } from '@/components/subdomain-validator';
import { SankalpTrackerSection } from '@/components/sections/sankalp-tracker-section';
import { EnhancedBeforeAfterSection } from '@/components/sections/enhanced-before-after-section';
import { Calendar, DollarSign, Users, TrendingUp, CheckCircle, Clock, Star, BarChart3, Target, Award, Eye, ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { DEFAULT_SANKALP_ITEMS, SankalpTrackerItem } from '@/lib/sankalp-defaults';
import { getDemoImpactMetrics, getDemoBeforeAfterItems, getDemoProjects, getDemoSankalpItems } from '@/lib/projects-demo-data';

// Icon mapping for dynamic icons
const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    Target,
    BarChart3,
    Users,
    DollarSign,
    CheckCircle
  };
  return icons[iconName] || Target;
};

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

  // Fetch projects from database
  const dbProjects = await prisma.project.findMany({
    where: { 
      subdomainId: subdomainData.id,
      isActive: true
    },
    orderBy: { order: 'asc' }
  });
  
  // Use demo data if no projects exist, otherwise use database projects
  const demoProjects = getDemoProjects();
  const projects = dbProjects.length > 0 ? dbProjects.map((p: any) => {
    // Convert dates to strings and add image field from photos
    const project: any = {
      ...p,
      startDate: p.startDate instanceof Date ? p.startDate.toISOString().split('T')[0] : p.startDate,
      endDate: p.endDate ? (p.endDate instanceof Date ? p.endDate.toISOString().split('T')[0] : p.endDate) : undefined,
      image: (p.photosAfter && Array.isArray(p.photosAfter) && p.photosAfter.length > 0) 
        ? p.photosAfter[0] 
        : ((p.photosBefore && Array.isArray(p.photosBefore) && p.photosBefore.length > 0) 
          ? p.photosBefore[0] 
          : '/images/hero-1.jpg')
    };
    return project;
  }) : demoProjects;
  const featuredProjects = projects.filter((p: any) => p.isFeatured);
  const ongoingProjects = projects.filter((p: any) => p.status === 'ongoing');
  const completedProjects = projects.filter((p: any) => p.status === 'completed');

  // Fetch before/after gallery from database
  const dbBeforeAfterItems = await prisma.beforeAfterGallery.findMany({
    where: {
      subdomainId: subdomainData.id,
      isActive: true
    },
    orderBy: { order: 'asc' }
  });

  // Use demo data if no items exist
  const demoBeforeAfterItems = getDemoBeforeAfterItems();
  const beforeAfterData = dbBeforeAfterItems.length > 0 ? dbBeforeAfterItems : demoBeforeAfterItems;

  // Fetch impact dashboard metrics from database
  const dbImpactMetrics = await prisma.impactDashboardMetric.findMany({
    where: { 
      subdomainId: subdomainData.id,
      isActive: true 
    },
    orderBy: { order: 'asc' }
  });

  // Use demo data if no metrics exist
  const demoImpactMetrics = getDemoImpactMetrics();
  const impactMetrics = dbImpactMetrics.length > 0 ? dbImpactMetrics : demoImpactMetrics;

  // Fetch Sankalp tracker items
  const sankalpItemsFromDb = await prisma.sankalpItem.findMany({
    where: {
      subdomainId: subdomainData.id,
      isActive: true,
    },
    orderBy: { order: 'asc' },
  });

  let sankalpItems: SankalpTrackerItem[] = sankalpItemsFromDb.map((item) => ({
    id: item.id,
    title: item.title,
    titleEn: item.titleEn,
    description: item.description,
    descriptionEn: item.descriptionEn,
    currentValue: item.currentValue,
    targetValue: item.targetValue,
    unit: item.unit,
    icon: item.icon,
    color: item.color,
    status: item.status as SankalpTrackerItem['status'],
    priority: item.priority as SankalpTrackerItem['priority'],
    order: item.order,
    isActive: item.isActive,
  }));

  // Use demo data if no items exist
  if (sankalpItems.length === 0) {
    sankalpItems = getDemoSankalpItems();
  }

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

        {/* Impact Dashboard */}
        <div className="container py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-600" />
            प्रभाव डॅशबोर्ड (Impact Dashboard)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {impactMetrics.map((metric: any) => {
              const IconComponent = getIconComponent(metric.icon || 'Target');
              return (
              <div key={metric.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    metric.color === 'blue' ? 'bg-blue-500 text-white' :
                    metric.color === 'green' ? 'bg-green-500 text-white' :
                    metric.color === 'purple' ? 'bg-purple-500 text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {metric.value.toLocaleString('en-IN')}
                    </div>
                    <div className="text-sm text-gray-600">{metric.unit}</div>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {metric.title}
                </h3>
                <div className="mb-2">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>प्रगती</span>
                    <span>{Math.round((metric.value / metric.target) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        metric.color === 'blue' ? 'bg-blue-500' :
                        metric.color === 'green' ? 'bg-green-500' :
                        metric.color === 'purple' ? 'bg-purple-500' :
                        'bg-orange-500'
                      }`}
                      style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  लक्ष्य: {metric.target.toLocaleString('en-IN')} {metric.unit}
                </div>
              </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Before/After Gallery */}
        <EnhancedBeforeAfterSection />

        {/* Stats Section */}
        <div className="container py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-purple-600" />
            प्रकल्प सांख्यिकी (Project Statistics)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {completedProjects.length}
              </div>
              <div className="text-gray-600">पूर्ण प्रकल्प</div>
              <div className="text-sm text-gray-500">Completed Projects</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {ongoingProjects.length}
              </div>
              <div className="text-gray-600">चालू प्रकल्प</div>
              <div className="text-sm text-gray-500">Ongoing Projects</div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-3xl font-bold text-yellow-600 mb-2">
                {projects.filter((p: any) => p.status === 'upcoming').length}
              </div>
              <div className="text-gray-600">आगामी प्रकल्प</div>
              <div className="text-sm text-gray-500">Upcoming Projects</div>
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

        {/* Sankalp Tracker Section */}
        <SankalpTrackerSection items={sankalpItems} />

        {/* All Projects - Beautiful Demo Design */}
        <div className="py-16 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-purple-400 rounded-full blur-2xl animate-pulse delay-500"></div>
          </div>

          <div className="container relative z-10">
            {/* Section Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full text-sm font-semibold mb-6 shadow-lg">
                <TrendingUp className="h-4 w-4" />
                सर्व प्रकल्प
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                गावाचे विकास प्रकल्प
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                गावाच्या विकासासाठी चालू असलेले, पूर्ण झालेले आणि आगामी प्रकल्प
              </p>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: any, index: number) => (
                <div 
                  key={project.id} 
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border-0 animate-in slide-in-from-bottom-4 fade-in"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image || '/images/hero-1.jpg'} 
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="ml-1">
                          {project.status === 'completed' ? 'पूर्ण' : 
                           project.status === 'ongoing' ? 'चालू' : 'आगामी'}
                        </span>
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.isFeatured && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500 text-white flex items-center gap-1">
                          <Star className="h-3 w-3" />
                          प्रमुख
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    {/* Category Badge */}
                    <div className="mb-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {project.category}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-500 italic mb-3">
                      {project.titleEn}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>

                    {/* Project Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span>सुरु: {new Date(project.startDate).toLocaleDateString('mr-IN')}</span>
                      </div>
                      {project.endDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4 text-green-500" />
                          <span>समाप्त: {new Date(project.endDate).toLocaleDateString('mr-IN')}</span>
                        </div>
                      )}
                      {project.budget && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold">₹{project.budget.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {/* Impact Metrics */}
                    {project.impactMetrics && project.impactMetrics.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {project.impactMetrics.slice(0, 4).map((metric: any, idx: number) => (
                          <div key={idx} className="text-center p-2 bg-gray-50 rounded-lg">
                            <div className="text-lg font-bold text-gray-900">{metric.value}</div>
                            <div className="text-xs text-gray-600">{metric.label}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Read More Button */}
                    <div className="flex items-center justify-between">
                      <a 
                        href="#" 
                        className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all"
                      >
                        संपूर्ण वाचा
                        <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </a>
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <div className="text-center mt-12">
              <a 
                href="#" 
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                अधिक प्रकल्प पहा
                <ChevronRight className="h-5 w-5" />
              </a>
            </div>
          </div>
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
