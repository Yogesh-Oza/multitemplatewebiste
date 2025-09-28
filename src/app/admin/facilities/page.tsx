'use client';

import { useState } from 'react';
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
  locationEn: string;
  contactPerson: string;
  contactPersonEn: string;
  phone: string;
  workingHours: string;
  workingHoursEn: string;
  status: 'working' | 'maintenance' | 'out_of_order';
  lastMaintenance: string;
  nextMaintenance: string;
  imageUrl: string;
  isActive: boolean;
}

const mockFacilities: Facility[] = [
  {
    id: '1',
    name: 'पाणीपुरवठा यंत्रणा',
    nameEn: 'Water Supply System',
    description: 'गावातील पाणीपुरवठा यंत्रणा आणि टंकी',
    descriptionEn: 'Village water supply system and tanks',
    category: 'पाणी',
    location: 'गाव मध्यभागी',
    locationEn: 'Village Center',
    contactPerson: 'श्री. राम पाटील',
    contactPersonEn: 'Mr. Ram Patil',
    phone: '+91 98765 43210',
    workingHours: 'सकाळी ६:०० ते संध्याकाळी ८:००',
    workingHoursEn: '6:00 AM to 8:00 PM',
    status: 'working',
    lastMaintenance: '2024-02-15',
    nextMaintenance: '2024-05-15',
    imageUrl: '/images/facility-1.jpg',
    isActive: true
  },
  {
    id: '2',
    name: 'वीज कनेक्शन',
    nameEn: 'Electricity Connection',
    description: 'गावातील वीज पुरवठा आणि स्ट्रीट लाईट',
    descriptionEn: 'Village electricity supply and street lights',
    category: 'वीज',
    location: 'संपूर्ण गाव',
    locationEn: 'Entire Village',
    contactPerson: 'श्री. सुनील शर्मा',
    contactPersonEn: 'Mr. Sunil Sharma',
    phone: '+91 87654 32109',
    workingHours: '२४ तास',
    workingHoursEn: '24 Hours',
    status: 'working',
    lastMaintenance: '2024-01-20',
    nextMaintenance: '2024-04-20',
    imageUrl: '/images/facility-2.jpg',
    isActive: true
  },
  {
    id: '3',
    name: 'स्वच्छता व्यवस्था',
    nameEn: 'Sanitation System',
    description: 'गावातील स्वच्छता आणि कचरा व्यवस्थापन',
    descriptionEn: 'Village sanitation and waste management',
    category: 'स्वच्छता',
    location: 'गाव परिसर',
    locationEn: 'Village Area',
    contactPerson: 'श्री. राजू गावडे',
    contactPersonEn: 'Mr. Raju Gavade',
    phone: '+91 76543 21098',
    workingHours: 'सकाळी ७:०० ते संध्याकाळी ६:००',
    workingHoursEn: '7:00 AM to 6:00 PM',
    status: 'maintenance',
    lastMaintenance: '2024-03-01',
    nextMaintenance: '2024-03-15',
    imageUrl: '/images/facility-3.jpg',
    isActive: true
  },
  {
    id: '4',
    name: 'रस्ते आणि पूल',
    nameEn: 'Roads and Bridges',
    description: 'गावातील रस्ते, पूल आणि वाहतूक सुविधा',
    descriptionEn: 'Village roads, bridges and transportation facilities',
    category: 'वाहतूक',
    location: 'मुख्य रस्ते',
    locationEn: 'Main Roads',
    contactPerson: 'श्री. विजय कुमार',
    contactPersonEn: 'Mr. Vijay Kumar',
    phone: '+91 65432 10987',
    workingHours: 'सकाळी ८:०० ते संध्याकाळी ५:००',
    workingHoursEn: '8:00 AM to 5:00 PM',
    status: 'out_of_order',
    lastMaintenance: '2024-01-10',
    nextMaintenance: '2024-03-10',
    imageUrl: '/images/facility-4.jpg',
    isActive: true
  }
];

const categories = [
  'पाणी', 'वीज', 'स्वच्छता', 'वाहतूक', 'संचार', 'शिक्षण', 'आरोग्य', 'अन्य'
];

