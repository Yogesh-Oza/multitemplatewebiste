'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2, Users, Home, MapPin, TrendingUp, RefreshCw } from 'lucide-react';
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
  sectionOneTitle?: string;
  sectionOneBody?: string;
  sectionTwoTitle?: string;
  sectionTwoBody?: string;
  sectionThreeTitle?: string;
  sectionThreeBody?: string;
  stats: Stat[];
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
    sectionOneTitle: villageData?.sectionOneTitle || 'आमचे गाव',
    sectionOneBody: villageData?.sectionOneBody || 'आमचे गाव एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गाव आहे. येथे सर्व जाती-धर्माचे लोक एकत्रित राहतात आणि सामूहिक विकासासाठी काम करतात.',
    sectionTwoTitle: villageData?.sectionTwoTitle || 'स्थान',
    sectionTwoBody: villageData?.sectionTwoBody || 'आमचे गाव महाराष्ट्र राज्यातील एक महत्त्वाचे गाव आहे. येथे सुंदर निसर्ग, समृद्ध संस्कृती आणि मैत्रीपूर्ण वातावरण आहे.',
    sectionThreeTitle: villageData?.sectionThreeTitle || 'विकास',
    sectionThreeBody: villageData?.sectionThreeBody || 'आमच्या गावाचा सतत विकास होत आहे. शिक्षण, आरोग्य, रोजगार आणि मूलभूत सुविधांसाठी सर्व प्रयत्न केले जात आहेत.',
    stats: transformStats(villageData?.stats),
  });

  // Update form data when villageData changes
  useEffect(() => {
    if (villageData) {
      setFormData({
        title: villageData.title || 'आमच्या गावाबद्दल',
        description: villageData.description || 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
        sectionOneTitle: villageData.sectionOneTitle || 'आमचे गाव',
        sectionOneBody: villageData.sectionOneBody || 'आमचे गाव एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गाव आहे. येथे सर्व जाती-धर्माचे लोक एकत्रित राहतात आणि सामूहिक विकासासाठी काम करतात.',
        sectionTwoTitle: villageData.sectionTwoTitle || 'स्थान',
        sectionTwoBody: villageData.sectionTwoBody || 'आमचे गाव महाराष्ट्र राज्यातील एक महत्त्वाचे गाव आहे. येथे सुंदर निसर्ग, समृद्ध संस्कृती आणि मैत्रीपूर्ण वातावरण आहे.',
        sectionThreeTitle: villageData.sectionThreeTitle || 'विकास',
        sectionThreeBody: villageData.sectionThreeBody || 'आमच्या गावाचा सतत विकास होत आहे. शिक्षण, आरोग्य, रोजगार आणि मूलभूत सुविधांसाठी सर्व प्रयत्न केले जात आहेत.',
        stats: transformStats(villageData.stats),
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Ensure stats is an array before submitting
      const dataToSubmit = {
        ...formData,
        stats: Array.isArray(formData.stats) ? formData.stats : []
      };
      
      console.log('Submitting village info:', dataToSubmit);
      
      const response = await fetch('/api/admin/village-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSubmit),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Update successful:', result);
        toast.success('गाव माहिती सफलतापूर्वक सेव्ह केली!');
        
        // Force refresh the page to show updated data
        setTimeout(() => {
          window.location.reload();
        }, 500);
      } else {
        const errorData = await response.json();
        console.error('Update failed:', errorData);
        toast.error(`त्रुटी आली: ${errorData.error || 'अज्ञात त्रुटी'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
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
