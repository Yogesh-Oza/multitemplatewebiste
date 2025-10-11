'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Globe, Mail, User, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useVillageData } from '@/hooks/useVillageData';

interface SubdomainFormData {
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
  districtId: string;
  districtName: string;
  subDistrictId: string;
  subDistrictName: string;
  villageId: string;
  villageNameLocal: string;
}

export default function SubdomainRegisterPage() {
  const [formData, setFormData] = useState<SubdomainFormData>({
    subdomain: '',
    villageName: '',
    villageNameEn: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    districtId: '',
    districtName: '',
    subDistrictId: '',
    subDistrictName: '',
    villageId: '',
    villageNameLocal: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionData, setSubmissionData] = useState<any>(null);
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  const [isCheckingAvailability, setIsCheckingAvailability] = useState<{[key: string]: boolean}>({});
  const [villageSearchTerm, setVillageSearchTerm] = useState('');

  // Use the village data hook
  const {
    districts,
    subDistricts,
    villages,
    loading: villageLoading,
    error: villageError,
    fetchSubDistricts,
    fetchVillages,
    clearSubDistricts,
    clearVillages
  } = useVillageData();


  const validateSubdomain = (subdomain: string) => {
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 20;
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const withCountryCode = cleanPhone.startsWith('91') && indianMobileRegex.test(cleanPhone.slice(2));
    return indianMobileRegex.test(cleanPhone) || withCountryCode;
  };

  const validateDomain = (subdomain: string) => {
    const reservedWords = ['www', 'admin', 'api', 'mail', 'ftp', 'blog', 'shop', 'app', 'test', 'dev', 'staging', 'production'];
    const invalidPatterns = /^(www|admin|api|mail|ftp|blog|shop|app|test|dev|staging|production)/;
    
    if (reservedWords.includes(subdomain.toLowerCase())) {
      return { valid: false, message: 'हे सबडोमेन आरक्षित आहे आणि वापरले जाऊ शकत नाही' };
    }
    
    if (invalidPatterns.test(subdomain.toLowerCase())) {
      return { valid: false, message: 'सबडोमेन आरक्षित शब्दांनी सुरू होऊ शकत नाही' };
    }
    
    if (!validateSubdomain(subdomain)) {
      return { valid: false, message: 'अवैध सबडोमेन स्वरूप. फक्त लोअरकेस अक्षरे, संख्या आणि हायफन वापरा (3-20 अक्षरे)' };
    }
    
    return { valid: true, message: '' };
  };

  // Real-time availability checking
  const checkAvailability = async (field: string, value: string) => {
    if (!value || value.length < 3) return;
    
    setIsCheckingAvailability(prev => ({ ...prev, [field]: true }));
    
    try {
      const response = await fetch(`/api/validate-subdomain?${field}=${encodeURIComponent(value)}`);
      const result = await response.json();
      
      if (!response.ok) {
        setValidationErrors(prev => ({ ...prev, [field]: result.error }));
      } else {
        setValidationErrors(prev => ({ ...prev, [field]: '' }));
      }
    } catch (error) {
    } finally {
      setIsCheckingAvailability(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear previous error for this field
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
    
    // Real-time validation
    let error = '';
    
    switch (field) {
      case 'subdomain':
        if (value) {
          const domainValidation = validateDomain(value);
          if (!domainValidation.valid) {
            error = domainValidation.message;
          } else {
            // Check availability after a short delay
            setTimeout(() => checkAvailability('subdomain', value), 500);
          }
        }
        break;
      case 'email':
        if (value && !validateEmail(value)) {
          error = 'कृपया वैध ईमेल पत्ता प्रविष्ट करा';
        } else if (value && validateEmail(value)) {
          setTimeout(() => checkAvailability('email', value), 500);
        }
        break;
      case 'phone':
        if (value && !validatePhone(value)) {
          error = 'कृपया वैध भारतीय मोबाइल नंबर प्रविष्ट करा (6-9 ने सुरू होणारे 10 अंक)';
        } else if (value && validatePhone(value)) {
          setTimeout(() => checkAvailability('phone', value), 500);
        }
        break;
    }
    
    if (error) {
      setValidationErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate subdomain
    const domainValidation = validateDomain(formData.subdomain);
    if (!domainValidation.valid) {
      toast.error(domainValidation.message);
      return;
    }

    // Validate email
    if (!validateEmail(formData.email)) {
      toast.error('कृपया वैध ईमेल पत्ता प्रविष्ट करा');
      return;
    }

    // Validate phone
    if (!validatePhone(formData.phone)) {
      toast.error('कृपया वैध भारतीय मोबाइल नंबर प्रविष्ट करा (6-9 ने सुरू होणारे 10 अंक)');
      return;
    }

    // Validate required fields
    if (!formData.villageName.trim() || !formData.villageNameEn.trim() || !formData.contactPerson.trim() || !formData.districtId || !formData.subDistrictId || !formData.villageId) {
      toast.error('कृपया सर्व आवश्यक फील्ड भरा');
      return;
    }

    // Check for any validation errors
    if (Object.keys(validationErrors).some(key => validationErrors[key])) {
      toast.error('कृपया सर्व त्रुटी दुरुस्त करा');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/subdomain/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmissionData(result);
        setIsSubmitted(true);
        if (result.emailSent) {
          toast.success('सबडोमेन नोंदणी यशस्वी! लॉगिन तपशीलांसाठी आपला ईमेल तपासा.');
        } else {
          toast.success('सबडोमेन नोंदणी यशस्वी! कृपया खाली आपले लॉगिन क्रेडेन्शियल्स नोंदवा.');
        }
      } else {
        toast.error(result.error || 'नोंदणी अयशस्वी');
      }
    } catch (error) {
      toast.error('नेटवर्क त्रुटी. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">नोंदणी यशस्वी!</h2>
            <p className="text-gray-600 mb-4">
              आपला सबडोमेन <strong>{formData.subdomain}.mahagp.in</strong> तयार झाला आहे.
            </p>
            
            {submissionData?.emailSent ? (
              <p className="text-sm text-gray-500">
                लॉगिन क्रेडेन्शियल्स आणि सेटअप सूचनांसाठी आपला ईमेल तपासा.
              </p>
            ) : (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800 mb-3">
                  ईमेल पाठविण्यात समस्या आली. कृपया खालील लॉगिन तपशील नोंदवा:
                </p>
                <div className="text-left space-y-2">
                  <div>
                    <span className="font-semibold text-gray-700">व्यवस्थापक URL:</span>
                    <br />
                    <code className="text-blue-600">{submissionData?.adminUrl}</code>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">वापरकर्ता नाव:</span>
                    <br />
                    <code className="bg-gray-100 px-2 py-1 rounded">{submissionData?.credentials?.username}</code>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">पासवर्ड:</span>
                    <br />
                    <code className="bg-gray-100 px-2 py-1 rounded">{submissionData?.credentials?.password}</code>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            आपल्या गावाची वेबसाइट तयार करा
          </h1>
          <p className="text-xl text-gray-600">
            आपला स्वतःचा सबडोमेन मिळवा आणि आपली ग्रामपंचायत वेबसाइट तयार करण्यास सुरुवात करा
          </p>
        </div>


        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-6 w-6 text-blue-600" />
              सबडोमेन नोंदणी
            </CardTitle>
            <CardDescription>
              आपल्या वेबसाइटसाठी सुरुवात करण्यासाठी आपल्या गावाची माहिती भरा
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subdomain Input */}
              <div className="space-y-2">
                <Label htmlFor="subdomain">सबडोमेन नाव</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="subdomain"
                    value={formData.subdomain}
                    onChange={(e) => handleFieldChange('subdomain', e.target.value.toLowerCase())}
                    placeholder="आपल्या-गावाचे-नाव"
                    className={`flex-1 ${validationErrors.subdomain ? 'border-red-500' : ''}`}
                    required
                  />
                  <Badge variant="outline" className="whitespace-nowrap">
                    .mahagp.in
                  </Badge>
                </div>
                <p className={`text-sm ${validationErrors.subdomain ? 'text-red-500' : 'text-gray-500'}`}>
                  {validationErrors.subdomain || 'फक्त लोअरकेस अक्षरे, संख्या आणि हायफन परवानगी (3-20 अक्षरे)'}
                </p>
                {isCheckingAvailability.subdomain && (
                  <p className="text-sm text-blue-500">तपासत आहे...</p>
                )}
              </div>

              {/* Village Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="villageName">गावाचे नाव (मराठी)</Label>
                  <Input
                    id="villageName"
                    value={formData.villageName}
                    onChange={(e) => setFormData({...formData, villageName: e.target.value})}
                    placeholder="गावाचे नाव"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="villageNameEn">गावाचे नाव (इंग्रजी)</Label>
                  <Input
                    id="villageNameEn"
                    value={formData.villageNameEn}
                    onChange={(e) => setFormData({...formData, villageNameEn: e.target.value})}
                    placeholder="Village Name"
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <User className="h-5 w-5" />
                  संपर्क माहिती
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">संपर्क व्यक्ती</Label>
                    <Input
                      id="contactPerson"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({...formData, contactPerson: e.target.value})}
                      placeholder="पूर्ण नाव"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">फोन नंबर</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleFieldChange('phone', e.target.value)}
                      placeholder="+91 9876543210"
                      className={validationErrors.phone ? 'border-red-500' : ''}
                      required
                    />
                    {validationErrors.phone && (
                      <p className="text-sm text-red-500">{validationErrors.phone}</p>
                    )}
                    {isCheckingAvailability.phone && (
                      <p className="text-sm text-blue-500">तपासत आहे...</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल पत्ता</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    placeholder="village@example.com"
                    className={validationErrors.email ? 'border-red-500' : ''}
                    required
                  />
                  {validationErrors.email && (
                    <p className="text-sm text-red-500">{validationErrors.email}</p>
                  )}
                  {isCheckingAvailability.email && (
                    <p className="text-sm text-blue-500">तपासत आहे...</p>
                  )}
                </div>
              </div>

              {/* District Selection */}
              <div className="space-y-2">
                <Label htmlFor="districtId" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  जिल्हा / District Name
                </Label>
                <select
                  id="districtId"
                  value={formData.districtId}
                  onChange={(e) => {
                    const selectedDistrict = districts.find(d => d.id === e.target.value);
                    setFormData({
                      ...formData, 
                      districtId: e.target.value,
                      districtName: selectedDistrict?.name || '',
                      subDistrictId: '', // Reset sub-district when district changes
                      subDistrictName: '',
                      villageId: '', // Reset village when district changes
                      villageNameLocal: ''
                    });
                    // Clear sub-districts and villages when district changes
                    clearSubDistricts();
                    clearVillages();
                    // Fetch sub-districts for selected district
                    if (e.target.value) {
                      fetchSubDistricts(e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={villageLoading.districts}
                >
                  <option value="">जिल्हा निवडा / Select District</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name} ({district.nameMarathi})
                    </option>
                  ))}
                </select>
                {villageLoading.districts && (
                  <p className="text-sm text-blue-500">Loading districts...</p>
                )}
              </div>

              {/* Sub-District Selection */}
              <div className="space-y-2">
                <Label htmlFor="subDistrictId" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  तालुका / Sub-District Name
                </Label>
                <select
                  id="subDistrictId"
                  value={formData.subDistrictId}
                  onChange={(e) => {
                    const selectedSubDistrict = subDistricts.find(sd => sd.id === e.target.value);
                    setFormData({
                      ...formData, 
                      subDistrictId: e.target.value,
                      subDistrictName: selectedSubDistrict?.name || '',
                      villageId: '', // Reset village when sub-district changes
                      villageNameLocal: ''
                    });
                    // Clear villages when sub-district changes
                    clearVillages();
                    // Fetch villages for selected sub-district
                    if (e.target.value) {
                      fetchVillages(e.target.value, villageSearchTerm);
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!formData.districtId || villageLoading.subDistricts}
                >
                  <option value="">तालुका निवडा / Select Sub-District</option>
                  {subDistricts.map((subDistrict) => (
                    <option key={subDistrict.id} value={subDistrict.id}>
                      {subDistrict.name} ({subDistrict.nameMarathi})
                    </option>
                  ))}
                </select>
                {villageLoading.subDistricts && (
                  <p className="text-sm text-blue-500">Loading sub-districts...</p>
                )}
              </div>

              {/* Village Selection */}
              <div className="space-y-2">
                <Label htmlFor="villageId" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  गावाचे नाव / Village Name
                </Label>
                
                {/* Village Search Input */}
                {formData.subDistrictId && (
                  <div className="mb-2">
                    <input
                      type="text"
                      placeholder="Search villages..."
                      value={villageSearchTerm}
                      onChange={(e) => {
                        setVillageSearchTerm(e.target.value);
                        // Debounce the search
                        setTimeout(() => {
                          if (formData.subDistrictId) {
                            fetchVillages(formData.subDistrictId, e.target.value);
                          }
                        }, 300);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                  </div>
                )}
                <select
                  id="villageId"
                  value={formData.villageId}
                  onChange={(e) => {
                    const selectedVillage = villages.find(v => v.id === e.target.value);
                    setFormData({
                      ...formData, 
                      villageId: e.target.value,
                      villageNameLocal: selectedVillage?.nameMarathi || ''
                    });
                  }}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                  disabled={!formData.subDistrictId || villageLoading.villages}
                >
                  <option value="">गाव निवडा / Select Village</option>
                  {villages.map((village) => (
                    <option key={village.id} value={village.id}>
                      {village.name} ({village.nameMarathi})
                    </option>
                  ))}
                </select>
                {villageLoading.villages && (
                  <p className="text-sm text-blue-500">Loading villages...</p>
                )}
                {villageSearchTerm && villages.length === 0 && !villageLoading.villages && (
                  <p className="text-sm text-gray-500">No villages found matching "{villageSearchTerm}"</p>
                )}
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !validateSubdomain(formData.subdomain) || !validateEmail(formData.email) || !validatePhone(formData.phone) || Object.keys(validationErrors).some(key => validationErrors[key]) || Object.values(isCheckingAvailability).some(checking => checking)}
              >
                {isSubmitting ? 'सबडोमेन तयार करत आहे...' : 'माझी गावाची वेबसाइट तयार करा'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="text-center">
              <Globe className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h3 className="font-semibold">स्वतःचा सबडोमेन</h3>
              <p className="text-sm text-gray-600">आपल्या गावाला स्वतःचा वेबसाइट URL मिळतो</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <Mail className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h3 className="font-semibold">सोपे व्यवस्थापन</h3>
              <p className="text-sm text-gray-600">सामग्री अपडेट करण्यासाठी सोपे व्यवस्थापक पॅनेल</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="text-center">
              <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <h3 className="font-semibold">व्यावसायिक डिझाइन</h3>
              <p className="text-sm text-gray-600">सुंदर, प्रतिक्रियाशील वेबसाइट टेम्प्लेट</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