const statusOptions = [
  { value: 'working', label: 'कार्यरत', color: 'bg-green-500', icon: CheckCircle },
  { value: 'maintenance', label: 'दुरुस्ती', color: 'bg-yellow-500', icon: AlertCircle },
  { value: 'out_of_order', label: 'बंद', color: 'bg-red-500', icon: XCircle }
];

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>(mockFacilities);
  const [editingFacility, setEditingFacility] = useState<Facility | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');

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
      locationEn: '',
      contactPerson: '',
      contactPersonEn: '',
      phone: '',
      workingHours: '',
      workingHoursEn: '',
      status: 'working',
      lastMaintenance: '',
      nextMaintenance: '',
      imageUrl: '',
      isActive: true
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingFacility) return;

    if (isAdding) {
      const newFacility = { ...editingFacility, id: Date.now().toString() };
      setFacilities(prev => [...prev, newFacility]);
      toast.success('नवीन सुविधा जोडली');
    } else {
      setFacilities(prev => prev.map(facility => 
        facility.id === editingFacility.id ? editingFacility : facility
      ));
      toast.success('सुविधा अपडेट केली');
    }

    setEditingFacility(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setFacilities(prev => prev.filter(facility => facility.id !== id));
    toast.success('सुविधा हटवली');
  };

  const handleCancel = () => {
    setEditingFacility(null);
    setIsAdding(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setEditingFacility(prev => prev ? { ...prev, imageUrl } : null);
    toast.success('प्रतिमा अपलोड केली');
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

  const getStatusBadge = (status: string) => {
    const statusOption = statusOptions.find(s => s.value === status);
    const Icon = statusOption?.icon || CheckCircle;
    return (
      <Badge className={`${statusOption?.color} text-white flex items-center space-x-1`}>
        <Icon className="h-3 w-3" />
        <span>{statusOption?.label}</span>
      </Badge>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin">
              <ArrowLeft className="h-4 w-4 mr-2" />
              मुख्यपृष्ठ
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">सोई-सुविधा</h1>
            <p className="text-gray-600 mt-1">सुविधा व्यवस्थापन</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {facilities.length} सुविधा
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {facilities.filter(f => f.status === 'working').length} कार्यरत
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
                {getStatusBadge(facility.status)}
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
                  {facility.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {facility.workingHours}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-medium text-gray-700 mb-1">अंतिम दुरुस्ती:</p>
                <p className="text-xs text-gray-500">
                  {new Date(facility.lastMaintenance).toLocaleDateString('mr-IN')}
                </p>
                <p className="text-xs font-medium text-gray-700 mb-1 mt-2">पुढील दुरुस्ती:</p>
                <p className="text-xs text-gray-500">
                  {new Date(facility.nextMaintenance).toLocaleDateString('mr-IN')}
                </p>
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
                  <Label htmlFor="status">स्थिती</Label>
                  <select
                    id="status"
                    value={editingFacility.status}
                    onChange={(e) => setEditingFacility({...editingFacility, status: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">फोन</Label>
                  <Input
                    id="phone"
                    value={editingFacility.phone}
                    onChange={(e) => setEditingFacility({...editingFacility, phone: e.target.value})}
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
                <div>
                  <Label htmlFor="locationEn">स्थळ (इंग्रजी)</Label>
                  <Input
                    id="locationEn"
                    value={editingFacility.locationEn}
                    onChange={(e) => setEditingFacility({...editingFacility, locationEn: e.target.value})}
                    placeholder="Village Center"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactPerson">संपर्क व्यक्ती (मराठी)</Label>
                  <Input
                    id="contactPerson"
                    value={editingFacility.contactPerson}
                    onChange={(e) => setEditingFacility({...editingFacility, contactPerson: e.target.value})}
                    placeholder="श्री. राम पाटील"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPersonEn">संपर्क व्यक्ती (इंग्रजी)</Label>
                  <Input
                    id="contactPersonEn"
                    value={editingFacility.contactPersonEn}
                    onChange={(e) => setEditingFacility({...editingFacility, contactPersonEn: e.target.value})}
                    placeholder="Mr. Ram Patil"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingHours">कार्यवेळ (मराठी)</Label>
                  <Input
                    id="workingHours"
                    value={editingFacility.workingHours}
                    onChange={(e) => setEditingFacility({...editingFacility, workingHours: e.target.value})}
                    placeholder="सकाळी ६:०० ते संध्याकाळी ८:००"
                  />
                </div>
                <div>
                  <Label htmlFor="workingHoursEn">कार्यवेळ (इंग्रजी)</Label>
                  <Input
                    id="workingHoursEn"
                    value={editingFacility.workingHoursEn}
                    onChange={(e) => setEditingFacility({...editingFacility, workingHoursEn: e.target.value})}
                    placeholder="6:00 AM to 8:00 PM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="lastMaintenance">अंतिम दुरुस्ती</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={editingFacility.lastMaintenance}
                    onChange={(e) => setEditingFacility({...editingFacility, lastMaintenance: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nextMaintenance">पुढील दुरुस्ती</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={editingFacility.nextMaintenance}
                    onChange={(e) => setEditingFacility({...editingFacility, nextMaintenance: e.target.value})}
                  />
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
