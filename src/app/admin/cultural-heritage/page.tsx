'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  Image
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CulturalHeritage {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
}


export default function CulturalHeritagePage() {
  const [heritage, setHeritage] = useState<CulturalHeritage[]>([]);
  const [editingItem, setEditingItem] = useState<CulturalHeritage | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch heritage from API
  useEffect(() => {
    const fetchHeritage = async () => {
      try {
        const response = await fetch('/api/cultural-heritage');
        if (response.ok) {
          const data = await response.json();
          setHeritage(data);
        }
      } catch (error) {
        console.error('Error fetching heritage:', error);
        toast.error('सांस्कृतिक वारसा लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeritage();
  }, []);

  const handleEdit = (item: CulturalHeritage) => {
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingItem({
      id: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      image: '',
      category: 'सांस्कृतिक'
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingItem) return;

    console.log('Saving cultural heritage:', editingItem);

    try {
      if (isAdding) {
        const response = await fetch('/api/cultural-heritage', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        console.log('Create response status:', response.status);

        if (response.ok) {
          const newItem = await response.json();
          console.log('Created heritage item:', newItem);
          setHeritage(prev => [...prev, newItem]);
          toast.success('नवीन आयटम जोडले');
        } else {
          const errorData = await response.json();
          console.error('Create failed:', errorData);
          throw new Error(errorData.error || 'Failed to create heritage item');
        }
      } else {
        const response = await fetch(`/api/cultural-heritage/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        console.log('Update response status:', response.status);

        if (response.ok) {
          const updatedItem = await response.json();
          console.log('Updated heritage item:', updatedItem);
          setHeritage(prev => prev.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          ));
          toast.success('आयटम अपडेट केले');
        } else {
          const errorData = await response.json();
          console.error('Update failed:', errorData);
          throw new Error(errorData.error || 'Failed to update heritage item');
        }
      }

      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving heritage item:', error);
      toast.error('आयटम सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/cultural-heritage/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setHeritage(prev => prev.filter(item => item.id !== id));
        toast.success('आयटम हटवले');
      } else {
        throw new Error('Failed to delete heritage item');
      }
    } catch (error) {
      console.error('Error deleting heritage item:', error);
      toast.error('आयटम हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया फक्त प्रतिमा फाइल निवडा');
      return;
    }
    
    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        const result = await response.json();
        setEditingItem(prev => prev ? { ...prev, image: result.imageUrl } : null);
        toast.success('प्रतिमा अपलोड केली');
      } else {
        const error = await response.json();
        throw new Error(error.error || 'अपलोड अयशस्वी');
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'अपलोड अयशस्वी');
    } finally {
      // reset input so same file can be reselected
      (event.target as HTMLInputElement).value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">सांस्कृतिक वारसा</h1>
          <p className="text-gray-600 mt-1">सांस्कृतिक उत्सव आणि परंपरागत कला व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {heritage.length} आयटम
          </Badge>
          <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन आयटम
          </Button>
        </div>
      </div>

      {/* Heritage Items Grid */}
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
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन आयटम जोडा' : 'आयटम संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    placeholder="गणेशोत्सव"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingItem.titleEn}
                    onChange={(e) => setEditingItem({...editingItem, titleEn: e.target.value})}
                    placeholder="Ganesh Festival"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    placeholder="गावातील सर्वात मोठा सांस्कृतिक उत्सव"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingItem.descriptionEn}
                    onChange={(e) => setEditingItem({...editingItem, descriptionEn: e.target.value})}
                    placeholder="The biggest cultural festival of the village"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingItem.image && (
                    <img
                      src={editingItem.image}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg mb-2"
                    />
                  )}
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="image"
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
                <Button variant="outline" onClick={handleCancel}>
                  रद्द करा
                </Button>
                <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                  <Save className="h-4 w-4 mr-2" />
                  सेव्ह करा
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
