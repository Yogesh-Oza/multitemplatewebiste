'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Newspaper, Plus, Edit, Save, X, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { NewsItem } from './types';

export function NewsUpdatesSection() {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [isLoadingNews, setIsLoadingNews] = useState(true);
  const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
  const [isUploadingNewsImage, setIsUploadingNewsImage] = useState(false);

  useEffect(() => {
    fetchNewsItems();
  }, []);

  const fetchNewsItems = async () => {
    try {
      const response = await fetch('/api/news-items');
      if (response.ok) {
        const data = await response.json();
        setNewsItems(data);
      }
    } catch (error) {
      console.error('Error fetching news items:', error);
      toast.error('बातम्या लोड करताना त्रुटी');
    } finally {
      setIsLoadingNews(false);
    }
  };

  const handleSaveNews = async () => {
    if (!editingNews) return;
    if (!editingNews.title || !editingNews.description || !editingNews.imageUrl) {
      toast.error('कृपया सर्व फील्ड भरा');
      return;
    }

    try {
      const url = '/api/news-items';
      const method = editingNews.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNews),
      });

      if (response.ok) {
        toast.success(editingNews.id ? 'बातमी अपडेट केली' : 'बातमी जोडली');
        setEditingNews(null);
        fetchNewsItems();
      } else {
        throw new Error('Failed to save news');
      }
    } catch (error) {
      console.error('Error saving news:', error);
      toast.error('बातमी सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही ही बातमी हटवू इच्छिता?')) return;
    
    try {
      const response = await fetch(`/api/news-items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('बातमी हटवली');
        fetchNewsItems();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('हटवताना त्रुटी');
    }
  };

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="news-updates">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <Newspaper className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">ताज्या बातम्या व अद्यतन</h2>
                <p className="text-sm text-gray-600">गावातील महत्त्वाच्या सूचना, उपलब्धी आणि विकासाच्या नवीनतम बातम्या</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {newsItems.filter(n => n.isActive).length} सक्रिय
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setEditingNews({
                  title: '',
                  description: '',
                  date: new Date().toLocaleDateString('mr-IN'),
                  imageUrl: '',
                  category: '',
                  categoryColor: 'bg-blue-500',
                  isUrgent: false,
                  order: newsItems.length,
                  isActive: true
                })}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                नवीन बातमी जोडा
              </Button>
            </div>

            {/* Add/Edit News Form */}
            {editingNews && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <Newspaper className="h-5 w-5 mr-2" />
                      {editingNews.id ? 'बातमी संपादित करा' : 'नवीन बातमी जोडा'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingNews(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="newsTitle">शीर्षक</Label>
                      <Input
                        id="newsTitle"
                        value={editingNews.title}
                        onChange={(e) => setEditingNews({ ...editingNews, title: e.target.value })}
                        placeholder="नवीन पाणी पुरवठा योजना यशस्वी"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="newsDescription">वर्णन</Label>
                      <textarea
                        id="newsDescription"
                        value={editingNews.description}
                        onChange={(e) => setEditingNews({ ...editingNews, description: e.target.value })}
                        placeholder="गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा..."
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newsDate">दिनांक</Label>
                      <Input
                        id="newsDate"
                        value={editingNews.date}
                        onChange={(e) => setEditingNews({ ...editingNews, date: e.target.value })}
                        placeholder="२३ मार्च २०२४"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newsCategory">श्रेणी</Label>
                      <Input
                        id="newsCategory"
                        value={editingNews.category}
                        onChange={(e) => setEditingNews({ ...editingNews, category: e.target.value })}
                        placeholder="पायाभूत सुविधा"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newsCategoryColor">श्रेणी रंग</Label>
                      <Input
                        id="newsCategoryColor"
                        value={editingNews.categoryColor}
                        onChange={(e) => setEditingNews({ ...editingNews, categoryColor: e.target.value })}
                        placeholder="bg-blue-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="newsOrder">क्रम</Label>
                      <Input
                        id="newsOrder"
                        type="number"
                        value={editingNews.order}
                        onChange={(e) => setEditingNews({ ...editingNews, order: parseInt(e.target.value) || 0 })}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>प्रतिमा</Label>
                    <div className="mt-2">
                      <label className="inline-flex items-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <Upload className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">प्रतिमा अपलोड करा</span>
                        <input
                          type="file"
                          accept={process.env.NEXT_PUBLIC_UPLOAD_ALLOWED_FILE_TYPES || 'image/*'}
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploadingNewsImage(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const uploadResponse = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });

                              if (uploadResponse.ok) {
                                const uploadData = await uploadResponse.json();
                                setEditingNews({ ...editingNews, imageUrl: uploadData.imageUrl || uploadData.url });
                                toast.success('प्रतिमा अपलोड केली');
                              } else {
                                toast.error('प्रतिमा अपलोड करताना त्रुटी');
                              }
                            } catch (error) {
                              console.error('Upload error:', error);
                              toast.error('प्रतिमा अपलोड करताना त्रुटी');
                            } finally {
                              setIsUploadingNewsImage(false);
                            }
                          }}
                          disabled={isUploadingNewsImage}
                        />
                      </label>
                      {editingNews.imageUrl && (
                        <div className="mt-2">
                          <img src={editingNews.imageUrl} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNews.isUrgent}
                        onChange={(e) => setEditingNews({ ...editingNews, isUrgent: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">तातडीचे</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingNews.isActive}
                        onChange={(e) => setEditingNews({ ...editingNews, isActive: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">सक्रिय</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingNews(null)}
                    >
                      रद्द करा
                    </Button>
                    <Button
                      onClick={handleSaveNews}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      सेव्ह करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* News Grid */}
            <div>
              {isLoadingNews ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">लोड होत आहे...</span>
                </div>
              ) : newsItems.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">अजून कोणतीही बातमी नाही</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {newsItems.map((item) => (
                    <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Newspaper className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge 
                            variant={item.isActive ? "default" : "secondary"}
                            className={item.isActive ? "bg-green-500" : "bg-gray-500"}
                          >
                            {item.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                        </div>
                        {item.isUrgent && (
                          <div className="absolute top-2 left-2">
                            <Badge className="bg-red-500">तातडीचे</Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h4>
                        <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingNews(item)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteNews(item.id!)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

