'use client';

import { useTranslation } from '@/lib/i18n/i18n-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  MapPin, 
  Users, 
  FileText,
  ExternalLink,
  Star,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

interface SchemeData {
  id: string;
  name: string;
  nameEn: string;
  type: 'central' | 'state' | 'district';
  eligibility: string;
  eligibilityEn: string;
  documents: string[];
  beneficiaries?: number;
  coverage?: {
    lat: number;
    lng: number;
    radius: number;
  };
  description?: string;
  descriptionEn?: string;
  isActive: boolean;
}

interface StarBeneficiary {
  id: string;
  name: string;
  nameEn: string;
  scheme: string;
  schemeEn: string;
  story: string;
  storyEn: string;
  photo?: string;
  amount?: number;
}

interface SchemesSectionProps {
  schemes?: SchemeData[];
  starBeneficiaries?: StarBeneficiary[];
}

export function SchemesSection({ schemes = [], starBeneficiaries = [] }: SchemesSectionProps) {
  const { t, language } = useTranslation();

  // Group schemes by type
  const groupedSchemes = schemes.reduce((acc, scheme) => {
    if (!acc[scheme.type]) {
      acc[scheme.type] = [];
    }
    acc[scheme.type].push(scheme);
    return acc;
  }, {} as Record<string, SchemeData[]>);

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'central':
        return {
          label: language === 'en' ? 'Central Schemes' : 'केंद्रीय योजना',
          icon: Building2,
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          badgeColor: 'bg-blue-100 text-blue-800'
        };
      case 'state':
        return {
          label: language === 'en' ? 'State Schemes' : 'राज्य योजना',
          icon: MapPin,
          color: 'text-green-600 bg-green-50 border-green-200',
          badgeColor: 'bg-green-100 text-green-800'
        };
      case 'district':
        return {
          label: language === 'en' ? 'District Schemes' : 'जिल्हा योजना',
          icon: Users,
          color: 'text-purple-600 bg-purple-50 border-purple-200',
          badgeColor: 'bg-purple-100 text-purple-800'
        };
      default:
        return {
          label: type,
          icon: Building2,
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

  return (
    <section id="schemes" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('sections.schemes.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'en' 
              ? 'Government schemes and programs benefiting our village community'
              : 'आमच्या गावाच्या समुदायाला फायदा देणाऱ्या शासकीय योजना आणि कार्यक्रम'
            }
          </p>
        </div>

        {schemes.length === 0 ? (
          <div className="text-center py-12">
            <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {language === 'en' 
                ? 'Scheme information will be updated soon'
                : 'योजना माहिती लवकरच अद्यतनित केली जाईल'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedSchemes).map(([type, typeSchemes]) => {
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
                      {typeSchemes.length} {language === 'en' ? 'Schemes' : 'योजना'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {typeSchemes.map((scheme) => (
                      <Card key={scheme.id} className="hover:shadow-lg transition-all duration-300 group">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                              {language === 'en' ? scheme.nameEn : scheme.name}
                            </CardTitle>
                            <Badge className={typeInfo.badgeColor}>
                              {typeInfo.label.split(' ')[0]}
                            </Badge>
                          </div>
                        </CardHeader>

                        <CardContent className="pt-0">
                          {scheme.description && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {language === 'en' ? scheme.descriptionEn : scheme.description}
                            </p>
                          )}

                          {/* Eligibility */}
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                              <CheckCircle className="w-4 h-4" />
                              {language === 'en' ? 'Eligibility' : 'पात्रता'}:
                            </h4>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {language === 'en' ? scheme.eligibilityEn : scheme.eligibility}
                            </p>
                          </div>

                          {/* Documents Required */}
                          {scheme.documents.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                {language === 'en' ? 'Required Documents' : 'आवश्यक कागदपत्रे'}:
                              </h4>
                              <div className="flex flex-wrap gap-1">
                                {scheme.documents.slice(0, 3).map((doc, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {doc}
                                  </Badge>
                                ))}
                                {scheme.documents.length > 3 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{scheme.documents.length - 3} {language === 'en' ? 'more' : 'अधिक'}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Beneficiaries Count */}
                          {scheme.beneficiaries && (
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500 flex items-center gap-1">
                                  <Users className="w-4 h-4" />
                                  {language === 'en' ? 'Beneficiaries' : 'लाभार्थी'}:
                                </span>
                                <span className="font-bold text-blue-600">
                                  {scheme.beneficiaries.toLocaleString()}
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
                            {language === 'en' ? 'Apply Now' : 'आता अर्ज करा'}
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

        {/* Star Beneficiaries Section */}
        {starBeneficiaries.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {t('sections.schemes.starBeneficiaries')}
              </h3>
              <p className="text-gray-600">
                {language === 'en' 
                  ? 'Success stories from our community members'
                  : 'आमच्या समुदायातील सदस्यांच्या यशाच्या कहाण्या'
                }
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {starBeneficiaries.map((beneficiary) => (
                <Card key={beneficiary.id} className="hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-center">
                      {/* Photo */}
                      <div className="relative w-20 h-20 mx-auto mb-4">
                        {beneficiary.photo ? (
                          <img
                            src={beneficiary.photo}
                            alt={language === 'en' ? beneficiary.nameEn : beneficiary.name}
                            className="w-20 h-20 rounded-full object-cover border-4 border-yellow-200"
                          />
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold">
                            {beneficiary.name.charAt(0)}
                          </div>
                        )}
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                          <Star className="w-4 h-4 text-white" />
                        </div>
                      </div>

                      {/* Name and Scheme */}
                      <h4 className="text-lg font-bold text-gray-900 mb-1">
                        {language === 'en' ? beneficiary.nameEn : beneficiary.name}
                      </h4>
                      <p className="text-sm text-blue-600 font-medium mb-3">
                        {language === 'en' ? beneficiary.schemeEn : beneficiary.scheme}
                      </p>

                      {/* Story */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {language === 'en' ? beneficiary.storyEn : beneficiary.story}
                      </p>

                      {/* Amount */}
                      {beneficiary.amount && (
                        <div className="text-center mb-4">
                          <div className="text-2xl font-bold text-green-600">
                            {formatCurrency(beneficiary.amount)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {language === 'en' ? 'Benefit Received' : 'मिळालेला फायदा'}
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full group-hover:bg-yellow-50 group-hover:border-yellow-300"
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {language === 'en' ? 'Read Full Story' : 'पूर्ण कहाणी वाचा'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Coverage Map Section */}
        <div className="mt-16">
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">
                  {t('sections.schemes.coverage')}
                </h3>
                <p className="text-green-100 mb-6">
                  {language === 'en' 
                    ? 'Interactive map showing scheme coverage across our village'
                    : 'आमच्या गावातील योजना व्याप्ती दर्शविणारा इंटरॅक्टिव्ह नकाशा'
                  }
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: language === 'en' ? 'Central' : 'केंद्रीय', count: groupedSchemes.central?.length || 0, color: 'bg-blue-500' },
                    { label: language === 'en' ? 'State' : 'राज्य', count: groupedSchemes.state?.length || 0, color: 'bg-green-500' },
                    { label: language === 'en' ? 'District' : 'जिल्हा', count: groupedSchemes.district?.length || 0, color: 'bg-purple-500' },
                    { label: language === 'en' ? 'Total' : 'एकूण', count: schemes.length, color: 'bg-yellow-500' }
                  ].map((item, index) => (
                    <div key={index} className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-2 ${item.color} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl font-bold">{item.count}</span>
                      </div>
                      <div className="text-sm font-medium">{item.label}</div>
                    </div>
                  ))}
                </div>
                <Button 
                  variant="secondary" 
                  size="lg" 
                  className="bg-white text-green-600 hover:bg-gray-100"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  {language === 'en' ? 'View Coverage Map' : 'व्याप्ती नकाशा पहा'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Building2 className="w-5 h-5 mr-2" />
            {language === 'en' ? 'View All Schemes' : 'सर्व योजना पहा'}
          </Button>
        </div>
      </div>
    </section>
  );
}