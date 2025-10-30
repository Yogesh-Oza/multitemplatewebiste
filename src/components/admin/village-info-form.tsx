'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2, Users, Home, MapPin, TrendingUp, RefreshCw, Video, Play, Upload, FileVideo, Link } from 'lucide-react';
import { toast } from 'sonner';

interface Stat {
  value: string;
  label: string;
  labelEn: string;
  icon: string;
}

interface VillageInfo {
  id?: string;
  title: string;
  description: string;
  villageLogo?: string;
  villageName?: string;
  villageNameEn?: string;
  satyamevJayateLogoUrl?: string;
  digitalIndiaLogoUrl?: string;
  govDeptText?: string;
  officialSiteText?: string;
  sectionOneTitle?: string;
  sectionOneBody?: string;
  sectionTwoTitle?: string;
  sectionTwoBody?: string;
  sectionThreeTitle?: string;
  sectionThreeBody?: string;
  stats: Stat[];
  welcomeVideo?: {
    url: string;
    title: string;
    description: string;
    isActive: boolean;
    type: 'youtube' | 'upload';
    uploadedFile?: string;
  };
}

interface VillageInfoFormProps {
  initialData?: VillageInfo | null;
}

export function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [villageData, setVillageData] = useState<VillageInfo | null>(initialData || null);
  const [isLoadingData, setIsLoadingData] = useState(!initialData);

  // Fetch village data from API
  useEffect(() => {
    if (!initialData) {
      const fetchVillageData = async () => {
        try {
          const response = await fetch('/api/village-info');
          if (response.ok) {
            const data = await response.json();
            setVillageData(data);
          }
        } catch (error) {
          console.error('Error fetching village data:', error);
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchVillageData();
    }
  }, [initialData]);
  
  // Helper function to transform stats data
  const transformStats = (stats: any): Stat[] => {
    if (!stats) {
      return [
        { value: '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
        { value: '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
        { value: '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
        { value: '654.40', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' },
      ];
    }
    
    // If stats is already an array, return it
    if (Array.isArray(stats)) {
      return stats;
    }
    
    // If stats is an object (from database), transform it to array format
    if (typeof stats === 'object') {
      return [
        { value: stats.families?.toString() || '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
        { value: stats.population?.toString() || '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
        { value: stats.gramPanchayatCount?.toString() || '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
        { value: stats.area?.toString() || '654.40', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' },
      ];
    }
    
    // Default fallback
    return [
      { value: '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
      { value: '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
      { value: '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
      { value: '654.40', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' },
    ];
  };

  const [formData, setFormData] = useState<VillageInfo>({
    title: villageData?.title || 'आमच्या गावाबद्दल',
    description: villageData?.description || 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
    villageLogo: villageData?.villageLogo || '',
    villageName: villageData?.villageName || '',
    villageNameEn: villageData?.villageNameEn || '',
    satyamevJayateLogoUrl: villageData?.satyamevJayateLogoUrl || '/images/gov-logos/satyamev_jayate_logo.png',
    digitalIndiaLogoUrl: villageData?.digitalIndiaLogoUrl || '/images/gov-logos/digital-india.png',
    govDeptText: villageData?.govDeptText || 'शासन महाराष्ट्र • ग्रामीण विकास विभाग',
    officialSiteText: villageData?.officialSiteText || 'अधिकृत ग्रामपंचायत संकेतस्थळ',
    sectionOneTitle: villageData?.sectionOneTitle || 'आमचे गाव',
    sectionOneBody: villageData?.sectionOneBody || 'आमचे गाव एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गाव आहे. येथे सर्व जाती-धर्माचे लोक एकत्रित राहतात आणि सामूहिक विकासासाठी काम करतात.',
    sectionTwoTitle: villageData?.sectionTwoTitle || 'स्थान',
    sectionTwoBody: villageData?.sectionTwoBody || 'आमचे गाव महाराष्ट्र राज्यातील एक महत्त्वाचे गाव आहे. येथे सुंदर निसर्ग, समृद्ध संस्कृती आणि मैत्रीपूर्ण वातावरण आहे.',
    sectionThreeTitle: villageData?.sectionThreeTitle || 'विकास',
    sectionThreeBody: villageData?.sectionThreeBody || 'आमच्या गावाचा सतत विकास होत आहे. शिक्षण, आरोग्य, रोजगार आणि मूलभूत सुविधांसाठी सर्व प्रयत्न केले जात आहेत.',
    stats: transformStats(villageData?.stats),
    welcomeVideo: villageData?.welcomeVideo || {
      url: '',
      title: 'गावाचे स्वागत व्हिडिओ',
      description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
      isActive: false,
      type: 'youtube',
      uploadedFile: ''
    },
  });

  // Update form data when villageData changes
  useEffect(() => {
    if (villageData) {
      setFormData({
        title: villageData.title || 'आमच्या गावाबद्दल',
        description: villageData.description || 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
        villageLogo: villageData.villageLogo || '',
        villageName: villageData.villageName || '',
        villageNameEn: villageData.villageNameEn || '',
        satyamevJayateLogoUrl: villageData.satyamevJayateLogoUrl || '/images/gov-logos/satyamev_jayate_logo.png',
        digitalIndiaLogoUrl: villageData.digitalIndiaLogoUrl || '/images/gov-logos/digital-india.png',
        govDeptText: villageData.govDeptText || 'शासन महाराष्ट्र • ग्रामीण विकास विभाग',
        officialSiteText: villageData.officialSiteText || 'अधिकृत ग्रामपंचायत संकेतस्थळ',
        sectionOneTitle: villageData.sectionOneTitle || 'आमचे गाव',
        sectionOneBody: villageData.sectionOneBody || 'आमचे गाव एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गाव आहे. येथे सर्व जाती-धर्माचे लोक एकत्रित राहतात आणि सामूहिक विकासासाठी काम करतात.',
        sectionTwoTitle: villageData.sectionTwoTitle || 'स्थान',
        sectionTwoBody: villageData.sectionTwoBody || 'आमचे गाव महाराष्ट्र राज्यातील एक महत्त्वाचे गाव आहे. येथे सुंदर निसर्ग, समृद्ध संस्कृती आणि मैत्रीपूर्ण वातावरण आहे.',
        sectionThreeTitle: villageData.sectionThreeTitle || 'विकास',
        sectionThreeBody: villageData.sectionThreeBody || 'आमच्या गावाचा सतत विकास होत आहे. शिक्षण, आरोग्य, रोजगार आणि मूलभूत सुविधांसाठी सर्व प्रयत्न केले जात आहेत.',
        stats: transformStats(villageData.stats),
        welcomeVideo: villageData.welcomeVideo || {
          url: '',
          title: 'गावाचे स्वागत व्हिडिओ',
          description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
          isActive: false,
          type: 'youtube',
          uploadedFile: ''
        },
      });
    }
  }, [villageData]);

  const handleInputChange = (field: keyof VillageInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: Array.isArray(prev.stats) ? prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      ) : []
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...(Array.isArray(prev.stats) ? prev.stats : []), { value: '', label: '', labelEn: '', icon: '📊' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: Array.isArray(prev.stats) ? prev.stats.filter((_, i) => i !== index) : []
    }));
  };

  const handleVideoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          welcomeVideo: {
            ...prev.welcomeVideo!,
            uploadedFile: data.url,
            type: 'upload'
          }
        }));
        toast.success('व्हिडिओ अपलोड केले!');
      } else {
        toast.error('व्हिडिओ अपलोड करताना त्रुटी आली');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('व्हिडिओ अपलोड करताना त्रुटी आली');
    }
  };

  const handleLogoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        const uploadedUrl = (data.url || data.imageUrl) as string | undefined;
        if (uploadedUrl) {
          setFormData(prev => ({
            ...prev,
            villageLogo: uploadedUrl
          }));
        } else {
        }
        toast.success('लोगो अपलोड केले!');
      } else {
        toast.error('लोगो अपलोड करताना त्रुटी आली');
      }
    } catch (error) {
      toast.error('लोगो अपलोड करताना त्रुटी आली');
    }
  };

  const handleGovLogoUpload = async (file: File, field: 'satyamevJayateLogoUrl' | 'digitalIndiaLogoUrl') => {
    try {
      const formDataFd = new FormData();
      formDataFd.append('file', file);
      const response = await fetch('/api/upload', { method: 'POST', body: formDataFd });
      if (response.ok) {
        const data = await response.json();
        const uploadedUrl = (data.url || data.imageUrl) as string | undefined;
        if (uploadedUrl) {
          setFormData(prev => ({ ...prev, [field]: uploadedUrl }));
        } else {
        }
        toast.success('लोगो अपलोड केले!');
      } else {
        toast.error('लोगो अपलोड करताना त्रुटी आली');
      }
    } catch (error) {
      toast.error('लोगो अपलोड करताना त्रुटी आली');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure stats is an array before submitting
      const dataToSubmit = {
        ...formData,
        stats: Array.isArray(formData.stats) ? formData.stats : []
      };
      
      
      const response = await fetch('/api/admin/village-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      
      if (response.ok) {
        const result = await response.json();
        toast.success('गाव माहिती सफलतापूर्वक सेव्ह केली!');
        
        // Force refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorData = await response.json();
        toast.error(`त्रुटी आली: ${errorData.error || 'अज्ञात त्रुटी'}`);
      }
    } catch (error) {
      toast.error('त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Village Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            गाव ब्रँडिंग
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="villageName">गावाचे नाव (हेडरसाठी)</Label>
              <Input
                id="villageName"
                value={formData.villageName || ''}
                onChange={(e) => handleInputChange('villageName', e.target.value)}
                placeholder="गावाचे नाव"
              />
              <p className="text-xs text-gray-500 mt-1">
                हे नाव हेडरमध्ये दिसेल
              </p>
            </div>
            <div>
              <Label htmlFor="villageNameEn">गावाचे नाव (इंग्रजी)</Label>
              <Input
                id="villageNameEn"
                value={formData.villageNameEn || ''}
                onChange={(e) => handleInputChange('villageNameEn', e.target.value)}
                placeholder="Village Name"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="villageLogo">गावाचे लोगो</Label>
            <div className="mt-2">
              <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <Upload className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">लोगो अपलोड करा</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleLogoUpload(file);
                    }
                  }}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP, कमाल 5MB</p>
              
              {formData.villageLogo && (
						<div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
							<div className="flex items-center space-x-2 text-sm text-green-700">
								<Home className="h-4 w-4" />
								<span>लोगो अपलोड केले: {formData.villageLogo.split('/').pop()}</span>
							</div>
							<div className="mt-3 flex items-center gap-4">
								<img
									src={formData.villageLogo}
									alt="Village logo preview"
									className="h-16 w-16 rounded object-contain border border-green-200 bg-white"
								/>
								<a
									href={formData.villageLogo}
									target="_blank"
									rel="noreferrer"
									className="text-sm text-green-700 underline underline-offset-2 hover:text-green-800"
								>
									पूर्ण आकारात पहा
								</a>
							</div>
						</div>
              )}
            </div>
          </div>

          {/* Government Branding moved into Village Info */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold mb-2">सरकारी लोगो आणि मजकूर</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label>Satyamev Jayate लोगो</Label>
                <div className="mt-2">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">फाइल निवडा</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleGovLogoUpload(file, 'satyamevJayateLogoUrl');
                      }}
                    />
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    {formData.satyamevJayateLogoUrl ? (
                      <img src={formData.satyamevJayateLogoUrl} alt="Satyamev Jayate Preview" className="h-8 w-8 object-contain bg-white border rounded" />
                    ) : null}
                    <span className="text-xs text-gray-600 break-all">{formData.satyamevJayateLogoUrl || ''}</span>
                  </div>
                </div>
              </div>
              <div>
                <Label>Digital India लोगो</Label>
                <div className="mt-2">
                  <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <Upload className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">फाइल निवडा</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleGovLogoUpload(file, 'digitalIndiaLogoUrl');
                      }}
                    />
                  </label>
                  <div className="mt-2 flex items-center gap-3">
                    {formData.digitalIndiaLogoUrl ? (
                      <img src={formData.digitalIndiaLogoUrl} alt="Digital India Preview" className="h-8 w-20 object-contain bg-white border rounded" />
                    ) : null}
                    <span className="text-xs text-gray-600 break-all">{formData.digitalIndiaLogoUrl || ''}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label htmlFor="govDeptText">सरकारी मजकूर (डावे)</Label>
                <Input
                  id="govDeptText"
                  value={formData.govDeptText || ''}
                  onChange={(e) => handleInputChange('govDeptText', e.target.value)}
                  placeholder="शासन महाराष्ट्र • ग्रामीण विकास विभाग"
                />
                <p className="text-xs text-gray-500 mt-1">हे मजकूर हेडरमधील डाव्या बाजूला दिसेल</p>
              </div>
              <div>
                <Label htmlFor="officialSiteText">सरकारी मजकूर (उजवे)</Label>
                <Input
                  id="officialSiteText"
                  value={formData.officialSiteText || ''}
                  onChange={(e) => handleInputChange('officialSiteText', e.target.value)}
                  placeholder="अधिकृत ग्रामपंचायत संकेतस्थळ"
                />
                <p className="text-xs text-gray-500 mt-1">हे मजकूर हेडरमधील उजव्या बाजूला दिसेल</p>
              </div>
            </div>

            <div className="mt-3 text-xs text-gray-600 space-y-1">
              <div>फाइल अपलोड माहिती</div>
              <div>• JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात</div>
              <div>• कमाल फाइल आकार: 5MB</div>
              <div>• लोगो साठी शिफारस केलेले आकार: Satyamev Jayate (32x32px), Digital India (80x32px)</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Home className="h-5 w-5 mr-2" />
            मुख्य माहिती
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">शीर्षक (मराठी)</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="गावाचे नाव"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">वर्णन (मराठी)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="गावाचे वर्णन..."
              rows={3}
              required
            />
          </div>
          
        </CardContent>
      </Card>

      {/* Additional Sections */}
      <Card>
        <CardHeader>
          <CardTitle>गाव माहिती - विभाग</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label>विभाग 1 शीर्षक</Label>
              <Input value={formData.sectionOneTitle} onChange={(e) => handleInputChange('sectionOneTitle' as any, e.target.value)} />
              <Label>विभाग 1 मजकूर</Label>
              <Textarea rows={5} value={formData.sectionOneBody} onChange={(e) => handleInputChange('sectionOneBody' as any, e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>विभाग 2 शीर्षक</Label>
              <Input value={formData.sectionTwoTitle} onChange={(e) => handleInputChange('sectionTwoTitle' as any, e.target.value)} />
              <Label>विभाग 2 मजकूर</Label>
              <Textarea rows={5} value={formData.sectionTwoBody} onChange={(e) => handleInputChange('sectionTwoBody' as any, e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>विभाग 3 शीर्षक</Label>
              <Input value={formData.sectionThreeTitle} onChange={(e) => handleInputChange('sectionThreeTitle' as any, e.target.value)} />
              <Label>विभाग 3 मजकूर</Label>
              <Textarea rows={5} value={formData.sectionThreeBody} onChange={(e) => handleInputChange('sectionThreeBody' as any, e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Welcome Video */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Video className="h-5 w-5 mr-2" />
            गावाचे स्वागत व्हिडिओ
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Type Selection */}
          <div className="flex space-x-4 mb-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="videoType"
                value="youtube"
                checked={formData.welcomeVideo?.type === 'youtube'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    type: 'youtube',
                    uploadedFile: ''
                  }
                }))}
                className="rounded"
              />
              <Link className="h-4 w-4" />
              <span className="text-sm">YouTube URL</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="videoType"
                value="upload"
                checked={formData.welcomeVideo?.type === 'upload'}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    type: 'upload',
                    url: ''
                  }
                }))}
                className="rounded"
              />
              <FileVideo className="h-4 w-4" />
              <span className="text-sm">व्हिडिओ अपलोड</span>
            </label>
          </div>

          {/* YouTube URL Option */}
          {formData.welcomeVideo?.type === 'youtube' && (
            <div>
              <Label htmlFor="videoUrl">YouTube URL</Label>
              <Input
                id="videoUrl"
                value={formData.welcomeVideo?.url || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    url: e.target.value
                  }
                }))}
                placeholder="https://www.youtube.com/watch?v=9W5Vw34xayM"
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                YouTube, Vimeo किंवा इतर व्हिडिओ प्लॅटफॉर्मचा URL
              </p>
            </div>
          )}

          {/* Video Upload Option */}
          {formData.welcomeVideo?.type === 'upload' && (
            <div>
              <Label>व्हिडिओ फाइल अपलोड</Label>
              <div className="mt-2">
                <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <Upload className="h-5 w-5 mr-2" />
                  <span className="text-sm font-medium">व्हिडिओ अपलोड करा</span>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleVideoUpload(file);
                      }
                    }}
                  />
                </label>
                <p className="text-xs text-gray-500 mt-1">MP4, MOV, AVI, कमाल 100MB</p>
                
                {formData.welcomeVideo?.uploadedFile && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                    <div className="flex items-center space-x-2 text-sm text-green-700">
                      <FileVideo className="h-4 w-4" />
                      <span>व्हिडिओ अपलोड केले: {formData.welcomeVideo.uploadedFile.split('/').pop()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Title and Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="videoTitle">व्हिडिओ शीर्षक</Label>
              <Input
                id="videoTitle"
                value={formData.welcomeVideo?.title || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    title: e.target.value
                  }
                }))}
                placeholder="गावाचे स्वागत व्हिडिओ"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="videoDescription">व्हिडिओ वर्णन</Label>
              <Textarea
                id="videoDescription"
                value={formData.welcomeVideo?.description || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    description: e.target.value
                  }
                }))}
                placeholder="सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप"
                rows={3}
                className="mt-1"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.welcomeVideo?.isActive || false}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  welcomeVideo: {
                    ...prev.welcomeVideo!,
                    isActive: e.target.checked
                  }
                }))}
                className="rounded"
              />
              <span className="text-sm">व्हिडिओ सक्रिय करा</span>
            </label>
          </div>

          {/* Video Preview */}
          {(formData.welcomeVideo?.url || formData.welcomeVideo?.uploadedFile) && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">व्हिडिओ प्रीव्ह्यू</h4>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Play className="h-4 w-4" />
                <span>
                  {formData.welcomeVideo?.type === 'youtube' 
                    ? `YouTube URL: ${formData.welcomeVideo.url}`
                    : `अपलोड केलेला व्हिडिओ: ${formData.welcomeVideo?.uploadedFile?.split('/').pop()}`
                  }
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              आकडेवारी
            </div>
            <Button type="button" onClick={addStat} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              नवीन आकडेवारी
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(Array.isArray(formData.stats) ? formData.stats : []).map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">आकडेवारी {index + 1}</h4>
                  {formData.stats.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStat(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label>मूल्य</Label>
                    <Input
                      value={stat.value}
                      onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                      placeholder="227"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>लेबल (मराठी)</Label>
                    <Input
                      value={stat.label}
                      onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                      placeholder="कुटुंबे"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>लेबल (इंग्रजी)</Label>
                    <Input
                      value={stat.labelEn}
                      onChange={(e) => handleStatChange(index, 'labelEn', e.target.value)}
                      placeholder="Families"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>आयकॉन</Label>
                    <Input
                      value={stat.icon}
                      onChange={(e) => handleStatChange(index, 'icon', e.target.value)}
                      placeholder="👨‍👩‍👧‍👦"
                      required
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          रद्द करा
        </Button>
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'सेव्ह करत आहे...' : 'सेव्ह करा'}
        </Button>
      </div>
    </form>
  );
}
