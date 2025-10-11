'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Department {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  head: string;
  headEn: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  services: string[];
  servicesEn: string[];
  imageUrl: string;
  isActive: boolean;
}


const serviceOptions = [
  'उपचार', 'लसीकरण', 'आरोग्य तपासणी', 'दवाखाना',
  'शाळा व्यवस्थापन', 'शिक्षक नियुक्ती', 'पुस्तके वाटप', 'शिष्यवृत्ती',
  'बियाणे वाटप', 'खत सबसिडी', 'शेती मार्गदर्शन', 'कर्ज मदत',
  'पाणीपुरवठा', 'वीज कनेक्शन', 'रस्ते दुरुस्ती', 'स्वच्छता'
];

const serviceOptionsEn = [
  'Treatment', 'Vaccination', 'Health Checkup', 'Pharmacy',
  'School Management', 'Teacher Recruitment', 'Book Distribution', 'Scholarships',
  'Seed Distribution', 'Fertilizer Subsidy', 'Farming Guidance', 'Loan Assistance',
  'Water Supply', 'Electricity Connection', 'Road Repair', 'Sanitation'
];

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch departments from API
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await fetch('/api/departments');
        if (response.ok) {
          const data = await response.json();
          setDepartments(data);
        }
      } catch (error) {
        console.error('Error fetching departments:', error);
        toast.error('विभाग लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleEdit = (department: Department) => {
    setEditingDepartment(department);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingDepartment({
      id: '',
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      head: '',
      headEn: '',
      phone: '',
      email: '',
      address: '',
      addressEn: '',
      workingHours: '',
      workingHoursEn: '',
      services: [],
      servicesEn: [],
      imageUrl: '',
      isActive: true
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingDepartment) return;

    try {
      if (isAdding) {
        const response = await fetch('/api/departments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingDepartment),
        });

        if (response.ok) {
          const newDepartment = await response.json();
          setDepartments(prev => [...prev, newDepartment]);
          toast.success('नवीन विभाग जोडला');
        } else {
          throw new Error('Failed to create department');
        }
      } else {
        const response = await fetch(`/api/departments/${editingDepartment.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingDepartment),
        });

        if (response.ok) {
          const updatedDepartment = await response.json();
          setDepartments(prev => prev.map(dept => 
            dept.id === updatedDepartment.id ? updatedDepartment : dept
          ));
          toast.success('विभाग अपडेट केला');
        } else {
          throw new Error('Failed to update department');
        }
      }

      setEditingDepartment(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving department:', error);
      toast.error('विभाग सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/departments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDepartments(prev => prev.filter(dept => dept.id !== id));
        toast.success('विभाग हटवला');
      } else {
        throw new Error('Failed to delete department');
      }
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error('विभाग हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingDepartment(null);
    setIsAdding(false);
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Show loading state
      toast.loading('प्रतिमा अपलोड होत आहे...');

      // Create form data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setEditingDepartment(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
        toast.success('प्रतिमा अपलोड केली');
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('प्रतिमा अपलोड करताना त्रुटी आली');
    }
  };

  const handleToggleActive = (id: string) => {
    setDepartments(prev => prev.map(dept => 
      dept.id === id ? { ...dept, isActive: !dept.isActive } : dept
    ));
    toast.success('विभाग स्थिती अपडेट केली');
  };

  const handleServiceToggle = (service: string, serviceEn: string) => {
    if (!editingDepartment) return;

    const isSelected = editingDepartment.services.includes(service);
    const newServices = isSelected 
      ? editingDepartment.services.filter(s => s !== service)
      : [...editingDepartment.services, service];
    
    const newServicesEn = isSelected 
      ? editingDepartment.servicesEn.filter(s => s !== serviceEn)
      : [...editingDepartment.servicesEn, serviceEn];

    setEditingDepartment({
      ...editingDepartment,
      services: newServices,
      servicesEn: newServicesEn
    });
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
          <h1 className="text-3xl font-bold text-gray-900">विभाग</h1>
          <p className="text-gray-600 mt-1">विभागीय माहिती व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {departments.length} विभाग
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {departments.filter(d => d.isActive).length} सक्रिय
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन विभाग
          </Button>
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => (
          <Card key={department.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={department.imageUrl}
                alt={department.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={department.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                  {department.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{department.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{department.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {department.head}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {department.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {department.workingHours}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-2">सेवा:</p>
                <div className="flex flex-wrap gap-1">
                  {department.services && department.services.length > 0 ? (
                    department.services.slice(0, 3).map((service, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {service}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500">सेवा उपलब्ध नाही</span>
                  )}
                  {department.services && department.services.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{department.services.length - 3} अधिक
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(department)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(department.id)}
                  className={department.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                >
                  {department.isActive ? 'निष्क्रिय' : 'सक्रिय'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन विभाग जोडा' : 'विभाग संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाव (मराठी)</Label>
                  <Input
                    id="name"
                    value={editingDepartment.name}
                    onChange={(e) => setEditingDepartment({...editingDepartment, name: e.target.value})}
                    placeholder="आरोग्य विभाग"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">नाव (इंग्रजी)</Label>
                  <Input
                    id="nameEn"
                    value={editingDepartment.nameEn}
                    onChange={(e) => setEditingDepartment({...editingDepartment, nameEn: e.target.value})}
                    placeholder="Health Department"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingDepartment.description}
                    onChange={(e) => setEditingDepartment({...editingDepartment, description: e.target.value})}
                    placeholder="विभागाचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingDepartment.descriptionEn}
                    onChange={(e) => setEditingDepartment({...editingDepartment, descriptionEn: e.target.value})}
                    placeholder="Department details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="head">प्रमुख नाव (मराठी)</Label>
                  <Input
                    id="head"
                    value={editingDepartment.head}
                    onChange={(e) => setEditingDepartment({...editingDepartment, head: e.target.value})}
                    placeholder="डॉ. प्रिया शर्मा"
                  />
                </div>
                <div>
                  <Label htmlFor="headEn">प्रमुख नाव (इंग्रजी)</Label>
                  <Input
                    id="headEn"
                    value={editingDepartment.headEn}
                    onChange={(e) => setEditingDepartment({...editingDepartment, headEn: e.target.value})}
                    placeholder="Dr. Priya Sharma"
                  />
                </div>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">फोन</Label>
                  <Input
                    id="phone"
                    value={editingDepartment.phone}
                    onChange={(e) => setEditingDepartment({...editingDepartment, phone: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <Label htmlFor="email">ईमेल</Label>
                  <Input
                    id="email"
                    type="email"
                    value={editingDepartment.email}
                    onChange={(e) => setEditingDepartment({...editingDepartment, email: e.target.value})}
                    placeholder="health@grampanchayat.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">पत्ता (मराठी)</Label>
                  <Textarea
                    id="address"
                    value={editingDepartment.address}
                    onChange={(e) => setEditingDepartment({...editingDepartment, address: e.target.value})}
                    placeholder="आरोग्य केंद्र, गाव, तालुका, जिल्हा"
                    rows={2}
                  />
                </div>
                <div>
                  <Label htmlFor="addressEn">पत्ता (इंग्रजी)</Label>
                  <Textarea
                    id="addressEn"
                    value={editingDepartment.addressEn}
                    onChange={(e) => setEditingDepartment({...editingDepartment, addressEn: e.target.value})}
                    placeholder="Health Center, Village, Taluka, District"
                    rows={2}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingHours">कार्यवेळ (मराठी)</Label>
                  <Input
                    id="workingHours"
                    value={editingDepartment.workingHours}
                    onChange={(e) => setEditingDepartment({...editingDepartment, workingHours: e.target.value})}
                    placeholder="सकाळी ८:०० ते संध्याकाळी ४:००"
                  />
                </div>
                <div>
                  <Label htmlFor="workingHoursEn">कार्यवेळ (इंग्रजी)</Label>
                  <Input
                    id="workingHoursEn"
                    value={editingDepartment.workingHoursEn}
                    onChange={(e) => setEditingDepartment({...editingDepartment, workingHoursEn: e.target.value})}
                    placeholder="8:00 AM to 4:00 PM"
                  />
                </div>
              </div>

              <div>
                <Label>सेवा निवडा</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {serviceOptions.map((service, index) => {
                    const serviceEn = serviceOptionsEn[index];
                    const isSelected = editingDepartment.services.includes(service);
                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => handleServiceToggle(service, serviceEn)}
                        className={`p-2 text-xs rounded border transition-colors ${
                          isSelected 
                            ? 'bg-blue-100 border-blue-300 text-blue-700' 
                            : 'bg-gray-50 border-gray-300 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {service}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingDepartment.imageUrl && (
                    <img
                      src={editingDepartment.imageUrl}
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

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingDepartment.isActive}
                  onChange={(e) => setEditingDepartment({...editingDepartment, isActive: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isActive">सक्रिय</Label>
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
