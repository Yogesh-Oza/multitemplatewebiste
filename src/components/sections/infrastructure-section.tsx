'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Car as Road, 
  Droplets, 
  Trash2, 
  GraduationCap as School, 
  Heart,
  MapPin,
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Wifi,
  Zap,
  Shield
} from 'lucide-react';

interface InfrastructureData {
  id: string;
  type: 'road' | 'water' | 'school' | 'health' | 'sanitation' | 'electricity' | 'internet' | 'security';
  name: string;
  nameEn: string;
  status: 'completed' | 'ongoing' | 'planned';
  details: {
    capacity?: number;
    coverage?: number;
    quality?: string;
    maintenance?: string;
    lastUpdated?: string;
  };
  description?: string;
  descriptionEn?: string;
  location?: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
}

interface SmartVillageData {
  waterSupply: {
    coverage: number;
    quality: string;
    lastUpdated: string;
  };
  electricity: {
    coverage: number;
    reliability: string;
    lastUpdated: string;
  };
  internet: {
    coverage: number;
    speed: string;
    lastUpdated: string;
  };
  wasteManagement: {
    collection: number;
    processing: number;
    lastUpdated: string;
  };
}

interface InfrastructureSectionProps {
  infrastructure?: InfrastructureData[];
  smartVillageData?: SmartVillageData;
}

