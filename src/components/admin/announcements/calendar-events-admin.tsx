'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Calendar, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface CalendarEvent {
  id: string;
  title: string;
  titleEn: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  venueEn: string;
  type: string;
  description: string;
  descriptionEn: string;
  attendees: number;
  maxAttendees: number;
  status: string;
  priority: string;
  organizer: string;
  organizerEn: string;
  contactInfo: { phone: string; email: string };
  documents: Array<{ name: string; nameEn: string; url: string }>;
  reminders: boolean;
  isActive: boolean;
  order: number;
}

export default function CalendarEventsAdmin() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    titleEn: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    venueEn: '',
    type: 'gram-sabha',
    description: '',
    descriptionEn: '',
    attendees: 0,
    maxAttendees: 0,
    status: 'upcoming',
    priority: 'medium',
    organizer: '',
    organizerEn: '',
    contactInfo: { phone: '', email: '' },
    documents: [] as Array<{ name: string; nameEn: string; url: string }>,
    reminders: true,
    isActive: true,
    order: 0
  });
  const [documentItem, setDocumentItem] = useState({ name: '', nameEn: '', url: '' });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/calendar-events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('घटना लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/calendar-events';
      const method = editingEvent ? 'PUT' : 'POST';
      
      const body = editingEvent 
        ? { ...formData, id: editingEvent.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchEvents();
        setIsModalOpen(false);
        setEditingEvent(null);
        resetForm();
        toast.success(editingEvent ? 'घटना अपडेट केली' : 'घटना जोडली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving event:', error);
      toast.error('घटना सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (event: CalendarEvent) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      titleEn: event.titleEn,
      date: event.date,
      time: event.time,
      duration: event.duration,
      venue: event.venue,
      venueEn: event.venueEn,
      type: event.type,
      description: event.description,
      descriptionEn: event.descriptionEn,
      attendees: event.attendees,
      maxAttendees: event.maxAttendees,
      status: event.status,
      priority: event.priority,
      organizer: event.organizer,
      organizerEn: event.organizerEn,
      contactInfo: event.contactInfo || { phone: '', email: '' },
      documents: Array.isArray(event.documents) ? event.documents : [],
      reminders: event.reminders,
      isActive: event.isActive,
      order: event.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही ही घटना हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/calendar-events?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchEvents();
          toast.success('घटना हटवली');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('घटना हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (event: CalendarEvent) => {
    try {
      const response = await fetch('/api/calendar-events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          isActive: !event.isActive
        })
      });
      if (response.ok) {
        await fetchEvents();
        toast.success(event.isActive ? 'घटना निष्क्रिय केली' : 'घटना सक्रिय केली');
      }
    } catch (error) {
      console.error('Error toggling event:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      titleEn: '',
      date: '',
      time: '',
      duration: '',
      venue: '',
      venueEn: '',
      type: 'gram-sabha',
      description: '',
      descriptionEn: '',
      attendees: 0,
      maxAttendees: 0,
      status: 'upcoming',
      priority: 'medium',
      organizer: '',
      organizerEn: '',
      contactInfo: { phone: '', email: '' },
      documents: [],
      reminders: true,
      isActive: true,
      order: 0
    });
    setDocumentItem({ name: '', nameEn: '', url: '' });
  };

  const addDocument = () => {
    if (documentItem.name.trim() && documentItem.url.trim()) {
      setFormData({
        ...formData,
        documents: [...formData.documents, { ...documentItem }]
      });
      setDocumentItem({ name: '', nameEn: '', url: '' });
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
          <h2 className="text-2xl font-bold text-gray-900">इंटरअॅक्टिव्ह कॅलेंडर</h2>
          <p className="text-gray-600 mt-1">Interactive Calendar Management</p>
        </div>
        <Button onClick={() => {
          setEditingEvent(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन घटना जोडा
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोणतीही घटना नाही</h3>
            <p className="text-gray-500 mb-4">नवीन घटना जोडण्यासाठी वरील बटणावर क्लिक करा</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{event.titleEn}</p>
                  </div>
                  <Badge variant={event.isActive ? "default" : "secondary"}>
                    {event.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">
                    <strong>तारीख:</strong> {event.date}
                  </div>
                  <div className="text-gray-600">
                    <strong>वेळ:</strong> {event.time} ({event.duration})
                  </div>
                  <div className="text-gray-600">
                    <strong>स्थान:</strong> {event.venue}
                  </div>
                  <Badge className={`${event.priority === 'high' ? 'bg-red-100 text-red-700' : event.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {event.priority === 'high' ? 'उच्च' : event.priority === 'medium' ? 'मध्यम' : 'कमी'}
                  </Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(event)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(event)}>
                    {event.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(event.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Modal - Similar structure to other modals */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{editingEvent ? 'घटना संपादित करा' : 'नवीन घटना जोडा'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsModalOpen(false);
                  setEditingEvent(null);
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
                    <Label>कालावधी</Label>
                    <Input value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })} placeholder="2 hours" required />
                  </div>
                  <div>
                    <Label>प्रकार</Label>
                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="gram-sabha">ग्रामसभा</option>
                      <option value="village-committee">गाव समिती</option>
                      <option value="camp">शिबिर</option>
                      <option value="festival">उत्सव</option>
                      <option value="meeting">बैठक</option>
                      <option value="other">इतर</option>
                    </select>
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
                    <Label>आयोजक (Marathi)</Label>
                    <Input value={formData.organizer} onChange={(e) => setFormData({ ...formData, organizer: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Organizer (English)</Label>
                    <Input value={formData.organizerEn} onChange={(e) => setFormData({ ...formData, organizerEn: e.target.value })} required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>उपस्थित</Label>
                    <Input type="number" value={formData.attendees} onChange={(e) => setFormData({ ...formData, attendees: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <Label>कमाल उपस्थित</Label>
                    <Input type="number" value={formData.maxAttendees} onChange={(e) => setFormData({ ...formData, maxAttendees: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>स्थिती</Label>
                    <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="upcoming">येत आहे</option>
                      <option value="ongoing">चालू</option>
                      <option value="completed">पूर्ण</option>
                      <option value="cancelled">रद्द</option>
                    </select>
                  </div>
                  <div>
                    <Label>प्राधान्य</Label>
                    <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="high">उच्च</option>
                      <option value="medium">मध्यम</option>
                      <option value="low">कमी</option>
                    </select>
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
                  <Label>संपर्क माहिती</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="फोन" value={formData.contactInfo.phone} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, phone: e.target.value } })} />
                    <Input placeholder="ईमेल" value={formData.contactInfo.email} onChange={(e) => setFormData({ ...formData, contactInfo: { ...formData.contactInfo, email: e.target.value } })} />
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
                    <div className="grid grid-cols-3 gap-2">
                      <Input placeholder="नाव (Marathi)" value={documentItem.name} onChange={(e) => setDocumentItem({ ...documentItem, name: e.target.value })} />
                      <Input placeholder="Name (English)" value={documentItem.nameEn} onChange={(e) => setDocumentItem({ ...documentItem, nameEn: e.target.value })} />
                      <Input placeholder="URL" value={documentItem.url} onChange={(e) => setDocumentItem({ ...documentItem, url: e.target.value })} />
                    </div>
                    <Button type="button" onClick={addDocument}>दस्तावेज जोडा</Button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.reminders} onChange={(e) => setFormData({ ...formData, reminders: e.target.checked })} />
                  <Label>आठवण</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingEvent ? 'अपडेट करा' : 'जोडा'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingEvent(null);
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

