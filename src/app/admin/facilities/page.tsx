'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Wrench, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Facility {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  location: string;
  contactInfo: string;
  workingHours: string;
  imageUrl: string;
  isActive: boolean;
  // GIS fields
  type?: string | null;
  status?: string | null;
  statusEn?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  services?: string[] | null;
  capacity?: string | null;
  lastMaintenance?: string | null;
}


const categories = [
  'पाणी', 'वीज', 'स्वच्छता', 'वाहतूक', 'संचार', 'शिक्षण', 'आरोग्य', 'अन्य'
];


export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');
  const [isLoading, setIsLoading] = useState(true);

  // Fetch facilities from API
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const response = await fetch('/api/facilities');
        if (response.ok) {
          const data = await response.json();
          setFacilities(data);
        }
      } catch (error) {
        console.error('Error fetching facilities:', error);
        toast.error('सुविधा लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleEdit = (facility: Facility) => {
    setEditingFacility(facility);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingFacility({
      id: '',
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      category: 'पाणी',
      location: '',
      contactInfo: '',
      workingHours: '',
      imageUrl: '',
      isActive: true,
      type: null,
      status: null,
      statusEn: null,
      latitude: null,
      longitude: null,
      services: null,
      capacity: null,
      lastMaintenance: null
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingFacility) return;

    try {
      if (isAdding) {
        const response = await fetch('/api/facilities', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingFacility),
        });

        if (response.ok) {
          const newFacility = await response.json();
          setFacilities(prev => [...prev, newFacility]);
          toast.success('नवीन सुविधा जोडली');
        } else {
          throw new Error('Failed to create facility');
        }
      } else {
        const response = await fetch(`/api/facilities/${editingFacility.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingFacility),
        });

        if (response.ok) {
          const updatedFacility = await response.json();
          setFacilities(prev => prev.map(facility => 
            facility.id === updatedFacility.id ? updatedFacility : facility
          ));
          toast.success('सुविधा अपडेट केली');
        } else {
          throw new Error('Failed to update facility');
        }
      }

      setEditingFacility(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving facility:', error);
      toast.error('सुविधा सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/facilities/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setFacilities(prev => prev.filter(facility => facility.id !== id));
        toast.success('सुविधा हटवली');
      } else {
        throw new Error('Failed to delete facility');
      }
    } catch (error) {
      console.error('Error deleting facility:', error);
      toast.error('सुविधा हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingFacility(null);
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
        setEditingFacility(prev => prev ? { ...prev, imageUrl: result.imageUrl } : null);
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
    setFacilities(prev => prev.map(facility => 
      facility.id === id ? { ...facility, isActive: !facility.isActive } : facility
    ));
    toast.success('सुविधा स्थिती अपडेट केली');
  };

  const filteredFacilities = selectedCategory === 'सर्व' 
    ? facilities 
    : facilities.filter(facility => facility.category === selectedCategory);

  const getStatusBadge = (isActive: boolean) => {
    const statusOption = isActive 
      ? { value: 'active', label: 'सक्रिय', color: 'bg-green-500', icon: CheckCircle }
      : { value: 'inactive', label: 'निष्क्रिय', color: 'bg-red-500', icon: XCircle };
    const Icon = statusOption.icon;
    return (
      <Badge className={`${statusOption.color} text-white flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{statusOption.label}</span>
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
          <h1 className="text-3xl font-bold text-gray-900">सोई-सुविधा</h1>
          <p className="text-gray-600 mt-1">सुविधा व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {facilities.length} सुविधा
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {facilities.filter(f => f.isActive).length} सक्रिय
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन सुविधा
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

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFacilities.map((facility) => (
          <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={facility.imageUrl}
                alt={facility.name}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(facility.isActive)}
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-white text-gray-800">
                  {facility.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{facility.name}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{facility.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {facility.location}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  {facility.contactInfo}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {facility.workingHours}
                </div>
              </div>


              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(facility)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleActive(facility.id)}
                  className={facility.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                >
                  {facility.isActive ? 'निष्क्रिय' : 'सक्रिय'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingFacility && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन सुविधा जोडा' : 'सुविधा संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाव (मराठी)</Label>
                  <Input
                    id="name"
                    value={editingFacility.name}
                    onChange={(e) => setEditingFacility({...editingFacility, name: e.target.value})}
                    placeholder="पाणीपुरवठा यंत्रणा"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">नाव (इंग्रजी)</Label>
                  <Input
                    id="nameEn"
                    value={editingFacility.nameEn}
                    onChange={(e) => setEditingFacility({...editingFacility, nameEn: e.target.value})}
                    placeholder="Water Supply System"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingFacility.description}
                    onChange={(e) => setEditingFacility({...editingFacility, description: e.target.value})}
                    placeholder="सुविधेचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingFacility.descriptionEn}
                    onChange={(e) => setEditingFacility({...editingFacility, descriptionEn: e.target.value})}
                    placeholder="Facility details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">वर्ग</Label>
                  <select
                    id="category"
                    value={editingFacility.category}
                    onChange={(e) => setEditingFacility({...editingFacility, category: e.target.value})}
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
                  <Label htmlFor="contactInfo">संपर्क माहिती</Label>
                  <Input
                    id="contactInfo"
                    value={editingFacility.contactInfo}
                    onChange={(e) => setEditingFacility({...editingFacility, contactInfo: e.target.value})}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="location">स्थळ (मराठी)</Label>
                  <Input
                    id="location"
                    value={editingFacility.location}
                    onChange={(e) => setEditingFacility({...editingFacility, location: e.target.value})}
                    placeholder="गाव मध्यभागी"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="workingHours">कार्यवेळ</Label>
                <Input
                  id="workingHours"
                  value={editingFacility.workingHours}
                  onChange={(e) => setEditingFacility({...editingFacility, workingHours: e.target.value})}
                  placeholder="सकाळी ६:०० ते संध्याकाळी ८:००"
                />
              </div>

              {/* GIS Fields Section */}
              <div className="border-t pt-6 space-y-4">
                <h3 className="text-lg font-semibold">GIS नकाशा साठी माहिती (वैकल्पिक)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">प्रकार (GIS साठी)</Label>
                    <select
                      id="type"
                      value={editingFacility.type || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, type: e.target.value || null})}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">-- निवडा --</option>
                      <option value="water">पाणी</option>
                      <option value="sanitation">स्वच्छता</option>
                      <option value="road">रस्ते</option>
                      <option value="school">शाळा</option>
                      <option value="health">आरोग्य</option>
                      <option value="library">वाचनालय</option>
                      <option value="playground">मैदान</option>
                      <option value="bus_stop">बस थांबा</option>
                      <option value="other">इतर</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status">स्थिती (मराठी)</Label>
                    <Input
                      id="status"
                      value={editingFacility.status || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, status: e.target.value || null})}
                      placeholder="चालू, देखभाल, बंद"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="statusEn">स्थिती (English)</Label>
                    <Input
                      id="statusEn"
                      value={editingFacility.statusEn || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, statusEn: e.target.value || null})}
                      placeholder="Operational, Maintenance, Non-functional"
                    />
                  </div>
                  <div>
                    <Label htmlFor="capacity">क्षमता</Label>
                    <Input
                      id="capacity"
                      value={editingFacility.capacity || ''}
                      onChange={(e) => setEditingFacility({...editingFacility, capacity: e.target.value || null})}
                      placeholder="50 रुग्ण, 200 विद्यार्थी"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="latitude">अक्षांश (Latitude)</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="0.000001"
                      value={editingFacility.latitude ?? ''}
                      onChange={(e) => setEditingFacility({...editingFacility, latitude: e.target.value ? Number(e.target.value) : null})}
                      placeholder="19.0760"
                    />
                  </div>
                  <div>
                    <Label htmlFor="longitude">रेखांश (Longitude)</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="0.000001"
                      value={editingFacility.longitude ?? ''}
                      onChange={(e) => setEditingFacility({...editingFacility, longitude: e.target.value ? Number(e.target.value) : null})}
                      placeholder="72.8777"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="lastMaintenance">अद्यतन तारीख</Label>
                  <Input
                    id="lastMaintenance"
                    value={editingFacility.lastMaintenance || ''}
                    onChange={(e) => setEditingFacility({...editingFacility, lastMaintenance: e.target.value || null})}
                    placeholder="अद्यतन: १५/११/२०२४"
                  />
                </div>

                <div>
                  <Label htmlFor="services">सेवा (प्रत्येक सेवा नवीन ओळीवर)</Label>
                  <Textarea
                    id="services"
                    value={Array.isArray(editingFacility.services) ? editingFacility.services.join('\n') : ''}
                    onChange={(e) => {
                      const services = e.target.value.split('\n').filter(s => s.trim());
                      setEditingFacility({...editingFacility, services: services.length > 0 ? services : null});
                    }}
                    placeholder="सेवा १&#10;सेवा २&#10;सेवा ३"
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">प्रत्येक सेवा नवीन ओळीवर लिहा</p>
                </div>
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingFacility.imageUrl && (
                    <img
                      src={editingFacility.imageUrl}
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
                  checked={editingFacility.isActive}
                  onChange={(e) => setEditingFacility({...editingFacility, isActive: e.target.checked})}
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
