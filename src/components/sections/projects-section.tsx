'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Clock, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Image as ImageIcon,
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import Image from 'next/image';

interface ProjectData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  status: 'completed' | 'ongoing' | 'proposed';
  startDate: string;
  endDate?: string;
  budget?: number;
  images: string[];
  beforeImage?: string;
  afterImage?: string;
  impactMetrics: Array<{
    label: string;
    value: number;
    unit?: string;
  }>;
  category: string;
  categoryEn: string;
  isFeatured: boolean;
}

interface ProjectsSectionProps {
  projects?: ProjectData[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const { t, language } = useTranslation();

  // Group projects by status
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.status]) {
      acc[project.status] = [];
    }
    acc[project.status].push(project);
    return acc;
  }, {} as Record<string, ProjectData[]>);

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: language === 'en' ? 'Completed' : 'पूर्ण झालेले',
          icon: CheckCircle,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'ongoing':
        return {
          label: language === 'en' ? 'Ongoing' : 'चालू',
          icon: Clock,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'proposed':
        return {
          label: language === 'en' ? 'Proposed' : 'प्रस्तावित',
          icon: Calendar,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      language === 'en' ? 'en-IN' : 'mr-IN'
    );
  };

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.projects.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Key projects and initiatives driving our village development'
              : 'आमच्या गावाच्या विकासाला चालना देणारे मुख्य प्रकल्प आणि उपक्रम'
            }
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'en' 
                ? 'Project information will be updated soon'
                : 'प्रकल्प माहिती लवकरच अद्यतनित केली जाईल'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedProjects).map(([status, statusProjects]) => {
              const statusInfo = getStatusInfo(status);
              const StatusIcon = statusInfo.icon;
              
              return (
                <div key={status} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${statusInfo.color.split(' ')[1]}`}>
                      <StatusIcon className={`w-5 h-5 ${statusInfo.color.split(' ')[0]}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {statusInfo.label}
                    </h3>
                    <Badge className={statusInfo.badgeColor}>
                      {statusProjects.length} {language === 'en' ? 'Projects' : 'प्रकल्प'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {statusProjects.map((project) => (
                      <Card key={project.id} className="hover:shadow-lg transition-all duration-300 group overflow-hidden">
                        {/* Project Image */}
                        {project.images.length > 0 && (
                          <div className="relative h-48 w-full">
                            <Image
                              src={project.images[0]}
                              alt={language === 'en' ? project.titleEn : project.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            {project.isFeatured && (
                              <Badge className="absolute top-4 left-4 bg-yellow-500 text-white">
                                {language === 'en' ? 'Featured' : 'विशेष'}
                              </Badge>
                            )}
                            <Badge className={`absolute top-4 right-4 ${statusInfo.badgeColor}`}>
                              {statusInfo.label}
                            </Badge>
                          </div>
                        )}

                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                            {language === 'en' ? project.titleEn : project.title}
                          </CardTitle>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {formatDate(project.startDate)}
                              {project.endDate && ` - ${formatDate(project.endDate)}`}
                            </span>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {language === 'en' ? project.descriptionEn : project.description}
                          </p>

                          {/* Project Details */}
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">
                                {language === 'en' ? 'Category' : 'वर्ग'}:
                              </span>
                              <span className="font-medium">
                                {language === 'en' ? project.categoryEn : project.category}
                              </span>
                            </div>
                            {project.budget && (
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1">
                                  <DollarSign className="w-4 h-4" />
                                  {language === 'en' ? 'Budget' : 'अर्थसंकल्प'}:
                                </span>
                                <span className="font-medium">
                                  {formatCurrency(project.budget)}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Impact Metrics */}
                          {project.impactMetrics.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                {language === 'en' ? 'Impact' : 'परिणाम'}:
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {project.impactMetrics.slice(0, 2).map((metric, index) => (
                                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                                    <div className="text-lg font-bold text-blue-600">
                                      {metric.value}
                                      {metric.unit && <span className="text-xs text-gray-500 ml-1">{metric.unit}</span>}
                                    </div>
                                    <div className="text-xs text-gray-600">
                                      {metric.label}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Before/After Images */}
                          {(project.beforeImage || project.afterImage) && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2">
                                {language === 'en' ? 'Before & After' : 'पूर्वी आणि नंतर'}:
                              </h4>
                              <div className="grid grid-cols-2 gap-2">
                                {project.beforeImage && (
                                  <div className="relative h-20 rounded overflow-hidden">
                                    <Image
                                      src={project.beforeImage}
                                      alt={language === 'en' ? 'Before' : 'पूर्वी'}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                                      {language === 'en' ? 'Before' : 'पूर्वी'}
                                    </div>
                                  </div>
                                )}
                                {project.afterImage && (
                                  <div className="relative h-20 rounded overflow-hidden">
                                    <Image
                                      src={project.afterImage}
                                      alt={language === 'en' ? 'After' : 'नंतर'}
                                      fill
                                      className="object-cover"
                                    />
                                    <div className="absolute bottom-1 left-1 text-xs bg-black bg-opacity-50 text-white px-1 rounded">
                                      {language === 'en' ? 'After' : 'नंतर'}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Action Button */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                          >
                            <ExternalLink className="w-4 h-4 mr-2" />
                            {language === 'en' ? 'View Details' : 'तपशील पहा'}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Sankalp Tracker */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  {t('sections.projects.sankalpTracker')}
                </h3>
                <p className="text-blue-100 mb-6">
                  {language === 'en' 
                    ? 'Track our progress towards key development goals'
                    : 'मुख्य विकास लक्ष्यांकडे आमच्या प्रगतीचा मागोवा घ्या'
                  }
                </p>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="text-center">
                      <div className="w-16 h-16 mx-auto mb-2 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                        <TrendingUp className="w-8 h-8" />
                      </div>
                      <div className="text-sm font-medium">
                        {language === 'en' ? `Goal ${item}` : `लक्ष्य ${item}`}
                      </div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="mt-6 bg-white text-blue-600 hover:bg-gray-100"
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'View All Goals' : 'सर्व लक्ष्ये पहा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <ImageIcon className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View All Projects' : 'सर्व प्रकल्प पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}