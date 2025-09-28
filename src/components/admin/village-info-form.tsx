'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, Plus, Trash2, Users, Home, MapPin, TrendingUp } from 'lucide-react';
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
  titleEn: string;
  description: string;
  descriptionEn: string;
  stats: Stat[];
}

interface VillageInfoFormProps {
  initialData?: VillageInfo | null;
}

export function VillageInfoForm({ initialData }: VillageInfoFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<VillageInfo>({
    title: initialData?.title || 'आमच्या गावाबद्दल',
    titleEn: initialData?.titleEn || 'About Our Village',
    description: initialData?.description || 'एक प्रगतीशील, सुसंस्कृत आणि सामाजिक न्यायावर आधारित गावाची ओळख',
    descriptionEn: initialData?.descriptionEn || 'An identity of a progressive, cultured, and social justice-based village',
    stats: initialData?.stats || [
      { value: '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
      { value: '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
      { value: '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
      { value: '654.40', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' },
    ],
  });

  const handleInputChange = (field: keyof VillageInfo, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatChange = (index: number, field: keyof Stat, value: string) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.map((stat, i) => 
        i === index ? { ...stat, [field]: value } : stat
      )
    }));
  };

  const addStat = () => {
    setFormData(prev => ({
      ...prev,
      stats: [...prev.stats, { value: '', label: '', labelEn: '', icon: '📊' }]
    }));
  };

  const removeStat = (index: number) => {
    setFormData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/village-info', {
        method: initialData ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('गाव माहिती सफलतापूर्वक सेव्ह केली!');
        router.refresh();
      } else {
        toast.error('त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      }
    } catch (error) {
      toast.error('त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <div>
              <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
              <Input
                id="titleEn"
                value={formData.titleEn}
                onChange={(e) => handleInputChange('titleEn', e.target.value)}
                placeholder="Village Name"
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
          
          <div>
            <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => handleInputChange('descriptionEn', e.target.value)}
              placeholder="Village description..."
              rows={3}
              required
            />
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
            {formData.stats.map((stat, index) => (
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
