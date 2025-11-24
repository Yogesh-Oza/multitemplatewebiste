'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Shield,
  BookOpen,
  Zap,
  GraduationCap,
  Heart,
  Briefcase,
  Users,
  Leaf,
  Award,
  Trash2,
  Edit,
  Plus,
  PauseCircle,
  Activity,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

type SankalpStatus = 'completed' | 'in-progress' | 'pending';
type SankalpPriority = 'high' | 'medium' | 'low';

interface SankalpItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  currentValue: number;
  targetValue: number;
  unit: string;
  icon: string;
  color: string;
  status: SankalpStatus;
  priority: SankalpPriority;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

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

export default function SankalpTrackerAdminPage() {
  const [items, setItems] = useState<SankalpItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SankalpItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    currentValue: 0,
    targetValue: 100,
    unit: '%',
    icon: 'Shield',
    color: 'from-green-500 to-emerald-600',
    status: 'in-progress' as SankalpStatus,
    priority: 'high' as SankalpPriority,
    order: 0,
    isActive: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/sankalp-items?includeInactive=true');
      if (!response.ok) {
        throw new Error('Failed to fetch Sankalp items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error(error);
      toast.error('संकल्प माहिती लोड करताना त्रुटी आली');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
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
    setEditingItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = editingItem ? 'PUT' : 'POST';
      const url = '/api/sankalp-items';
      const body = editingItem ? { ...formData, id: editingItem.id } : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Failed to save Sankalp item');
      }

      await fetchItems();
      setIsModalOpen(false);
      resetForm();
      toast.success(editingItem ? 'संकल्प अपडेट केला' : 'नवीन संकल्प जोडला');
    } catch (error) {
      console.error(error);
      toast.error('माहिती सेव्ह करताना त्रुटी आली');
    }
  };

  const handleEdit = (item: SankalpItem) => {
    setEditingItem(item);
    setFormData({
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
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
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
      await fetchItems();
    } catch (error) {
      console.error(error);
      toast.error('संकल्प हटवताना त्रुटी आली');
    }
  };

  const handleToggleActive = async (item: SankalpItem) => {
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
      await fetchItems();
    } catch (error) {
      console.error(error);
      toast.error('स्थिती बदलताना त्रुटी आली');
    }
  };

  const stats = useMemo(() => {
    if (items.length === 0) {
      return {
        overallProgress: 0,
        completed: 0,
        inProgress: 0,
        highPriority: 0,
      };
    }

    const activeItems = items.filter((item) => item.isActive);
    const overallProgress =
      activeItems.length > 0
        ? Math.round(
            activeItems.reduce(
              (sum, item) => sum + (item.currentValue / item.targetValue) * 100,
              0
            ) / activeItems.length
          )
        : 0;

    return {
      overallProgress,
      completed: activeItems.filter((item) => item.status === 'completed').length,
      inProgress: activeItems.filter((item) => item.status === 'in-progress').length,
      highPriority: activeItems.filter((item) => item.priority === 'high').length,
    };
  }, [items]);

  const getStatusBadge = (status: SankalpStatus) => {
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

  const getPriorityBadge = (priority: SankalpPriority) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">उच्च</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">मध्यम</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">कमी</Badge>;
    }
  };

  const renderIcon = (iconName: string) => {
    const icon = iconOptions.find((option) => option.value === iconName);
    if (!icon) {
      return <Target className="h-6 w-6" />;
    }
    const IconComponent = icon.icon;
    return <IconComponent className="h-6 w-6" />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">संकल्प ट्रॅकर व्यवस्थापन</h1>
          <p className="text-gray-600">गावाचा वचन ट्रॅकर (10 बिंदू) पूर्णपणे व्यवस्थापित करा</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
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
                <p className="text-3xl font-bold">{stats.overallProgress}%</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.inProgress}</p>
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
                <p className="text-3xl font-bold text-gray-900">{stats.highPriority}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id} className="border-0 shadow-lg bg-white/90 backdrop-blur">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-r ${item.color} text-white`}>
                  {renderIcon(item.icon)}
                </div>
                <div className="flex gap-2 items-center">
                  {getStatusBadge(item.status)}
                  {getPriorityBadge(item.priority)}
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

              <div className="flex items-center gap-2 pt-2 border-t">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(item)}>
                  <Edit className="h-4 w-4 mr-1" />
                  संपादित
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(item)}
                  className={item.isActive ? 'text-yellow-600' : 'text-green-600'}
                >
                  {item.isActive ? 'निष्क्रिय' : 'सक्रिय'}
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(item.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingItem ? 'संकल्प संपादित करा' : 'नवीन संकल्प जोडा'}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    १० बिंदूंच्या गाव वचन ट्रॅकर मध्ये नोंद/अपडेट करण्यासाठी खालील माहिती भरा.
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  बंद करा
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी) *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Title (English) *</Label>
                    <Input
                      value={formData.titleEn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>वर्णन (मराठी) *</Label>
                    <Textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>Description (English) *</Label>
                    <Textarea
                      rows={3}
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <Label>चालू मूल्य *</Label>
                    <Input
                      type="number"
                      value={formData.currentValue}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, currentValue: parseFloat(e.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>लक्ष्य मूल्य *</Label>
                    <Input
                      type="number"
                      value={formData.targetValue}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, targetValue: parseFloat(e.target.value) || 0 }))
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>एकक *</Label>
                    <Input
                      value={formData.unit}
                      onChange={(e) => setFormData((prev) => ({ ...prev, unit: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label>क्रम</Label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData((prev) => ({ ...prev, order: parseInt(e.target.value, 10) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label>स्थिती</Label>
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, status: e.target.value as SankalpStatus }))
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
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, priority: e.target.value as SankalpPriority }))
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
                      value={formData.isActive ? 'true' : 'false'}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, isActive: e.target.value === 'true' }))
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
                      value={formData.icon}
                      onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}
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
                      value={formData.color}
                      onChange={(e) => setFormData((prev) => ({ ...prev, color: e.target.value }))}
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
                      setIsModalOpen(false);
                      resetForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">{editingItem ? 'अपडेट' : 'जतन करा'}</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

