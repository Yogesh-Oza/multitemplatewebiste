'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Image, Upload, Trash2, Eye, Camera } from 'lucide-react';
import { toast } from 'sonner';
import type { HeroImage, HomepageSettings } from './types';

export function HeroImagesSection() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [homepageSettings, setHomepageSettings] = useState<HomepageSettings | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchImages();
    fetchHomepageSettings();
  }, []);

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

  const fetchHomepageSettings = async () => {
    try {
      const response = await fetch('/api/homepage-settings');
      if (response.ok) {
        const data = await response.json();
        setHomepageSettings(data);
      }
    } catch (error) {
      console.error('Error fetching homepage settings:', error);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया प्रतिमा फाइल निवडा');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    setIsUploading(true);
    
    try {
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

  const handleSaveSettings = async () => {
    if (!homepageSettings) return;
    
    setIsSavingSettings(true);
    try {
      const response = await fetch('/api/homepage-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(homepageSettings),
      });

      if (response.ok) {
        toast.success('होमपेज सेटिंग्स सेव्ह केल्या');
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('सेटिंग्स सेव्ह करताना त्रुटी');
    } finally {
      setIsSavingSettings(false);
    }
  };

  return (
    <Accordion type="single" collapsible defaultValue="hero-images" className="w-full">
      <AccordionItem value="hero-images">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Image className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">मुख्य प्रतिमा</h2>
                <p className="text-sm text-gray-600">होमपेज मुख्य प्रतिमा व्यवस्थापन</p>
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
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
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

            {/* Homepage Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Image className="h-5 w-5 mr-2" />
                  होमपेज मुख्य प्रतिमा व्यवस्थापन
                </CardTitle>
                <CardDescription>
                  होमपेजवरील मुख्य शीर्षक आणि उपशीर्षक व्यवस्थापन
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {homepageSettings && (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="mainHeading">मुख्य शीर्षक</Label>
                        <Input
                          id="mainHeading"
                          value={homepageSettings.mainHeading}
                          onChange={(e) => setHomepageSettings(prev => prev ? { ...prev, mainHeading: e.target.value } : null)}
                          placeholder="आमच्या गावात स्वागत आहे"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="subtitle">उपशीर्षक</Label>
                        <Input
                          id="subtitle"
                          value={homepageSettings.subtitle}
                          onChange={(e) => setHomepageSettings(prev => prev ? { ...prev, subtitle: e.target.value } : null)}
                          placeholder="एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव"
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button 
                        onClick={handleSaveSettings}
                        disabled={isSavingSettings}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isSavingSettings ? 'सेव्ह होत आहे...' : 'सेटिंग्स सेव्ह करा'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Images Grid */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-6">प्रतिमा सूची</h3>
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
                        <h4 className="font-medium text-gray-900 mb-2">{image.title || 'प्रतिमा'}</h4>
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

