'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  Users, 
  TrendingUp, 
  MapPin,
  Calendar,
  DollarSign,
  ExternalLink,
  Download,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  GraduationCap,
  Wrench,
  ShoppingCart
} from 'lucide-react';
import Image from 'next/image';

interface JobData {
  id: string;
  title: string;
  titleEn: string;
  company: string;
  companyEn: string;
  location: string;
  locationEn: string;
  type: 'full-time' | 'part-time' | 'contract' | 'internship';
  salary?: string;
  description: string;
  descriptionEn: string;
  requirements: string[];
  requirementsEn: string[];
  postedDate: string;
  deadline?: string;
  isActive: boolean;
  category: 'government' | 'private' | 'ngo' | 'self-employment';
}

interface SkillData {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  durationEn: string;
  cost: string;
  costEn: string;
  provider: string;
  providerEn: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  category: 'technical' | 'soft-skills' | 'agriculture' | 'handicraft';
}

interface EmploymentSectionProps {
  jobs?: JobData[];
  skills?: SkillData[];
  statistics?: {
    totalJobs: number;
    activeJobs: number;
    totalApplicants: number;
    placementRate: number;
  };
}

export function EmploymentSection({ 
  jobs = [], 
  skills = [], 
  statistics = {
    totalJobs: 0,
    activeJobs: 0,
    totalApplicants: 0,
    placementRate: 0
  }
}: EmploymentSectionProps) {
  const { t, language } = useTranslation();

  // Group jobs by category
  const groupedJobs = jobs.reduce((acc, job) => {
    if (!acc[job.category]) {
      acc[job.category] = [];
    }
    acc[job.category].push(job);
    return acc;
  }, {} as Record<string, JobData[]>);

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, SkillData[]>);

  const getJobTypeInfo = (type: string) => {
    switch (type) {
      case 'full-time':
        return {
          label: language === 'en' ? 'Full Time' : 'पूर्णवेळ',
          color: 'bg-green-100 text-green-800',
          icon: Briefcase
        };
      case 'part-time':
        return {
          label: language === 'en' ? 'Part Time' : 'अर्धवेळ',
          color: 'bg-blue-100 text-blue-800',
          icon: Clock
        };
      case 'contract':
        return {
          label: language === 'en' ? 'Contract' : 'करार',
          color: 'bg-orange-100 text-orange-800',
          icon: Calendar
        };
      case 'internship':
        return {
          label: language === 'en' ? 'Internship' : 'इंटर्नशिप',
          color: 'bg-purple-100 text-purple-800',
          icon: GraduationCap
        };
      default:
        return {
          label: type,
          color: 'bg-gray-100 text-gray-800',
          icon: Briefcase
        };
    }
  };

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'government':
        return {
          label: language === 'en' ? 'Government Jobs' : 'शासकीय नोकरी',
          icon: Building,
          color: 'text-blue-600 bg-blue-50 border-blue-200'
        };
      case 'private':
        return {
          label: language === 'en' ? 'Private Sector' : 'खाजगी क्षेत्र',
          icon: Briefcase,
          color: 'text-green-600 bg-green-50 border-green-200'
        };
      case 'ngo':
        return {
          label: language === 'en' ? 'NGO Sector' : 'एनजीओ क्षेत्र',
          icon: Users,
          color: 'text-purple-600 bg-purple-50 border-purple-200'
        };
      case 'self-employment':
        return {
          label: language === 'en' ? 'Self Employment' : 'स्वरोजगार',
          icon: Wrench,
          color: 'text-orange-600 bg-orange-50 border-orange-200'
        };
      default:
        return {
          label: category,
          icon: Briefcase,
          color: 'text-gray-600 bg-gray-50 border-gray-200'
        };
    }
  };

  const getSkillCategoryInfo = (category: string) => {
    switch (category) {
      case 'technical':
        return {
          label: language === 'en' ? 'Technical Skills' : 'तांत्रिक कौशल्य',
          icon: Wrench,
          color: 'text-blue-600 bg-blue-50'
        };
      case 'soft-skills':
        return {
          label: language === 'en' ? 'Soft Skills' : 'सॉफ्ट स्किल्स',
          icon: Users,
          color: 'text-green-600 bg-green-50'
        };
      case 'agriculture':
        return {
          label: language === 'en' ? 'Agriculture' : 'शेती',
          icon: TrendingUp,
          color: 'text-orange-600 bg-orange-50'
        };
      case 'handicraft':
        return {
          label: language === 'en' ? 'Handicraft' : 'हस्तकला',
          icon: ShoppingCart,
          color: 'text-purple-600 bg-purple-50'
        };
      default:
        return {
          label: category,
          icon: GraduationCap,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  return (
    <section id="employment" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.employment.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Find employment opportunities and skill development programs'
              : 'रोजगाराच्या संधी आणि कौशल्य विकास कार्यक्रम शोधा'
            }
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalJobs}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Total Jobs' : 'एकूण नोकरी'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.activeJobs}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Active Jobs' : 'सक्रिय नोकरी'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.totalApplicants}
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Applicants' : 'अर्जदार'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.placementRate}%
              </h3>
              <p className="text-gray-600">
                {language === 'en' ? 'Placement Rate' : 'प्लेसमेंट दर'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Job Opportunities */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Job Opportunities' : 'नोकरीच्या संधी'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Jobs' : 'सर्व नोकरी पहा'}
            </Button>
          </div>

          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Job opportunities will be updated soon'
                  : 'नोकरीच्या संधी लवकरच अद्यतनित केल्या जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedJobs).map(([category, categoryJobs]) => {
                const categoryInfo = getCategoryInfo(category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color.split(' ')[1]}`}>
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {categoryInfo.label}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {categoryJobs.length} {language === 'en' ? 'Jobs' : 'नोकरी'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryJobs.slice(0, 6).map((job) => {
                        const jobTypeInfo = getJobTypeInfo(job.type);
                        const JobTypeIcon = jobTypeInfo.icon;
                        
                        return (
                          <Card key={job.id} className="hover:shadow-lg transition-all duration-300 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                  {language === 'en' ? job.titleEn : job.title}
                                </CardTitle>
                                <Badge className={jobTypeInfo.color}>
                                  <JobTypeIcon className="w-3 h-3 mr-1" />
                                  {jobTypeInfo.label}
                                </Badge>
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <Building className="w-4 h-4 mr-2" />
                                {language === 'en' ? job.companyEn : job.company}
                              </div>
                              <div className="flex items-center text-sm text-gray-600">
                                <MapPin className="w-4 h-4 mr-2" />
                                {language === 'en' ? job.locationEn : job.location}
                              </div>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {language === 'en' ? job.descriptionEn : job.description}
                              </p>

                              {job.salary && (
                                <div className="flex items-center text-sm text-green-600 mb-4">
                                  <DollarSign className="w-4 h-4 mr-2" />
                                  {job.salary}
                                </div>
                              )}

                              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {language === 'en' ? 'Posted' : 'पोस्ट केले'}: {new Date(job.postedDate).toLocaleDateString()}
                                </div>
                                {job.deadline && (
                                  <div className="flex items-center text-red-600">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {language === 'en' ? 'Deadline' : 'अंतिम तारीख'}: {new Date(job.deadline).toLocaleDateString()}
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Button 
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                  size="sm"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Apply Now' : 'आता अर्ज करा'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Download Details' : 'तपशील डाउनलोड करा'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {categoryJobs.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${categoryJobs.length - 6} More Jobs` 
                            : `${categoryJobs.length - 6} अधिक नोकरी पहा`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Skill Development */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Skill Development Programs' : 'कौशल्य विकास कार्यक्रम'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Programs' : 'सर्व कार्यक्रम पहा'}
            </Button>
          </div>

          {skills.length === 0 ? (
            <div className="text-center py-12">
              <GraduationCap className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Skill development programs will be updated soon'
                  : 'कौशल्य विकास कार्यक्रम लवकरच अद्यतनित केले जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedSkills).map(([category, categorySkills]) => {
                const categoryInfo = getSkillCategoryInfo(category);
                const CategoryIcon = categoryInfo.icon;
                
                return (
                  <div key={category} className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color.split(' ')[1]}`}>
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo.color.split(' ')[0]}`} />
                      </div>
                      <h4 className="text-xl font-bold text-gray-900">
                        {categoryInfo.label}
                      </h4>
                      <Badge className="bg-gray-100 text-gray-800">
                        {categorySkills.length} {language === 'en' ? 'Programs' : 'कार्यक्रम'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categorySkills.slice(0, 6).map((skill) => (
                        <Card key={skill.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                              {language === 'en' ? skill.nameEn : skill.name}
                            </CardTitle>
                            <div className="flex items-center text-sm text-gray-600">
                              <Building className="w-4 h-4 mr-2" />
                              {language === 'en' ? skill.providerEn : skill.provider}
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {language === 'en' ? skill.descriptionEn : skill.description}
                            </p>

                            <div className="space-y-2 mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Duration' : 'कालावधी'}:
                                </span>
                                <span className="font-medium">
                                  {language === 'en' ? skill.durationEn : skill.duration}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Cost' : 'खर्च'}:
                                </span>
                                <span className="font-medium text-green-600">
                                  {language === 'en' ? skill.costEn : skill.cost}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600">
                                  {language === 'en' ? 'Start Date' : 'सुरुवातीची तारीख'}:
                                </span>
                                <span className="font-medium">
                                  {new Date(skill.startDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Button 
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                                size="sm"
                              >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Register Now' : 'आता नोंदणी करा'}
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full group-hover:bg-gray-50"
                              >
                                <Download className="w-4 h-4 mr-2" />
                                {language === 'en' ? 'Download Brochure' : 'ब्रोशर डाउनलोड करा'}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {categorySkills.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${categorySkills.length - 6} More Programs` 
                            : `${categorySkills.length - 6} अधिक कार्यक्रम पहा`
                          }
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Self Employment Support */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Self Employment Support' : 'स्वरोजगार सहाय्य'}
                </h3>
                <p className="text-green-100">
                  {language === 'en' 
                    ? 'Get support for starting your own business or enterprise'
                    : 'तुमचा स्वतःचा व्यवसाय किंवा उद्योग सुरू करण्यासाठी सहाय्य मिळवा'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Financial Support' : 'आर्थिक सहाय्य'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Loans and grants for startups'
                      : 'स्टार्टअपसाठी कर्ज आणि अनुदान'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Training' : 'प्रशिक्षण'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Business and technical training'
                      : 'व्यवसाय आणि तांत्रिक प्रशिक्षण'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Mentorship' : 'मार्गदर्शन'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Expert guidance and support'
                      : 'तज्ञ मार्गदर्शन आणि सहाय्य'
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <Wrench className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Apply for Support' : 'सहाय्यासाठी अर्ज करा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Briefcase className="w-5 h-5 mr-2" />
            {language === 'en' ? 'Explore All Opportunities' : 'सर्व संधी एक्सप्लोर करा'}
          </Button>
        </div>
      </div>
    </section>
  );
}