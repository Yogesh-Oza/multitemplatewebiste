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

interface SubdomainFormData {
  subdomain: string;
  villageName: string;
  villageNameEn: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  description: string;
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
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateSubdomain = (subdomain: string) => {
    const regex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    return regex.test(subdomain) && subdomain.length >= 3 && subdomain.length <= 20;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateSubdomain(formData.subdomain)) {
      toast.error('Invalid subdomain format. Use only lowercase letters, numbers, and hyphens (3-20 characters)');
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
        setIsSubmitted(true);
        toast.success('Subdomain registration successful! Check your email for login details.');
      } else {
        toast.error(result.error || 'Registration failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
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
            <p className="text-sm text-gray-500">
              लॉगिन क्रेडेन्शियल्स आणि सेटअप सूचनांसाठी आपला ईमेल तपासा.
            </p>
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
                    onChange={(e) => setFormData({...formData, subdomain: e.target.value.toLowerCase()})}
                    placeholder="आपल्या-गावाचे-नाव"
                    className="flex-1"
                    required
                  />
                  <Badge variant="outline" className="whitespace-nowrap">
                    .mahagp.in
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  फक्त लोअरकेस अक्षरे, संख्या आणि हायफन परवानगी (3-20 अक्षरे)
                </p>
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
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 9876543210"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">ईमेल पत्ता</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="village@example.com"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  गावाचा पत्ता
                </Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="तालुका, जिल्हा, राज्यासह पूर्ण गावाचा पत्ता"
                  rows={3}
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">गावाचे वर्णन (पर्यायी)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="आपल्या गावाबद्दल, त्याच्या इतिहासाबद्दल किंवा विशेष वैशिष्ट्यांबद्दल संक्षिप्त वर्णन"
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting || !validateSubdomain(formData.subdomain)}
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
