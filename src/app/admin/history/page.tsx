'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  BookOpen,
  Users,
  TrendingUp,
  Save,
  Globe
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface HistoryCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

const iconOptions = [
  { value: 'BookOpen', label: 'पुस्तक (BookOpen)' },
  { value: 'Users', label: 'लोक (Users)' },
  { value: 'TrendingUp', label: 'वाढ (TrendingUp)' },
  { value: 'History', label: 'इतिहास (History)' },
  { value: 'Globe', label: 'जग (Globe)' }
];

const gradientOptions = [
  { value: 'from-amber-500 to-orange-600', label: 'नारंगी (Amber-Orange)' },
  { value: 'from-emerald-500 to-teal-600', label: 'हिरवा (Emerald-Teal)' },
  { value: 'from-blue-500 to-indigo-600', label: 'निळा (Blue-Indigo)' },
  { value: 'from-purple-500 to-pink-600', label: 'जांभळा (Purple-Pink)' },
  { value: 'from-red-500 to-rose-600', label: 'लाल (Red-Rose)' }
];

export default function HistoryPage() {
  const [cards, setCards] = useState<HistoryCard[]>([]);
  const [editingCard, setEditingCard] = useState<HistoryCard | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch cards from API
  const fetchCards = async () => {
    try {
      const response = await fetch('/api/history-cards');
      if (response.ok) {
        const data = await response.json();
        setCards(data);
      }
    } catch (error) {
      console.error('Error fetching history cards:', error);
      toast.error('इतिहास कार्ड लोड करताना त्रुटी');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleEdit = (card: HistoryCard) => {
    setEditingCard(card);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingCard({
      id: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      gradient: 'from-amber-500 to-orange-600',
      icon: 'BookOpen'
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingCard) return;

    try {
      if (isAdding) {
        const response = await fetch('/api/history-cards', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCard),
        });

        if (response.ok) {
          const newCard = await response.json();
          setCards(prev => [...prev, newCard]);
          toast.success('नवीन कार्ड जोडले');
        } else {
          throw new Error('Failed to create card');
        }
      } else {
        const response = await fetch('/api/history-cards', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingCard),
        });

        if (response.ok) {
          const updatedCard = await response.json();
          setCards(prev => prev.map(card => 
            card.id === editingCard.id ? updatedCard : card
          ));
          toast.success('कार्ड अपडेट केले');
        } else {
          throw new Error('Failed to update card');
        }
      }

      setEditingCard(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving card:', error);
      toast.error('कार्ड सेव्ह करताना त्रुटी');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/history-cards?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCards(prev => prev.filter(card => card.id !== id));
        toast.success('कार्ड हटवले');
      } else {
        throw new Error('Failed to delete card');
      }
    } catch (error) {
      console.error('Error deleting card:', error);
      toast.error('कार्ड हटवताना त्रुटी');
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setIsAdding(false);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'BookOpen': return <BookOpen className="h-12 w-12 mx-auto" />;
      case 'Users': return <Users className="h-12 w-12 mx-auto" />;
      case 'TrendingUp': return <TrendingUp className="h-12 w-12 mx-auto" />;
      case 'History': return <History className="h-12 w-12 mx-auto" />;
      case 'Globe': return <Globe className="h-12 w-12 mx-auto" />;
      default: return <BookOpen className="h-12 w-12 mx-auto" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">लोड होत आहे...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">इतिहास कार्ड</h1>
          <p className="text-gray-600 mt-1">गावाचा इतिहास आणि परंपरा व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {cards.length} कार्ड
          </Badge>
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            नवीन कार्ड
          </Button>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className={`h-32 bg-gradient-to-br ${card.gradient} flex items-center justify-center`}>
              <div className="text-center text-white">
                <div className="text-3xl mb-2">
                  {getIconComponent(card.icon)}
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">{card.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{card.description}</p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(card)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(card.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isAdding ? 'नवीन कार्ड जोडा' : 'कार्ड संपादित करा'}
            </h2>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingCard.title}
                    onChange={(e) => setEditingCard({...editingCard, title: e.target.value})}
                    placeholder="ग्रामाचा इतिहास"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingCard.titleEn}
                    onChange={(e) => setEditingCard({...editingCard, titleEn: e.target.value})}
                    placeholder="Village History"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">वर्णन (मराठी)</Label>
                <Textarea
                  id="description"
                  value={editingCard.description}
                  onChange={(e) => setEditingCard({...editingCard, description: e.target.value})}
                  placeholder="आमच्या गावाचा समृद्ध इतिहास आणि परंपरा"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                <Textarea
                  id="descriptionEn"
                  value={editingCard.descriptionEn}
                  onChange={(e) => setEditingCard({...editingCard, descriptionEn: e.target.value})}
                  placeholder="Rich history and traditions of our village"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="gradient">ग्रेडिएंट</Label>
                  <select
                    id="gradient"
                    value={editingCard.gradient}
                    onChange={(e) => setEditingCard({...editingCard, gradient: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {gradientOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Label htmlFor="icon">आयकॉन</Label>
                  <select
                    id="icon"
                    value={editingCard.icon}
                    onChange={(e) => setEditingCard({...editingCard, icon: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <Button variant="outline" onClick={handleCancel}>
                रद्द करा
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                सेव्ह करा
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}