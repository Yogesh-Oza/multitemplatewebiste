'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Target, BarChart3, Users, DollarSign, CheckCircle, Upload, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface ImpactDashboardMetric {
  id: string;
  title: string;
  titleEn: string;
  value: number;
  target: number;
  unit: string;
  unitEn: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function ImpactDashboardAdminPage() {
  // Impact Dashboard Metrics State
  const [metrics, setMetrics] = useState<ImpactDashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<ImpactDashboardMetric | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    value: 0,
    target: 0,
    unit: '',
    unitEn: '',
    icon: 'Target',
    color: 'blue',
    isActive: true,
    order: 0
  });

  // Before/After Gallery State
  const [galleryItems, setGalleryItems] = useState<BeforeAfterItem[]>([]);
  const [isLoadingGallery, setIsLoadingGallery] = useState(true);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [editingGalleryItem, setEditingGalleryItem] = useState<BeforeAfterItem | null>(null);
  const [isUploadingBefore, setIsUploadingBefore] = useState(false);
  const [isUploadingAfter, setIsUploadingAfter] = useState(false);
  const [galleryFormData, setGalleryFormData] = useState({
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
    fetchMetrics();
    fetchGalleryItems();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/impact-dashboard-metrics');
      if (response.ok) {
        const data = await response.json();
        setMetrics(data);
      }
    } catch (error) {
      console.error('Error fetching metrics:', error);
      toast.error('मेट्रिक्स लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMetric ? '/api/impact-dashboard-metrics' : '/api/impact-dashboard-metrics';
      const method = editingMetric ? 'PUT' : 'POST';
      
      const body = editingMetric 
        ? { ...formData, id: editingMetric.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchMetrics();
        setIsModalOpen(false);
        setEditingMetric(null);
        resetForm();
        toast.success(editingMetric ? 'मेट्रिक अपडेट केले' : 'मेट्रिक जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving metric:', error);
      toast.error('मेट्रिक सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (metric: ImpactDashboardMetric) => {
    setEditingMetric(metric);
    setFormData({
      title: metric.title,
      titleEn: metric.titleEn,
      value: metric.value,
      target: metric.target,
      unit: metric.unit,
      unitEn: metric.unitEn,
      icon: metric.icon,
      color: metric.color,
      isActive: metric.isActive,
      order: metric.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा मेट्रिक हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/impact-dashboard-metrics?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchMetrics();
          toast.success('मेट्रिक हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting metric:', error);
        toast.error('मेट्रिक हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (metric: ImpactDashboardMetric) => {
    try {
      const response = await fetch('/api/impact-dashboard-metrics', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: metric.id,
          ...metric,
          isActive: !metric.isActive
        })
      });
      if (response.ok) {
        await fetchMetrics();
        toast.success(metric.isActive ? 'मेट्रिक निष्क्रिय केले' : 'मेट्रिक सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling metric:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      value: 0,
      target: 0,
      unit: '',
      unitEn: '',
      icon: 'Target',
      color: 'blue',
      isActive: true,
      order: 0
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Target,
      BarChart3,
      Users,
      DollarSign,
      CheckCircle
    };
    const IconComponent = icons[iconName] || Target;
    return IconComponent;
  };

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white'
    };
    return colors[color] || 'bg-gray-500 text-white';
  };

  const calculateProgress = (value: number, target: number) => {
    if (target === 0) return 0;
    return Math.round((value / target) * 100);
  };

  // Default metrics to show when none are added
  const getDefaultMetrics = (): ImpactDashboardMetric[] => [
    {
      id: 'default-1',
      title: 'एकूण प्रकल्प',
      titleEn: 'Total Projects',
      value: 6,
      target: 20,
      unit: 'प्रकल्प',
      unitEn: 'Projects',
      color: 'blue',
      icon: 'Target',
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-2',
      title: 'पूर्ण प्रकल्प',
      titleEn: 'Completed Projects',
      value: 3,
      target: 15,
      unit: 'प्रकल्प',
      unitEn: 'Projects',
      color: 'green',
      icon: 'CheckCircle',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-3',
      title: 'एकूण खर्च',
      titleEn: 'Total Expenditure',
      value: 10000000,
      target: 5000000,
      unit: '₹',
      unitEn: '₹',
      color: 'purple',
      icon: 'DollarSign',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-4',
      title: 'लाभार्थी',
      titleEn: 'Beneficiaries',
      value: 1250,
      target: 2000,
      unit: 'लोक',
      unitEn: 'People',
      color: 'orange',
      icon: 'Users',
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayMetrics = metrics.length > 0 ? metrics : getDefaultMetrics();
  const isShowingDefaults = metrics.length === 0;

  // Gallery Functions
  const fetchGalleryItems = async () => {
    try {
      const response = await fetch('/api/before-after-gallery');
      if (response.ok) {
        const data = await response.json();
        setGalleryItems(data);
      }
    } catch (error) {
      console.error('Error fetching gallery items:', error);
      toast.error('आयटम लोड करताना त्रुटी');
    } finally {
      setIsLoadingGallery(false);
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
        setGalleryFormData(prev => ({ ...prev, beforeImage: uploadData.imageUrl }));
      } else {
        setGalleryFormData(prev => ({ ...prev, afterImage: uploadData.imageUrl }));
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

  const handleGallerySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/before-after-gallery';
      const method = editingGalleryItem ? 'PUT' : 'POST';
      
      const body = editingGalleryItem 
        ? { ...galleryFormData, id: editingGalleryItem.id }
        : galleryFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchGalleryItems();
        setIsGalleryModalOpen(false);
        setEditingGalleryItem(null);
        resetGalleryForm();
        toast.success(editingGalleryItem ? 'आयटम अपडेट केले' : 'आयटम जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleGalleryEdit = (item: BeforeAfterItem) => {
    setEditingGalleryItem(item);
    setGalleryFormData({
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
    setIsGalleryModalOpen(true);
  };

  const handleGalleryDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा आयटम हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/before-after-gallery?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchGalleryItems();
          toast.success('आयटम हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting gallery item:', error);
        toast.error('आयटम हटवताना त्रुटी');
      }
    }
  };

  const handleGalleryToggleActive = async (item: BeforeAfterItem) => {
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
        await fetchGalleryItems();
        toast.success(item.isActive ? 'आयटम निष्क्रिय केले' : 'आयटम सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling gallery item:', error);
      toast.error('त्रुटी');
    }
  };

  const resetGalleryForm = () => {
    setGalleryFormData({
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

  // Default gallery items
  const getDefaultGalleryItems = (): BeforeAfterItem[] => [
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

  const displayGalleryItems = galleryItems.length > 0 ? galleryItems : getDefaultGalleryItems();
  const isShowingGalleryDefaults = galleryItems.length === 0;

  if (isLoading || isLoadingGallery) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">प्रमुख प्रकल्प आणि उपक्रम</h1>
        <p className="text-gray-600 mt-2">गावाच्या विकासासाठी चालू असलेले आणि पूर्ण झालेले प्रकल्प</p>
      </div>

      {/* Section 1: Impact Dashboard */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">प्रभाव डॅशबोर्ड (Impact Dashboard)</h2>
          <p className="text-gray-600 mt-1">गावाच्या विकासासाठी चालू असलेले आणि पूर्ण झालेले प्रकल्प</p>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button onClick={() => {
            setEditingMetric(null);
            resetForm();
            setIsModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            नवीन मेट्रिक जोडा
          </Button>
        </div>

        {/* Info message when showing defaults */}
        {isShowingDefaults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>नोंद:</strong> हे डिफॉल्ट मेट्रिक्स आहेत. तुम्ही "नवीन मेट्रिक जोडा" बटणावर क्लिक करून स्वतःचे मेट्रिक्स जोडू शकता.
            </p>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayMetrics.map((metric) => {
          const IconComponent = getIconComponent(metric.icon);
          const progress = calculateProgress(metric.value, metric.target);
          
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{metric.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{metric.titleEn}</p>
                  </div>
                  <Badge variant={metric.isActive ? "default" : "secondary"}>
                    {metric.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                      <IconComponent className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value.toLocaleString('en-IN')}
                      </div>
                      <div className="text-sm text-gray-600">{metric.unit}</div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>प्रगती</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          metric.color === 'blue' ? 'bg-blue-500' :
                          metric.color === 'green' ? 'bg-green-500' :
                          metric.color === 'purple' ? 'bg-purple-500' :
                          'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      लक्ष्य: {metric.target.toLocaleString('en-IN')} {metric.unit}
                    </div>
                  </div>

                  {!isShowingDefaults && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(metric)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleActive(metric)}
                        className={metric.isActive ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {metric.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(metric.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {isShowingDefaults && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 text-center">
                        डिफॉल्ट मेट्रिक - संपादन करण्यासाठी मेट्रिक जोडा
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
        </div>

        {/* Add/Edit Modal */}
        {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingMetric ? 'मेट्रिक संपादित करा' : 'नवीन मेट्रिक जोडा'}
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
                      placeholder="एकूण प्रकल्प"
                    />
                  </div>
                  <div>
                    <Label htmlFor="titleEn">शीर्षक (इंग्रजी) *</Label>
                    <Input
                      id="titleEn"
                      value={formData.titleEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      required
                      placeholder="Total Projects"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="value">वर्तमान मूल्य *</Label>
                    <Input
                      id="value"
                      type="number"
                      step="0.01"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="target">लक्ष्य मूल्य *</Label>
                    <Input
                      id="target"
                      type="number"
                      step="0.01"
                      value={formData.target}
                      onChange={(e) => setFormData(prev => ({ ...prev, target: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="unit">एकक (मराठी) *</Label>
                    <Input
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      required
                      placeholder="प्रकल्प, ₹, लोक"
                    />
                  </div>
                  <div>
                    <Label htmlFor="unitEn">एकक (इंग्रजी) *</Label>
                    <Input
                      id="unitEn"
                      value={formData.unitEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitEn: e.target.value }))}
                      required
                      placeholder="Projects, ₹, People"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="icon">आयकॉन</Label>
                    <select
                      id="icon"
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Target">Target</option>
                      <option value="BarChart3">Bar Chart</option>
                      <option value="Users">Users</option>
                      <option value="DollarSign">Dollar Sign</option>
                      <option value="CheckCircle">Check Circle</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="color">रंग</Label>
                    <select
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                    </select>
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
                      setEditingMetric(null);
                      resetForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">
                    {editingMetric ? 'अपडेट करा' : 'जोडा'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Section 2: Before/After Gallery */}
      <div className="space-y-6 pt-8 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">पूर्वी आणि नंतर गॅलरी</h2>
            <p className="text-gray-600 mt-1">स्लायडरद्वारे परिवर्तन दाखविणे – रस्ते, तळी, शाळा आणि इतर विकास कामे</p>
          </div>
          <Button onClick={() => {
            setEditingGalleryItem(null);
            resetGalleryForm();
            setIsGalleryModalOpen(true);
          }} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            नवीन आयटम जोडा
          </Button>
        </div>

        {/* Info message when showing defaults */}
        {isShowingGalleryDefaults && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>नोंद:</strong> हे डिफॉल्ट आयटम आहेत. तुम्ही "नवीन आयटम जोडा" बटणावर क्लिक करून स्वतःचे आयटम जोडू शकता.
            </p>
          </div>
        )}

        {/* Gallery Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayGalleryItems.map((item) => (
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

                  {!isShowingGalleryDefaults && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGalleryEdit(item)}
                        className="flex-1"
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGalleryToggleActive(item)}
                        className={item.isActive ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleGalleryDelete(item.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {isShowingGalleryDefaults && (
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
      </div>

      {/* Gallery Add/Edit Modal */}
      {isGalleryModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingGalleryItem ? 'आयटम संपादित करा' : 'नवीन आयटम जोडा'}
              </h2>
              
              <form onSubmit={handleGallerySubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gallery-title">शीर्षक (मराठी) *</Label>
                    <Input
                      id="gallery-title"
                      value={galleryFormData.title}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                      placeholder="रस्ते दुरुस्ती प्रकल्प"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-titleEn">शीर्षक (इंग्रजी) *</Label>
                    <Input
                      id="gallery-titleEn"
                      value={galleryFormData.titleEn}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, titleEn: e.target.value }))}
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
                      {galleryFormData.beforeImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={galleryFormData.beforeImage}
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
                      {galleryFormData.afterImage && (
                        <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <Image
                            src={galleryFormData.afterImage}
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
                    <Label htmlFor="gallery-description">वर्णन (मराठी) *</Label>
                    <Textarea
                      id="gallery-description"
                      value={galleryFormData.description}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                      rows={3}
                      placeholder="गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-descriptionEn">वर्णन (इंग्रजी) *</Label>
                    <Textarea
                      id="gallery-descriptionEn"
                      value={galleryFormData.descriptionEn}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      required
                      rows={3}
                      placeholder="Repair and improvement of main roads in the village"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gallery-impact">परिणाम (मराठी) *</Label>
                    <Textarea
                      id="gallery-impact"
                      value={galleryFormData.impact}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, impact: e.target.value }))}
                      required
                      rows={3}
                      placeholder="रस्ते सुधारले, वाहतूक सुगम झाली"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-impactEn">परिणाम (इंग्रजी) *</Label>
                    <Textarea
                      id="gallery-impactEn"
                      value={galleryFormData.impactEn}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, impactEn: e.target.value }))}
                      required
                      rows={3}
                      placeholder="Roads improved, traffic became smoother"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gallery-year">वर्ष *</Label>
                    <Input
                      id="gallery-year"
                      value={galleryFormData.year}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, year: e.target.value }))}
                      required
                      placeholder="२०२३"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-cost">खर्च *</Label>
                    <Input
                      id="gallery-cost"
                      value={galleryFormData.cost}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, cost: e.target.value }))}
                      required
                      placeholder="₹२५ लाख"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="gallery-category">वर्ग (मराठी) *</Label>
                    <Input
                      id="gallery-category"
                      value={galleryFormData.category}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, category: e.target.value }))}
                      required
                      placeholder="पायाभूत सुविधा"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gallery-categoryEn">वर्ग (इंग्रजी) *</Label>
                    <Input
                      id="gallery-categoryEn"
                      value={galleryFormData.categoryEn}
                      onChange={(e) => setGalleryFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                      required
                      placeholder="Infrastructure"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gallery-order">क्रम</Label>
                  <Input
                    id="gallery-order"
                    type="number"
                    value={galleryFormData.order}
                    onChange={(e) => setGalleryFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gallery-isActive"
                    checked={galleryFormData.isActive}
                    onChange={(e) => setGalleryFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="gallery-isActive" className="cursor-pointer">सक्रिय</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsGalleryModalOpen(false);
                      setEditingGalleryItem(null);
                      resetGalleryForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit" disabled={!galleryFormData.beforeImage || !galleryFormData.afterImage}>
                    {editingGalleryItem ? 'अपडेट करा' : 'जोडा'}
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