export function InfrastructureSection({ infrastructure = [], smartVillageData }: InfrastructureSectionProps) {
  const { t, language } = useTranslation();

  // Group infrastructure by type
  const groupedInfrastructure = infrastructure.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, InfrastructureData[]>);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'road':
        return {
          label: language === 'en' ? 'Roads' : 'रस्ते',
          icon: Road,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      case 'water':
        return {
          label: language === 'en' ? 'Water Supply' : 'पाणीपुरवठा',
          icon: Droplets,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'sanitation':
        return {
          label: language === 'en' ? 'Sanitation' : 'स्वच्छता',
          icon: Trash2,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'school':
        return {
          label: language === 'en' ? 'Schools' : 'शाळा',
          icon: School,
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'health':
        return {
          label: language === 'en' ? 'Health Centers' : 'आरोग्य केंद्रे',
          icon: Heart,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'electricity':
        return {
          label: language === 'en' ? 'Electricity' : 'वीज',
          icon: Zap,
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          badgeColor: 'bg-yellow-100 text-yellow-800'
        };
      case 'internet':
        return {
          label: language === 'en' ? 'Internet' : 'इंटरनेट',
          icon: Wifi,
          color: 'text-cyan-600 bg-cyan-50 border-cyan-200',
          badgeColor: 'bg-cyan-100 text-cyan-800'
        };
      case 'security':
        return {
          label: language === 'en' ? 'Security' : 'सुरक्षा',
          icon: Shield,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
      default:
        return {
          label: type,
          icon: MapPin,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          label: language === 'en' ? 'Completed' : 'पूर्ण',
          icon: CheckCircle,
          color: 'text-green-600 bg-green-100'
        };
      case 'ongoing':
        return {
          label: language === 'en' ? 'Ongoing' : 'चालू',
          icon: Clock,
          color: 'text-blue-600 bg-blue-100'
        };
      case 'planned':
        return {
          label: language === 'en' ? 'Planned' : 'नियोजित',
          icon: AlertCircle,
          color: 'text-orange-600 bg-orange-100'
        };
      default:
        return {
          label: status,
          icon: Clock,
          color: 'text-gray-600 bg-gray-100'
        };
    }
  };

  return (
    <section id="infrastructure" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.infrastructure.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Modern infrastructure supporting our village development and growth'
              : 'आमच्या गावाच्या विकास आणि वाढीस समर्थन देणारी आधुनिक पायाभूत सुविधा'
            }
          </p>
        </div>

        {infrastructure.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'en' 
                ? 'Infrastructure information will be updated soon'
                : 'पायाभूत सुविधा माहिती लवकरच अद्यतनित केली जाईल'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedInfrastructure).map(([type, typeItems]) => {
              const typeInfo = getTypeInfo(type);
              const TypeIcon = typeInfo.icon;
              
              return (
                <div key={type} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${typeInfo.color.split(' ')[1]}`}>
                      <TypeIcon className={`w-5 h-5 ${typeInfo.color.split(' ')[0]}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {typeInfo.label}
                    </h3>
                    <Badge className={typeInfo.badgeColor}>
                      {typeItems.length} {language === 'en' ? 'Items' : 'वस्तू'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeItems.map((item) => {
                      const statusInfo = getStatusInfo(item.status);
                      const StatusIcon = statusInfo.icon;
                      
                      return (
                        <Card key={item.id} className="hover:shadow-lg transition-all duration-300 group">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                                {language === 'en' ? item.nameEn : item.name}
                              </CardTitle>
                              <Badge className={statusInfo.color}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-0">
                            {item.description && (
                              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                {language === 'en' ? item.descriptionEn : item.description}
                              </p>
                            )}

                            {/* Infrastructure Details */}
                            <div className="space-y-2 mb-4">
                              {item.details.capacity && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">
                                    {language === 'en' ? 'Capacity' : 'क्षमता'}:
                                  </span>
                                  <span className="font-medium">
                                    {item.details.capacity} {language === 'en' ? 'units' : 'एकके'}
                                  </span>
                                </div>
                              )}
                              {item.details.coverage && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">
                                    {language === 'en' ? 'Coverage' : 'व्याप्ती'}:
                                  </span>
                                  <span className="font-medium">
                                    {item.details.coverage}%
                                  </span>
                                </div>
                              )}
                              {item.details.quality && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">
                                    {language === 'en' ? 'Quality' : 'गुणवत्ता'}:
                                  </span>
                                  <span className="font-medium">
                                    {item.details.quality}
                                  </span>
                                </div>
                              )}
                              {item.details.lastUpdated && (
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-500">
                                    {language === 'en' ? 'Last Updated' : 'शेवटचे अद्यतन'}:
                                  </span>
                                  <span className="font-medium">
                                    {new Date(item.details.lastUpdated).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Location */}
                            {item.location && (
                              <div className="mb-4">
                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {language === 'en' ? 'Location' : 'स्थान'}: 
                                    {item.location.lat.toFixed(4)}, {item.location.lng.toFixed(4)}
                                  </span>
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
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Smart Village Dashboard */}
        {smartVillageData && (
          <div className="mt-16">
            <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <CardContent className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-4">
                    {t('sections.infrastructure.smartVillage')}
                  </h3>
                  <p className="text-blue-100">
                    {language === 'en' 
                      ? 'Real-time data on village infrastructure and utilities'
                      : 'गावाच्या पायाभूत सुविधा आणि उपयुक्तता यांचा रिअल-टाइम डेटा'
                    }
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Water Supply */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Droplets className="w-6 h-6" />
                      <h4 className="font-semibold">
                        {language === 'en' ? 'Water Supply' : 'पाणीपुरवठा'}
                      </h4>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {smartVillageData.waterSupply.coverage}%
                    </div>
                    <div className="text-sm text-blue-100">
                      {language === 'en' ? 'Coverage' : 'व्याप्ती'}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Quality' : 'गुणवत्ता'}: {smartVillageData.waterSupply.quality}
                    </div>
                  </div>

                  {/* Electricity */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Zap className="w-6 h-6" />
                      <h4 className="font-semibold">
                        {language === 'en' ? 'Electricity' : 'वीज'}
                      </h4>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {smartVillageData.electricity.coverage}%
                    </div>
                    <div className="text-sm text-blue-100">
                      {language === 'en' ? 'Coverage' : 'व्याप्ती'}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Reliability' : 'विश्वसनीयता'}: {smartVillageData.electricity.reliability}
                    </div>
                  </div>

                  {/* Internet */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Wifi className="w-6 h-6" />
                      <h4 className="font-semibold">
                        {language === 'en' ? 'Internet' : 'इंटरनेट'}
                      </h4>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {smartVillageData.internet.coverage}%
                    </div>
                    <div className="text-sm text-blue-100">
                      {language === 'en' ? 'Coverage' : 'व्याप्ती'}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Speed' : 'गती'}: {smartVillageData.internet.speed}
                    </div>
                  </div>

                  {/* Waste Management */}
                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Trash2 className="w-6 h-6" />
                      <h4 className="font-semibold">
                        {language === 'en' ? 'Waste Management' : 'कचरा व्यवस्थापन'}
                      </h4>
                    </div>
                    <div className="text-2xl font-bold mb-1">
                      {smartVillageData.wasteManagement.collection}%
                    </div>
                    <div className="text-sm text-blue-100">
                      {language === 'en' ? 'Collection' : 'संकलन'}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      {language === 'en' ? 'Processing' : 'प्रक्रिया'}: {smartVillageData.wasteManagement.processing}%
                    </div>
                  </div>
                </div>

                <div className="text-center mt-6">
                  <Button 
                    variant="secondary" 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    {language === 'en' ? 'View GIS Map' : 'जीआयएस नकाशा पहा'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <MapPin className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View All Infrastructure' : 'सर्व पायाभूत सुविधा पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}