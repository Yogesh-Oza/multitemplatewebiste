'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Edit, Trash2, Target, BarChart3, Users, DollarSign, CheckCircle, Upload, Eye, EyeOff, Image as ImageIcon, Calendar, TrendingUp, Clock, AlertCircle, Shield, BookOpen, Zap, GraduationCap, Heart, Briefcase, Leaf, Award, PauseCircle, Activity, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Image from 'next/image';
import { getDemoImpactMetrics, getDemoBeforeAfterItems, getDemoProjects, getDemoSankalpItems } from '@/lib/projects-demo-data';

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

  // Projects State
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any | null>(null);
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    startDate: '',
    endDate: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    budget: '',
    category: '',
    categoryEn: '',
    isFeatured: false,
    order: 0,
    impactMetrics: [{ label: '', value: '' }],
    photosBefore: [] as string[],
    photosAfter: [] as string[]
  });

  // Sankalp Tracker State
  const [sankalpItems, setSankalpItems] = useState<any[]>([]);
  const [isLoadingSankalp, setIsLoadingSankalp] = useState(true);
  const [isSankalpModalOpen, setIsSankalpModalOpen] = useState(false);
  const [editingSankalpItem, setEditingSankalpItem] = useState<any | null>(null);
  const [sankalpFormData, setSankalpFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    currentValue: 0,
    targetValue: 100,
    unit: '%',
    icon: 'Shield',
    color: 'from-green-500 to-emerald-600',
    status: 'in-progress' as 'completed' | 'in-progress' | 'pending',
    priority: 'high' as 'high' | 'medium' | 'low',
    order: 0,
    isActive: true,
  });

  // Tab state
  const [activeTab, setActiveTab] = useState('metrics');

  // Icon options for Sankalp
  const iconOptions = [
    { label: 'Shield', value: 'Shield', icon: Shield },
    { label: 'Book', value: 'BookOpen', icon: BookOpen },
    { label: 'Zap', value: 'Zap', icon: Zap },
    { label: 'Graduation Cap', value: 'GraduationCap', icon: GraduationCap },
    { label: 'Heart', value: 'Heart', icon: Heart },
    { label: 'Briefcase', value: 'Briefcase', icon: Briefcase },
    { label: 'Users', value: 'Users', icon: Users },
    { label: 'Trending Up', value: 'TrendingUp', icon: TrendingUp },
    { label: 'Leaf', value: 'Leaf', icon: Leaf },
    { label: 'Award', value: 'Award', icon: Award },
    { label: 'Target', value: 'Target', icon: Target },
  ];

  const gradientOptions = [
    { label: 'Green', value: 'from-green-500 to-emerald-600' },
    { label: 'Blue', value: 'from-blue-500 to-indigo-600' },
    { label: 'Orange', value: 'from-yellow-500 to-orange-600' },
    { label: 'Purple', value: 'from-purple-500 to-pink-600' },
    { label: 'Red', value: 'from-red-500 to-pink-600' },
    { label: 'Indigo', value: 'from-indigo-500 to-blue-600' },
    { label: 'Pink', value: 'from-pink-500 to-rose-600' },
    { label: 'Cyan', value: 'from-cyan-500 to-blue-600' },
    { label: 'Teal', value: 'from-green-600 to-teal-600' },
    { label: 'Amber', value: 'from-orange-500 to-red-600' },
  ];

  useEffect(() => {
    fetchMetrics();
    fetchGalleryItems();
    fetchProjects();
    fetchSankalpItems();
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

  const displayMetrics = metrics.length > 0 ? metrics : getDemoImpactMetrics();
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

  const displayGalleryItems = galleryItems.length > 0 ? galleryItems : getDemoBeforeAfterItems();
  const isShowingGalleryDefaults = galleryItems.length === 0;

  // Projects Functions
  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('प्रकल्प लोड करताना त्रुटी');
    } finally {
      setIsLoadingProjects(false);
    }
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingProject ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectFormData,
          budget: projectFormData.budget ? parseFloat(projectFormData.budget) : null,
          impactMetrics: projectFormData.impactMetrics.filter(m => m.label && m.value),
          photosBefore: projectFormData.photosBefore,
          photosAfter: projectFormData.photosAfter
        })
      });

      if (response.ok) {
        await fetchProjects();
        setIsProjectModalOpen(false);
        setEditingProject(null);
        resetProjectForm();
        toast.success(editingProject ? 'प्रकल्प अपडेट केले' : 'प्रकल्प जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error('प्रकल्प सेव्ह करताना त्रुटी');
    }
  };

  const handleProjectEdit = (project: any) => {
    setEditingProject(project);
    setProjectFormData({
      title: project.title,
      titleEn: project.titleEn,
      description: project.description,
      descriptionEn: project.descriptionEn,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate ? project.endDate.split('T')[0] : '',
      status: project.status,
      budget: project.budget?.toString() || '',
      category: project.category,
      categoryEn: project.categoryEn,
      isFeatured: project.isFeatured,
      order: project.order,
      impactMetrics: project.impactMetrics && project.impactMetrics.length > 0 ? project.impactMetrics : [{ label: '', value: '' }],
      photosBefore: project.photosBefore || [],
      photosAfter: project.photosAfter || []
    });
    setIsProjectModalOpen(true);
  };

  const handleProjectDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा प्रकल्प हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchProjects();
          toast.success('प्रकल्प हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        toast.error('प्रकल्प हटवताना त्रुटी');
      }
    }
  };

  const resetProjectForm = () => {
    setProjectFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      startDate: '',
      endDate: '',
      status: 'upcoming',
      budget: '',
      category: '',
      categoryEn: '',
      isFeatured: false,
      order: 0,
      impactMetrics: [{ label: '', value: '' }],
      photosBefore: [],
      photosAfter: []
    });
  };

  const addImpactMetric = () => {
    setProjectFormData(prev => ({
      ...prev,
      impactMetrics: [...prev.impactMetrics, { label: '', value: '' }]
    }));
  };

  const updateImpactMetric = (index: number, field: 'label' | 'value', value: string) => {
    setProjectFormData(prev => ({
      ...prev,
      impactMetrics: prev.impactMetrics.map((metric, i) => 
        i === index ? { ...metric, [field]: value } : metric
      )
    }));
  };

  const removeImpactMetric = (index: number) => {
    setProjectFormData(prev => ({
      ...prev,
      impactMetrics: prev.impactMetrics.filter((_, i) => i !== index)
    }));
  };

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ongoing':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'upcoming':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getProjectStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'ongoing':
        return 'bg-blue-100 text-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const displayProjects = projects.length > 0 ? projects : getDemoProjects();
  const isShowingProjectDefaults = projects.length === 0;

  // Sankalp Tracker Functions
  const fetchSankalpItems = async () => {
    try {
      const response = await fetch('/api/sankalp-items?includeInactive=true');
      if (!response.ok) {
        throw new Error('Failed to fetch Sankalp items');
      }
      const data = await response.json();
      setSankalpItems(data);
    } catch (error) {
      console.error(error);
      toast.error('संकल्प माहिती लोड करताना त्रुटी आली');
    } finally {
      setIsLoadingSankalp(false);
    }
  };

  const handleSankalpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingSankalpItem ? 'PUT' : 'POST';
      const url = '/api/sankalp-items';
      const body = editingSankalpItem ? { ...sankalpFormData, id: editingSankalpItem.id } : sankalpFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save Sankalp item');
      }

      await fetchSankalpItems();
      setIsSankalpModalOpen(false);
      resetSankalpForm();
      toast.success(editingSankalpItem ? 'संकल्प अपडेट केला' : 'नवीन संकल्प जोडला');
    } catch (error) {
      console.error(error);
      toast.error('माहिती सेव्ह करताना त्रुटी आली');
    }
  };

  const handleSankalpEdit = (item: any) => {
    setEditingSankalpItem(item);
    setSankalpFormData({
      title: item.title,
      titleEn: item.titleEn,
      description: item.description,
      descriptionEn: item.descriptionEn,
      currentValue: item.currentValue,
      targetValue: item.targetValue,
      unit: item.unit,
      icon: item.icon,
      color: item.color,
      status: item.status,
      priority: item.priority,
      order: item.order,
      isActive: item.isActive,
    });
    setIsSankalpModalOpen(true);
  };

  const handleSankalpDelete = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे का? हा संकल्प कायमचा हटेल.')) {
      return;
    }

    try {
      const response = await fetch(`/api/sankalp-items?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete Sankalp item');
      }

      toast.success('संकल्प हटवला');
      await fetchSankalpItems();
    } catch (error) {
      console.error(error);
      toast.error('संकल्प हटवताना त्रुटी आली');
    }
  };

  const handleSankalpToggleActive = async (item: any) => {
    try {
      const response = await fetch('/api/sankalp-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle Sankalp item');
      }

      toast.success(item.isActive ? 'संकल्प निष्क्रिय केला' : 'संकल्प सक्रिय केला');
      await fetchSankalpItems();
    } catch (error) {
      console.error(error);
      toast.error('स्थिती बदलताना त्रुटी आली');
    }
  };

  const resetSankalpForm = () => {
    setSankalpFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      currentValue: 0,
      targetValue: 100,
      unit: '%',
      icon: 'Shield',
      color: 'from-green-500 to-emerald-600',
      status: 'in-progress',
      priority: 'high',
      order: 0,
      isActive: true,
    });
    setEditingSankalpItem(null);
  };

  const renderSankalpIcon = (iconName: string) => {
    const icon = iconOptions.find((option) => option.value === iconName);
    if (!icon) {
      return <Target className="h-6 w-6" />;
    }
    const IconComponent = icon.icon;
    return <IconComponent className="h-6 w-6" />;
  };

  const getSankalpStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-100 text-green-800 border border-green-200 flex items-center gap-1">
            <CheckCircle className="h-4 w-4" />
            पूर्ण
          </Badge>
        );
      case 'in-progress':
        return (
          <Badge className="bg-blue-100 text-blue-800 border border-blue-200 flex items-center gap-1">
            <Clock className="h-4 w-4" />
            चालू
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border border-gray-200 flex items-center gap-1">
            <PauseCircle className="h-4 w-4" />
            प्रलंबित
          </Badge>
        );
    }
  };

  const getSankalpPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">उच्च</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">मध्यम</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">कमी</Badge>;
    }
  };

  const sankalpStats = useMemo(() => {
    if (sankalpItems.length === 0) {
      return {
        overallProgress: 0,
        completed: 0,
        inProgress: 0,
        highPriority: 0,
      };
    }

    const activeItems = sankalpItems.filter((item) => item.isActive);
    const overallProgress =
      activeItems.length > 0
        ? Math.round(
            activeItems.reduce(
              (sum: number, item: any) => sum + (item.currentValue / item.targetValue) * 100,
              0
            ) / activeItems.length
          )
        : 0;

    return {
      overallProgress,
      completed: activeItems.filter((item: any) => item.status === 'completed').length,
      inProgress: activeItems.filter((item: any) => item.status === 'in-progress').length,
      highPriority: activeItems.filter((item: any) => item.priority === 'high').length,
    };
  }, [sankalpItems]);

  const displaySankalpItems = sankalpItems.length > 0 ? sankalpItems : getDemoSankalpItems();
  const isShowingSankalpDefaults = sankalpItems.length === 0;

  if (isLoading || isLoadingGallery || isLoadingProjects || isLoadingSankalp) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">प्रमुख प्रकल्प आणि उपक्रम</h1>
        <p className="text-gray-600 mt-2">गावाच्या विकासासाठी चालू असलेले आणि पूर्ण झालेले प्रकल्प</p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="metrics">प्रभाव डॅशबोर्ड</TabsTrigger>
          <TabsTrigger value="gallery">पूर्वी/नंतर गॅलरी</TabsTrigger>
          <TabsTrigger value="projects">प्रकल्प</TabsTrigger>
          <TabsTrigger value="sankalp">संकल्प ट्रॅकर</TabsTrigger>
        </TabsList>

        {/* Tab 1: Impact Dashboard Metrics */}
        <TabsContent value="metrics" className="space-y-6 mt-6">
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
        </TabsContent>

        {/* Tab 2: Before/After Gallery */}
        <TabsContent value="gallery" className="space-y-6 mt-6">
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
        </TabsContent>

        {/* Tab 3: Projects */}
        <TabsContent value="projects" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">प्रकल्प व्यवस्थापन</h2>
              <p className="text-gray-600 mt-1">विकास प्रकल्प आणि उपक्रम व्यवस्थापन</p>
            </div>
            <Button onClick={() => {
              setEditingProject(null);
              resetProjectForm();
              setIsProjectModalOpen(true);
            }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              नवीन प्रकल्प जोडा
            </Button>
          </div>

          {isShowingProjectDefaults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>नोंद:</strong> हे डिफॉल्ट प्रकल्प आहेत. तुम्ही "नवीन प्रकल्प जोडा" बटणावर क्लिक करून स्वतःचे प्रकल्प जोडू शकता.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project: any) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{project.titleEn}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.isFeatured && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Star className="h-3 w-3 mr-1" />
                          प्रमुख
                        </Badge>
                      )}
                      <Badge className={getProjectStatusColor(project.status)}>
                        {getProjectStatusIcon(project.status)}
                        <span className="ml-1">
                          {project.status === 'completed' ? 'पूर्ण' : 
                           project.status === 'ongoing' ? 'चालू' : 'आगामी'}
                        </span>
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {project.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(project.startDate).toLocaleDateString('mr-IN')}</span>
                      </div>
                      {project.budget && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          <span>₹{project.budget.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                    </div>

                    {!isShowingProjectDefaults && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProjectEdit(project)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादित
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProjectDelete(project.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {isShowingProjectDefaults && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 text-center">
                          डिफॉल्ट प्रकल्प - संपादन करण्यासाठी प्रकल्प जोडा
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Project Add/Edit Modal */}
          {isProjectModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingProject ? 'प्रकल्प संपादित करा' : 'नवीन प्रकल्प जोडा'}
                  </h2>
                  
                  <form onSubmit={handleProjectSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>शीर्षक (मराठी) *</Label>
                        <Input
                          value={projectFormData.title}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>शीर्षक (इंग्रजी) *</Label>
                        <Input
                          value={projectFormData.titleEn}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>वर्णन (मराठी) *</Label>
                        <Textarea
                          value={projectFormData.description}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          required
                        />
                      </div>
                      <div>
                        <Label>वर्णन (इंग्रजी) *</Label>
                        <Textarea
                          value={projectFormData.descriptionEn}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                          rows={3}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>सुरुवातीची तारीख *</Label>
                        <Input
                          type="date"
                          value={projectFormData.startDate}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, startDate: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>समाप्तीची तारीख</Label>
                        <Input
                          type="date"
                          value={projectFormData.endDate}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>स्थिती *</Label>
                        <Select
                          value={projectFormData.status}
                          onValueChange={(value: 'upcoming' | 'ongoing' | 'completed') => 
                            setProjectFormData(prev => ({ ...prev, status: value }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="upcoming">आगामी</SelectItem>
                            <SelectItem value="ongoing">चालू</SelectItem>
                            <SelectItem value="completed">पूर्ण</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>बजेट (₹)</Label>
                        <Input
                          type="number"
                          value={projectFormData.budget}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, budget: e.target.value }))}
                          placeholder="बजेट रक्कम"
                        />
                      </div>
                      <div>
                        <Label>वर्ग (मराठी) *</Label>
                        <Input
                          value={projectFormData.category}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, category: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>वर्ग (इंग्रजी) *</Label>
                        <Input
                          value={projectFormData.categoryEn}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={projectFormData.isFeatured}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                        />
                        <span className="text-sm font-medium text-gray-700">प्रमुख प्रकल्प</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <Label>क्रम:</Label>
                        <Input
                          type="number"
                          value={projectFormData.order}
                          onChange={(e) => setProjectFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                          className="w-20"
                        />
                      </div>
                    </div>

                    {/* Impact Metrics */}
                    <div>
                      <Label>परिणाम मेट्रिक्स</Label>
                      <div className="space-y-3">
                        {projectFormData.impactMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Input
                              placeholder="मेट्रिक लेबल (उदा., लाभार्थी)"
                              value={metric.label}
                              onChange={(e) => updateImpactMetric(index, 'label', e.target.value)}
                              className="flex-1"
                            />
                            <Input
                              placeholder="मूल्य"
                              value={metric.value}
                              onChange={(e) => updateImpactMetric(index, 'value', e.target.value)}
                              className="w-32"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeImpactMetric(index)}
                              disabled={projectFormData.impactMetrics.length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addImpactMetric}
                        >
                          मेट्रिक जोडा
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsProjectModalOpen(false);
                          setEditingProject(null);
                          resetProjectForm();
                        }}
                      >
                        रद्द करा
                      </Button>
                      <Button type="submit">
                        {editingProject ? 'अपडेट करा' : 'जोडा'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </TabsContent>

        {/* Tab 4: Sankalp Tracker */}
        <TabsContent value="sankalp" className="space-y-6 mt-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">संकल्प ट्रॅकर व्यवस्थापन</h2>
              <p className="text-gray-600 mt-1">गावाचा वचन ट्रॅकर (10 बिंदू) पूर्णपणे व्यवस्थापित करा</p>
            </div>
            <Button
              onClick={() => {
                resetSankalpForm();
                setIsSankalpModalOpen(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              नवीन संकल्प जोडा
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8" />
                  <div>
                    <p className="text-sm text-indigo-100">एकूण प्रगती</p>
                    <p className="text-3xl font-bold">{sankalpStats.overallProgress}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">पूर्ण संकल्प</p>
                    <p className="text-3xl font-bold text-gray-900">{sankalpStats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-500">चालू संकल्प</p>
                    <p className="text-3xl font-bold text-gray-900">{sankalpStats.inProgress}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-500">उच्च प्राधान्य</p>
                    <p className="text-3xl font-bold text-gray-900">{sankalpStats.highPriority}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {isShowingSankalpDefaults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>नोंद:</strong> हे डिफॉल्ट संकल्प आहेत. तुम्ही "नवीन संकल्प जोडा" बटणावर क्लिक करून स्वतःचे संकल्प जोडू शकता.
              </p>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displaySankalpItems.map((item: any) => (
              <Card key={item.id} className="border-0 shadow-lg bg-white/90 backdrop-blur">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white`}>
                      {renderSankalpIcon(item.icon)}
                    </div>
                    <div className="flex gap-2 items-center">
                      {getSankalpStatusBadge(item.status)}
                      {getSankalpPriorityBadge(item.priority)}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500 italic">{item.titleEn}</p>
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>

                  <div>
                    <div className="flex justify-between text-sm font-medium mb-1">
                      <span>प्रगती</span>
                      <span>
                        {item.currentValue}
                        {item.unit} / {item.targetValue}
                        {item.unit}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r ${item.color}`}
                        style={{
                          width: `${Math.min((item.currentValue / item.targetValue) * 100, 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>क्रम: {item.order}</span>
                    <span>{item.isActive ? 'सक्रिय' : 'निष्क्रिय'}</span>
                  </div>

                  {!isShowingSankalpDefaults && (
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => handleSankalpEdit(item)}>
                        <Edit className="h-4 w-4 mr-1" />
                        संपादित
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSankalpToggleActive(item)}
                        className={item.isActive ? 'text-yellow-600' : 'text-green-600'}
                      >
                        {item.isActive ? 'निष्क्रिय' : 'सक्रिय'}
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleSankalpDelete(item.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                  {isShowingSankalpDefaults && (
                    <div className="pt-2 border-t">
                      <p className="text-xs text-gray-500 text-center">
                        डिफॉल्ट संकल्प - संपादन करण्यासाठी संकल्प जोडा
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sankalp Modal */}
          {isSankalpModalOpen && (
            <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {editingSankalpItem ? 'संकल्प संपादित करा' : 'नवीन संकल्प जोडा'}
                      </h2>
                      <p className="text-gray-500 text-sm">
                        १० बिंदूंच्या गाव वचन ट्रॅकर मध्ये नोंद/अपडेट करण्यासाठी खालील माहिती भरा.
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsSankalpModalOpen(false);
                        resetSankalpForm();
                      }}
                    >
                      बंद करा
                    </Button>
                  </div>

                  <form onSubmit={handleSankalpSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>शीर्षक (मराठी) *</Label>
                        <Input
                          value={sankalpFormData.title}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, title: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>Title (English) *</Label>
                        <Input
                          value={sankalpFormData.titleEn}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, titleEn: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>वर्णन (मराठी) *</Label>
                        <Textarea
                          rows={3}
                          value={sankalpFormData.description}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, description: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>Description (English) *</Label>
                        <Textarea
                          rows={3}
                          value={sankalpFormData.descriptionEn}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div>
                        <Label>चालू मूल्य *</Label>
                        <Input
                          type="number"
                          value={sankalpFormData.currentValue}
                          onChange={(e) =>
                            setSankalpFormData((prev) => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>लक्ष्य मूल्य *</Label>
                        <Input
                          type="number"
                          value={sankalpFormData.targetValue}
                          onChange={(e) =>
                            setSankalpFormData((prev) => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label>एकक *</Label>
                        <Input
                          value={sankalpFormData.unit}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, unit: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label>क्रम</Label>
                        <Input
                          type="number"
                          value={sankalpFormData.order}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label>स्थिती</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={sankalpFormData.status}
                          onChange={(e) =>
                            setSankalpFormData((prev) => ({ ...prev, status: e.target.value as 'completed' | 'in-progress' | 'pending' }))
                          }
                        >
                          <option value="in-progress">चालू</option>
                          <option value="completed">पूर्ण</option>
                          <option value="pending">प्रलंबित</option>
                        </select>
                      </div>
                      <div>
                        <Label>प्राधान्य</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={sankalpFormData.priority}
                          onChange={(e) =>
                            setSankalpFormData((prev) => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))
                          }
                        >
                          <option value="high">उच्च</option>
                          <option value="medium">मध्यम</option>
                          <option value="low">कमी</option>
                        </select>
                      </div>
                      <div>
                        <Label>स्थिती (Active)</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={sankalpFormData.isActive ? 'true' : 'false'}
                          onChange={(e) =>
                            setSankalpFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }))
                          }
                        >
                          <option value="true">सक्रिय</option>
                          <option value="false">निष्क्रिय</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label>आयकॉन</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={sankalpFormData.icon}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, icon: e.target.value }))}
                        >
                          {iconOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label>ग्रेडिएंट रंग</Label>
                        <select
                          className="w-full px-3 py-2 border rounded-md"
                          value={sankalpFormData.color}
                          onChange={(e) => setSankalpFormData((prev) => ({ ...prev, color: e.target.value }))}
                        >
                          {gradientOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsSankalpModalOpen(false);
                          resetSankalpForm();
                        }}
                      >
                        रद्द करा
                      </Button>
                      <Button type="submit">{editingSankalpItem ? 'अपडेट' : 'जतन करा'}</Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

