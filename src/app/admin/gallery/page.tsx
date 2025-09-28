'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  Edit, 
  Trash2, 
  Plus,
  ArrowLeft,
  Save,
  Upload,
  Image,
  Eye,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface GalleryItem {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  imageUrl: string;
  category: string;
  date: string;
  isFeatured: boolean;
}

const mockGalleryItems: GalleryItem[] = [
  {
    id: '1',
    title: 'गणपती उत्सव २०२४',
    titleEn: 'Ganesh Festival 2024',
    description: 'गावातील गणपती उत्सवाच्या प्रतिमा',
    descriptionEn: 'Images from village Ganesh festival',
    imageUrl: '/images/gallery-1.jpg',
    category: 'उत्सव',
    date: '2024-09-15',
    isFeatured: true
  },
  {
    id: '2',
    title: 'ग्रामपंचायत मैदान',
    titleEn: 'Gram Panchayat Ground',
    description: 'ग्रामपंचायत मैदानाचे दृश्य',
    descriptionEn: 'View of Gram Panchayat ground',
    imageUrl: '/images/gallery-2.jpg',
    category: 'स्थळ',
    date: '2024-08-20',
    isFeatured: false
  },
  {
    id: '3',
    title: 'किसान मेळा',
    titleEn: 'Farmers Fair',
    description: 'शेती संबंधित प्रदर्शन',
    descriptionEn: 'Agricultural exhibition',
    imageUrl: '/images/gallery-3.jpg',
    category: 'कार्यक्रम',
    date: '2024-07-10',
    isFeatured: true
  },
  {
    id: '4',
    title: 'लोकनृत्य कार्यक्रम',
    titleEn: 'Folk Dance Program',
    description: 'परंपरागत लोकनृत्य प्रदर्शन',
    descriptionEn: 'Traditional folk dance performance',
    imageUrl: '/images/gallery-4.jpg',
    category: 'सांस्कृतिक',
    date: '2024-06-25',
    isFeatured: false
  }
];

const categories = [
  'उत्सव', 'कार्यक्रम', 'स्थळ', 'सांस्कृतिक', 'शेती', 'शिक्षण', 'आरोग्य', 'अन्य'
];

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(mockGalleryItems);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('सर्व');

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingItem({
      id: '',
      title: '',
      titleEn: '',
      description: '',
      descriptionEn: '',
      imageUrl: '',
      category: 'उत्सव',
      date: new Date().toISOString().split('T')[0],
      isFeatured: false
    });
    setIsAdding(true);
  };

  const handleSave = () => {
    if (!editingItem) return;

    if (isAdding) {
      const newItem = { ...editingItem, id: Date.now().toString() };
      setGalleryItems(prev => [...prev, newItem]);
      toast.success('नवीन प्रतिमा जोडली');
    } else {
      setGalleryItems(prev => prev.map(item => 
        item.id === editingItem.id ? editingItem : item
      ));
      toast.success('प्रतिमा अपडेट केली');
    }

    setEditingItem(null);
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setGalleryItems(prev => prev.filter(item => item.id !== id));
    toast.success('प्रतिमा हटवली');
  };

  const handleCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setEditingItem(prev => prev ? { ...prev, imageUrl } : null);
    toast.success('प्रतिमा अपलोड केली');
  };

  const handleToggleFeatured = (id: string) => {
    setGalleryItems(prev => prev.map(item => 
      item.id === id ? { ...item, isFeatured: !item.isFeatured } : item
    ));
    toast.success('प्रतिमा स्थिती अपडेट केली');
  };

  const filteredItems = selectedCategory === 'सर्व' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

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
            <h1 className="text-3xl font-bold text-gray-900">गॅलरी</h1>
            <p className="text-gray-600 mt-1">प्रतिमा गॅलरी व्यवस्थापन</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {galleryItems.length} प्रतिमा
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {galleryItems.filter(item => item.isFeatured).length} फीचर्ड
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            नवीन प्रतिमा
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

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="relative group">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-2 right-2">
                {item.isFeatured && (
                  <Badge className="bg-yellow-500 text-white">
                    फीचर्ड
                  </Badge>
                )}
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge className="bg-white text-gray-800">
                  {item.category}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="flex space-x-2">
                  <Button size="sm" variant="secondary">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="secondary">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{item.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
              <p className="text-xs text-gray-500 mb-4">
                {new Date(item.date).toLocaleDateString('mr-IN')}
              </p>
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(item)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  संपादन
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleToggleFeatured(item.id)}
                  className={item.isFeatured ? 'bg-yellow-100 text-yellow-700' : ''}
                >
                  ⭐
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700"
                  onClick={() => handleDelete(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन प्रतिमा जोडा' : 'प्रतिमा संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">शीर्षक (मराठी)</Label>
                  <Input
                    id="title"
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                    placeholder="गणपती उत्सव २०२४"
                  />
                </div>
                <div>
                  <Label htmlFor="titleEn">शीर्षक (इंग्रजी)</Label>
                  <Input
                    id="titleEn"
                    value={editingItem.titleEn}
                    onChange={(e) => setEditingItem({...editingItem, titleEn: e.target.value})}
                    placeholder="Ganesh Festival 2024"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="description">वर्णन (मराठी)</Label>
                  <Textarea
                    id="description"
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({...editingItem, description: e.target.value})}
                    placeholder="प्रतिमेचे तपशील"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="descriptionEn">वर्णन (इंग्रजी)</Label>
                  <Textarea
                    id="descriptionEn"
                    value={editingItem.descriptionEn}
                    onChange={(e) => setEditingItem({...editingItem, descriptionEn: e.target.value})}
                    placeholder="Image details"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">वर्ग</Label>
                  <select
                    id="category"
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({...editingItem, category: e.target.value})}
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
                  <Label htmlFor="date">तारीख</Label>
                  <Input
                    id="date"
                    type="date"
                    value={editingItem.date}
                    onChange={(e) => setEditingItem({...editingItem, date: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={editingItem.isFeatured}
                  onChange={(e) => setEditingItem({...editingItem, isFeatured: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isFeatured">फीचर्ड प्रतिमा</Label>
              </div>

              <div>
                <Label htmlFor="image">प्रतिमा</Label>
                <div className="mt-2">
                  {editingItem.imageUrl && (
                    <img
                      src={editingItem.imageUrl}
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
