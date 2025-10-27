'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Users, MapPin, FileText } from 'lucide-react';

interface Scheme {
  id: string;
  name: string;
  nameEn: string;
  type: string;
  eligibility: string;
  eligibilityEn: string;
  benefits: string;
  benefitsEn: string;
  applicationProcess: string;
  applicationProcessEn: string;
  contactInfo: string;
  contactInfoEn: string;
  website: string | null;
  imageUrl: string | null;
  beneficiaries: number | null;
  coverage: any;
  isActive: boolean;
}

interface SchemesSectionProps {
  schemes?: Scheme[];
}

export function SchemesSection({ schemes = [] }: SchemesSectionProps) {
  const { t, language } = useTranslation();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'central':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'state':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'central':
        return t('schemes.central');
      case 'state':
        return t('schemes.state');
      default:
        return t('schemes.district');
    }
  };

  const groupedSchemes = schemes.reduce((acc, scheme) => {
    if (!acc[scheme.type]) {
      acc[scheme.type] = [];
    }
    acc[scheme.type].push(scheme);
    return acc;
  }, {} as Record<string, Scheme[]>);

  const typeOrder = ['central', 'state', 'district'];

  return (
    <section id="schemes" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('schemes.title')}
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Scheme Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {schemes.filter(s => s.type === 'central').length}
              </div>
              <div className="text-sm text-gray-600">
                {t('schemes.central')} {language === 'en' ? 'Schemes' : 'योजना'}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {schemes.filter(s => s.type === 'state').length}
              </div>
              <div className="text-sm text-gray-600">
                {t('schemes.state')} {language === 'en' ? 'Schemes' : 'योजना'}
              </div>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {schemes.reduce((sum, s) => sum + (s.beneficiaries || 0), 0)}
              </div>
              <div className="text-sm text-gray-600">
                {t('schemes.beneficiaries')}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schemes by Type */}
        <div className="space-y-12">
          {typeOrder.map((type) => {
            const typeSchemes = groupedSchemes[type];
            if (!typeSchemes || typeSchemes.length === 0) return null;

            return (
              <div key={type}>
                <div className="flex items-center mb-6">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    type === 'central' ? 'bg-red-100' : type === 'state' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    <FileText className={`w-4 h-4 ${
                      type === 'central' ? 'text-red-600' : type === 'state' ? 'text-blue-600' : 'text-green-600'
                    }`} />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">
                    {getTypeLabel(type)} {language === 'en' ? 'Schemes' : 'योजना'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {typeSchemes.map((scheme) => (
                    <Card key={scheme.id} className="hover:shadow-lg transition-shadow duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <Badge className={getTypeColor(scheme.type)}>
                            {getTypeLabel(scheme.type)}
                          </Badge>
                          {scheme.beneficiaries && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-1" />
                              {scheme.beneficiaries}
                            </div>
                          )}
                        </div>

                        <h4 className="text-lg font-semibold text-gray-900 mb-3">
                          {language === 'en' ? scheme.nameEn : scheme.name}
                        </h4>

                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-1">
                              {t('schemes.eligibility')}:
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {language === 'en' ? scheme.eligibilityEn : scheme.eligibility}
                            </p>
                          </div>

                          <div>
                            <h5 className="text-sm font-semibold text-gray-700 mb-1">
                              {t('schemes.benefits')}:
                            </h5>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {language === 'en' ? scheme.benefitsEn : scheme.benefits}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-500">
                              {language === 'en' ? 'Application Process' : 'अर्ज प्रक्रिया'}
                            </div>
                            <Button variant="outline" size="sm">
                              {t('common.learnMore')}
                            </Button>
                          </div>
                        </div>

                        {scheme.website && (
                          <div className="mt-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="w-full"
                              onClick={() => scheme.website && window.open(scheme.website, '_blank')}
                            >
                              <ExternalLink className="w-3 h-3 mr-1" />
                              {language === 'en' ? 'Visit Website' : 'वेबसाइट भेट द्या'}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Coverage Map Placeholder */}
        {schemes.some(s => s.coverage) && (
          <div className="mt-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              {t('schemes.coverage')} {language === 'en' ? 'Map' : 'नकाशा'}
            </h3>
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
              <CardContent className="p-8 text-center">
                <MapPin className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === 'en' ? 'Interactive Coverage Map' : 'इंटरएक्टिव व्याप्ती नकाशा'}
                </h4>
                <p className="text-gray-600 mb-4">
                  {language === 'en' 
                    ? 'View scheme coverage across different areas of the village'
                    : 'गावाच्या विविध भागात योजनांची व्याप्ती पहा'
                  }
                </p>
                <Button>
                  {language === 'en' ? 'View Map' : 'नकाशा पहा'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Star Beneficiaries */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {language === 'en' ? 'Star Beneficiaries' : 'तारक लाभार्थी'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    {language === 'en' ? `Beneficiary ${i}` : `लाभार्थी ${i}`}
                  </h4>
                  <p className="text-sm text-gray-600 mb-4">
                    {language === 'en' 
                      ? 'Success story of how government schemes transformed their life'
                      : 'शासकीय योजनांनी त्यांचे जीवन कसे बदलले याची यशस्वी कहाणी'
                    }
                  </p>
                  <Button variant="outline" size="sm">
                    {t('common.readMore')}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}