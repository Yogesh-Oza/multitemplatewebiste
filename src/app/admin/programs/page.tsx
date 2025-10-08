'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  Clock,
  MapPin,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface Program {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  time: string;
  location: string;
  category: string;
  imageUrl: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}


const categories = [
  'उत्सव', 'आरोग्य', 'शेती', 'शिक्षण', 'क्रीडा', 'सांस्कृतिक', 'सामाजिक', 'अन्य'
];

const statusOptions = [
  { value: 'upcoming', label: 'येत आहे', color: 'bg-blue-500' },
  { value: 'ongoing', label: 'सुरू आहे', color: 'bg-green-500' },
  { value: 'completed', label: 'पूर्ण', color: 'bg-gray-500' }
];

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch programs from API
  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const response = await fetch('/api/programs');
        if (response.ok) {
          const data = await response.json();
          setPrograms(data);
        }
      } catch (error) {
        console.error('Error fetching programs:', error);
        toast.error('कार्यक्रम लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  const handleEdit = (program: Program) => {
    setEditingProgram(program);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingProgram({
      id: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      date: '',
      time: '',
      location: '',
      category: 'उत्सव',
      imageUrl: '',
      status: 'upcoming'
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingProgram) return;

    try {
      if (isAdding) {
        const response = await fetch('/api/programs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProgram),
        });

        if (response.ok) {
          const newProgram = await response.json();
          setPrograms(prev => [...prev, newProgram]);
          toast.success('नवीन कार्यक्रम जोडले');
        } else {
          throw new Error('Failed to create program');
        }
      } else {
        const response = await fetch(`/api/programs/${editingProgram.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingProgram),
        });

        if (response.ok) {
          const updatedProgram = await response.json();
          setPrograms(prev => prev.map(program => 
            program.id === updatedProgram.id ? updatedProgram : program
          ));
          toast.success('कार्यक्रम अपडेट केले');
        } else {
          throw new Error('Failed to update program');
        }
      }

      setEditingProgram(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving program:', error);
      toast.error('कार्यक्रम सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPrograms(prev => prev.filter(program => program.id !== id));
        toast.success('कार्यक्रम हटवले');
      } else {
        throw new Error('Failed to delete program');
      }
    } catch (error) {
      console.error('Error deleting program:', error);
      toast.error('कार्यक्रम हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingProgram(null);
    setIsAdding(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setEditingProgram(prev => prev ? { ...prev, imageUrl } : null);
    toast.success('प्रतिमा अपलोड केली');
  };

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
          <h1 className="text-3xl font-bold text-gray-900">कार्यक्रम</h1>
          <p className="text-gray-600 mt-1">कार्यक्रम आणि उत्सव व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {programs.length} कार्यक्रम
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन कार्यक्रम
          </Button>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <Card key={program.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative">
              <img
                src={program.imageUrl}
                alt={program.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                {getStatusBadge(program.status)}
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-white text-gray-800">
                  {program.category}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{program.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{program.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(program.date).toLocaleDateString('mr-IN')}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2" />
                  {program.time}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  {program.location}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(program)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(program.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन कार्यक्रम जोडा' : 'कार्यक्रम संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingProgram.title}
                    onChange={(e) => setEditingProgram({...editingProgram, title: e.target.value})}
                    placeholder="गणपती उत्सव"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingProgram.titleEn}
                    onChange={(e) => setEditingProgram({...editingProgram, titleEn: e.target.value})}
                    placeholder="Ganesh Festival"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingProgram.description}
                    onChange={(e) => setEditingProgram({...editingProgram, description: e.target.value})}
                    placeholder="कार्यक्रमाचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingProgram.descriptionEn}
                    onChange={(e) => setEditingProgram({...editingProgram, descriptionEn: e.target.value})}
                    placeholder="Program details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="date">तारीख</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingProgram.date}
                    onChange={(e) => setEditingProgram({...editingProgram, date: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="time">वेळ</Label>
                  <Input
                    id="time"
                    type="time"
                    value={editingProgram.time}
                    onChange={(e) => setEditingProgram({...editingProgram, time: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="category">वर्ग</Label>
                  <select
                    id="category"
                    value={editingProgram.category}
                    onChange={(e) => setEditingProgram({...editingProgram, category: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label htmlFor="location">स्थळ</Label>
                <Input
                  id="location"
                  value={editingProgram.location}
                  onChange={(e) => setEditingProgram({...editingProgram, location: e.target.value})}
                  placeholder="ग्रामपंचायत मैदान"
                />
              </div>

              <div>
                <Label htmlFor="status">स्थिती</Label>
                <select
                  id="status"
                  value={editingProgram.status}
                  onChange={(e) => setEditingProgram({...editingProgram, status: e.target.value as any})}
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
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingProgram.imageUrl && (
                    <img
                      src={editingProgram.imageUrl}
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
