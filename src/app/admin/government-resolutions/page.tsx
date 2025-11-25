'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, FileText, Calendar, Building, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { GOVERNMENT_RESOLUTION_DEMO_DATA } from '@/lib/demo-government-resolutions';

interface GovernmentResolution {
  id: string;
  title: string;
  titleEn: string;
  number: string;
  date: string;
  department: string;
  departmentEn: string;
  fileUrl: string;
  category: string;
  categoryEn: string;
  priority: string;
  priorityEn: string;
  description: string;
  descriptionEn: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export default function GovernmentResolutionsAdminPage() {
  const [resolutions, setResolutions] = useState<GovernmentResolution[]>([]);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingResolution, setEditingResolution] = useState<GovernmentResolution | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    number: '',
    date: '',
    department: '',
    departmentEn: '',
    fileUrl: '',
    category: '',
    categoryEn: '',
    priority: 'मध्यम',
    priorityEn: 'Medium',
    description: '',
    descriptionEn: '',
    isActive: true,
    order: 0
  });

  useEffect(() => {
    fetchResolutions();
  }, []);

  const fetchResolutions = async () => {
    try {
      const response = await fetch('/api/government-resolutions?includeInactive=true&limit=100');
      if (response.ok) {
        const data = await response.json();
        const useDemoData = !data || data.length === 0;
        setIsDemoMode(useDemoData);
        setResolutions(useDemoData ? (GOVERNMENT_RESOLUTION_DEMO_DATA as GovernmentResolution[]) : data);
      } else {
        toast.error('Failed to fetch resolutions');
      }
    } catch (error) {
      console.error('Error fetching resolutions:', error);
      toast.error('Failed to fetch resolutions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingResolution ? `/api/government-resolutions/${editingResolution.id}` : '/api/government-resolutions';
      const method = editingResolution ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: new Date(formData.date).toISOString()
        })
      });

      if (response.ok) {
        await fetchResolutions();
        setIsModalOpen(false);
        setEditingResolution(null);
        resetForm();
        toast.success(editingResolution ? 'Resolution updated successfully' : 'Resolution added successfully');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to save resolution');
      }
    } catch (error) {
      console.error('Error saving resolution:', error);
      toast.error('Failed to save resolution');
    }
  };

  const handleEdit = (resolution: GovernmentResolution) => {
    if (resolution.id.startsWith('demo-')) {
      toast.info('कृपया नवीन निर्णय जोडा. Demo डेटा संपादित करू शकत नाही.');
      return;
    }
    setEditingResolution(resolution);
    setFormData({
      title: resolution.title,
      titleEn: resolution.titleEn,
      number: resolution.number,
      date: resolution.date.split('T')[0],
      department: resolution.department,
      departmentEn: resolution.departmentEn,
      fileUrl: resolution.fileUrl,
      category: resolution.category,
      categoryEn: resolution.categoryEn,
      priority: resolution.priority || 'मध्यम',
      priorityEn: resolution.priorityEn || 'Medium',
      description: resolution.description || '',
      descriptionEn: resolution.descriptionEn || '',
      isActive: resolution.isActive,
      order: resolution.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('demo-')) {
      toast.info('Demo डेटा हटवू शकत नाही. कृपया नवीन निर्णय जोडा.');
      return;
    }
    if (confirm('Are you sure you want to delete this resolution?')) {
      try {
        const response = await fetch(`/api/government-resolutions/${id}`, { method: 'DELETE' });
        if (response.ok) {
          await fetchResolutions();
          toast.success('Resolution deleted successfully');
        } else {
          toast.error('Failed to delete resolution');
        }
      } catch (error) {
        console.error('Error deleting resolution:', error);
        toast.error('Failed to delete resolution');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      number: '',
      date: '',
      department: '',
      departmentEn: '',
      fileUrl: '',
      category: '',
      categoryEn: '',
      priority: 'मध्यम',
      priorityEn: 'Medium',
      description: '',
      descriptionEn: '',
      isActive: true,
      order: 0
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'सामान्य': 'bg-blue-100 text-blue-800',
      'वित्त': 'bg-green-100 text-green-800',
      'कृषी': 'bg-yellow-100 text-yellow-800',
      'शिक्षण': 'bg-purple-100 text-purple-800',
      'आरोग्य': 'bg-red-100 text-red-800',
      'विकास': 'bg-indigo-100 text-indigo-800'
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
          <h1 className="text-3xl font-bold text-gray-900">Government Resolutions</h1>
          <p className="text-gray-600">Manage government resolutions and circulars</p>
        </div>
        <Button
          onClick={() => {
            setEditingResolution(null);
            resetForm();
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Resolution
        </Button>
      </div>

      {isDemoMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
          <div className="p-2 bg-blue-100 rounded-full">
            <Info className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-blue-900 font-medium">Demo Data Displayed</p>
            <p className="text-sm text-blue-800">
              No live government resolutions were found for this subdomain. Showing placeholder entries for reference.
              Add a new resolution to replace the demo list.
            </p>
          </div>
        </div>
      )}

      {/* Resolutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resolutions.map((resolution) => {
          const isDemoResolution = resolution.id.startsWith('demo-');
          return (
            <Card key={resolution.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{resolution.title}</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">{resolution.titleEn}</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className={getCategoryColor(resolution.category)}>
                    {resolution.category}
                  </Badge>
                  <Badge className={
                    resolution.priority === 'उच्च' ? 'bg-red-100 text-red-800' :
                    resolution.priority === 'मध्यम' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }>
                    {resolution.priority || 'मध्यम'}
                  </Badge>
                  {resolution.isActive ? (
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
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <FileText className="h-4 w-4" />
                  <span>GR No: {resolution.number}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Building className="h-4 w-4" />
                  <span>{resolution.department}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(resolution.date).toLocaleDateString()}</span>
                </div>

                {resolution.fileUrl && (
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resolution.fileUrl, '_blank')}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(resolution)}
                    className="flex-1"
                    disabled={isDemoResolution}
                    title={isDemoResolution ? 'Demo data cannot be edited' : undefined}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(resolution.id)}
                    className="text-red-600 hover:text-red-700 disabled:text-gray-400"
                    disabled={isDemoResolution}
                    title={isDemoResolution ? 'Demo data cannot be deleted' : undefined}
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingResolution ? 'Edit Resolution' : 'Add New Resolution'}
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GR Number *
                    </label>
                    <Input
                      value={formData.number}
                      onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                      placeholder="e.g., GR-2024/123"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department (Marathi) *
                    </label>
                    <Input
                      value={formData.department}
                      onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Department (English) *
                    </label>
                    <Input
                      value={formData.departmentEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, departmentEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (Marathi) *
                    </label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="अभियान">अभियान</SelectItem>
                        <SelectItem value="निर्देश">निर्देश</SelectItem>
                        <SelectItem value="कार्यक्रम">कार्यक्रम</SelectItem>
                        <SelectItem value="योजना">योजना</SelectItem>
                        <SelectItem value="उपक्रम">उपक्रम</SelectItem>
                        <SelectItem value="सामान्य">सामान्य</SelectItem>
                        <SelectItem value="वित्त">वित्त</SelectItem>
                        <SelectItem value="कृषी">कृषी</SelectItem>
                        <SelectItem value="शिक्षण">शिक्षण</SelectItem>
                        <SelectItem value="आरोग्य">आरोग्य</SelectItem>
                        <SelectItem value="विकास">विकास</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category (English) *
                    </label>
                    <Select
                      value={formData.categoryEn}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, categoryEn: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Campaign">Campaign</SelectItem>
                        <SelectItem value="Guidelines">Guidelines</SelectItem>
                        <SelectItem value="Program">Program</SelectItem>
                        <SelectItem value="Scheme">Scheme</SelectItem>
                        <SelectItem value="Initiative">Initiative</SelectItem>
                        <SelectItem value="General">General</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Agriculture">Agriculture</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Health">Health</SelectItem>
                        <SelectItem value="Development">Development</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (Marathi) *
                    </label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => {
                        const priorityMap: { [key: string]: string } = {
                          'उच्च': 'High',
                          'मध्यम': 'Medium',
                          'कमी': 'Low'
                        };
                        setFormData(prev => ({ 
                          ...prev, 
                          priority: value,
                          priorityEn: priorityMap[value] || 'Medium'
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="उच्च">उच्च (High)</SelectItem>
                        <SelectItem value="मध्यम">मध्यम (Medium)</SelectItem>
                        <SelectItem value="कमी">कमी (Low)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority (English) *
                    </label>
                    <Select
                      value={formData.priorityEn}
                      onValueChange={(value) => {
                        const priorityMap: { [key: string]: string } = {
                          'High': 'उच्च',
                          'Medium': 'मध्यम',
                          'Low': 'कमी'
                        };
                        setFormData(prev => ({ 
                          ...prev, 
                          priorityEn: value,
                          priority: priorityMap[value] || 'मध्यम'
                        }));
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="High">High (उच्च)</SelectItem>
                        <SelectItem value="Medium">Medium (मध्यम)</SelectItem>
                        <SelectItem value="Low">Low (कमी)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (Marathi)
                    </label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="निर्णयाचे वर्णन..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description (English)
                    </label>
                    <Textarea
                      value={formData.descriptionEn}
                      onChange={(e) => setFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                      placeholder="Resolution description..."
                      rows={4}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    File URL
                  </label>
                  <Input
                    value={formData.fileUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, fileUrl: e.target.value }))}
                    placeholder="https://example.com/document.pdf"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    />
                    <span className="text-sm font-medium text-gray-700">Active</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-medium text-gray-700">Order:</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      className="w-20"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsModalOpen(false);
                      setEditingResolution(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingResolution ? 'Update Resolution' : 'Add Resolution'}
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
