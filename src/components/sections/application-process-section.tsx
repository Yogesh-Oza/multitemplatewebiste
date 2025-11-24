'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  Download, 
  ExternalLink,
  ArrowRight,
  User,
  Building,
  Phone,
  Globe,
  AlertTriangle
} from 'lucide-react';
import {
  applicationProcessDemoConfig,
  ApplicationProcessConfigData,
  ApplicationStep,
  RequiredDocument
} from '@/lib/demo-schemes-beneficiary';

interface ApplicationProcessProps {
  scheme?: {
    id: string;
    title: string;
    titleEn: string;
    applicationProcess: string;
    applicationProcessEn: string;
    documents: string;
    documentsEn: string;
    contactInfo: string;
    contactInfoEn: string;
    website: string;
    contactOfficeName?: string;
    contactOfficeNameEn?: string;
    contactAddress?: string;
    contactAddressEn?: string;
    contactPhone?: string;
    contactOfficeHours?: string;
    contactOfficeHoursEn?: string;
  };
}

// Icon mapping
const iconMap: Record<string, any> = {
  CheckCircle,
  FileText,
  User,
  ArrowRight,
  Clock
};

export default function ApplicationProcessSection({ scheme: propScheme }: ApplicationProcessProps) {
  const [config, setConfig] = useState<ApplicationProcessConfigData>(applicationProcessDemoConfig);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/application-process');
        if (response.ok) {
          const data = await response.json();
          setConfig({
            steps: data.steps || applicationProcessDemoConfig.steps,
            requiredDocuments: data.requiredDocuments || applicationProcessDemoConfig.requiredDocuments,
            applicationFormUrl: data.applicationFormUrl || '',
            sampleFormUrl: data.sampleFormUrl || '',
            isActive: data.isActive ?? true
          });
          setIsDemo(Boolean(data.isDemo));
        } else {
          setError('माहिती लोड करण्यात अडचण आली');
        }
      } catch (err) {
        console.error(err);
        setError('माहिती लोड करण्यात अडचण आली');
      } finally {
        setLoading(false);
      }
    };

    if (!propScheme) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [propScheme]);

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 mx-auto text-red-500 mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  const applicationSteps = config.steps || [
    {
      step: 1,
      title: 'पात्रता तपासणी',
      titleEn: 'Eligibility Check',
      description: 'योजनेच्या पात्रता निकषांची तपासणी करा',
      descriptionEn: 'Check the eligibility criteria for the scheme',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      step: 2,
      title: 'कागदपत्रे तयार करा',
      titleEn: 'Prepare Documents',
      description: 'सर्व आवश्यक कागदपत्रे तयार करा',
      descriptionEn: 'Prepare all required documents',
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      step: 3,
      title: 'अर्ज भरा',
      titleEn: 'Fill Application',
      description: 'ऑनलाइन किंवा ऑफलाइन अर्ज भरा',
      descriptionEn: 'Fill online or offline application',
      icon: User,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      step: 4,
      title: 'सबमिट करा',
      titleEn: 'Submit Application',
      description: 'अर्ज सबमिट करा आणि रसीद घ्या',
      descriptionEn: 'Submit application and get receipt',
      icon: ArrowRight,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      step: 5,
      title: 'अनुवीक्षण',
      titleEn: 'Monitoring',
      description: 'अर्जाची स्थिती तपासत रहा',
      descriptionEn: 'Keep checking application status',
      icon: Clock,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ];

  const requiredDocuments = config.requiredDocuments || [
    {
      name: 'आधार कार्ड',
      nameEn: 'Aadhaar Card',
      required: true,
      description: 'वैध आधार कार्डची प्रत',
      descriptionEn: 'Valid Aadhaar card copy'
    },
    {
      name: 'पैन कार्ड',
      nameEn: 'PAN Card',
      required: true,
      description: 'पैन कार्डची प्रत',
      descriptionEn: 'PAN card copy'
    },
    {
      name: 'राहण्याचा पुरावा',
      nameEn: 'Address Proof',
      required: true,
      description: 'राहण्याचा पुरावा (वीज बिल, पाणी बिल)',
      descriptionEn: 'Address proof (electricity bill, water bill)'
    },
    {
      name: 'जातीचा दाखला',
      nameEn: 'Caste Certificate',
      required: false,
      description: 'जर लागू असेल तर जातीचा दाखला',
      descriptionEn: 'Caste certificate if applicable'
    },
    {
      name: 'आय प्रमाणपत्र',
      nameEn: 'Income Certificate',
      required: true,
      description: 'तहसीलदार कार्यालयातून घेतलेले आय प्रमाणपत्र',
      descriptionEn: 'Income certificate from Tehsildar office'
    },
    {
      name: 'फोटो',
      nameEn: 'Photograph',
      required: true,
      description: '२ पासपोर्ट साइज फोटो',
      descriptionEn: '2 passport size photographs'
    }
  ];

  return (
    <div className="space-y-8">
      {isDemo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            डेमो डेटा - प्रशासनामधून अपडेट करा
          </p>
        </div>
      )}

      {/* Application Process Steps */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            अर्ज प्रक्रिया
            <Badge className="ml-auto bg-blue-600 text-white">Application Process</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {applicationSteps.map((step, index) => {
              const IconComponent = iconMap[step.icon] || CheckCircle;
              return (
                <div key={step.step} className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full ${step.bgColor} flex items-center justify-center`}>
                    <IconComponent className={`h-5 w-5 ${step.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      <span className="text-sm text-gray-500">({step.titleEn})</span>
                      <Badge variant="outline" className="text-xs">
                        Step {step.step}
                      </Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">{step.description}</p>
                    <p className="text-gray-500 text-xs">{step.descriptionEn}</p>
                  </div>
                  {index < applicationSteps.length - 1 && (
                    <div className="flex-shrink-0 mt-5">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            आवश्यक कागदपत्रे
            <Badge className="ml-auto bg-green-600 text-white">Required Documents</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full ${doc.required ? 'bg-red-100' : 'bg-yellow-100'} flex items-center justify-center`}>
                  <FileText className={`h-4 w-4 ${doc.required ? 'text-red-600' : 'text-yellow-600'}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                    <span className="text-sm text-gray-500">({doc.nameEn})</span>
                    {doc.required ? (
                      <Badge className="bg-red-100 text-red-700 text-xs">आवश्यक</Badge>
                    ) : (
                      <Badge className="bg-yellow-100 text-yellow-700 text-xs">पर्यायी</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm">{doc.description}</p>
                  <p className="text-gray-500 text-xs">{doc.descriptionEn}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* Download Forms Button */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex flex-wrap gap-3">
              {config.applicationFormUrl ? (
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => window.open(config.applicationFormUrl, '_blank')}
                >
                  <Download className="h-4 w-4 mr-2" />
                  अर्ज फॉर्म डाउनलोड करा
                </Button>
              ) : (
                <Button className="bg-blue-600 hover:bg-blue-700 text-white" disabled>
                  <Download className="h-4 w-4 mr-2" />
                  अर्ज फॉर्म डाउनलोड करा
                </Button>
              )}
              {config.sampleFormUrl ? (
                <Button 
                  variant="outline" 
                  className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  onClick={() => window.open(config.sampleFormUrl, '_blank')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  नमुना अर्ज पहा
                </Button>
              ) : (
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50" disabled>
                  <FileText className="h-4 w-4 mr-2" />
                  नमुना अर्ज पहा
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-50">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100">
              <Phone className="h-6 w-6 text-orange-600" />
            </div>
            संपर्क माहिती
            <Badge className="ml-auto bg-orange-600 text-white">Contact Information</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-orange-600 mt-1" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {propScheme?.contactOfficeName || 'ग्रामपंचायत कार्यालय'}
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {propScheme?.contactOfficeNameEn || 'Gram Panchayat Office'}
                  </p>
                  <p className="text-gray-700">
                    {propScheme?.contactAddress || propScheme?.contactInfo || 'संपर्क माहिती उपलब्ध नाही'}
                  </p>
                </div>
              </div>
              
              {propScheme?.contactPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">फोन नंबर</h4>
                    <p className="text-gray-600 text-sm">Phone Number</p>
                    <p className="text-gray-700">{propScheme.contactPhone}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              {propScheme?.contactOfficeHours && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">कार्यालयीन वेळ</h4>
                    <p className="text-gray-600 text-sm">Office Hours</p>
                    <p className="text-gray-700">{propScheme.contactOfficeHours}</p>
                  </div>
                </div>
              )}
              
              {propScheme?.website && (
                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-orange-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900">वेबसाइट</h4>
                    <p className="text-gray-600 text-sm">Website</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto text-blue-600 hover:text-blue-800"
                      onClick={() => window.open(propScheme.website, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      {propScheme.website}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
