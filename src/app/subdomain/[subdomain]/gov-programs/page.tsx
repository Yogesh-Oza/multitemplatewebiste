'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Calendar, 
  Users, 
  DollarSign, 
  ExternalLink, 
  Clock,
  MapPin,
  Phone,
  Globe,
  FileText,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import ApplicationProcessSection from '@/components/sections/application-process-section';
import BeneficiaryStoriesSection from '@/components/sections/beneficiary-stories-section';
import EnhancedCoverageMapSection from '@/components/sections/enhanced-coverage-map-section';

interface GovernmentScheme {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  eligibility: string;
  eligibilityEn: string;
  benefits: string;
  benefitsEn: string;
  documents: string;
  documentsEn: string;
  applicationProcess: string;
  applicationProcessEn: string;
  contactInfo: string;
  contactInfoEn: string;
  website: string;
  imageUrl: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const categories = [
  { value: 'घर', label: 'घर', color: 'bg-blue-500', icon: Building },
  { value: 'रोजगार', label: 'रोजगार', color: 'bg-green-500', icon: Users },
  { value: 'शेती', label: 'शेती', color: 'bg-yellow-500', icon: DollarSign },
  { value: 'शिक्षण', label: 'शिक्षण', color: 'bg-purple-500', icon: FileText },
  { value: 'आरोग्य', label: 'आरोग्य', color: 'bg-red-500', icon: CheckCircle },
  { value: 'महिला', label: 'महिला', color: 'bg-pink-500', icon: Users },
  { value: 'बाल', label: 'बाल', color: 'bg-cyan-500', icon: Users },
  { value: 'वृद्ध', label: 'वृद्ध', color: 'bg-orange-500', icon: Users },
  { value: 'अन्य', label: 'अन्य', color: 'bg-gray-500', icon: Info }
];

export default function GovProgramsPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [filteredSchemes, setFilteredSchemes] = useState<GovernmentScheme[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/government-schemes');
        if (response.ok) {
          const data = await response.json();
          setSchemes(data);
          setFilteredSchemes(data);
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'सर्व') {
      setFilteredSchemes(schemes);
    } else {
      setFilteredSchemes(schemes.filter(scheme => scheme.category === selectedCategory));
    }
  }, [selectedCategory, schemes]);

  const getCategoryInfo = (category: string) => {
    return categories.find(cat => cat.value === category) || categories[categories.length - 1];
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'तारीख निर्दिष्ट नाही';
    try {
      return new Date(dateString).toLocaleDateString('mr-IN');
    } catch {
      return 'अवैध तारीख';
    }
  };

  const getStatusBadge = (scheme: GovernmentScheme) => {
    const now = new Date();
    const startDate = scheme.startDate ? new Date(scheme.startDate) : null;
    const endDate = scheme.endDate ? new Date(scheme.endDate) : null;

    if (startDate && endDate) {
      if (now < startDate) {
        return <Badge className="bg-blue-500 text-white">येत आहे</Badge>;
      } else if (now > endDate) {
        return <Badge className="bg-gray-500 text-white">समाप्त</Badge>;
      } else {
        return <Badge className="bg-green-500 text-white">सक्रिय</Badge>;
      }
    }
    return <Badge className="bg-gray-500 text-white">अज्ञात</Badge>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">लोड होत आहे...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        {/* Government Logo Background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <Building className="h-10 w-10 text-blue-600" />
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-blue-600" />
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-blue-600" />
          </div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                <Building className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                योजना आणि लाभार्थी माहिती
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              Schemes & Beneficiary Information
            </p>
            <p className="text-lg mb-8 opacity-80">
              केंद्र / राज्य / जिल्हा स्तरावरील लागू योजना, अर्ज प्रक्रिया, पात्रता आणि आवश्यक कागदपत्रे
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span>सर्व योजना</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <Users className="h-5 w-5 mr-2" />
                <span>लाभार्थी कथा</span>
              </div>
              <div className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm">
                <MapPin className="h-5 w-5 mr-2" />
                <span>कव्हरेज नकाशा</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            <Button
              variant={selectedCategory === 'सर्व' ? 'default' : 'outline'}
              onClick={() => setSelectedCategory('सर्व')}
              className="mb-2"
            >
              सर्व
            </Button>
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(category.value)}
                  className="mb-2"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {category.label}
                </Button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredSchemes.length === 0 ? (
            <div className="text-center py-16">
              <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                कोणतीही योजना सापडली नाही
              </h3>
              <p className="text-gray-500">
                {selectedCategory === 'सर्व' 
                  ? 'अद्याप कोणतीही योजना जोडली गेली नाही'
                  : `${selectedCategory} श्रेणीत कोणतीही योजना नाही`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredSchemes.map((scheme) => {
                const categoryInfo = getCategoryInfo(scheme.category);
                const IconComponent = categoryInfo.icon;
                
                return (
                  <Card key={scheme.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                    {/* Image Section */}
                    <div className="relative h-48 bg-gradient-to-br from-blue-100 to-indigo-200">
                      {scheme.imageUrl ? (
                        <img
                          src={scheme.imageUrl}
                          alt={scheme.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <IconComponent className="h-16 w-16 text-blue-400" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        {getStatusBadge(scheme)}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <Badge className={`${categoryInfo.color} text-white`}>
                          {scheme.category}
                        </Badge>
                      </div>
                    </div>

                    {/* Content Section */}
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg font-bold text-gray-800 line-clamp-2">
                        {scheme.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 line-clamp-2">
                        {scheme.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Benefits */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-green-600" />
                          लाभ
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {scheme.benefits}
                        </p>
                      </div>

                      {/* Eligibility */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                          <CheckCircle className="h-4 w-4 mr-2 text-blue-600" />
                          पात्रता
                        </h4>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {scheme.eligibility}
                        </p>
                      </div>

                      {/* Dates */}
                      <div className="space-y-2">
                        <h4 className="font-semibold text-gray-700 flex items-center">
                          <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                          कालावधी
                        </h4>
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>सुरुवात: {formatDate(scheme.startDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>समाप्ती: {formatDate(scheme.endDate)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      {scheme.contactInfo && (
                        <div className="space-y-2">
                          <h4 className="font-semibold text-gray-700 flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-orange-600" />
                            संपर्क
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {scheme.contactInfo}
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t">
                        {scheme.website && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => window.open(scheme.website, '_blank')}
                          >
                            <Globe className="h-4 w-4 mr-2" />
                            वेबसाइट
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="default"
                          className="flex-1"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          अधिक माहिती
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {schemes.length}
              </div>
              <div className="text-gray-600">एकूण योजना</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {schemes.filter(s => s.isActive).length}
              </div>
              <div className="text-gray-600">सक्रिय योजना</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.length}
              </div>
              <div className="text-gray-600">श्रेण्या</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {new Set(schemes.map(s => s.category)).size}
              </div>
              <div className="text-gray-600">वापरलेल्या श्रेण्या</div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process Section */}
      {filteredSchemes.length > 0 && (
        <section className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container mx-auto px-4">
            <ApplicationProcessSection scheme={filteredSchemes[0]} />
          </div>
        </section>
      )}

      {/* Star Beneficiary Stories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <BeneficiaryStoriesSection />
        </div>
      </section>

      {/* Enhanced Coverage Map Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <EnhancedCoverageMapSection />
        </div>
      </section>

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <Building className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-2xl font-bold">महाराष्ट्र शासन</h3>
                <p className="text-lg opacity-90">Maharashtra Government</p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">
              सर्व योजना भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली कार्यरत आहेत
            </p>
            <p className="text-sm opacity-70">
              All schemes are operational under the guidance of Government of India and Maharashtra Government
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
