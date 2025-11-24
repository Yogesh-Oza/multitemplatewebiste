'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Users, Calendar, Clock, MapPin, FileText, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MeetingNotification {
  id: string;
  title: string;
  titleEn: string;
  type: string;
  date: string;
  time: string;
  venue: string;
  venueEn: string;
  agenda: string[];
  agendaEn: string[];
  status: string;
  priority: string;
  attendees: number;
  quorum: number;
  documents: Array<{ name: string; nameEn: string; url: string; type: string }>;
  lastUpdated: string;
  isActive: boolean;
  order: number;
}

export default function MeetingNotificationsAdmin() {
  const [meetings, setMeetings] = useState<MeetingNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<MeetingNotification | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    type: 'gram-sabha',
    date: '',
    time: '',
    venue: '',
    venueEn: '',
    agenda: [] as string[],
    agendaEn: [] as string[],
    status: 'upcoming',
    priority: 'medium',
    attendees: 0,
    quorum: 0,
    documents: [] as Array<{ name: string; nameEn: string; url: string; type: string }>,
    lastUpdated: new Date().toISOString().split('T')[0],
    isActive: true,
    order: 0
  });
  const [agendaItem, setAgendaItem] = useState({ marathi: '', english: '' });
  const [documentItem, setDocumentItem] = useState({ name: '', nameEn: '', url: '', type: 'agenda' });

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await fetch('/api/meeting-notifications');
      if (response.ok) {
        const data = await response.json();
        setMeetings(data);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
      toast.error('बैठकी लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/meeting-notifications';
      const method = editingMeeting ? 'PUT' : 'POST';
      
      const body = editingMeeting 
        ? { ...formData, id: editingMeeting.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchMeetings();
        setIsModalOpen(false);
        setEditingMeeting(null);
        resetForm();
        toast.success(editingMeeting ? 'बैठक अपडेट केली' : 'बैठक जोडली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast.error('बैठक सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (meeting: MeetingNotification) => {
    setEditingMeeting(meeting);
    setFormData({
      title: meeting.title,
      titleEn: meeting.titleEn,
      type: meeting.type,
      date: meeting.date,
      time: meeting.time,
      venue: meeting.venue,
      venueEn: meeting.venueEn,
      agenda: Array.isArray(meeting.agenda) ? meeting.agenda : [],
      agendaEn: Array.isArray(meeting.agendaEn) ? meeting.agendaEn : [],
      status: meeting.status,
      priority: meeting.priority,
      attendees: meeting.attendees,
      quorum: meeting.quorum,
      documents: Array.isArray(meeting.documents) ? meeting.documents : [],
      lastUpdated: meeting.lastUpdated,
      isActive: meeting.isActive,
      order: meeting.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही ही बैठक हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/meeting-notifications?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchMeetings();
          toast.success('बैठक हटवली');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting meeting:', error);
        toast.error('बैठक हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (meeting: MeetingNotification) => {
    try {
      const response = await fetch('/api/meeting-notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: meeting.id,
          ...meeting,
          isActive: !meeting.isActive
        })
      });
      if (response.ok) {
        await fetchMeetings();
        toast.success(meeting.isActive ? 'बैठक निष्क्रिय केली' : 'बैठक सक्रिय केली');
      }
    } catch (error) {
      console.error('Error toggling meeting:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      type: 'gram-sabha',
      date: '',
      time: '',
      venue: '',
      venueEn: '',
      agenda: [],
      agendaEn: [],
      status: 'upcoming',
      priority: 'medium',
      attendees: 0,
      quorum: 0,
      documents: [],
      lastUpdated: new Date().toISOString().split('T')[0],
      isActive: true,
      order: 0
    });
    setAgendaItem({ marathi: '', english: '' });
    setDocumentItem({ name: '', nameEn: '', url: '', type: 'agenda' });
  };

  const addAgendaItem = () => {
    if (agendaItem.marathi.trim()) {
      setFormData({
        ...formData,
        agenda: [...formData.agenda, agendaItem.marathi],
        agendaEn: [...formData.agendaEn, agendaItem.english]
      });
      setAgendaItem({ marathi: '', english: '' });
    }
  };

  const removeAgendaItem = (index: number) => {
    const newAgenda = formData.agenda.filter((_, i) => i !== index);
    const newAgendaEn = formData.agendaEn.filter((_, i) => i !== index);
    setFormData({ ...formData, agenda: newAgenda, agendaEn: newAgendaEn });
  };

  const addDocument = () => {
    if (documentItem.name.trim() && documentItem.url.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...documentItem }]
      });
      setDocumentItem({ name: '', nameEn: '', url: '', type: 'agenda' });
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
          <h2 className="text-2xl font-bold text-gray-900">बैठकीच्या सूचना</h2>
          <p className="text-gray-600 mt-1">Meeting Notifications Management</p>
        </div>
        <Button onClick={() => {
          setEditingMeeting(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन बैठक जोडा
        </Button>
      </div>

      {meetings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोणतीही बैठक नाही</h3>
            <p className="text-gray-500 mb-4">नवीन बैठक जोडण्यासाठी वरील बटणावर क्लिक करा</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meetings.map((meeting) => (
            <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{meeting.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{meeting.titleEn}</p>
                  </div>
                  <Badge variant={meeting.isActive ? "default" : "secondary"}>
                    {meeting.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{meeting.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{meeting.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{meeting.venue}</span>
                  </div>
                  <Badge className={`${meeting.priority === 'high' ? 'bg-red-100 text-red-700' : meeting.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {meeting.priority === 'high' ? 'उच्च' : meeting.priority === 'medium' ? 'मध्यम' : 'कमी'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(meeting)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(meeting)}>
                    {meeting.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(meeting.id)}>
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
                <h3 className="text-2xl font-bold">{editingMeeting ? 'बैठक संपादित करा' : 'नवीन बैठक जोडा'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsModalOpen(false);
                  setEditingMeeting(null);
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
                      <option value="gram-sabha">ग्रामसभा</option>
                      <option value="village-committee">गाव समिती</option>
                      <option value="special-meeting">विशेष बैठक</option>
                    </select>
                  </div>
                  <div>
                    <Label>स्थिती</Label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="upcoming">येत आहे</option>
                      <option value="ongoing">चालू</option>
                      <option value="completed">पूर्ण</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>तारीख</Label>
                    <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
                  </div>
                  <div>
                    <Label>वेळ</Label>
                    <Input value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="11:00 AM" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>स्थान (Marathi)</Label>
                    <Input value={formData.venue} onChange={(e) => setFormData({ ...formData, venue: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Venue (English)</Label>
                    <Input value={formData.venueEn} onChange={(e) => setFormData({ ...formData, venueEn: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>उपस्थित</Label>
                    <Input type="number" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label>क्वोरम</Label>
                    <Input type="number" value={formData.quorum} onChange={(e) => setFormData({ ...formData, quorum: parseInt(e.target.value) || 0 })} />
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
                  <Label>अजेंडा</Label>
                  <div className="space-y-2">
                    {formData.agenda.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{item}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeAgendaItem(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input placeholder="अजेंडा मुद्दा (Marathi)" value={agendaItem.marathi} onChange={(e) => setAgendaItem({ ...agendaItem, marathi: e.target.value })} />
                      <Input placeholder="Agenda Item (English)" value={agendaItem.english} onChange={(e) => setAgendaItem({ ...agendaItem, english: e.target.value })} />
                      <Button type="button" onClick={addAgendaItem}>जोडा</Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>दस्तावेज</Label>
                  <div className="space-y-2">
                    {formData.documents.map((doc, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <span className="flex-1">{doc.name}</span>
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeDocument(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <div className="grid grid-cols-4 gap-2">
                      <Input placeholder="नाव (Marathi)" value={documentItem.name} onChange={(e) => setDocumentItem({ ...documentItem, name: e.target.value })} />
                      <Input placeholder="Name (English)" value={documentItem.nameEn} onChange={(e) => setDocumentItem({ ...documentItem, nameEn: e.target.value })} />
                      <Input placeholder="URL" value={documentItem.url} onChange={(e) => setDocumentItem({ ...documentItem, url: e.target.value })} />
                      <select value={documentItem.type} onChange={(e) => setDocumentItem({ ...documentItem, type: e.target.value })} className="px-3 py-2 border rounded-md">
                        <option value="agenda">अजेंडा</option>
                        <option value="minutes">नोंद</option>
                        <option value="notice">सूचना</option>
                        <option value="resolution">निर्णय</option>
                      </select>
                    </div>
                    <Button type="button" onClick={addDocument}>दस्तावेज जोडा</Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingMeeting ? 'अपडेट करा' : 'जोडा'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingMeeting(null);
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

