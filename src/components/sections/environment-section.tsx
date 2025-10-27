'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  Droplets, 
  Sun, 
  Wind,
  Recycle,
  TreePine,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Users,
  MapPin,
  ExternalLink,
  Download,
  Play
} from 'lucide-react';
import Image from 'next/image';

interface EnvironmentData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'air' | 'water' | 'soil' | 'waste' | 'biodiversity' | 'energy';
  status: 'good' | 'moderate' | 'poor' | 'critical';
  value: number;
  unit: string;
  unitEn: string;
  target?: number;
  lastUpdated: string;
  trend: 'up' | 'down' | 'stable';
  isActive: boolean;
}

interface InitiativeData {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: 'conservation' | 'renewable-energy' | 'waste-management' | 'water-conservation' | 'afforestation';
  status: 'planned' | 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  budget: string;
  budgetEn: string;
  participants: number;
  impact: string;
  impactEn: string;
  image?: string;
  isActive: boolean;
}

interface EnvironmentSectionProps {
  environmentData?: EnvironmentData[];
  initiatives?: InitiativeData[];
  statistics?: {
    airQuality: number;
    waterQuality: number;
    wasteReduction: number;
    energyEfficiency: number;
    treeCoverage: number;
    carbonFootprint: number;
  };
}

export function EnvironmentSection({ 
  environmentData = [], 
  initiatives = [],
  statistics = {
    airQuality: 0,
    waterQuality: 0,
    wasteReduction: 0,
    energyEfficiency: 0,
    treeCoverage: 0,
    carbonFootprint: 0
  }
}: EnvironmentSectionProps) {
  const { t, language } = useTranslation();

  // Group environment data by category
  const groupedData = environmentData.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EnvironmentData[]>);

  // Group initiatives by category
  const groupedInitiatives = initiatives.reduce((acc, initiative) => {
    if (!acc[initiative.category]) {
      acc[initiative.category] = [];
    }
    acc[initiative.category].push(initiative);
    return acc;
  }, {} as Record<string, InitiativeData[]>);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'air':
        return {
          label: language === 'en' ? 'Air Quality' : 'हवेची गुणवत्ता',
          icon: Wind,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'water':
        return {
          label: language === 'en' ? 'Water Quality' : 'पाण्याची गुणवत्ता',
          icon: Droplets,
          color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
          badgeColor: 'bg-cyan-100 text-cyan-800'
        };
      case 'soil':
        return {
          label: language === 'en' ? 'Soil Health' : 'मातीचे आरोग्य',
          icon: TreePine,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'waste':
        return {
          label: language === 'en' ? 'Waste Management' : 'कचरा व्यवस्थापन',
          icon: Recycle,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'biodiversity':
        return {
          label: language === 'en' ? 'Biodiversity' : 'जैवविविधता',
          icon: Leaf,
          color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
          badgeColor: 'bg-emerald-100 text-emerald-800'
        };
      case 'energy':
        return {
          label: language === 'en' ? 'Energy Efficiency' : 'ऊर्जा कार्यक्षमता',
          icon: Sun,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      default:
        return {
          label: category,
          icon: Leaf,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'good':
        return {
          label: language === 'en' ? 'Good' : 'चांगले',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle
        };
      case 'moderate':
        return {
          label: language === 'en' ? 'Moderate' : 'मध्यम',
          color: 'bg-yellow-100 text-yellow-800',
          icon: AlertTriangle
        };
      case 'poor':
        return {
          label: language === 'en' ? 'Poor' : 'खराब',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle
        };
      case 'critical':
        return {
          label: language === 'en' ? 'Critical' : 'गंभीर',
          color: 'bg-red-100 text-red-800',
          icon: AlertTriangle
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800',
          icon: AlertTriangle
        };
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-600" />;
      case 'stable':
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getInitiativeCategoryInfo = (category: string) => {
    switch (category) {
      case 'conservation':
        return {
          label: language === 'en' ? 'Conservation' : 'संरक्षण',
          icon: Leaf,
          color: 'text-green-600 bg-green-50'
        };
      case 'renewable-energy':
        return {
          label: language === 'en' ? 'Renewable Energy' : 'नवीकरणीय ऊर्जा',
          icon: Sun,
          color: 'text-yellow-600 bg-yellow-50'
        };
      case 'waste-management':
        return {
          label: language === 'en' ? 'Waste Management' : 'कचरा व्यवस्थापन',
          icon: Recycle,
          color: 'text-orange-600 bg-orange-50'
        };
      case 'water-conservation':
        return {
          label: language === 'en' ? 'Water Conservation' : 'पाणी संरक्षण',
          icon: Droplets,
          color: 'text-cyan-600 bg-cyan-50'
        };
      case 'afforestation':
        return {
          label: language === 'en' ? 'Afforestation' : 'वनीकरण',
          icon: TreePine,
          color: 'text-emerald-600 bg-emerald-50'
        };
      default:
        return {
          label: category,
          icon: Leaf,
          color: 'text-gray-600 bg-gray-50'
        };
    }
  };

  const getInitiativeStatusInfo = (status: string) => {
    switch (status) {
      case 'planned':
        return {
          label: language === 'en' ? 'Planned' : 'नियोजित',
          color: 'bg-blue-100 text-blue-800'
        };
      case 'ongoing':
        return {
          label: language === 'en' ? 'Ongoing' : 'चालू',
          color: 'bg-yellow-100 text-yellow-800'
        };
      case 'completed':
        return {
          label: language === 'en' ? 'Completed' : 'पूर्ण',
          color: 'bg-green-100 text-green-800'
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800'
        };
    }
  };

  return (
    <section id="environment" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.environment.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Environmental monitoring and sustainability initiatives'
              : 'पर्यावरणीय निरीक्षण आणि स्थिरता उपक्रम'
            }
          </p>
        </div>

        {/* Environmental Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                <Wind className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.airQuality}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Air Quality' : 'हवेची गुणवत्ता'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-cyan-100 rounded-full flex items-center justify-center">
                <Droplets className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.waterQuality}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Water Quality' : 'पाण्याची गुणवत्ता'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
                <Recycle className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.wasteReduction}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Waste Reduction' : 'कचरा कमी करणे'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center">
                <Sun className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.energyEfficiency}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Energy Efficiency' : 'ऊर्जा कार्यक्षमता'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                <TreePine className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.treeCoverage}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Tree Coverage' : 'झाडांचे आच्छादन'}
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <div className="w-12 h-12 mx-auto mb-3 bg-emerald-100 rounded-full flex items-center justify-center">
                <Leaf className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {statistics.carbonFootprint}%
              </h3>
              <p className="text-gray-600 text-sm">
                {language === 'en' ? 'Carbon Footprint' : 'कार्बन फुटप्रिंट'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Environmental Monitoring */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Environmental Monitoring' : 'पर्यावरणीय निरीक्षण'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View Detailed Report' : 'तपशीलवार अहवाल पहा'}
            </Button>
          </div>

          {environmentData.length === 0 ? (
            <div className="text-center py-12">
              <Leaf className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Environmental data will be updated soon'
                  : 'पर्यावरणीय डेटा लवकरच अद्यतनित केला जाईल'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedData).map(([category, categoryData]) => {
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
                      <Badge className={categoryInfo.badgeColor}>
                        {categoryData.length} {language === 'en' ? 'Metrics' : 'मेट्रिक्स'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryData.map((item) => {
                        const statusInfo = getStatusInfo(item.status);
                        const StatusIcon = statusInfo.icon;
                        
                        return (
                          <Card key={item.id} className="hover:shadow-lg transition-all duration-300 group">
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                  {language === 'en' ? item.titleEn : item.title}
                                </CardTitle>
                                <Badge className={statusInfo.color}>
                                  <StatusIcon className="w-3 h-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-2">
                                {language === 'en' ? item.descriptionEn : item.description}
                              </p>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="space-y-4">
                                {/* Current Value */}
                                <div className="text-center">
                                  <div className="text-3xl font-bold text-gray-900 mb-1">
                                    {item.value}
                                    <span className="text-lg text-gray-600 ml-1">
                                      {language === 'en' ? item.unitEn : item.unit}
                                    </span>
                                  </div>
                                  <div className="flex items-center justify-center gap-2">
                                    {getTrendIcon(item.trend)}
                                    <span className="text-sm text-gray-600">
                                      {language === 'en' ? 'Last updated' : 'अंतिम अद्यतन'}: {new Date(item.lastUpdated).toLocaleDateString()}
                                    </span>
                                  </div>
                                </div>

                                {/* Target (if available) */}
                                {item.target && (
                                  <div className="bg-gray-50 rounded-lg p-3">
                                    <div className="flex items-center justify-between text-sm">
                                      <span className="text-gray-600">
                                        {language === 'en' ? 'Target' : 'लक्ष्य'}:
                                      </span>
                                      <span className="font-medium">
                                        {item.target} {language === 'en' ? item.unitEn : item.unit}
                                      </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                      <div 
                                        className="bg-blue-600 h-2 rounded-full" 
                                        style={{ width: `${Math.min((item.value / item.target) * 100, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}

                                {/* Action Button */}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <BarChart3 className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'View Details' : 'तपशील पहा'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sustainability Initiatives */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {language === 'en' ? 'Sustainability Initiatives' : 'स्थिरता उपक्रम'}
            </h3>
            <Button variant="outline">
              <ExternalLink className="w-4 h-4 mr-2" />
              {language === 'en' ? 'View All Initiatives' : 'सर्व उपक्रम पहा'}
            </Button>
          </div>

          {initiatives.length === 0 ? (
            <div className="text-center py-12">
              <Recycle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {language === 'en' 
                  ? 'Sustainability initiatives will be updated soon'
                  : 'स्थिरता उपक्रम लवकरच अद्यतनित केले जातील'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-12">
              {Object.entries(groupedInitiatives).map(([category, categoryInitiatives]) => {
                const categoryInfo = getInitiativeCategoryInfo(category);
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
                        {categoryInitiatives.length} {language === 'en' ? 'Initiatives' : 'उपक्रम'}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {categoryInitiatives.slice(0, 6).map((initiative) => {
                        const statusInfo = getInitiativeStatusInfo(initiative.status);
                        
                        return (
                          <Card key={initiative.id} className="hover:shadow-lg transition-all duration-300 group">
                            {initiative.image && (
                              <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                <Image
                                  src={initiative.image}
                                  alt={language === 'en' ? initiative.titleEn : initiative.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                              </div>
                            )}
                            
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between mb-2">
                                <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                  {language === 'en' ? initiative.titleEn : initiative.title}
                                </CardTitle>
                                <Badge className={statusInfo.color}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-gray-600 text-sm line-clamp-3">
                                {language === 'en' ? initiative.descriptionEn : initiative.description}
                              </p>
                            </CardHeader>

                            <CardContent className="pt-0">
                              <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {language === 'en' ? 'Budget' : 'अर्थसंकल्प'}:
                                  </span>
                                  <span className="font-medium text-green-600">
                                    {language === 'en' ? initiative.budgetEn : initiative.budget}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {language === 'en' ? 'Participants' : 'सहभागी'}:
                                  </span>
                                  <span className="font-medium">
                                    {initiative.participants}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {language === 'en' ? 'Start Date' : 'सुरुवातीची तारीख'}:
                                  </span>
                                  <span className="font-medium">
                                    {new Date(initiative.startDate).toLocaleDateString()}
                                  </span>
                                </div>
                                {initiative.endDate && (
                                  <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600">
                                      {language === 'en' ? 'End Date' : 'अंतिम तारीख'}:
                                    </span>
                                    <span className="font-medium">
                                      {new Date(initiative.endDate).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-2">
                                <Button 
                                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                                  size="sm"
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Learn More' : 'अधिक जाणून घ्या'}
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full group-hover:bg-gray-50"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Download Report' : 'अहवाल डाउनलोड करा'}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {categoryInitiatives.length > 6 && (
                      <div className="text-center">
                        <Button variant="outline">
                          {language === 'en' 
                            ? `View ${categoryInitiatives.length - 6} More Initiatives` 
                            : `${categoryInitiatives.length - 6} अधिक उपक्रम पहा`
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

        {/* Environmental Awareness */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {language === 'en' ? 'Environmental Awareness' : 'पर्यावरणीय जागरूकता'}
                </h3>
                <p className="text-green-100">
                  {language === 'en' 
                    ? 'Join our environmental awareness programs and make a difference'
                    : 'आमच्या पर्यावरणीय जागरूकता कार्यक्रमात सामील व्हा आणि फरक करा'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Community Programs' : 'समुदाय कार्यक्रम'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Join local environmental initiatives'
                      : 'स्थानिक पर्यावरणीय उपक्रमात सामील व्हा'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Education' : 'शिक्षण'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Learn about environmental conservation'
                      : 'पर्यावरण संरक्षणाबद्दल जाणून घ्या'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Events' : 'कार्यक्रम'}
                  </h4>
                  <p className="text-sm text-green-100">
                    {language === 'en' 
                      ? 'Participate in environmental events'
                      : 'पर्यावरणीय कार्यक्रमात सहभागी व्हा'
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
                  <Leaf className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Join Now' : 'आता सामील व्हा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
            <Leaf className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View Environmental Dashboard' : 'पर्यावरणीय डॅशबोर्ड पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}