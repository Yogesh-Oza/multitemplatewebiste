'use client';

import { useState } from 'react';
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
  Save
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
}

const mockHistoryCards: HistoryCard[] = [
  {
    id: '1',
    title: 'ग्रामाचा इतिहास',
    titleEn: 'Village History',
    description: 'आमच्या गावाचा समृद्ध इतिहास आणि परंपरा',
    descriptionEn: 'Rich history and traditions of our village',
    gradient: 'from-amber-500 to-orange-600',
    icon: 'BookOpen'
  },
  {
    id: '2',
    title: 'सांस्कृतिक वारसा',
    titleEn: 'Cultural Heritage',
    description: 'सांस्कृतिक उत्सव आणि परंपरागत कला',
    descriptionEn: 'Cultural festivals and traditional arts',
    gradient: 'from-emerald-500 to-teal-600',
    icon: 'Users'
  },
  {
    id: '3',
    title: 'सामाजिक विकास',
    titleEn: 'Social Development',
    description: 'गावाच्या सामाजिक प्रगतीचा प्रवास',
    descriptionEn: 'Journey of social progress in the village',
    gradient: 'from-blue-500 to-indigo-600',
    icon: 'TrendingUp'
  }
];

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
  const [cards, setCards] = useState<HistoryCard[]>(mockHistoryCards);
  const [editingCard, setEditingCard] = useState<HistoryCard | null>(null);
  const [isAdding, setIsAdding] = useState(false);

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

  const handleSave = () => {
    if (!editingCard) return;

    if (isAdding) {
      const newCard = { ...editingCard, id: Date.now().toString() };
      setCards(prev => [...prev, newCard]);
      toast.success('नवीन कार्ड जोडले');
    } else {
      setCards(prev => prev.map(card => 
        card.id === editingCard.id ? editingCard : card
      ));
      toast.success('कार्ड अपडेट केले');
    }

    setEditingCard(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setCards(prev => prev.filter(card => card.id !== id));
    toast.success('कार्ड हटवले');
  };

  const handleCancel = () => {
    setEditingCard(null);
    setIsAdding(false);
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
            <h1 className="text-3xl font-bold text-gray-900">इतिहास कार्ड</h1>
            <p className="text-gray-600 mt-1">गावाचा इतिहास आणि परंपरा व्यवस्थापन</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {cards.length} कार्ड
          </Badge>
          <Button onClick={handleAdd} className="bg-purple-600 hover:bg-purple-700">
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
                  {card.icon === 'BookOpen' && <BookOpen className="h-12 w-12 mx-auto" />}
                  {card.icon === 'Users' && <Users className="h-12 w-12 mx-auto" />}
                  {card.icon === 'TrendingUp' && <TrendingUp className="h-12 w-12 mx-auto" />}
                  {card.icon === 'History' && <History className="h-12 w-12 mx-auto" />}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन कार्ड जोडा' : 'कार्ड संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div>
                  <Label htmlFor="gradient">रंग संयोजन</Label>
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
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={handleCancel}>
                  रद्द करा
                </Button>
                <Button onClick={handleSave} className="bg-purple-600 hover:bg-purple-700">
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
