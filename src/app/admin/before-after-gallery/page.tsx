'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface BeforeAfterItem {
  id: string;
  title: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  descriptionEn: string;
  impact: string;
  impactEn: string;
  year: string;
  cost: string;
  category: string;
  categoryEn: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function BeforeAfterGalleryAdminPage() {
  const [items, setItems] = useState<BeforeAfterItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BeforeAfterItem | null>(null);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    beforeImage: '',
    afterImage: '',
    description: '',
    descriptionEn: '',
    impact: '',
    impactEn: '',
    year: '',
    cost: '',
    category: '',
    categoryEn: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/before-after-gallery');
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('आयटम लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'before' | 'after') => {
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

    if (type === 'before') {
      setIsUploadingBefore(true);
    } else {
      setIsUploadingAfter(true);
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();

      if (type === 'before') {
        setFormData(prev => ({ ...prev, beforeImage: uploadData.imageUrl }));
      } else {
        setFormData(prev => ({ ...prev, afterImage: uploadData.imageUrl }));
      }

      toast.success('प्रतिमा यशस्वीरित्या अपलोड केली');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('अपलोड करताना त्रुटी');
    } finally {
      if (type === 'before') {
        setIsUploadingBefore(false);
      } else {
        setIsUploadingAfter(false);
      }
      event.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/before-after-gallery';
      const method = editingItem ? 'PUT' : 'POST';
      
      const body = editingItem 
        ? { ...formData, id: editingItem.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchItems();
        setIsModalOpen(false);
        setEditingItem(null);
        resetForm();
        toast.success(editingItem ? 'आयटम अपडेट केले' : 'आयटम जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error('आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (item: BeforeAfterItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      titleEn: item.titleEn,
      beforeImage: item.beforeImage,
      afterImage: item.afterImage,
      description: item.description,
      descriptionEn: item.descriptionEn,
      impact: item.impact,
      impactEn: item.impactEn,
      year: item.year,
      cost: item.cost,
      category: item.category,
      categoryEn: item.categoryEn,
      order: item.order,
      isActive: item.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा आयटम हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/before-after-gallery?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchItems();
          toast.success('आयटम हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting item:', error);
        toast.error('आयटम हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (item: BeforeAfterItem) => {
    try {
      const response = await fetch('/api/before-after-gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: item.id,
          ...item,
          isActive: !item.isActive
        })
      });
      if (response.ok) {
        await fetchItems();
        toast.success(item.isActive ? 'आयटम निष्क्रिय केले' : 'आयटम सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      beforeImage: '',
      afterImage: '',
      description: '',
      descriptionEn: '',
      impact: '',
      impactEn: '',
      year: '',
      cost: '',
      category: '',
      categoryEn: '',
      order: 0,
      isActive: true
    });
  };

  // Default items to show when none are added
  const getDefaultItems = (): BeforeAfterItem[] => [
    {
      id: 'default-1',
      title: 'रस्ते दुरुस्ती प्रकल्प',
      titleEn: 'Road Repair Project',
      beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
      afterImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center',
      description: 'गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा',
      descriptionEn: 'Repair and improvement of main roads in the village',
      impact: 'रस्ते सुधारले, वाहतूक सुगम झाली, दुर्घटना कमी झाल्या',
      impactEn: 'Roads improved, traffic became smoother, accidents reduced',
      year: '२०२३',
      cost: '₹२५ लाख',
      category: 'पायाभूत सुविधा',
      categoryEn: 'Infrastructure',
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayItems = items.length > 0 ? items : getDefaultItems();
  const isShowingDefaults = items.length === 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">पूर्वी आणि नंतर गॅलरी</h1>
        <p className="text-gray-600 mt-2">स्लायडरद्वारे परिवर्तन दाखविणे – रस्ते, तळी, शाळा आणि इतर विकास कामे</p>
      </div>

      {/* Add Button */}
      <div className="flex justify-end">
        <Button onClick={() => {
          setEditingItem(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन आयटम जोडा
        </Button>
      </div>

      {/* Info message when showing defaults */}
      {isShowingDefaults && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-blue-800">
            <strong>नोंद:</strong> हे डिफॉल्ट आयटम आहेत. तुम्ही "नवीन आयटम जोडा" बटणावर क्लिक करून स्वतःचे आयटम जोडू शकता.
          </p>
        </div>
      )}

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{item.titleEn}</p>
                </div>
                <Badge variant={item.isActive ? "default" : "secondary"}>
                  {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Before/After Images Preview */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {item.beforeImage ? (
                      <Image
                        src={item.beforeImage}
                        alt="पूर्वी"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      पूर्वी
                    </div>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                    {item.afterImage ? (
                      <Image
                        src={item.afterImage}
                        alt="नंतर"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      नंतर
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs text-gray-500">वर्ष:</span>
                    <span className="ml-2 text-sm font-medium">{item.year}</span>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">खर्च:</span>
                    <span className="ml-2 text-sm font-medium">{item.cost}</span>
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                  </div>
                </div>

                {!isShowingDefaults && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActive(item)}
                      className={item.isActive ? 'text-yellow-600' : 'text-green-600'}
                    >
                      {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
                {isShowingDefaults && (
                  <div className="pt-2 border-t">
                    <p className="text-xs text-gray-500 text-center">
                      डिफॉल्ट आयटम - संपादन करण्यासाठी आयटम जोडा
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingItem ? 'आयटम संपादित करा' : 'नवीन आयटम जोडा'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="title">शीर्षक (मराठी) *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="रस्ते दुरुस्ती प्रकल्प"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">शीर्षक (इंग्रजी) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      required
                      placeholder="Road Repair Project"
                    />
                  </div>
                </div>

                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>पूर्वीची प्रतिमा *</Label>
                    <div className="mt-2 space-y-2">
                      {formData.beforeImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={formData.beforeImage}
                            alt="पूर्वी"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'before')}
                        disabled={isUploadingBefore}
                      />
                      {isUploadingBefore && (
                        <p className="text-xs text-gray-500">अपलोड होत आहे...</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label>नंतरची प्रतिमा *</Label>
                    <div className="mt-2 space-y-2">
                      {formData.afterImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={formData.afterImage}
                            alt="नंतर"
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, 'after')}
                        disabled={isUploadingAfter}
                      />
                      {isUploadingAfter && (
                        <p className="text-xs text-gray-500">अपलोड होत आहे...</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="description">वर्णन (मराठी) *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={3}
                      placeholder="गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा"
                    />
                  </div>
                  <div>
                    <Label htmlFor="descriptionEn">वर्णन (इंग्रजी) *</Label>
                    <Textarea
                      id="descriptionEn"
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      required
                      rows={3}
                      placeholder="Repair and improvement of main roads in the village"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="impact">परिणाम (मराठी) *</Label>
                    <Textarea
                      id="impact"
                      value={formData.impact}
                      onChange={(e) => setFormData(prev => ({ ...prev, impact: e.target.value }))}
                      required
                      rows={3}
                      placeholder="रस्ते सुधारले, वाहतूक सुगम झाली"
                    />
                  </div>
                  <div>
                    <Label htmlFor="impactEn">परिणाम (इंग्रजी) *</Label>
                    <Textarea
                      id="impactEn"
                      value={formData.impactEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, impactEn: e.target.value }))}
                      required
                      rows={3}
                      placeholder="Roads improved, traffic became smoother"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="year">वर्ष *</Label>
                    <Input
                      id="year"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      required
                      placeholder="२०२३"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cost">खर्च *</Label>
                    <Input
                      id="cost"
                      value={formData.cost}
                      onChange={(e) => setFormData(prev => ({ ...prev, cost: e.target.value }))}
                      required
                      placeholder="₹२५ लाख"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="category">वर्ग (मराठी) *</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      placeholder="पायाभूत सुविधा"
                    />
                  </div>
                  <div>
                    <Label htmlFor="categoryEn">वर्ग (इंग्रजी) *</Label>
                    <Input
                      id="categoryEn"
                      value={formData.categoryEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                      required
                      placeholder="Infrastructure"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="order">क्रम</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingItem(null);
                      resetForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit" disabled={!formData.beforeImage || !formData.afterImage}>
                    {editingItem ? 'अपडेट करा' : 'जोडा'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

