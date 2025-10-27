'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, Clock, AlertCircle, TrendingUp, Eye } from 'lucide-react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  status: string;
  budget: number | null;
  photosBefore: string[];
  photosAfter: string[];
  impactMetrics: any;
  category: string;
  categoryEn: string;
  isFeatured: boolean;
  order: number;
}

interface ProjectsSectionProps {
  projects?: Project[];
}

export function ProjectsSection({ projects = [] }: ProjectsSectionProps) {
  const { t, language } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle;
      case 'ongoing':
        return Clock;
      default:
        return AlertCircle;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return t('projects.completed');
      case 'ongoing':
        return t('projects.ongoing');
      default:
        return t('projects.proposed');
    }
  };

  const featuredProjects = projects.filter(p => p.isFeatured);
  const completedProjects = projects.filter(p => p.status === 'completed');
  const ongoingProjects = projects.filter(p => p.status === 'ongoing');

  return (
    <section id="projects" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('projects.title')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Sankalp Tracker */}
        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {t('projects.sankalpTracker')}
          </h3>
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {completedProjects.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('projects.completed')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {ongoingProjects.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {t('projects.ongoing')}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {projects.length}
                  </div>
                  <div className="text-sm text-gray-600">
                    {language === 'en' ? 'Total Projects' : 'एकूण प्रकल्प'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6">
              {language === 'en' ? 'Featured Projects' : 'विशेष प्रकल्प'}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredProjects.slice(0, 2).map((project) => {
                const StatusIcon = getStatusIcon(project.status);
                return (
                  <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                    <div className="relative">
                      {project.photosAfter && project.photosAfter.length > 0 ? (
                        <Image
                          src={project.photosAfter[0]}
                          alt={language === 'en' ? project.titleEn : project.title}
                          width={600}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                          <TrendingUp className="w-16 h-16 text-gray-400" />
                        </div>
                      )}
                      <Badge 
                        className={`absolute top-4 right-4 ${getStatusColor(project.status)}`}
                      >
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {getStatusLabel(project.status)}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h4 className="text-xl font-semibold text-gray-900 mb-2">
                        {language === 'en' ? project.titleEn : project.title}
                      </h4>
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {language === 'en' ? project.descriptionEn : project.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          {language === 'en' ? project.categoryEn : project.category}
                        </div>
                        {project.budget && (
                          <div className="text-sm font-semibold text-green-600">
                            ₹{project.budget.toLocaleString()}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* All Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const StatusIcon = getStatusIcon(project.status);
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="relative">
                  {project.photosAfter && project.photosAfter.length > 0 ? (
                    <Image
                      src={project.photosAfter[0]}
                      alt={language === 'en' ? project.titleEn : project.title}
                      width={400}
                      height={200}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-200 flex items-center justify-center">
                      <TrendingUp className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  <Badge 
                    className={`absolute top-2 right-2 ${getStatusColor(project.status)}`}
                  >
                    <StatusIcon className="w-3 h-3 mr-1" />
                    {getStatusLabel(project.status)}
                  </Badge>
                </div>
                <CardContent className="p-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {language === 'en' ? project.titleEn : project.title}
                  </h4>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {language === 'en' ? project.descriptionEn : project.description}
                  </p>
                  
                  {/* Impact Metrics */}
                  {project.impactMetrics && project.impactMetrics.length > 0 && (
                    <div className="mb-3">
                      <div className="text-xs font-semibold text-gray-500 mb-2">
                        {t('projects.impact')}:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {project.impactMetrics.slice(0, 2).map((metric: any, index: number) => (
                          <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {metric.label}: {metric.value}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      {language === 'en' ? project.categoryEn : project.category}
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="w-3 h-3 mr-1" />
                      {t('common.viewMore')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Before & After Gallery */}
        {projects.some(p => p.photosBefore && p.photosAfter) && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {t('projects.beforeAfter')}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects
                .filter(p => p.photosBefore && p.photosAfter)
                .slice(0, 6)
                .map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="grid grid-cols-2">
                      <div className="relative">
                        <Image
                          src={project.photosBefore![0]}
                          alt={`${language === 'en' ? project.titleEn : project.title} - Before`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {language === 'en' ? 'Before' : 'पूर्वी'}
                        </div>
                      </div>
                      <div className="relative">
                        <Image
                          src={project.photosAfter![0]}
                          alt={`${language === 'en' ? project.titleEn : project.title} - After`}
                          width={200}
                          height={150}
                          className="w-full h-32 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                          {language === 'en' ? 'After' : 'नंतर'}
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="text-sm font-semibold text-gray-900 text-center">
                        {language === 'en' ? project.titleEn : project.title}
                      </h4>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}