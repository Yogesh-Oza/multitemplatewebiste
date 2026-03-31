'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Image, 
  Video, 
  Edit, 
  Save,
  Trash2,
  Upload,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  category?: string;
  isActive: boolean;
  order: number;
}

const galleryTypes = [
  { value: 'photo', label: 'फोटो', icon: Image },
  { value: 'video', label: 'व्हिडिओ', icon: Video }
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'photo' | 'video'>('photo');

  // Fetch gallery items from API
  useEffect(() => {
    const fetchGalleryItems = async () => {
      try {
        const response = await fetch('/api/gallery');
        if (response.ok) {
          const data = await response.json();
          setGalleryItems(data);
        }
      } catch (error) {
        console.error('Error fetching gallery items:', error);
        toast.error('गॅलरी आयटम लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGalleryItems();
  }, []);

  const handleEdit = (item: GalleryItem) => {
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
      type: 'photo',
      mediaUrl: '',
      category: '',
      isActive: true,
      order: 0
    });
    setIsAdding(true);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      toast.error('कृपया फक्त प्रतिमा किंवा व्हिडिओ फाइल निवडा');
      return;
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
    if (file.size > maxSize) {
      const maxSizeMB = file.type.startsWith('video/') ? '50MB' : '10MB';
      toast.error(`फाइल आकार ${maxSizeMB} पेक्षा कमी असावा`);
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
        setEditingItem(prev => prev ? { ...prev, mediaUrl: result.imageUrl } : null);
        toast.success('मीडिया अपलोड केले');
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

  const handleSave = async () => {
    if (!editingItem) return;

    console.log('Saving gallery item:', editingItem);

    try {
      if (isAdding) {
        const response = await fetch('/api/gallery', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        console.log('Create response status:', response.status);

        if (response.ok) {
          const newItem = await response.json();
          console.log('Created gallery item:', newItem);
          setGalleryItems(prev => [...prev, newItem]);
          toast.success('नवीन गॅलरी आयटम जोडले');
        } else {
          const errorData = await response.json();
          console.error('Create error:', errorData);
          throw new Error(errorData.error || 'गॅलरी आयटम तयार करताना त्रुटी आली');
        }
      } else {
        const response = await fetch(`/api/gallery/${editingItem.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingItem),
        });

        console.log('Update response status:', response.status);

        if (response.ok) {
          const updatedItem = await response.json();
          console.log('Updated gallery item:', updatedItem);
          setGalleryItems(prev => prev.map(item => 
            item.id === updatedItem.id ? updatedItem : item
          ));
          toast.success('गॅलरी आयटम अपडेट केले');
        } else {
          const errorData = await response.json();
          console.error('Update error:', errorData);
          throw new Error(errorData.error || 'गॅलरी आयटम अपडेट करताना त्रुटी आली');
        }
      }

      setEditingItem(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('गॅलरी आयटम सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setGalleryItems(prev => prev.filter(item => item.id !== id));
        toast.success('गॅलरी आयटम हटवले');
      } else {
        throw new Error('Failed to delete gallery item');
      }
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      toast.error('गॅलरी आयटम हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleToggleActive = (id: string) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id ? { ...item, isActive: !item.isActive } : item
    ));
    toast.success('गॅलरी आयटम स्थिती अपडेट केली');
  };

  const getGalleryIcon = (type: string) => {
    const galleryType = galleryTypes.find(t => t.value === type);
    return galleryType ? galleryType.icon : Image;
  };

  const filteredItems = galleryItems.filter(item => item.type === activeTab);

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
          <h1 className="text-3xl font-bold text-gray-900">गॅलरी व्यवस्थापन</h1>
          <p className="text-gray-600 mt-1">फोटो आणि व्हिडिओ गॅलरी व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {galleryItems.length} आयटम
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {galleryItems.filter(item => item.isActive).length} सक्रिय
          </Badge>
          <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन आयटम
          </Button>
        </div>
      </div>

      {/* Gallery Type Tabs */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('photo')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'photo'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Image className="h-4 w-4 inline mr-2" />
          फोटो गॅलरी
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            activeTab === 'video'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Video className="h-4 w-4 inline mr-2" />
          व्हिडिओ गॅलरी
        </button>
      </div>

      {/* Gallery Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          const Icon = getGalleryIcon(item.type);
          return (
            <Card key={item.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <Icon className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </div>
                  </div>
                  <Badge className={item.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {item.type === 'photo' ? (
                    <img
                      src={item.mediaUrl}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video
                      src={item.mediaUrl}
                      className="w-full h-32 object-cover rounded-lg"
                      muted
                    />
                  )}
                  <div className="text-sm text-gray-500">
                    <p><strong>प्रकार:</strong> {item.type === 'photo' ? 'फोटो' : 'व्हिडिओ'}</p>
                    {item.category && <p><strong>वर्ग:</strong> {item.category}</p>}
                    <p><strong>क्रम:</strong> {item.order}</p>
                  </div>
                </div>
                
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
                    onClick={() => handleToggleActive(item.id)}
                    className={item.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                  >
                    {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(item.id)}
                    className="bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन गॅलरी आयटम जोडा' : 'गॅलरी आयटम संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Image className="h-5 w-5 mr-2 text-purple-600" />
                    मूलभूत माहिती
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">प्रकार</Label>
                    <select
                      id="type"
                      value={editingItem.type}
                      onChange={(e) => setEditingItem({...editingItem, type: e.target.value as 'photo' | 'video'})}
                      className="w-full p-2 border border-gray-300 rounded-md mt-1"
                    >
                      {galleryTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="order">क्रम</Label>
                    <Input
                      id="order"
                      type="number"
                      value={editingItem.order}
                      onChange={(e) => setEditingItem({...editingItem, order: parseInt(e.target.value) || 0})}
                      placeholder="0"
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">शीर्षक (मराठी)</Label>
                    <Input
                      id="title"
                      value={editingItem.title}
                      onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                      placeholder="गॅलरी आयटम शीर्षक"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                    <Input
                      id="titleEn"
                      value={editingItem.titleEn}
                      onChange={(e) => setEditingItem({...editingItem, titleEn: e.target.value})}
                      placeholder="Gallery Item Title"
                      className="mt-1"
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
                      placeholder="गॅलरी आयटम वर्णन"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                    <Textarea
                      id="descriptionEn"
                      value={editingItem.descriptionEn}
                      onChange={(e) => setEditingItem({...editingItem, descriptionEn: e.target.value})}
                      placeholder="Gallery Item Description"
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="category">वर्ग (वैकल्पिक)</Label>
                  <Input
                    id="category"
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
                    placeholder="उत्सव, कार्यक्रम, इत्यादी"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Media Upload Section */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Upload className="h-5 w-5 mr-2 text-green-600" />
                    मीडिया अपलोड
                  </h3>
                </div>
                
                <div>
                  <Label htmlFor="media">मीडिया फाइल</Label>
                  <div className="space-y-3">
                    <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                      <Upload className="h-5 w-5 mr-2" />
                      <span className="text-sm font-medium">फाइल अपलोड</span>
                      <input
                        type="file"
                        accept={process.env.NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES || 'image/*'}
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <p className="text-xs text-gray-500">
                      {editingItem.type === 'photo' 
                        ? 'JPG, PNG, WebP, कमाल 10MB' 
                        : 'MP4, WebM, कमाल 50MB'
                      }
                    </p>

                    {editingItem.mediaUrl && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 mb-2">अपलोड केलेली मीडिया:</p>
                        <div className="relative inline-block">
                          {editingItem.type === 'photo' ? (
                            <img
                              src={editingItem.mediaUrl}
                              alt="Uploaded preview"
                              className="max-w-xs max-h-32 object-cover rounded-lg border"
                            />
                          ) : (
                            <video
                              src={editingItem.mediaUrl}
                              className="max-w-xs max-h-32 object-cover rounded-lg border"
                              muted
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setEditingItem(prev => prev ? { ...prev, mediaUrl: '' } : null)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Section */}
              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Eye className="h-5 w-5 mr-2 text-blue-600" />
                    स्थिती सेटिंग्स
                  </h3>
                </div>
                
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={editingItem.isActive}
                    onChange={(e) => setEditingItem({...editingItem, isActive: e.target.checked})}
                    className="rounded h-4 w-4 text-purple-600"
                  />
                  <Label htmlFor="isActive" className="text-sm font-medium">
                    हा गॅलरी आयटम सक्रिय आहे
                  </Label>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                  रद्द करा
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
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