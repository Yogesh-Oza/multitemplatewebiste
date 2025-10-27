'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CreditCard, 
  MessageSquare, 
  QrCode,
  ExternalLink,
  Download,
  Upload,
  CheckCircle,
  Clock,
  AlertCircle,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import Image from 'next/image';

interface CitizenServiceData {
  id: string;
  title: string;
  titleEn: string;
  description?: string;
  descriptionEn?: string;
  link?: string;
  qrCode?: string;
  category: 'certificate' | 'payment' | 'form' | 'grievance' | 'feedback';
  isActive: boolean;
}

interface GrievanceFormData {
  name: string;
  contact: string;
  category: string;
  priority: string;
  description: string;
}

interface FeedbackFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
}

interface CitizenServicesSectionProps {
  services?: CitizenServiceData[];
}

export function CitizenServicesSection({ services = [] }: CitizenServicesSectionProps) {
  const { t, language } = useTranslation();

  // Group services by category
  const groupedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, CitizenServiceData[]>);

  const getCategoryInfo = (category: string) => {
    switch (category) {
      case 'certificate':
        return {
          label: language === 'en' ? 'Certificates' : 'प्रमाणपत्रे',
          icon: FileText,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'payment':
        return {
          label: language === 'en' ? 'Payments' : 'पेमेंट',
          icon: CreditCard,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'form':
        return {
          label: language === 'en' ? 'Forms' : 'फॉर्म',
          icon: Upload,
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      case 'grievance':
        return {
          label: language === 'en' ? 'Grievances' : 'तक्रारी',
          icon: MessageSquare,
          color: 'text-red-600 bg-red-50 border-red-200',
          badgeColor: 'bg-red-100 text-red-800'
        };
      case 'feedback':
        return {
          label: language === 'en' ? 'Feedback' : 'अभिप्राय',
          icon: MessageSquare,
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          badgeColor: 'bg-orange-100 text-orange-800'
        };
      default:
        return {
          label: category,
          icon: FileText,
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          badgeColor: 'bg-gray-100 text-gray-800'
        };
    }
  };

  const quickServices = [
    {
      title: language === 'en' ? 'Birth Certificate' : 'जन्म प्रमाणपत्र',
      titleEn: 'Birth Certificate',
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
      link: '/services/birth-certificate'
    },
    {
      title: language === 'en' ? 'Death Certificate' : 'मृत्यू प्रमाणपत्र',
      titleEn: 'Death Certificate',
      icon: FileText,
      color: 'text-gray-600 bg-gray-50',
      link: '/services/death-certificate'
    },
    {
      title: language === 'en' ? 'Right to Service' : 'अधिकार ते सेवा',
      titleEn: 'Right to Service',
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50',
      link: '/services/rts'
    },
    {
      title: language === 'en' ? 'Online Payment' : 'ऑनलाइन पेमेंट',
      titleEn: 'Online Payment',
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-50',
      link: '/services/payment'
    }
  ];

  return (
    <section id="citizen-services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.citizenServices.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Access government services and submit applications online'
              : 'शासकीय सेवा मिळवा आणि ऑनलाइन अर्ज सबमिट करा'
            }
          </p>
        </div>

        {/* Quick Services */}
        <div className="mb-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
            {language === 'en' ? 'Quick Services' : 'त्वरित सेवा'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickServices.map((service, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full ${service.color.split(' ')[1]} flex items-center justify-center`}>
                    <service.icon className={`w-8 h-8 ${service.color.split(' ')[0]}`} />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h4>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full group-hover:bg-blue-50 group-hover:border-blue-300"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Access' : 'प्रवेश'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Service Categories */}
        {services.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'en' 
                ? 'Service information will be updated soon'
                : 'सेवा माहिती लवकरच अद्यतनित केली जाईल'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedServices).map(([category, categoryServices]) => {
              const categoryInfo = getCategoryInfo(category);
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <div key={category} className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${categoryInfo.color.split(' ')[1]}`}>
                      <CategoryIcon className={`w-5 h-5 ${categoryInfo.color.split(' ')[0]}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {categoryInfo.label}
                    </h3>
                    <Badge className={categoryInfo.badgeColor}>
                      {categoryServices.length} {language === 'en' ? 'Services' : 'सेवा'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categoryServices.map((service) => (
                      <Card key={service.id} className="hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                            {language === 'en' ? service.titleEn : service.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {service.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {language === 'en' ? service.descriptionEn : service.description}
                            </p>
                          )}

                          {/* QR Code */}
                          {service.qrCode && (
                            <div className="mb-4 text-center">
                              <div className="inline-block p-2 bg-white rounded-lg border">
                                <Image
                                  src={service.qrCode}
                                  alt={language === 'en' ? 'QR Code' : 'QR कोड'}
                                  width={80}
                                  height={80}
                                  className="rounded"
                                />
                              </div>
                              <p className="text-xs text-gray-500 mt-2">
                                {language === 'en' ? 'Scan for quick access' : 'त्वरित प्रवेशासाठी स्कॅन करा'}
                              </p>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="space-y-2">
                            {service.link && (
                              <Button 
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                asChild
                              >
                                <a href={service.link} target="_blank" rel="noopener noreferrer">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  {language === 'en' ? 'Access Service' : 'सेवा मिळवा'}
                                </a>
                              </Button>
                            )}
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full group-hover:bg-gray-50"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {language === 'en' ? 'Download Form' : 'फॉर्म डाउनलोड करा'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Grievance Portal */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-4">
                  {t('sections.grievances.grievancePortal')}
                </h3>
                <p className="text-red-100">
                  {language === 'en' 
                    ? 'Submit your complaints and track their status online'
                    : 'तुमच्या तक्रारी सबमिट करा आणि त्यांची स्थिती ऑनलाइन ट्रॅक करा'
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Submit Complaint' : 'तक्रार सबमिट करा'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'File your grievance online'
                      : 'तुमची तक्रार ऑनलाइन दाखल करा'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Track Status' : 'स्थिती ट्रॅक करा'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'Monitor complaint progress'
                      : 'तक्रारीची प्रगती मॉनिटर करा'
                    }
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-3 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-8 h-8" />
                  </div>
                  <h4 className="font-semibold mb-2">
                    {language === 'en' ? 'Resolution' : 'निवारण'}
                  </h4>
                  <p className="text-sm text-red-100">
                    {language === 'en' 
                      ? 'Get timely resolution'
                      : 'वेळेवर निवारण मिळवा'
                    }
                  </p>
                </div>
              </div>

              <div className="text-center">
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-red-600 hover:bg-gray-100"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'Submit Grievance' : 'तक्रार सबमिट करा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Form */}
        <div className="mt-12">
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                {t('forms.feedback.title')}
              </h3>
              <p className="text-gray-600 mb-6">
                {language === 'en' 
                  ? 'Help us improve our services by sharing your feedback'
                  : 'तुमचा अभिप्राय सामायिक करून आमच्या सेवा सुधारण्यात मदत करा'
                }
              </p>
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <MessageSquare className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Submit Feedback' : 'अभिप्राय सबमिट करा'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Contact Information */}
        <div className="mt-12">
          <Card className="bg-gray-50">
            <CardContent className="p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
                {language === 'en' ? 'Need Help?' : 'मदत हवी?'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
                    <Phone className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Call Us' : 'आम्हाला कॉल करा'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    +91 12345 67890
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
                    <Mail className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Email Us' : 'आम्हाला ईमेल करा'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    info@grampanchayat.com
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {language === 'en' ? 'Visit Us' : 'आम्हाला भेट द्या'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {language === 'en' ? 'Gram Panchayat Office' : 'ग्रामपंचायत कार्यालय'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <FileText className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View All Services' : 'सर्व सेवा पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}