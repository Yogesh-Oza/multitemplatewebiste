'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, AlertTriangle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface ImportantDeadline {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  deadline: string;
  time: string;
  description: string;
  descriptionEn: string;
  instructions: string[];
  instructionsEn: string[];
  documents: Array<{ name: string; nameEn: string; url: string; required: boolean }>;
  contactInfo: { name: string; nameEn: string; phone: string; email: string };
  priority: string;
  status: string;
  lastUpdated: string;
  isActive: boolean;
  order: number;
}

export default function ImportantDeadlinesAdmin() {
  const [deadlines, setDeadlines] = useState<ImportantDeadline[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeadline, setEditingDeadline] = useState<ImportantDeadline | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    type: 'tax',
    deadline: '',
    time: '',
    description: '',
    descriptionEn: '',
    instructions: [] as string[],
    instructionsEn: [] as string[],
    documents: [] as Array<{ name: string; nameEn: string; url: string; required: boolean }>,
    contactInfo: { name: '', nameEn: '', phone: '', email: '' },
    priority: 'medium',
    status: 'upcoming',
    lastUpdated: new Date().toISOString().split('T')[0],
    isActive: true,
    order: 0
  });
  const [instructionItem, setInstructionItem] = useState({ marathi: '', english: '' });
  const [documentItem, setDocumentItem] = useState({ name: '', nameEn: '', url: '', required: false });

  useEffect(() => {
    fetchDeadlines();
  }, []);

  const fetchDeadlines = async () => {
    try {
      const response = await fetch('/api/important-deadlines');
      if (response.ok) {
        const data = await response.json();
        setDeadlines(data);
      }
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      toast.error('मुदती लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/important-deadlines';
      const method = editingDeadline ? 'PUT' : 'POST';
      
      const body = editingDeadline 
        ? { ...formData, id: editingDeadline.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchDeadlines();
        setIsModalOpen(false);
        setEditingDeadline(null);
        resetForm();
        toast.success(editingDeadline ? 'मुदत अपडेट केली' : 'मुदत जोडली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving deadline:', error);
      toast.error('मुदत सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (deadline: ImportantDeadline) => {
    setEditingDeadline(deadline);
    setFormData({
      title: deadline.title,
      titleEn: deadline.titleEn,
      type: deadline.type,
      deadline: deadline.deadline,
      time: deadline.time,
      description: deadline.description,
      descriptionEn: deadline.descriptionEn,
      instructions: Array.isArray(deadline.instructions) ? deadline.instructions : [],
      instructionsEn: Array.isArray(deadline.instructionsEn) ? deadline.instructionsEn : [],
      documents: Array.isArray(deadline.documents) ? deadline.documents : [],
      contactInfo: deadline.contactInfo || { name: '', nameEn: '', phone: '', email: '' },
      priority: deadline.priority,
      status: deadline.status,
      lastUpdated: deadline.lastUpdated,
      isActive: deadline.isActive,
      order: deadline.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही ही मुदत हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/important-deadlines?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchDeadlines();
          toast.success('मुदत हटवली');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting deadline:', error);
        toast.error('मुदत हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (deadline: ImportantDeadline) => {
    try {
      const response = await fetch('/api/important-deadlines', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: deadline.id,
          ...deadline,
          isActive: !deadline.isActive
        })
      });
      if (response.ok) {
        await fetchDeadlines();
        toast.success(deadline.isActive ? 'मुदत निष्क्रिय केली' : 'मुदत सक्रिय केली');
      }
    } catch (error) {
      console.error('Error toggling deadline:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      type: 'tax',
      deadline: '',
      time: '',
      description: '',
      descriptionEn: '',
      instructions: [],
      instructionsEn: [],
      documents: [],
      contactInfo: { name: '', nameEn: '', phone: '', email: '' },
      priority: 'medium',
      status: 'upcoming',
      lastUpdated: new Date().toISOString().split('T')[0],
      isActive: true,
      order: 0
    });
    setInstructionItem({ marathi: '', english: '' });
    setDocumentItem({ name: '', nameEn: '', url: '', required: false });
  };

  const addInstruction = () => {
    if (instructionItem.marathi.trim()) {
      setFormData({
        ...formData,
        instructions: [...formData.instructions, instructionItem.marathi],
        instructionsEn: [...formData.instructionsEn, instructionItem.english]
      });
      setInstructionItem({ marathi: '', english: '' });
    }
  };

  const removeInstruction = (index: number) => {
    const newInstructions = formData.instructions.filter((_, i) => i !== index);
    const newInstructionsEn = formData.instructionsEn.filter((_, i) => i !== index);
    setFormData({ ...formData, instructions: newInstructions, instructionsEn: newInstructionsEn });
  };

  const addDocument = () => {
    if (documentItem.name.trim() && documentItem.url.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...documentItem }]
      });
      setDocumentItem({ name: '', nameEn: '', url: '', required: false });
    }
  };

  const removeDocument = (index: number) => {
    setFormData({
      ...formData,
      documents: formData.documents.filter((_, i) => i !== index)
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
          <h2 className="text-2xl font-bold text-gray-900">महत्त्वाच्या अंतिम मुदती</h2>
          <p className="text-gray-600 mt-1">Important Deadlines Management</p>
        </div>
        <Button onClick={() => {
          setEditingDeadline(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन मुदत जोडा
        </Button>
      </div>

      {deadlines.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertTriangle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोणतीही मुदत नाही</h3>
            <p className="text-gray-500 mb-4">नवीन मुदत जोडण्यासाठी वरील बटणावर क्लिक करा</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deadlines.map((deadline) => (
            <Card key={deadline.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{deadline.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{deadline.titleEn}</p>
                  </div>
                  <Badge variant={deadline.isActive ? "default" : "secondary"}>
                    {deadline.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">
                    <strong>मुदत:</strong> {deadline.deadline} ({deadline.time})
                  </div>
                  <Badge className={`${deadline.priority === 'urgent' ? 'bg-red-100 text-red-700' : deadline.priority === 'high' ? 'bg-orange-100 text-orange-700' : deadline.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {deadline.priority === 'urgent' ? 'तातडीचे' : deadline.priority === 'high' ? 'उच्च' : deadline.priority === 'medium' ? 'मध्यम' : 'कमी'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(deadline)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(deadline)}>
                    {deadline.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(deadline.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal - Similar structure to MeetingNotificationsAdmin but with deadline-specific fields */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{editingDeadline ? 'मुदत संपादित करा' : 'नवीन मुदत जोडा'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsModalOpen(false);
                  setEditingDeadline(null);
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
                      <option value="tax">कर भरणा</option>
                      <option value="election">निवडणुका</option>
                      <option value="camp">शिबिर</option>
                      <option value="application">अर्ज</option>
                      <option value="meeting">बैठक</option>
                      <option value="other">इतर</option>
                    </select>
                  </div>
                  <div>
                    <Label>स्थिती</Label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="upcoming">येत आहे</option>
                      <option value="due-soon">लवकरच येणार</option>
                      <option value="overdue">ओव्हरड्यू</option>
                      <option value="completed">पूर्ण</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>मुदत</Label>
                    <Input type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                  </div>
                  <div>
                    <Label>वेळ</Label>
                    <Input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="11:59 PM" required />
                  </div>
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
                  <Label>सूचना</Label>
                  <div className="space-y-2">
                    {formData.instructions.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeInstruction(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input placeholder="सूचना (Marathi)" value={instructionItem.marathi} onChange={(e) => setInstructionItem({ ...instructionItem, marathi: e.target.value })} />
                      <Input placeholder="Instruction (English)" value={instructionItem.english} onChange={(e) => setInstructionItem({ ...instructionItem, english: e.target.value })} />
                      <Button type="button" onClick={addInstruction}>जोडा</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>आवश्यक कागदपत्रे</Label>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{doc.name} {doc.required && <Badge className="ml-2">आवश्यक</Badge>}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="नाव (Marathi)" value={documentItem.name} onChange={(e) => setDocumentItem({ ...documentItem, name: e.target.value })} />
                      <Input placeholder="Name (English)" value={documentItem.nameEn} onChange={(e) => setDocumentItem({ ...documentItem, nameEn: e.target.value })} />
                      <Input placeholder="URL" value={documentItem.url} onChange={(e) => setDocumentItem({ ...documentItem, url: e.target.value })} />
                      <div className="flex items-center gap-2">
                        <input type="checkbox" checked={documentItem.required} onChange={(e) => setDocumentItem({ ...documentItem, required: e.target.checked })} />
                        <Label>आवश्यक</Label>
                      </div>
                    </div>
                    <Button type="button" onClick={addDocument}>दस्तावेज जोडा</Button>
                  </div>
                </div>

                <div>
                  <Label>संपर्क माहिती</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="नाव (Marathi)" value={formData.contactInfo.name} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, name: e.target.value } })} />
                    <Input placeholder="Name (English)" value={formData.contactInfo.nameEn} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, nameEn: e.target.value } })} />
                    <Input placeholder="फोन" value={formData.contactInfo.phone} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: e.target.value } })} />
                    <Input placeholder="ईमेल" value={formData.contactInfo.email} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value } })} />
                  </div>
                </div>

                <div>
                  <Label>प्राधान्य</Label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                    <option value="urgent">तातडीचे</option>
                    <option value="high">उच्च</option>
                    <option value="medium">मध्यम</option>
                    <option value="low">कमी</option>
                  </select>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingDeadline ? 'अपडेट करा' : 'जोडा'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingDeadline(null);
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

