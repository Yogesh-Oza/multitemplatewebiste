'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Building, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  FileText,
  ExternalLink,
  Calendar,
  Users,
  DollarSign
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GovernmentScheme {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  department: string;
  eligibility: string;
  eligibilityEn: string;
  benefits: string;
  benefitsEn: string;
  applicationProcess: string;
  applicationProcessEn: string;
  documents: string;
  documentsEn: string;
  contactInfo: string;
  contactInfoEn: string;
  website: string;
  status: 'active' | 'inactive' | 'upcoming';
  startDate: string;
  endDate: string;
  imageUrl: string;
}


const categories = [
  'घर', 'रोजगार', 'शेती', 'शिक्षण', 'आरोग्य', 'महिला', 'बाल', 'वृद्ध', 'अन्य'
];

const departments = [
  'ग्रामीण विकास', 'कृषी', 'शिक्षण', 'आरोग्य', 'महिला आणि बाल विकास', 'सामाजिक न्याय', 'अन्य'
];

const statusOptions = [
  { value: 'active', label: 'सक्रिय', color: 'bg-green-500' },
  { value: 'inactive', label: 'निष्क्रिय', color: 'bg-gray-500' },
  { value: 'upcoming', label: 'येत आहे', color: 'bg-blue-500' }
];

export default function GovernmentSchemesPage() {
  const [schemes, setSchemes] = useState<GovernmentScheme[]>([]);
  const [editingScheme, setEditingScheme] = useState<GovernmentScheme | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch schemes from API
  useEffect(() => {
    const fetchSchemes = async () => {
      try {
        const response = await fetch('/api/government-schemes');
        if (response.ok) {
          const data = await response.json();
          setSchemes(data);
        }
      } catch (error) {
        console.error('Error fetching schemes:', error);
        toast.error('शासकीय योजना लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchemes();
  }, []);

  const handleEdit = (scheme: GovernmentScheme) => {
    setEditingScheme(scheme);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingScheme({
      id: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      category: 'घर',
      department: 'ग्रामीण विकास',
      eligibility: '',
      eligibilityEn: '',
      benefits: '',
      benefitsEn: '',
      applicationProcess: '',
      applicationProcessEn: '',
      documents: '',
      documentsEn: '',
      contactInfo: '',
      contactInfoEn: '',
      website: '',
      status: 'active',
      startDate: '',
      endDate: '',
      imageUrl: ''
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingScheme) return;


    try {
      if (isAdding) {
        const response = await fetch('/api/government-schemes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingScheme),
        });

        if (response.ok) {
          const newScheme = await response.json();
          setSchemes(prev => [...prev, newScheme]);
          toast.success('नवीन योजना जोडली');
        } else {
          throw new Error('Failed to create scheme');
        }
      } else {
        const response = await fetch(`/api/government-schemes/${editingScheme.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingScheme),
        });

        if (response.ok) {
          const updatedScheme = await response.json();
          setSchemes(prev => prev.map(scheme => 
            scheme.id === updatedScheme.id ? updatedScheme : scheme
          ));
          toast.success('योजना अपडेट केली');
        } else {
          throw new Error('Failed to update scheme');
        }
      }

      setEditingScheme(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving scheme:', error);
      toast.error('योजना सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/government-schemes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSchemes(prev => prev.filter(scheme => scheme.id !== id));
        toast.success('योजना हटवली');
      } else {
        throw new Error('Failed to delete scheme');
      }
    } catch (error) {
      console.error('Error deleting scheme:', error);
      toast.error('योजना हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingScheme(null);
    setIsAdding(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया केवळ प्रतिमा फाइल निवडा');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('प्रतिमा फाइल 5MB पेक्षा लहान असावी');
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
        const data = await response.json();
        setEditingScheme(prev => prev ? { ...prev, imageUrl: data.imageUrl } : null);
        toast.success('प्रतिमा अपलोड केली');
      } else {
        const errorData = await response.json();
        console.error('Upload failed:', errorData);
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    }
  };

  const filteredSchemes = selectedCategory === 'सर्व' 
    ? schemes 
    : schemes.filter(scheme => scheme.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    return (
      <Badge className={`${statusOption?.color} text-white`}>
        {statusOption?.label}
      </Badge>
    );
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
          <h1 className="text-3xl font-bold text-gray-900">शासकीय योजना</h1>
          <p className="text-gray-600 mt-1">सरकारी योजना व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {schemes.length} योजना
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {schemes.filter(s => s.status === 'active').length} सक्रिय
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन योजना
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'सर्व' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('सर्व')}
            >
              सर्व
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schemes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchemes.map((scheme) => (
          <Card key={scheme.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              {scheme.imageUrl ? (
                <img
                  src={scheme.imageUrl}
                  alt={scheme.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">प्रतिमा नाही</span>
                </div>
              )}
              <div className="absolute top-2 right-2">
                {getStatusBadge(scheme.status)}
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-white text-gray-800">
                  {scheme.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{scheme.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{scheme.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Building className="h-4 w-4 mr-2" />
                  {scheme.department}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  {scheme.benefits}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {scheme.startDate && scheme.endDate ? (
                    `${new Date(scheme.startDate).toLocaleDateString('mr-IN')} - ${new Date(scheme.endDate).toLocaleDateString('mr-IN')}`
                  ) : (
                    'तारीख निर्दिष्ट नाही'
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(scheme)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(scheme.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन योजना जोडा' : 'योजना संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingScheme.title}
                    onChange={(e) => setEditingScheme({...editingScheme, title: e.target.value})}
                    placeholder="पीएम आवास योजना"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingScheme.titleEn}
                    onChange={(e) => setEditingScheme({...editingScheme, titleEn: e.target.value})}
                    placeholder="PM Awas Yojana"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingScheme.description}
                    onChange={(e) => setEditingScheme({...editingScheme, description: e.target.value})}
                    placeholder="योजनेचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingScheme.descriptionEn}
                    onChange={(e) => setEditingScheme({...editingScheme, descriptionEn: e.target.value})}
                    placeholder="Scheme details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">वर्ग</Label>
                  <select
                    id="category"
                    value={editingScheme.category}
                    onChange={(e) => setEditingScheme({...editingScheme, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="department">विभाग</Label>
                  <select
                    id="department"
                    value={editingScheme.department}
                    onChange={(e) => setEditingScheme({...editingScheme, department: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="status">स्थिती</Label>
                  <select
                    id="status"
                    value={editingScheme.status}
                    onChange={(e) => setEditingScheme({...editingScheme, status: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="eligibility">पात्रता (मराठी)</Label>
                  <Textarea
                    id="eligibility"
                    value={editingScheme.eligibility}
                    onChange={(e) => setEditingScheme({...editingScheme, eligibility: e.target.value})}
                    placeholder="पात्रता निकष"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="eligibilityEn">पात्रता (इंग्रजी)</Label>
                  <Textarea
                    id="eligibilityEn"
                    value={editingScheme.eligibilityEn}
                    onChange={(e) => setEditingScheme({...editingScheme, eligibilityEn: e.target.value})}
                    placeholder="Eligibility criteria"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="benefits">लाभ (मराठी)</Label>
                  <Textarea
                    id="benefits"
                    value={editingScheme.benefits}
                    onChange={(e) => setEditingScheme({...editingScheme, benefits: e.target.value})}
                    placeholder="योजनेचे लाभ"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="benefitsEn">लाभ (इंग्रजी)</Label>
                  <Textarea
                    id="benefitsEn"
                    value={editingScheme.benefitsEn}
                    onChange={(e) => setEditingScheme({...editingScheme, benefitsEn: e.target.value})}
                    placeholder="Scheme benefits"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">सुरुवात तारीख</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={editingScheme.startDate}
                    onChange={(e) => setEditingScheme({...editingScheme, startDate: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">समाप्ती तारीख</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={editingScheme.endDate}
                    onChange={(e) => setEditingScheme({...editingScheme, endDate: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactInfo">संपर्क माहिती (मराठी)</Label>
                  <Input
                    id="contactInfo"
                    value={editingScheme.contactInfo}
                    onChange={(e) => setEditingScheme({...editingScheme, contactInfo: e.target.value})}
                    placeholder="ग्रामसेवक कार्यालय"
                  />
                </div>
                <div>
                  <Label htmlFor="contactInfoEn">संपर्क माहिती (इंग्रजी)</Label>
                  <Input
                    id="contactInfoEn"
                    value={editingScheme.contactInfoEn}
                    onChange={(e) => setEditingScheme({...editingScheme, contactInfoEn: e.target.value})}
                    placeholder="Gramsevak Office"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">वेबसाइट</Label>
                  <Input
                    id="website"
                    value={editingScheme.website}
                    onChange={(e) => setEditingScheme({...editingScheme, website: e.target.value})}
                    placeholder="https://example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingScheme.imageUrl && (
                    <img
                      src={editingScheme.imageUrl}
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
                <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
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
