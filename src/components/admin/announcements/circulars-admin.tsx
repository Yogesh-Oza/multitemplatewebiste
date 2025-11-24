'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Circular {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  department: string;
  departmentEn: string;
  number: string;
  date: string;
  priority: string;
  status: string;
  description: string;
  descriptionEn: string;
  content: string;
  contentEn: string;
  attachments: Array<{ name: string; nameEn: string; url: string; type: string; size: string }>;
  issuedBy: string;
  issuedByEn: string;
  lastUpdated: string;
  isActive: boolean;
  order: number;
}

export default function CircularsAdmin() {
  const [circulars, setCirculars] = useState<Circular[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCircular, setEditingCircular] = useState<Circular | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    type: 'circular',
    department: '',
    departmentEn: '',
    number: '',
    date: new Date().toISOString().split('T')[0],
    priority: 'medium',
    status: 'active',
    description: '',
    descriptionEn: '',
    content: '',
    contentEn: '',
    attachments: [] as Array<{ name: string; nameEn: string; url: string; type: string; size: string }>,
    issuedBy: '',
    issuedByEn: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    isActive: true,
    order: 0
  });
  const [attachmentItem, setAttachmentItem] = useState({ name: '', nameEn: '', url: '', type: 'pdf', size: '' });

  useEffect(() => {
    fetchCirculars();
  }, []);

  const fetchCirculars = async () => {
    try {
      const response = await fetch('/api/circulars');
      if (response.ok) {
        const data = await response.json();
        setCirculars(data);
      }
    } catch (error) {
      console.error('Error fetching circulars:', error);
      toast.error('परिपत्रके लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/circulars';
      const method = editingCircular ? 'PUT' : 'POST';
      
      const body = editingCircular 
        ? { ...formData, id: editingCircular.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchCirculars();
        setIsModalOpen(false);
        setEditingCircular(null);
        resetForm();
        toast.success(editingCircular ? 'परिपत्रक अपडेट केले' : 'परिपत्रक जोडले');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving circular:', error);
      toast.error('परिपत्रक सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (circular: Circular) => {
    setEditingCircular(circular);
    setFormData({
      title: circular.title,
      titleEn: circular.titleEn,
      type: circular.type,
      department: circular.department,
      departmentEn: circular.departmentEn,
      number: circular.number,
      date: circular.date,
      priority: circular.priority,
      status: circular.status,
      description: circular.description,
      descriptionEn: circular.descriptionEn,
      content: circular.content,
      contentEn: circular.contentEn,
      attachments: Array.isArray(circular.attachments) ? circular.attachments : [],
      issuedBy: circular.issuedBy,
      issuedByEn: circular.issuedByEn,
      lastUpdated: circular.lastUpdated,
      isActive: circular.isActive,
      order: circular.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हे परिपत्रक हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/circulars?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchCirculars();
          toast.success('परिपत्रक हटवले');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting circular:', error);
        toast.error('परिपत्रक हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (circular: Circular) => {
    try {
      const response = await fetch('/api/circulars', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...circular,
          isActive: !circular.isActive
        })
      });
      if (response.ok) {
        await fetchCirculars();
        toast.success(circular.isActive ? 'परिपत्रक निष्क्रिय केले' : 'परिपत्रक सक्रिय केले');
      }
    } catch (error) {
      console.error('Error toggling circular:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      type: 'circular',
      department: '',
      departmentEn: '',
      number: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      status: 'active',
      description: '',
      descriptionEn: '',
      content: '',
      contentEn: '',
      attachments: [],
      issuedBy: '',
      issuedByEn: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      isActive: true,
      order: 0
    });
    setAttachmentItem({ name: '', nameEn: '', url: '', type: 'pdf', size: '' });
  };

  const addAttachment = () => {
    if (attachmentItem.name.trim() && attachmentItem.url.trim()) {
      setFormData({
        ...formData,
        attachments: [...formData.attachments, { ...attachmentItem }]
      });
      setAttachmentItem({ name: '', nameEn: '', url: '', type: 'pdf', size: '' });
    }
  };

  const removeAttachment = (index: number) => {
    setFormData({
      ...formData,
      attachments: formData.attachments.filter((_, i) => i !== index)
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">परिपत्रके / आदेश / कार्यालयीन नोंदी</h2>
          <p className="text-gray-600 mt-1">Circulars / Orders / Official Notes Management</p>
        </div>
        <Button onClick={() => {
          setEditingCircular(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन परिपत्रक जोडा
        </Button>
      </div>

      {circulars.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोणतेही परिपत्रक नाही</h3>
            <p className="text-gray-500 mb-4">नवीन परिपत्रक जोडण्यासाठी वरील बटणावर क्लिक करा</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {circulars.map((circular) => (
            <Card key={circular.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{circular.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{circular.titleEn}</p>
                  </div>
                  <Badge variant={circular.isActive ? "default" : "secondary"}>
                    {circular.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">
                    <strong>विभाग:</strong> {circular.department}
                  </div>
                  <div className="text-gray-600">
                    <strong>क्र.:</strong> {circular.number}
                  </div>
                  <div className="text-gray-600">
                    <strong>तारीख:</strong> {circular.date}
                  </div>
                  <Badge className={`${circular.priority === 'high' ? 'bg-red-100 text-red-700' : circular.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {circular.priority === 'high' ? 'उच्च' : circular.priority === 'medium' ? 'मध्यम' : 'कमी'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(circular)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(circular)}>
                    {circular.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(circular.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{editingCircular ? 'परिपत्रक संपादित करा' : 'नवीन परिपत्रक जोडा'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsModalOpen(false);
                  setEditingCircular(null);
                  resetForm();
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>शीर्षक (Marathi)</Label>
                    <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Title (English)</Label>
                    <Input value={formData.titleEn} onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>प्रकार</Label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="circular">परिपत्रक</option>
                      <option value="order">आदेश</option>
                      <option value="memo">कार्यालयीन नोंद</option>
                      <option value="notification">सूचना</option>
                    </select>
                  </div>
                  <div>
                    <Label>स्थिती</Label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="active">सक्रिय</option>
                      <option value="superseded">रद्द</option>
                      <option value="draft">मसुदा</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>विभाग (Marathi)</Label>
                    <Input value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Department (English)</Label>
                    <Input value={formData.departmentEn} onChange={(e) => setFormData({ ...formData, departmentEn: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>क्र.</Label>
                    <Input value={formData.number} onChange={(e) => setFormData({ ...formData, number: e.target.value })} required />
                  </div>
                  <div>
                    <Label>तारीख</Label>
                    <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>जारी केले (Marathi)</Label>
                    <Input value={formData.issuedBy} onChange={(e) => setFormData({ ...formData, issuedBy: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Issued By (English)</Label>
                    <Input value={formData.issuedByEn} onChange={(e) => setFormData({ ...formData, issuedByEn: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <Label>प्राधान्य</Label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                    <option value="high">उच्च</option>
                    <option value="medium">मध्यम</option>
                    <option value="low">कमी</option>
                  </select>
                </div>

                <div>
                  <Label>वर्णन (Marathi)</Label>
                  <Textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                <div>
                  <Label>Description (English)</Label>
                  <Textarea value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} required />
                </div>

                <div>
                  <Label>सामग्री (Marathi)</Label>
                  <Textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} rows={4} required />
                </div>

                <div>
                  <Label>Content (English)</Label>
                  <Textarea value={formData.contentEn} onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })} rows={4} required />
                </div>

                <div>
                  <Label>संलग्नक</Label>
                  <div className="space-y-2">
                    {formData.attachments.map((att, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{att.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAttachment(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="grid grid-cols-5 gap-2">
                      <Input placeholder="नाव (Marathi)" value={attachmentItem.name} onChange={(e) => setAttachmentItem({ ...attachmentItem, name: e.target.value })} />
                      <Input placeholder="Name (English)" value={attachmentItem.nameEn} onChange={(e) => setAttachmentItem({ ...attachmentItem, nameEn: e.target.value })} />
                      <Input placeholder="URL" value={attachmentItem.url} onChange={(e) => setAttachmentItem({ ...attachmentItem, url: e.target.value })} />
                      <Input placeholder="Size (e.g., 2.5 MB)" value={attachmentItem.size} onChange={(e) => setAttachmentItem({ ...attachmentItem, size: e.target.value })} />
                      <select value={attachmentItem.type} onChange={(e) => setAttachmentItem({ ...attachmentItem, type: e.target.value })} className="px-3 py-2 border rounded-md">
                        <option value="pdf">PDF</option>
                        <option value="doc">DOC</option>
                        <option value="image">Image</option>
                      </select>
                    </div>
                    <Button type="button" onClick={addAttachment}>संलग्नक जोडा</Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingCircular ? 'अपडेट करा' : 'जोडा'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingCircular(null);
                    resetForm();
                  }}>रद्द करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

