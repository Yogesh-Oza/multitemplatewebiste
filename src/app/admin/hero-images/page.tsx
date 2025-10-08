'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Upload, 
  Trash2, 
  Eye, 
  Plus,
  ArrowLeft,
  Camera
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface HeroImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch images from API
  const fetchImages = async () => {
    try {
      const response = await fetch('/api/hero-images');
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast.error('प्रतिमा लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया प्रतिमा फाइल निवडा');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    setIsUploading(true);
    
    try {
      // Upload file to Vercel Blob
      const formData = new FormData();
      formData.append('file', file);
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      
      // Save to database
      const saveResponse = await fetch('/api/hero-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl: uploadData.imageUrl,
          title: file.name.split('.')[0],
          description: '',
          isActive: true,
        }),
      });

      if (!saveResponse.ok) {
        throw new Error('Save to database failed');
      }

      const newImage = await saveResponse.json();
      setImages(prev => [newImage, ...prev]);
      toast.success('प्रतिमा यशस्वीरित्या अपलोड केली');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('अपलोड करताना त्रुटी');
    } finally {
      setIsUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/hero-images?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setImages(prev => prev.filter(img => img.id !== id));
        toast.success('प्रतिमा हटवली');
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('हटवताना त्रुटी');
    }
  };

  const handleToggleActive = async (id: string) => {
    const image = images.find(img => img.id === id);
    if (!image) return;

    try {
      const response = await fetch('/api/hero-images', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          imageUrl: image.imageUrl,
          title: image.title,
          description: image.description,
          isActive: !image.isActive,
        }),
      });

      if (response.ok) {
        setImages(prev => prev.map(img => 
          img.id === id ? { ...img, isActive: !img.isActive } : img
        ));
        toast.success('प्रतिमा स्थिती अपडेट केली');
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error('Update error:', error);
      toast.error('अपडेट करताना त्रुटी');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">मुख्य प्रतिमा</h1>
          <p className="text-gray-600 mt-1">होमपेज मुख्य प्रतिमा व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {images.filter(img => img.isActive).length} सक्रिय
          </Badge>
          <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
            {images.length} एकूण
          </Badge>
        </div>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5" />
            <span>नवीन प्रतिमा अपलोड करा</span>
          </CardTitle>
          <CardDescription>
            होमपेज स्लाइडरसाठी नवीन प्रतिमा जोडा. JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
              disabled={isUploading}
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center space-y-4"
            >
              <div className="p-4 bg-blue-100 rounded-full">
                <Camera className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-medium text-gray-900">
                  {isUploading ? 'अपलोड होत आहे...' : 'प्रतिमा अपलोड करा'}
                </p>
                <p className="text-sm text-gray-500">
                  क्लिक करा किंवा प्रतिमा ड्रॅग करा
                </p>
              </div>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">प्रतिमा सूची</h2>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">लोड होत आहे...</span>
          </div>
        ) : images.length === 0 ? (
          <div className="text-center py-12">
            <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">अजून कोणतीही प्रतिमा नाही</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Hero Image'}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge 
                      variant={image.isActive ? "default" : "secondary"}
                      className={image.isActive ? "bg-green-500" : "bg-gray-500"}
                    >
                      {image.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-gray-900 mb-2">{image.title || 'प्रतिमा'}</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    जोडले: {new Date(image.createdAt).toLocaleDateString('mr-IN')}
                  </p>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleToggleActive(image.id)}
                      className="flex-1"
                    >
                      {image.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDelete(image.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Eye className="h-5 w-5" />
            <span>सूचना</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">प्रतिमा आकार</h4>
              <p className="text-sm text-blue-700">
                शिफारस केलेला आकार: 1920x1080px (16:9 गुणोत्तर)
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">फाइल स्वरूप</h4>
              <p className="text-sm text-green-700">
                JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">सक्रिय प्रतिमा</h4>
              <p className="text-sm text-purple-700">
                फक्त सक्रिय प्रतिमा होमपेजवर दिसतील
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-orange-900 mb-2">कमाल संख्या</h4>
              <p className="text-sm text-orange-700">
                कमाल 10 प्रतिमा जोडू शकता
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
