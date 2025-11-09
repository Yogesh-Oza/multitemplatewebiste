'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Search, Filter, Calendar, AlertCircle, Plus, Edit, Save, X, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { Announcement } from './types';

export function AnnouncementsSection() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [isUploadingAnnouncementImage, setIsUploadingAnnouncementImage] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Error fetching announcements:', error);
      toast.error('सूचना लोड करताना त्रुटी');
    } finally {
      setIsLoadingAnnouncements(false);
    }
  };

  const handleSaveAnnouncement = async () => {
    if (!editingAnnouncement) return;
    if (!editingAnnouncement.title || !editingAnnouncement.description || !editingAnnouncement.image) {
      toast.error('कृपया सर्व फील्ड भरा');
      return;
    }

    try {
      const url = editingAnnouncement.id 
        ? `/api/admin/announcements/${editingAnnouncement.id}` 
        : '/api/admin/announcements';
      const method = editingAnnouncement.id ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editingAnnouncement.title,
          date: editingAnnouncement.date,
          description: editingAnnouncement.description,
          fullDescription: editingAnnouncement.fullDescription,
          image: editingAnnouncement.image,
          category: editingAnnouncement.category,
          priority: editingAnnouncement.priority,
          status: editingAnnouncement.status,
          order: editingAnnouncement.order || 0,
        }),
      });

      if (response.ok) {
        toast.success(editingAnnouncement.id ? 'सूचना अपडेट केली' : 'सूचना जोडली');
        setEditingAnnouncement(null);
        fetchAnnouncements();
      } else {
        throw new Error('Failed to save announcement');
      }
    } catch (error) {
      console.error('Error saving announcement:', error);
      toast.error('सूचना सेव्ह करताना त्रुटी');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही ही सूचना हटवू इच्छिता?')) return;
    
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('सूचना हटवली');
        fetchAnnouncements();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('हटवताना त्रुटी');
    }
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    const matchesSearch = announcement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         announcement.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || announcement.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="announcements">
        <AccordionTrigger className="hover:no-underline">
          <div className="flex items-center justify-between w-full pr-4">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-5 w-5 text-purple-600" />
              <div className="text-left">
                <h2 className="text-xl font-semibold text-gray-900">सूचना व्यवस्थापन</h2>
                <p className="text-sm text-gray-600">सूचना आणि जाहीराती व्यवस्थापन</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              {announcements.length} एकूण
            </Badge>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-6 pt-4">
            <div className="flex justify-end">
              <Button
                onClick={() => setEditingAnnouncement({
                  title: '',
                  date: '',
                  description: '',
                  fullDescription: '',
                  image: '',
                  category: '',
                  priority: 'medium',
                  status: 'active',
                  isActive: true,
                  order: announcements.length
                })}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                नवीन सूचना
              </Button>
            </div>

            {/* Search and Filter */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="searchAnnouncements">शोधा</Label>
                    <div className="relative mt-2">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="searchAnnouncements"
                        placeholder="सूचना शोधा..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="filterStatus">स्थिती</Label>
                    <select
                      id="filterStatus"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="all">सर्व</option>
                      <option value="active">सक्रिय</option>
                      <option value="completed">पूर्ण</option>
                      <option value="upcoming">येत आहे</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      अधिक फिल्टर
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add/Edit Announcement Form */}
            {editingAnnouncement && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      {editingAnnouncement.id ? 'सूचना संपादित करा' : 'नवीन सूचना जोडा'}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingAnnouncement(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="announcementTitle">शीर्षक</Label>
                      <Input
                        id="announcementTitle"
                        value={editingAnnouncement.title}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, title: e.target.value })}
                        placeholder="सूचनेचे शीर्षक"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcementDate">तारीख</Label>
                      <Input
                        id="announcementDate"
                        value={editingAnnouncement.date}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, date: e.target.value })}
                        placeholder="२३ मार्च २०२४"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcementCategory">श्रेणी</Label>
                      <Input
                        id="announcementCategory"
                        value={editingAnnouncement.category}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, category: e.target.value })}
                        placeholder="पाणीपुरवठा"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcementPriority">प्राधान्य</Label>
                      <select
                        id="announcementPriority"
                        value={editingAnnouncement.priority}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, priority: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="low">कमी</option>
                        <option value="medium">मध्यम</option>
                        <option value="high">उच्च</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="announcementStatus">स्थिती</Label>
                      <select
                        id="announcementStatus"
                        value={editingAnnouncement.status}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="active">सक्रिय</option>
                        <option value="completed">पूर्ण</option>
                        <option value="upcoming">येत आहे</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="announcementDescription">वर्णन</Label>
                      <textarea
                        id="announcementDescription"
                        value={editingAnnouncement.description}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, description: e.target.value })}
                        placeholder="सूचनेचे वर्णन"
                        className="w-full min-h-[100px] px-3 py-2 border rounded-md"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="announcementFullDescription">पूर्ण वर्णन</Label>
                      <textarea
                        id="announcementFullDescription"
                        value={editingAnnouncement.fullDescription || ''}
                        onChange={(e) => setEditingAnnouncement({ ...editingAnnouncement, fullDescription: e.target.value })}
                        placeholder="सूचनेचे पूर्ण वर्णन"
                        className="w-full min-h-[150px] px-3 py-2 border rounded-md"
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
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;

                            setIsUploadingAnnouncementImage(true);
                            try {
                              const formData = new FormData();
                              formData.append('file', file);
                              
                              const uploadResponse = await fetch('/api/upload', {
                                method: 'POST',
                                body: formData,
                              });

                              if (uploadResponse.ok) {
                                const uploadData = await uploadResponse.json();
                                setEditingAnnouncement({ ...editingAnnouncement, image: uploadData.imageUrl || uploadData.url });
                                toast.success('प्रतिमा अपलोड केली');
                              } else {
                                toast.error('प्रतिमा अपलोड करताना त्रुटी');
                              }
                            } catch (error) {
                              console.error('Upload error:', error);
                              toast.error('प्रतिमा अपलोड करताना त्रुटी');
                            } finally {
                              setIsUploadingAnnouncementImage(false);
                            }
                          }}
                          disabled={isUploadingAnnouncementImage}
                        />
                      </label>
                      {editingAnnouncement.image && (
                        <div className="mt-2">
                          <img src={editingAnnouncement.image} alt="Preview" className="h-20 w-20 rounded object-cover border" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setEditingAnnouncement(null)}
                    >
                      रद्द करा
                    </Button>
                    <Button
                      onClick={handleSaveAnnouncement}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      सेव्ह करा
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Announcements Grid */}
            <div>
              {isLoadingAnnouncements ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                  <span className="ml-2 text-gray-600">लोड होत आहे...</span>
                </div>
              ) : filteredAnnouncements.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">कोणतीही सूचना सापडली नाही</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAnnouncements.map((announcement) => (
                    <Card key={announcement.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
                      <div className="relative">
                        <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                          {announcement.image ? (
                            <img
                              src={announcement.image}
                              alt={announcement.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <AlertCircle className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="absolute top-2 left-2 flex space-x-2">
                          <Badge className={`${
                            announcement.priority === 'high' ? 'bg-red-500' :
                            announcement.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          } text-white border-0`}>
                            {announcement.category}
                          </Badge>
                          <Badge className={`${
                            announcement.status === 'active' ? 'bg-green-100 text-green-800' :
                            announcement.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          } border-0`}>
                            {announcement.status === 'active' ? 'सक्रिय' :
                             announcement.status === 'completed' ? 'पूर्ण' : 'येत आहे'}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{announcement.title}</h4>
                        <div className="flex items-center mb-2 text-gray-500">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span className="text-xs">{announcement.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">{announcement.description}</p>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAnnouncement(announcement)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteAnnouncement(announcement.id!)}
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

