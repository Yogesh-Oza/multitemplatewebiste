'use client';

import { useState } from 'react';
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
  altText: string;
  isActive: boolean;
  createdAt: string;
}

const mockHeroImages: HeroImage[] = [
  {
    id: '1',
    imageUrl: '/images/hero-1.jpg',
    altText: 'ग्रामपंचायत कार्यालय',
    isActive: true,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    imageUrl: '/images/hero-2.jpg',
    altText: 'गावाचा दृश्य',
    isActive: true,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    imageUrl: '/images/hero-3.jpg',
    altText: 'सामुदायिक केंद्र',
    isActive: false,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    imageUrl: '/images/hero-4.jpg',
    altText: 'गावाचा निसर्ग',
    isActive: true,
    createdAt: '2024-01-12'
  },
  {
    id: '5',
    imageUrl: '/images/hero-5.jpg',
    altText: 'सांस्कृतिक कार्यक्रम',
    isActive: true,
    createdAt: '2024-01-11'
  }
];

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>(mockHeroImages);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      const newImage: HeroImage = {
        id: Date.now().toString(),
        imageUrl: URL.createObjectURL(file),
        altText: file.name,
        isActive: true,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      setImages(prev => [newImage, ...prev]);
      setIsUploading(false);
      toast.success('प्रतिमा यशस्वीरित्या अपलोड केली');
    }, 2000);
  };

  const handleDelete = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
    toast.success('प्रतिमा हटवली');
  };

  const handleToggleActive = (id: string) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, isActive: !img.isActive } : img
    ));
    toast.success('प्रतिमा स्थिती अपडेट केली');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              मुख्यपृष्ठ
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">मुख्य प्रतिमा</h1>
            <p className="text-gray-600 mt-1">होमपेज मुख्य प्रतिमा व्यवस्थापन</p>
          </div>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative">
                <img
                  src={image.imageUrl}
                  alt={image.altText}
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
                <h3 className="font-medium text-gray-900 mb-2">{image.altText}</h3>
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
