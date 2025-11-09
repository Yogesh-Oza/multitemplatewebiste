'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Globe, Plus, Edit, Save, X, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { CulturalHeritage } from './types';

export function CulturalHeritageSection() {
  const [heritage, setHeritage] = useState<CulturalHeritage[]>([]);
  const [isLoadingHeritage, setIsLoadingHeritage] = useState(true);
  const [editingHeritage, setEditingHeritage] = useState<CulturalHeritage | null>(null);
  const [isAddingHeritage, setIsAddingHeritage] = useState(false);
  const [isUploadingHeritageImage, setIsUploadingHeritageImage] = useState(false);

  useEffect(() => {
    fetchHeritage();
  }, []);

  const fetchHeritage = async () => {
    try {
      const response = await fetch('/api/cultural-heritage');
      if (response.ok) {
        const data = await response.json();
        setHeritage(data);
      }
    } catch (error) {
      console.error('Error fetching cultural heritage:', error);
      toast.error('सांस्कृतिक वारसा लोड करताना त्रुटी');
    } finally {
      setIsLoadingHeritage(false);
    }
  };

  const handleSaveHeritage = async () => {
    if (!editingHeritage) return;

    try {
      if (isAddingHeritage) {
        const response = await fetch('/api/cultural-heritage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingHeritage),
        });

        if (response.ok) {
          toast.success('नवीन आयटम जोडले');
          fetchHeritage();
        } else {
          throw new Error('Failed to create heritage item');
        }
      } else {
        const response = await fetch(`/api/cultural-heritage/${editingHeritage.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingHeritage),
        });

        if (response.ok) {
          toast.success('आयटम अपडेट केले');
          fetchHeritage();
        } else {
          throw new Error('Failed to update heritage item');
        }
      }

      setEditingHeritage(null);
      setIsAddingHeritage(false);
    } catch (error) {
      console.error('Error saving heritage item:', error);
      toast.error('आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteHeritage = async (id: string) => {
    if (!confirm('हे आयटम हटवायचे आहे?')) return;

    try {
      const response = await fetch(`/api/cultural-heritage/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('आयटम हटवले');
        fetchHeritage();
      } else {
        throw new Error('Failed to delete heritage item');
      }
    } catch (error) {
      console.error('Error deleting heritage item:', error);
      toast.error('आयटम हटवताना त्रुटी');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="cultural-heritage">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">सांस्कृतिक वारसा</h2>
                <p className="text-sm text-gray-600">सांस्कृतिक उत्सव आणि परंपरागत कला व्यवस्थापन</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {heritage.length} आयटम
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button onClick={() => {
                setEditingHeritage({
                  id: '',
                  title: '',
                  titleEn: '',
                  description: '',
                  descriptionEn: '',
                  image: '',
                  category: 'सांस्कृतिक'
                });
                setIsAddingHeritage(true);
              }} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                नवीन आयटम
              </Button>
            </div>

            {isLoadingHeritage ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">लोड होत आहे...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {heritage.map((item) => (
                  <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-green-500">
                          सांस्कृतिक
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.description}</p>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingHeritage(item);
                            setIsAddingHeritage(false);
                          }}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादन
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteHeritage(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Edit Heritage Modal */}
            {editingHeritage && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Edit className="h-5 w-5" />
                      <span>{isAddingHeritage ? 'नवीन आयटम जोडा' : 'आयटम संपादित करा'}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingHeritage(null);
                          setIsAddingHeritage(false);
                        }}
                        className="ml-auto"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="heritageTitle">शीर्षक (मराठी)</Label>
                        <Input
                          id="heritageTitle"
                          value={editingHeritage.title}
                          onChange={(e) => setEditingHeritage({...editingHeritage, title: e.target.value})}
                          placeholder="गणेशोत्सव"
                        />
                      </div>
                      <div>
                        <Label htmlFor="heritageTitleEn">शीर्षक (इंग्रजी)</Label>
                        <Input
                          id="heritageTitleEn"
                          value={editingHeritage.titleEn}
                          onChange={(e) => setEditingHeritage({...editingHeritage, titleEn: e.target.value})}
                          placeholder="Ganesh Festival"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="heritageDescription">वर्णन (मराठी)</Label>
                        <Textarea
                          id="heritageDescription"
                          value={editingHeritage.description}
                          onChange={(e) => setEditingHeritage({...editingHeritage, description: e.target.value})}
                          placeholder="गावातील सर्वात मोठा सांस्कृतिक उत्सव"
                          rows={3}
                        />
                      </div>
                      <div>
                        <Label htmlFor="heritageDescriptionEn">वर्णन (इंग्रजी)</Label>
                        <Textarea
                          id="heritageDescriptionEn"
                          value={editingHeritage.descriptionEn}
                          onChange={(e) => setEditingHeritage({...editingHeritage, descriptionEn: e.target.value})}
                          placeholder="The biggest cultural festival of the village"
                          rows={3}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="heritageCategory">श्रेणी</Label>
                      <Input
                        id="heritageCategory"
                        value={editingHeritage.category}
                        onChange={(e) => setEditingHeritage({...editingHeritage, category: e.target.value})}
                        placeholder="सांस्कृतिक"
                      />
                    </div>

                    <div>
                      <Label htmlFor="heritageImage">प्रतिमा</Label>
                      <div className="mt-2">
                        {editingHeritage.image && (
                          <img
                            src={editingHeritage.image}
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg mb-2"
                          />
                        )}
                        <input
                          type="file"
                          id="heritageImage"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploadingHeritageImage(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const uploadResponse = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });
                              
                              if (uploadResponse.ok) {
                                const result = await uploadResponse.json();
                                setEditingHeritage(prev => prev ? { ...prev, image: result.imageUrl || result.url } : null);
                                toast.success('प्रतिमा अपलोड केली');
                              } else {
                                throw new Error('Upload failed');
                              }
                            } catch (err: any) {
                              console.error('Upload error:', err);
                              toast.error(err.message || 'अपलोड अयशस्वी');
                            } finally {
                              setIsUploadingHeritageImage(false);
                            }
                          }}
                          className="hidden"
                        />
                        <label
                          htmlFor="heritageImage"
                          className="cursor-pointer flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                        >
                          <div className="text-center">
                            <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">प्रतिमा अपलोड करा</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                      <Button variant="outline" onClick={() => {
                        setEditingHeritage(null);
                        setIsAddingHeritage(false);
                      }}>
                        रद्द करा
                      </Button>
                      <Button onClick={handleSaveHeritage} className="bg-green-600 hover:bg-green-700">
                        <Save className="h-4 w-4 mr-2" />
                        सेव्ह करा
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

