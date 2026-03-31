'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Upload, Eye, EyeOff, Image as ImageIcon, History, BookOpen, Users, TrendingUp, Globe, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import Image from 'next/image';

interface TimelineItem {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl?: string;
  side: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface HistoryCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function HistoryAdminPage() {
  // Timeline Items State
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoadingTimeline, setIsLoadingTimeline] = useState(true);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const [editingTimeline, setEditingTimeline] = useState<TimelineItem | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [timelineFormData, setTimelineFormData] = useState({
    year: '',
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    imageUrl: '',
    side: 'left',
    order: 0,
    isActive: true
  });

  // History Cards State
  const [historyCards, setHistoryCards] = useState<HistoryCard[]>([]);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<HistoryCard | null>(null);
  const [cardFormData, setCardFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    descriptionEn: '',
    gradient: 'from-amber-500 to-orange-600',
    icon: 'BookOpen',
    order: 0,
    isActive: true
  });

  const [activeTab, setActiveTab] = useState<'timeline' | 'cards'>('timeline');

  useEffect(() => {
    fetchTimelineItems();
    fetchHistoryCards();
  }, []);

  const fetchTimelineItems = async () => {
    try {
      const response = await fetch('/api/timeline-items');
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
      }
    } catch (error) {
      console.error('Error fetching timeline items:', error);
      toast.error('टाइमलाइन आयटम लोड करताना त्रुटी');
    } finally {
      setIsLoadingTimeline(false);
    }
  };

  const fetchHistoryCards = async () => {
    try {
      const response = await fetch('/api/history-cards');
      if (response.ok) {
        const data = await response.json();
        setHistoryCards(data);
      }
    } catch (error) {
      console.error('Error fetching history cards:', error);
      toast.error('इतिहास कार्ड लोड करताना त्रुटी');
    } finally {
      setIsLoadingCards(false);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('कृपया प्रतिमा फाइल निवडा');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('फाइल आकार 10MB पेक्षा कमी असावा');
      return;
    }

    setIsUploadingImage(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadData = await uploadResponse.json();
      setTimelineFormData(prev => ({ ...prev, imageUrl: uploadData.imageUrl }));
      toast.success('प्रतिमा यशस्वीरित्या अपलोड केली');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('अपलोड करताना त्रुटी');
    } finally {
      setIsUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleTimelineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/timeline-items';
      const method = editingTimeline ? 'PUT' : 'POST';
      
      const body = editingTimeline 
        ? { ...timelineFormData, id: editingTimeline.id }
        : timelineFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchTimelineItems();
        setIsTimelineModalOpen(false);
        setEditingTimeline(null);
        resetTimelineForm();
        toast.success(editingTimeline ? 'टाइमलाइन आयटम अपडेट केले' : 'टाइमलाइन आयटम जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving timeline item:', error);
      toast.error('टाइमलाइन आयटम सेव्ह करताना त्रुटी');
    }
  };

  const handleTimelineEdit = (item: TimelineItem) => {
    setEditingTimeline(item);
    setTimelineFormData({
      year: item.year,
      title: item.title,
      titleEn: item.titleEn,
      description: item.description,
      descriptionEn: item.descriptionEn,
      imageUrl: item.imageUrl || '',
      side: item.side,
      order: item.order,
      isActive: item.isActive
    });
    setIsTimelineModalOpen(true);
  };

  const handleTimelineDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा टाइमलाइन आयटम हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/timeline-items?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchTimelineItems();
          toast.success('टाइमलाइन आयटम हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting timeline item:', error);
        toast.error('टाइमलाइन आयटम हटवताना त्रुटी');
      }
    }
  };

  const handleTimelineToggleActive = async (item: TimelineItem) => {
    try {
      const response = await fetch('/api/timeline-items', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...item,
          isActive: !item.isActive
        })
      });
      if (response.ok) {
        await fetchTimelineItems();
        toast.success(item.isActive ? 'टाइमलाइन आयटम निष्क्रिय केले' : 'टाइमलाइन आयटम सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling timeline item:', error);
      toast.error('त्रुटी');
    }
  };

  const resetTimelineForm = () => {
    setTimelineFormData({
      year: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      imageUrl: '',
      side: 'left',
      order: 0,
      isActive: true
    });
  };

  const handleCardSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/history-cards';
      const method = editingCard ? 'PUT' : 'POST';
      
      const body = editingCard 
        ? { ...cardFormData, id: editingCard.id }
        : cardFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchHistoryCards();
        setIsCardModalOpen(false);
        setEditingCard(null);
        resetCardForm();
        toast.success(editingCard ? 'इतिहास कार्ड अपडेट केले' : 'इतिहास कार्ड जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving history card:', error);
      toast.error('इतिहास कार्ड सेव्ह करताना त्रुटी');
    }
  };

  const handleCardEdit = (card: HistoryCard) => {
    setEditingCard(card);
    setCardFormData({
      title: card.title,
      titleEn: card.titleEn,
      description: card.description,
      descriptionEn: card.descriptionEn,
      gradient: card.gradient,
      icon: card.icon,
      order: card.order,
      isActive: card.isActive
    });
    setIsCardModalOpen(true);
  };

  const handleCardDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हे कार्ड हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/history-cards?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchHistoryCards();
          toast.success('इतिहास कार्ड हटवले');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting history card:', error);
        toast.error('इतिहास कार्ड हटवताना त्रुटी');
      }
    }
  };

  const handleCardToggleActive = async (card: HistoryCard) => {
    try {
      const response = await fetch('/api/history-cards', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...card,
          isActive: !card.isActive
        })
      });
      if (response.ok) {
        await fetchHistoryCards();
        toast.success(card.isActive ? 'इतिहास कार्ड निष्क्रिय केले' : 'इतिहास कार्ड सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling history card:', error);
      toast.error('त्रुटी');
    }
  };

  const resetCardForm = () => {
    setCardFormData({
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      gradient: 'from-amber-500 to-orange-600',
      icon: 'BookOpen',
      order: 0,
      isActive: true
    });
  };

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      BookOpen,
      Users,
      TrendingUp,
      History,
      Globe,
      Palette
    };
    const IconComponent = icons[iconName] || BookOpen;
    return IconComponent;
  };

  // Default timeline items
  const getDefaultTimelineItems = (): TimelineItem[] => [
    {
      id: 'default-1',
      year: '1950',
      title: 'गावाची स्थापना',
      titleEn: 'Village Foundation',
      description: 'आमच्या गावाची स्थापना आणि पहिले निवासी',
      descriptionEn: 'Foundation of our village and first residents',
      imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop',
      side: 'left',
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-2',
      year: '1970',
      title: 'पहिली ग्रामपंचायत',
      titleEn: 'First Gram Panchayat',
      description: 'लोकशाही व्यवस्थेची सुरुवात आणि स्थानिक स्वराज्य',
      descriptionEn: 'Beginning of democratic system and local self-governance',
      imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop',
      side: 'right',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-3',
      year: '1990',
      title: 'शिक्षणाची सुरुवात',
      titleEn: 'Education Begins',
      description: 'पहिले शाळा आणि शिक्षणाच्या सुविधांची सुरुवात',
      descriptionEn: 'First schools and beginning of educational facilities',
      imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
      side: 'left',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'default-4',
      year: '2010',
      title: 'डिजिटल युग',
      titleEn: 'Digital Era',
      description: 'तंत्रज्ञानाचा वापर आणि आधुनिकीकरण',
      descriptionEn: 'Use of technology and modernization',
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&h=400&fit=crop',
      side: 'right',
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  const displayTimelineItems = timelineItems.length > 0 ? timelineItems : getDefaultTimelineItems();
  const isShowingTimelineDefaults = timelineItems.length === 0;

  if (isLoadingTimeline || isLoadingCards) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">आमचे गाव – ओळख आणि संस्कृती</h1>
        <p className="text-gray-600 mt-2">गावाचा इतिहास, टाइमलाइन आणि इतिहास कार्ड व्यवस्थापन</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'timeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            टाइमलाइन आयटम ({timelineItems.length})
          </button>
          <button
            onClick={() => setActiveTab('cards')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cards'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            इतिहास कार्ड ({historyCards.length})
          </button>
        </nav>
      </div>

      {/* Timeline Items Section */}
      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditingTimeline(null);
              resetTimelineForm();
              setIsTimelineModalOpen(true);
            }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              नवीन टाइमलाइन आयटम जोडा
            </Button>
          </div>

          {/* Info message when showing defaults */}
          {isShowingTimelineDefaults && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">
                <strong>नोंद:</strong> हे डिफॉल्ट टाइमलाइन आयटम आहेत. तुम्ही "नवीन टाइमलाइन आयटम जोडा" बटणावर क्लिक करून स्वतःचे आयटम जोडू शकता.
              </p>
            </div>
          )}

          {/* Timeline Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayTimelineItems.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{item.year}</div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{item.titleEn}</p>
                    </div>
                    <Badge variant={item.isActive ? "default" : "secondary"}>
                      {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Image Preview */}
                    {item.imageUrl && (
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <Image
                          src={item.imageUrl}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {item.side === 'left' ? 'डावीकडे' : 'उजवीकडे'}
                      </Badge>
                    </div>

                    {!isShowingTimelineDefaults && (
                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTimelineEdit(item)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादित
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTimelineToggleActive(item)}
                          className={item.isActive ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {item.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTimelineDelete(item.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                    {isShowingTimelineDefaults && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-gray-500 text-center">
                          डिफॉल्ट आयटम - संपादन करण्यासाठी आयटम जोडा
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline Add/Edit Modal */}
          {isTimelineModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingTimeline ? 'टाइमलाइन आयटम संपादित करा' : 'नवीन टाइमलाइन आयटम जोडा'}
                  </h2>
                  
                  <form onSubmit={handleTimelineSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="year">वर्ष *</Label>
                        <Input
                          id="year"
                          value={timelineFormData.year}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, year: e.target.value }))}
                          required
                          placeholder="1950"
                        />
                      </div>
                      <div>
                        <Label htmlFor="side">बाजू</Label>
                        <select
                          id="side"
                          value={timelineFormData.side}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, side: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="left">डावीकडे</option>
                          <option value="right">उजवीकडे</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="timeline-title">शीर्षक (मराठी) *</Label>
                        <Input
                          id="timeline-title"
                          value={timelineFormData.title}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                          placeholder="गावाची स्थापना"
                        />
                      </div>
                      <div>
                        <Label htmlFor="timeline-titleEn">शीर्षक (इंग्रजी) *</Label>
                        <Input
                          id="timeline-titleEn"
                          value={timelineFormData.titleEn}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                          required
                          placeholder="Village Foundation"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="timeline-description">वर्णन (मराठी) *</Label>
                        <Textarea
                          id="timeline-description"
                          value={timelineFormData.description}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, description: e.target.value }))}
                          required
                          rows={3}
                          placeholder="आमच्या गावाची स्थापना आणि पहिले निवासी"
                        />
                      </div>
                      <div>
                        <Label htmlFor="timeline-descriptionEn">वर्णन (इंग्रजी) *</Label>
                        <Textarea
                          id="timeline-descriptionEn"
                          value={timelineFormData.descriptionEn}
                          onChange={(e) => setTimelineFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                          required
                          rows={3}
                          placeholder="Foundation of our village and first residents"
                        />
                      </div>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <Label>प्रतिमा</Label>
                      <div className="mt-2 space-y-2">
                        {timelineFormData.imageUrl && (
                          <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <Image
                              src={timelineFormData.imageUrl}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                        <Input
                          type="file"
                          accept={process.env.NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES || 'image/*'}
                          onChange={handleImageUpload}
                          disabled={isUploadingImage}
                        />
                        {isUploadingImage && (
                          <p className="text-xs text-gray-500">अपलोड होत आहे...</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="timeline-order">क्रम</Label>
                      <Input
                        id="timeline-order"
                        type="number"
                        value={timelineFormData.order}
                        onChange={(e) => setTimelineFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="timeline-isActive"
                        checked={timelineFormData.isActive}
                        onChange={(e) => setTimelineFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="timeline-isActive" className="cursor-pointer">सक्रिय</Label>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsTimelineModalOpen(false);
                          setEditingTimeline(null);
                          resetTimelineForm();
                        }}
                      >
                        रद्द करा
                      </Button>
                      <Button type="submit">
                        {editingTimeline ? 'अपडेट करा' : 'जोडा'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* History Cards Section */}
      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button onClick={() => {
              setEditingCard(null);
              resetCardForm();
              setIsCardModalOpen(true);
            }} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              नवीन इतिहास कार्ड जोडा
            </Button>
          </div>

          {/* History Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {historyCards.map((card) => {
              const IconComponent = getIconComponent(card.icon);
              return (
                <Card key={card.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{card.title}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{card.titleEn}</p>
                      </div>
                      <Badge variant={card.isActive ? "default" : "secondary"}>
                        {card.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className={`h-32 bg-gradient-to-br ${card.gradient} rounded-lg flex items-center justify-center`}>
                        <div className="text-white">
                          <IconComponent className="h-12 w-12" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-2">{card.description}</p>

                      <div className="flex items-center gap-2 pt-2 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCardEdit(card)}
                          className="flex-1"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          संपादित
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCardToggleActive(card)}
                          className={card.isActive ? 'text-yellow-600' : 'text-green-600'}
                        >
                          {card.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCardDelete(card.id)}
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

          {/* Card Add/Edit Modal */}
          {isCardModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-6">
                    {editingCard ? 'इतिहास कार्ड संपादित करा' : 'नवीन इतिहास कार्ड जोडा'}
                  </h2>
                  
                  <form onSubmit={handleCardSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="card-title">शीर्षक (मराठी) *</Label>
                        <Input
                          id="card-title"
                          value={cardFormData.title}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, title: e.target.value }))}
                          required
                          placeholder="ग्रामाचा इतिहास"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-titleEn">शीर्षक (इंग्रजी) *</Label>
                        <Input
                          id="card-titleEn"
                          value={cardFormData.titleEn}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                          required
                          placeholder="Village History"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="card-description">वर्णन (मराठी) *</Label>
                        <Textarea
                          id="card-description"
                          value={cardFormData.description}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, description: e.target.value }))}
                          required
                          rows={3}
                          placeholder="आमच्या गावाचा समृद्ध इतिहास आणि परंपरा"
                        />
                      </div>
                      <div>
                        <Label htmlFor="card-descriptionEn">वर्णन (इंग्रजी) *</Label>
                        <Textarea
                          id="card-descriptionEn"
                          value={cardFormData.descriptionEn}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, descriptionEn: e.target.value }))}
                          required
                          rows={3}
                          placeholder="Rich history and traditions of our village"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="card-gradient">ग्रेडिएंट</Label>
                        <select
                          id="card-gradient"
                          value={cardFormData.gradient}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, gradient: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="from-amber-500 to-orange-600">नारंगी (Amber-Orange)</option>
                          <option value="from-emerald-500 to-teal-600">हिरवा (Emerald-Teal)</option>
                          <option value="from-blue-500 to-indigo-600">निळा (Blue-Indigo)</option>
                          <option value="from-purple-500 to-pink-600">जांभळा (Purple-Pink)</option>
                          <option value="from-red-500 to-rose-600">लाल (Red-Rose)</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="card-icon">आयकॉन</Label>
                        <select
                          id="card-icon"
                          value={cardFormData.icon}
                          onChange={(e) => setCardFormData(prev => ({ ...prev, icon: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="BookOpen">पुस्तक (BookOpen)</option>
                          <option value="Users">लोक (Users)</option>
                          <option value="TrendingUp">वाढ (TrendingUp)</option>
                          <option value="History">इतिहास (History)</option>
                          <option value="Globe">जग (Globe)</option>
                          <option value="Palette">पॅलेट (Palette)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="card-order">क्रम</Label>
                      <Input
                        id="card-order"
                        type="number"
                        value={cardFormData.order}
                        onChange={(e) => setCardFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="card-isActive"
                        checked={cardFormData.isActive}
                        onChange={(e) => setCardFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="card-isActive" className="cursor-pointer">सक्रिय</Label>
                    </div>

                    <div className="flex justify-end gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsCardModalOpen(false);
                          setEditingCard(null);
                          resetCardForm();
                        }}
                      >
                        रद्द करा
                      </Button>
                      <Button type="submit">
                        {editingCard ? 'अपडेट करा' : 'जोडा'}
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

