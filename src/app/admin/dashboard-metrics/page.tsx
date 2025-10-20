'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, BarChart3, TrendingUp, Users, Droplets, Zap, TreePine, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardMetric {
  id: string;
  title: string;
  titleEn: string;
  value: number;
  unit: string;
  unitEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  categoryEn: string;
  icon: string;
  color: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardMetricsAdminPage() {
  const [metrics, setMetrics] = useState<DashboardMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMetric, setEditingMetric] = useState<DashboardMetric | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    value: 0,
    unit: '',
    unitEn: '',
    description: '',
    descriptionEn: '',
    category: '',
    categoryEn: '',
    icon: 'BarChart3',
    color: 'blue',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('/api/dashboard-metrics');
      const data = await response.json();
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingMetric ? `/api/dashboard-metrics/${editingMetric.id}` : '/api/dashboard-metrics';
      const method = editingMetric ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchMetrics();
        setIsModalOpen(false);
        setEditingMetric(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving metric:', error);
    }
  };

  const handleEdit = (metric: DashboardMetric) => {
    setEditingMetric(metric);
    setFormData({
      title: metric.title,
      titleEn: metric.titleEn,
      value: metric.value,
      unit: metric.unit,
      unitEn: metric.unitEn,
      description: metric.description,
      descriptionEn: metric.descriptionEn,
      category: metric.category,
      categoryEn: metric.categoryEn,
      icon: metric.icon,
      color: metric.color,
      isActive: metric.isActive,
      order: metric.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this metric?')) {
      try {
        await fetch(`/api/dashboard-metrics/${id}`, { method: 'DELETE' });
        await fetchMetrics();
      } catch (error) {
        console.error('Error deleting metric:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      value: 0,
      unit: '',
      unitEn: '',
      description: '',
      descriptionEn: '',
      category: '',
      categoryEn: '',
      icon: 'BarChart3',
      color: 'blue',
      isActive: true,
      order: 0
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons = {
      BarChart3,
      TrendingUp,
      Users,
      Droplets,
      Zap,
      TreePine,
      GraduationCap
    };
    const IconComponent = icons[iconName as keyof typeof icons] || BarChart3;
    return IconComponent;
  };

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      red: 'bg-red-500 text-white',
      yellow: 'bg-yellow-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      indigo: 'bg-indigo-500 text-white',
      pink: 'bg-pink-500 text-white'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500 text-white';
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'लोकसंख्या': 'bg-blue-100 text-blue-800',
      'साक्षरता': 'bg-green-100 text-green-800',
      'स्वच्छता': 'bg-yellow-100 text-yellow-800',
      'पाणीपुरवठा': 'bg-blue-100 text-blue-800',
      'वीजपुरवठा': 'bg-yellow-100 text-yellow-800',
      'रस्ते': 'bg-orange-100 text-orange-800',
      'पर्यावरण': 'bg-green-100 text-green-800',
      'सामाजिक': 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Metrics</h1>
          <p className="text-gray-600">Manage KPIs and progress indicators for the dashboard</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Metric
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric) => {
          const IconComponent = getIconComponent(metric.icon);
          return (
            <Card key={metric.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{metric.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{metric.titleEn}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(metric.category)}>
                      {metric.category}
                    </Badge>
                    {metric.isActive ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                        Inactive
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(metric.color)}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-gray-900">
                        {metric.value.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">{metric.unit}</div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {metric.description}
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(metric)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
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
                {editingMetric ? 'Edit Metric' : 'Add New Metric'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (Marathi) *
                    </label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title (English) *
                    </label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Value *
                    </label>
                    <Input
                      type="number"
                      value={formData.value}
                      onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit (Marathi) *
                    </label>
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                      placeholder="e.g., %, लोक, हेक्टर"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unit (English) *
                    </label>
                    <Input
                      value={formData.unitEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, unitEn: e.target.value }))}
                      placeholder="e.g., %, people, hectares"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Marathi) *
                    </label>
                    <Input
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English) *
                    </label>
                    <Input
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (Marathi) *
                    </label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="e.g., लोकसंख्या, साक्षरता"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (English) *
                    </label>
                    <Input
                      value={formData.categoryEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, categoryEn: e.target.value }))}
                      placeholder="e.g., Population, Literacy"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon
                    </label>
                    <select
                      value={formData.icon}
                      onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BarChart3">Bar Chart</option>
                      <option value="TrendingUp">Trending Up</option>
                      <option value="Users">Users</option>
                      <option value="Droplets">Droplets</option>
                      <option value="Zap">Zap</option>
                      <option value="TreePine">Tree Pine</option>
                      <option value="GraduationCap">Graduation Cap</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Color
                    </label>
                    <select
                      value={formData.color}
                      onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="blue">Blue</option>
                      <option value="green">Green</option>
                      <option value="red">Red</option>
                      <option value="yellow">Yellow</option>
                      <option value="purple">Purple</option>
                      <option value="orange">Orange</option>
                      <option value="indigo">Indigo</option>
                      <option value="pink">Pink</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
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
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingMetric ? 'Update Metric' : 'Add Metric'}
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
