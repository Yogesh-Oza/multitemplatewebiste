'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Building, Users, Phone, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface OfficeDetails {
  id: string;
  address: string;
  addressEn: string;
  phone: string;
  email: string;
  workingHours: string;
  workingHoursEn: string;
  importantNotice?: string;
  importantNoticeEn?: string;
  isActive: boolean;
  isDemo?: boolean;
}

interface Role {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  responsibilities: string[];
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  nameEn: string;
  phone: string;
  description: string;
  icon: string;
  color: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  order: number;
  isActive: boolean;
  isDemo?: boolean;
}

export default function AboutAdminPage() {
  const [activeTab, setActiveTab] = useState('office');

  // Office Details State
  const [officeDetails, setOfficeDetails] = useState<OfficeDetails | null>(null);
  const [isLoadingOffice, setIsLoadingOffice] = useState(true);
  const [isOfficeModalOpen, setIsOfficeModalOpen] = useState(false);
  const [officeFormData, setOfficeFormData] = useState({
    address: '',
    addressEn: '',
    phone: '',
    email: '',
    workingHours: '',
    workingHoursEn: '',
    importantNotice: '',
    importantNoticeEn: ''
  });

  // Roles State
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [roleFormData, setRoleFormData] = useState({
    title: '',
    titleEn: '',
    description: '',
    responsibilities: [] as string[],
    icon: 'Users',
    color: 'from-blue-500 to-indigo-600',
    order: 0,
    isActive: true
  });
  const [newResponsibility, setNewResponsibility] = useState('');

  // Emergency Contacts State
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<EmergencyContact | null>(null);
  const [contactFormData, setContactFormData] = useState({
    name: '',
    nameEn: '',
    phone: '',
    description: '',
    icon: 'Shield',
    color: 'from-blue-500 to-indigo-600',
    priority: 'high' as 'high' | 'medium' | 'low',
    category: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    fetchOfficeDetails();
    fetchRoles();
    fetchEmergencyContacts();
  }, []);

  // Office Details Functions
  const fetchOfficeDetails = async () => {
    try {
      const response = await fetch('/api/office-details');
      if (response.ok) {
        const data = await response.json();
        setOfficeDetails(data);
        if (!data.isDemo) {
          setOfficeFormData({
            address: data.address || '',
            addressEn: data.addressEn || '',
            phone: data.phone || '',
            email: data.email || '',
            workingHours: data.workingHours || '',
            workingHoursEn: data.workingHoursEn || '',
            importantNotice: data.importantNotice || '',
            importantNoticeEn: data.importantNoticeEn || ''
          });
        }
      }
    } catch (error) {
      console.error('Error fetching office details:', error);
      toast.error('कार्यालय माहिती लोड करताना त्रुटी');
    } finally {
      setIsLoadingOffice(false);
    }
  };

  const handleOfficeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/office-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(officeFormData)
      });

      if (response.ok) {
        await fetchOfficeDetails();
        setIsOfficeModalOpen(false);
        toast.success('कार्यालय माहिती सेव्ह केली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving office details:', error);
      toast.error('कार्यालय माहिती सेव्ह करताना त्रुटी');
    }
  };

  // Roles Functions
  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.filter((r: Role) => !r.isDemo));
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('भूमिका लोड करताना त्रुटी');
    } finally {
      setIsLoadingRoles(false);
    }
  };

  const handleRoleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/roles';
      const method = editingRole ? 'PUT' : 'POST';
      
      const body = editingRole 
        ? { ...roleFormData, id: editingRole.id }
        : roleFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchRoles();
        setIsRoleModalOpen(false);
        setEditingRole(null);
        resetRoleForm();
        toast.success(editingRole ? 'भूमिका अपडेट केली' : 'भूमिका जोडली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving role:', error);
      toast.error('भूमिका सेव्ह करताना त्रुटी');
    }
  };

  const handleRoleEdit = (role: Role) => {
    setEditingRole(role);
    setRoleFormData({
      title: role.title,
      titleEn: role.titleEn,
      description: role.description,
      responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [],
      icon: role.icon,
      color: role.color,
      order: role.order,
      isActive: role.isActive
    });
    setIsRoleModalOpen(true);
  };

  const handleRoleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही ही भूमिका हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/roles?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchRoles();
          toast.success('भूमिका हटवली');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting role:', error);
        toast.error('भूमिका हटवताना त्रुटी');
      }
    }
  };

  const handleRoleToggleActive = async (role: Role) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...role,
          isActive: !role.isActive
        })
      });
      if (response.ok) {
        await fetchRoles();
        toast.success(role.isActive ? 'भूमिका निष्क्रिय केली' : 'भूमिका सक्रिय केली');
      }
    } catch (error) {
      console.error('Error toggling role:', error);
      toast.error('त्रुटी');
    }
  };

  const resetRoleForm = () => {
    setRoleFormData({
      title: '',
      titleEn: '',
      description: '',
      responsibilities: [],
      icon: 'Users',
      color: 'from-blue-500 to-indigo-600',
      order: 0,
      isActive: true
    });
    setNewResponsibility('');
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setRoleFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setRoleFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  // Emergency Contacts Functions
  const fetchEmergencyContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts');
      if (response.ok) {
        const data = await response.json();
        setEmergencyContacts(data.filter((c: EmergencyContact) => !c.isDemo));
      }
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      toast.error('आपत्कालीन संपर्क लोड करताना त्रुटी');
    } finally {
      setIsLoadingContacts(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/emergency-contacts';
      const method = editingContact ? 'PUT' : 'POST';
      
      const body = editingContact 
        ? { ...contactFormData, id: editingContact.id }
        : contactFormData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchEmergencyContacts();
        setIsContactModalOpen(false);
        setEditingContact(null);
        resetContactForm();
        toast.success(editingContact ? 'संपर्क अपडेट केला' : 'संपर्क जोडला');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      toast.error('संपर्क सेव्ह करताना त्रुटी');
    }
  };

  const handleContactEdit = (contact: EmergencyContact) => {
    setEditingContact(contact);
    setContactFormData({
      name: contact.name,
      nameEn: contact.nameEn,
      phone: contact.phone,
      description: contact.description,
      icon: contact.icon,
      color: contact.color,
      priority: contact.priority,
      category: contact.category,
      order: contact.order,
      isActive: contact.isActive
    });
    setIsContactModalOpen(true);
  };

  const handleContactDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही हा संपर्क हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/emergency-contacts?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchEmergencyContacts();
          toast.success('संपर्क हटवला');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        toast.error('संपर्क हटवताना त्रुटी');
      }
    }
  };

  const handleContactToggleActive = async (contact: EmergencyContact) => {
    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contact,
          isActive: !contact.isActive
        })
      });
      if (response.ok) {
        await fetchEmergencyContacts();
        toast.success(contact.isActive ? 'संपर्क निष्क्रिय केला' : 'संपर्क सक्रिय केला');
      }
    } catch (error) {
      console.error('Error toggling contact:', error);
      toast.error('त्रुटी');
    }
  };

  const resetContactForm = () => {
    setContactFormData({
      name: '',
      nameEn: '',
      phone: '',
      description: '',
      icon: 'Shield',
      color: 'from-blue-500 to-indigo-600',
      priority: 'high',
      category: '',
      order: 0,
      isActive: true
    });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">ग्रामपंचायतीबद्दल व्यवस्थापन</h1>
        <p className="text-gray-600 mt-2">कार्यालय माहिती, भूमिका आणि आपत्कालीन संपर्क व्यवस्थापन</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="office">
            <Building className="h-4 w-4 mr-2" />
            कार्यालय माहिती
          </TabsTrigger>
          <TabsTrigger value="roles">
            <Users className="h-4 w-4 mr-2" />
            भूमिका व जबाबदाऱ्या
          </TabsTrigger>
          <TabsTrigger value="contacts">
            <Phone className="h-4 w-4 mr-2" />
            आपत्कालीन संपर्क
          </TabsTrigger>
        </TabsList>

        {/* Office Information Tab */}
        <TabsContent value="office" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>कार्यालय माहिती</CardTitle>
                <Button onClick={() => setIsOfficeModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  {officeDetails && !officeDetails.isDemo ? 'संपादित करा' : 'जोडा'}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingOffice ? (
                <p>लोड होत आहे...</p>
              ) : officeDetails && !officeDetails.isDemo ? (
                <div className="space-y-4">
                  <div>
                    <Label>पत्ता (मराठी)</Label>
                    <p className="text-gray-700">{officeDetails.address}</p>
                  </div>
                  <div>
                    <Label>पत्ता (इंग्रजी)</Label>
                    <p className="text-gray-700">{officeDetails.addressEn}</p>
                  </div>
                  <div>
                    <Label>फोन</Label>
                    <p className="text-gray-700">{officeDetails.phone}</p>
                  </div>
                  <div>
                    <Label>ईमेल</Label>
                    <p className="text-gray-700">{officeDetails.email}</p>
                  </div>
                  <div>
                    <Label>कामकाजाची वेळ (मराठी)</Label>
                    <p className="text-gray-700">{officeDetails.workingHours}</p>
                  </div>
                  <div>
                    <Label>कामकाजाची वेळ (इंग्रजी)</Label>
                    <p className="text-gray-700">{officeDetails.workingHoursEn}</p>
                  </div>
                  {officeDetails.importantNotice && (
                    <div>
                      <Label>महत्त्वाची सूचना (मराठी)</Label>
                      <p className="text-gray-700">{officeDetails.importantNotice}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">कृपया कार्यालय माहिती जोडा</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Roles Tab */}
        <TabsContent value="roles" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>भूमिका व जबाबदाऱ्या</CardTitle>
                <Button onClick={() => {
                  resetRoleForm();
                  setIsRoleModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  नवीन भूमिका जोडा
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingRoles ? (
                <p>लोड होत आहे...</p>
              ) : roles.length === 0 ? (
                <p className="text-gray-500">कोणतीही भूमिका नाही. नवीन भूमिका जोडा.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {roles.map((role) => (
                    <Card key={role.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{role.title}</h3>
                            <p className="text-sm text-gray-500">{role.titleEn}</p>
                          </div>
                          <Badge variant={role.isActive ? 'default' : 'secondary'}>
                            {role.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleEdit(role)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleToggleActive(role)}
                          >
                            {role.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRoleDelete(role.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="contacts" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>आपत्कालीन संपर्क</CardTitle>
                <Button onClick={() => {
                  resetContactForm();
                  setIsContactModalOpen(true);
                }}>
                  <Plus className="h-4 w-4 mr-2" />
                  नवीन संपर्क जोडा
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingContacts ? (
                <p>लोड होत आहे...</p>
              ) : emergencyContacts.length === 0 ? (
                <p className="text-gray-500">कोणतेही संपर्क नाहीत. नवीन संपर्क जोडा.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {emergencyContacts.map((contact) => (
                    <Card key={contact.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold">{contact.name}</h3>
                            <p className="text-sm text-gray-500">{contact.nameEn}</p>
                          </div>
                          <Badge variant={contact.isActive ? 'default' : 'secondary'}>
                            {contact.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{contact.phone}</p>
                        <p className="text-xs text-gray-500 mb-2">{contact.description}</p>
                        <div className="flex items-center gap-2 pt-2 border-t">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactEdit(contact)}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            संपादित
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactToggleActive(contact)}
                          >
                            {contact.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleContactDelete(contact.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Office Details Modal */}
      {isOfficeModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">कार्यालय माहिती {officeDetails && !officeDetails.isDemo ? 'संपादित करा' : 'जोडा'}</h2>
              
              <form onSubmit={handleOfficeSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="address">पत्ता (मराठी) *</Label>
                  <Textarea
                    id="address"
                    value={officeFormData.address}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="addressEn">पत्ता (इंग्रजी) *</Label>
                  <Textarea
                    id="addressEn"
                    value={officeFormData.addressEn}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, addressEn: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="phone">फोन *</Label>
                    <Input
                      id="phone"
                      value={officeFormData.phone}
                      onChange={(e) => setOfficeFormData(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">ईमेल *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={officeFormData.email}
                      onChange={(e) => setOfficeFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="workingHours">कामकाजाची वेळ (मराठी) *</Label>
                  <Input
                    id="workingHours"
                    value={officeFormData.workingHours}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, workingHours: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="workingHoursEn">कामकाजाची वेळ (इंग्रजी) *</Label>
                  <Input
                    id="workingHoursEn"
                    value={officeFormData.workingHoursEn}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, workingHoursEn: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="importantNotice">महत्त्वाची सूचना (मराठी)</Label>
                  <Textarea
                    id="importantNotice"
                    value={officeFormData.importantNotice}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, importantNotice: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="importantNoticeEn">महत्त्वाची सूचना (इंग्रजी)</Label>
                  <Textarea
                    id="importantNoticeEn"
                    value={officeFormData.importantNoticeEn}
                    onChange={(e) => setOfficeFormData(prev => ({ ...prev, importantNoticeEn: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsOfficeModalOpen(false)}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">सेव्ह करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Role Modal */}
      {isRoleModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingRole ? 'भूमिका संपादित करा' : 'नवीन भूमिका जोडा'}</h2>
              
              <form onSubmit={handleRoleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="roleTitle">शीर्षक (मराठी) *</Label>
                    <Input
                      id="roleTitle"
                      value={roleFormData.title}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="roleTitleEn">शीर्षक (इंग्रजी) *</Label>
                    <Input
                      id="roleTitleEn"
                      value={roleFormData.titleEn}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, titleEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleDescription">वर्णन *</Label>
                  <Textarea
                    id="roleDescription"
                    value={roleFormData.description}
                    onChange={(e) => setRoleFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={3}
                  />
                </div>
                <div>
                  <Label>जबाबदाऱ्या</Label>
                  <div className="space-y-2 mb-2">
                    {roleFormData.responsibilities.map((resp, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input value={resp} readOnly />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeResponsibility(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={newResponsibility}
                      onChange={(e) => setNewResponsibility(e.target.value)}
                      placeholder="नवीन जबाबदारी जोडा"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addResponsibility();
                        }
                      }}
                    />
                    <Button type="button" onClick={addResponsibility}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="roleIcon">आयकॉन</Label>
                    <select
                      id="roleIcon"
                      value={roleFormData.icon}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Users">Users</option>
                      <option value="Shield">Shield</option>
                      <option value="FileText">FileText</option>
                      <option value="Home">Home</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="roleColor">रंग</Label>
                    <select
                      id="roleColor"
                      value={roleFormData.color}
                      onChange={(e) => setRoleFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="from-blue-500 to-indigo-600">Blue</option>
                      <option value="from-green-500 to-emerald-600">Green</option>
                      <option value="from-purple-500 to-pink-600">Purple</option>
                      <option value="from-orange-500 to-red-600">Orange</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="roleOrder">क्रम</Label>
                  <Input
                    id="roleOrder"
                    type="number"
                    value={roleFormData.order}
                    onChange={(e) => setRoleFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="roleIsActive"
                    checked={roleFormData.isActive}
                    onChange={(e) => setRoleFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="roleIsActive" className="cursor-pointer">सक्रिय</Label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsRoleModalOpen(false);
                      setEditingRole(null);
                      resetRoleForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">सेव्ह करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Contact Modal */}
      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">{editingContact ? 'संपर्क संपादित करा' : 'नवीन संपर्क जोडा'}</h2>
              
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactName">नाव (मराठी) *</Label>
                    <Input
                      id="contactName"
                      value={contactFormData.name}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactNameEn">नाव (इंग्रजी) *</Label>
                    <Input
                      id="contactNameEn"
                      value={contactFormData.nameEn}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contactPhone">फोन *</Label>
                  <Input
                    id="contactPhone"
                    value={contactFormData.phone}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, phone: e.target.value }))}
                    required
                    placeholder="100 / +91 12345 11111"
                  />
                </div>
                <div>
                  <Label htmlFor="contactDescription">वर्णन *</Label>
                  <Textarea
                    id="contactDescription"
                    value={contactFormData.description}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    rows={2}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactIcon">आयकॉन</Label>
                    <select
                      id="contactIcon"
                      value={contactFormData.icon}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, icon: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="Shield">Shield</option>
                      <option value="Stethoscope">Stethoscope</option>
                      <option value="Flame">Flame</option>
                      <option value="Heart">Heart</option>
                      <option value="AlertTriangle">AlertTriangle</option>
                      <option value="Zap">Zap</option>
                      <option value="TreePine">TreePine</option>
                      <option value="Wrench">Wrench</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="contactColor">रंग</Label>
                    <select
                      id="contactColor"
                      value={contactFormData.color}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, color: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="from-blue-500 to-indigo-600">Blue</option>
                      <option value="from-red-500 to-pink-600">Red</option>
                      <option value="from-orange-500 to-red-600">Orange</option>
                      <option value="from-green-500 to-emerald-600">Green</option>
                      <option value="from-yellow-500 to-orange-600">Yellow</option>
                      <option value="from-yellow-400 to-yellow-600">Yellow Light</option>
                      <option value="from-green-600 to-teal-600">Green Dark</option>
                      <option value="from-green-700 to-green-800">Green Darker</option>
                      <option value="from-cyan-500 to-blue-600">Cyan</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactPriority">प्राथमिकता</Label>
                    <select
                      id="contactPriority"
                      value={contactFormData.priority}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="high">तातडीचे</option>
                      <option value="medium">मध्यम</option>
                      <option value="low">सामान्य</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="contactCategory">वर्ग</Label>
                    <Input
                      id="contactCategory"
                      value={contactFormData.category}
                      onChange={(e) => setContactFormData(prev => ({ ...prev, category: e.target.value }))}
                      placeholder="सुरक्षा, आरोग्य, इ."
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="contactOrder">क्रम</Label>
                  <Input
                    id="contactOrder"
                    type="number"
                    value={contactFormData.order}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="contactIsActive"
                    checked={contactFormData.isActive}
                    onChange={(e) => setContactFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="contactIsActive" className="cursor-pointer">सक्रिय</Label>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsContactModalOpen(false);
                      setEditingContact(null);
                      resetContactForm();
                    }}
                  >
                    रद्द करा
                  </Button>
                  <Button type="submit">सेव्ह करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

