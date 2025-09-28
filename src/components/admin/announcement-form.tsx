'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Save, ArrowLeft, Upload, Calendar, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface AnnouncementFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function AnnouncementForm({ initialData, isEdit = false }: AnnouncementFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    date: initialData?.date || '',
    description: initialData?.description || '',
    fullDescription: initialData?.fullDescription || '',
    image: initialData?.image || '',
    category: initialData?.category || '',
    priority: initialData?.priority || 'medium',
    status: initialData?.status || 'active',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEdit 
        ? `/api/admin/announcements/${initialData?.id}` 
        : '/api/admin/announcements';
      
      const method = isEdit ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success(isEdit ? 'सूचना अपडेट केली!' : 'नवीन सूचना तयार केली!');
        router.push('/admin/announcements');
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
            <AlertCircle className="h-5 w-5 mr-2" />
            मुख्य माहिती
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">शीर्षक</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="सूचनेचे शीर्षक"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">तारीख</Label>
              <Input
                id="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="२३ मार्च २०२४"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="category">वर्ग</Label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              >
                <option value="">वर्ग निवडा</option>
                <option value="पाणीपुरवठा">पाणीपुरवठा</option>
                <option value="आरोग्य">आरोग्य</option>
                <option value="विकास">विकास</option>
                <option value="विद्युत">विद्युत</option>
                <option value="शिक्षण">शिक्षण</option>
                <option value="स्वच्छता">स्वच्छता</option>
                <option value="इतर">इतर</option>
              </select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">संक्षिप्त वर्णन</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="सूचनेचे संक्षिप्त वर्णन..."
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fullDescription">संपूर्ण वर्णन</Label>
            <Textarea
              id="fullDescription"
              value={formData.fullDescription}
              onChange={(e) => handleInputChange('fullDescription', e.target.value)}
              placeholder="सूचनेचे संपूर्ण वर्णन..."
              rows={5}
            />
          </div>
        </CardContent>
      </Card>

      {/* Image and Settings */}
      <Card>
        <CardHeader>
          <CardTitle>प्रतिमा आणि सेटिंग्स</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="image">प्रतिमा URL</Label>
            <Input
              id="image"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="priority">प्राधान्य</Label>
              <select
                value={formData.priority}
                onChange={(e) => handleInputChange('priority', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="high">उच्च</option>
                <option value="medium">मध्यम</option>
                <option value="low">कमी</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="status">स्थिती</Label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="active">सक्रिय</option>
                <option value="completed">पूर्ण</option>
                <option value="upcoming">येत आहे</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          मागे जा
        </Button>
        
        <Button type="submit" disabled={isLoading}>
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? 'सेव्ह करत आहे...' : (isEdit ? 'अपडेट करा' : 'तयार करा')}
        </Button>
      </div>
    </form>
  );
}
