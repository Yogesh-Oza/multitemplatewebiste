'use client';

import { useEffect, useState } from 'react';
import { Edit, Eye, EyeOff, Phone, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

const emptyForm = {
  name: '',
  nameEn: '',
  phone: '',
  description: '',
  icon: 'Shield',
  color: 'from-blue-500 to-indigo-600',
  priority: 'high' as 'high' | 'medium' | 'low',
  category: '',
  order: 0,
  isActive: true,
};

export function EmergencyContactsAdmin() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<EmergencyContact | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/emergency-contacts');
      if (response.ok) {
        const data = await response.json();
        setContacts(data.filter((c: EmergencyContact) => !c.isDemo));
      }
    } catch {
      toast.error('आपत्कालीन संपर्क लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/emergency-contacts', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editing ? { ...formData, id: editing.id } : formData),
      });
      if (!response.ok) throw new Error('save failed');
      await fetchContacts();
      setIsModalOpen(false);
      resetForm();
      toast.success(editing ? 'संपर्क अपडेट केला' : 'संपर्क जोडला');
    } catch {
      toast.error('संपर्क सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (contact: EmergencyContact) => {
    setEditing(contact);
    setFormData({
      name: contact.name,
      nameEn: contact.nameEn,
      phone: contact.phone,
      description: contact.description,
      icon: contact.icon,
      color: contact.color,
      priority: contact.priority,
      category: contact.category,
      order: contact.order,
      isActive: contact.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही हा संपर्क हटवू इच्छिता?')) return;
    try {
      const response = await fetch(`/api/emergency-contacts?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      await fetchContacts();
      toast.success('संपर्क हटवला');
    } catch {
      toast.error('संपर्क हटवताना त्रुटी');
    }
  };

  const handleToggle = async (contact: EmergencyContact) => {
    try {
      const response = await fetch('/api/emergency-contacts', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, isActive: !contact.isActive }),
      });
      if (!response.ok) throw new Error('toggle failed');
      await fetchContacts();
      toast.success(contact.isActive ? 'संपर्क निष्क्रिय केला' : 'संपर्क सक्रिय केला');
    } catch {
      toast.error('त्रुटी');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-red-600" />
            मुख्य संपर्क / आपत्कालीन क्रमांक
          </CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन संपर्क जोडा
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>लोड होत आहे...</p>
        ) : contacts.length === 0 ? (
          <p className="text-gray-500">कोणतेही संपर्क नाहीत. नवीन संपर्क जोडा.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contacts.map((contact) => (
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
                  <p className="text-sm text-gray-600 mb-1">{contact.phone}</p>
                  <p className="text-xs text-gray-500 mb-2">{contact.description}</p>
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(contact)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggle(contact)}>
                      {contact.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(contact.id)}
                      className="text-red-600"
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editing ? 'संपर्क संपादित करा' : 'नवीन संपर्क'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>नाव (मराठी) *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
                    placeholder="उदा. आरोग्य केंद्र"
                  />
                </div>
                <div>
                  <Label>नाव (इंग्रजी)</Label>
                  <Input
                    value={formData.nameEn}
                    onChange={(e) => setFormData((p) => ({ ...p, nameEn: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>फोन *</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>वर्णन</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>श्रेणी</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                    placeholder="आरोग्य / पोलीस / इतर"
                  />
                </div>
                <div>
                  <Label>प्राधान्य</Label>
                  <select
                    className="w-full border rounded-md h-10 px-3"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((p) => ({
                        ...p,
                        priority: e.target.value as 'high' | 'medium' | 'low',
                      }))
                    }
                  >
                    <option value="high">उच्च</option>
                    <option value="medium">मध्यम</option>
                    <option value="low">कमी</option>
                  </select>
                </div>
                <div>
                  <Label>क्रम</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="contactActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                />
                <Label htmlFor="contactActive">सक्रिय</Label>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                >
                  रद्द करा
                </Button>
                <Button type="submit">सेव्ह करा</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Card>
  );
}
