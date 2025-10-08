'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Phone, 
  Edit, 
  Save,
  ArrowLeft,
  MapPin,
  Mail,
  Globe,
  Clock,
  Building,
  User
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface ContactInfo {
  id: string;
  type: 'office' | 'person' | 'department';
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  phone: string;
  email: string;
  address: string;
  addressEn: string;
  workingHours: string;
  workingHoursEn: string;
  isActive: boolean;
}


const contactTypes = [
  { value: 'office', label: 'कार्यालय', icon: Building },
  { value: 'person', label: 'व्यक्ती', icon: User },
  { value: 'department', label: 'विभाग', icon: Building }
];

export default function ContactPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([]);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch contacts from API
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast.error('संपर्क माहिती लोड करताना त्रुटी आली');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact);
    setIsAdding(false);
  };

  const handleAdd = () => {
    setEditingContact({
      id: '',
      type: 'office',
      name: '',
      nameEn: '',
      designation: '',
      designationEn: '',
      phone: '',
      email: '',
      address: '',
      addressEn: '',
      workingHours: '',
      workingHoursEn: '',
      isActive: true
    });
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!editingContact) return;

    try {
      if (isAdding) {
        const response = await fetch('/api/contacts', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingContact),
        });

        if (response.ok) {
          const newContact = await response.json();
          setContacts(prev => [...prev, newContact]);
          toast.success('नवीन संपर्क जोडले');
        } else {
          throw new Error('Failed to create contact');
        }
      } else {
        const response = await fetch(`/api/contacts/${editingContact.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editingContact),
        });

        if (response.ok) {
          const updatedContact = await response.json();
          setContacts(prev => prev.map(contact => 
            contact.id === updatedContact.id ? updatedContact : contact
          ));
          toast.success('संपर्क अपडेट केले');
        } else {
          throw new Error('Failed to update contact');
        }
      }

      setEditingContact(null);
      setIsAdding(false);
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('संपर्क सेव्ह करताना त्रुटी आली');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/contacts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(prev => prev.filter(contact => contact.id !== id));
        toast.success('संपर्क हटवले');
      } else {
        throw new Error('Failed to delete contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('संपर्क हटवताना त्रुटी आली');
    }
  };

  const handleCancel = () => {
    setEditingContact(null);
    setIsAdding(false);
  };

  const handleToggleActive = (id: string) => {
    setContacts(prev => prev.map(contact => 
      contact.id === id ? { ...contact, isActive: !contact.isActive } : contact
    ));
    toast.success('संपर्क स्थिती अपडेट केली');
  };

  const getContactIcon = (type: string) => {
    const contactType = contactTypes.find(t => t.value === type);
    return contactType ? contactType.icon : Building;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">संपर्क</h1>
          <p className="text-gray-600 mt-1">संपर्क माहिती व्यवस्थापन</p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {contacts.length} संपर्क
          </Badge>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            {contacts.filter(c => c.isActive).length} सक्रिय
          </Badge>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Phone className="h-4 w-4 mr-2" />
            नवीन संपर्क
          </Button>
        </div>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contacts.map((contact) => {
          const Icon = getContactIcon(contact.type);
          return (
            <Card key={contact.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{contact.name}</CardTitle>
                      <CardDescription>{contact.designation}</CardDescription>
                    </div>
                  </div>
                  <Badge className={contact.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                    {contact.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{contact.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-sm line-clamp-2">{contact.address}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{contact.workingHours}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(contact)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    संपादन
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(contact.id)}
                    className={contact.isActive ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}
                  >
                    {contact.isActive ? 'निष्क्रिय' : 'सक्रिय'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>{isAdding ? 'नवीन संपर्क जोडा' : 'संपर्क संपादित करा'}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">प्रकार</Label>
                  <select
                    id="type"
                    value={editingContact.type}
                    onChange={(e) => setEditingContact({...editingContact, type: e.target.value as any})}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    {contactTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="phone">फोन</Label>
                  <Input
                    id="phone"
                    value={editingContact.phone}
                    onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                    placeholder="+91 12345 67890"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">नाव (मराठी)</Label>
                  <Input
                    id="name"
                    value={editingContact.name}
                    onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                    placeholder="ग्रामपंचायत कार्यालय"
                  />
                </div>
                <div>
                  <Label htmlFor="nameEn">नाव (इंग्रजी)</Label>
                  <Input
                    id="nameEn"
                    value={editingContact.nameEn}
                    onChange={(e) => setEditingContact({...editingContact, nameEn: e.target.value})}
                    placeholder="Gram Panchayat Office"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="designation">पद (मराठी)</Label>
                  <Input
                    id="designation"
                    value={editingContact.designation}
                    onChange={(e) => setEditingContact({...editingContact, designation: e.target.value})}
                    placeholder="मुख्य कार्यालय"
                  />
                </div>
                <div>
                  <Label htmlFor="designationEn">पद (इंग्रजी)</Label>
                  <Input
                    id="designationEn"
                    value={editingContact.designationEn}
                    onChange={(e) => setEditingContact({...editingContact, designationEn: e.target.value})}
                    placeholder="Main Office"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">ईमेल</Label>
                <Input
                  id="email"
                  type="email"
                  value={editingContact.email}
                  onChange={(e) => setEditingContact({...editingContact, email: e.target.value})}
                  placeholder="info@grampanchayat.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="address">पत्ता (मराठी)</Label>
                  <Textarea
                    id="address"
                    value={editingContact.address}
                    onChange={(e) => setEditingContact({...editingContact, address: e.target.value})}
                    placeholder="ग्रामपंचायत कार्यालय, गाव, तालुका, जिल्हा"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="addressEn">पत्ता (इंग्रजी)</Label>
                  <Textarea
                    id="addressEn"
                    value={editingContact.addressEn}
                    onChange={(e) => setEditingContact({...editingContact, addressEn: e.target.value})}
                    placeholder="Gram Panchayat Office, Village, Taluka, District"
                    rows={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="workingHours">कार्यवेळ (मराठी)</Label>
                  <Input
                    id="workingHours"
                    value={editingContact.workingHours}
                    onChange={(e) => setEditingContact({...editingContact, workingHours: e.target.value})}
                    placeholder="सकाळी ९:०० ते संध्याकाळी ६:००"
                  />
                </div>
                <div>
                  <Label htmlFor="workingHoursEn">कार्यवेळ (इंग्रजी)</Label>
                  <Input
                    id="workingHoursEn"
                    value={editingContact.workingHoursEn}
                    onChange={(e) => setEditingContact({...editingContact, workingHoursEn: e.target.value})}
                    placeholder="9:00 AM to 6:00 PM"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={editingContact.isActive}
                  onChange={(e) => setEditingContact({...editingContact, isActive: e.target.checked})}
                  className="rounded"
                />
                <Label htmlFor="isActive">सक्रिय</Label>
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
