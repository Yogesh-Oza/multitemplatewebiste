'use client';

import { useEffect, useState } from 'react';
import { Edit, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface TeamMember {
  id: string;
  name: string;
  nameEn: string;
  designation: string;
  designationEn: string;
  phone: string;
  email?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

const emptyForm = {
  name: '',
  nameEn: '',
  designation: '',
  designationEn: '',
  phone: '',
  email: '',
  imageUrl: '',
  order: 0,
  isActive: true,
};

export function TeamMembersAdmin() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/team-members');
      if (response.ok) {
        const data = await response.json();
        setMembers(Array.isArray(data) ? data : []);
      }
    } catch {
      toast.error('पंचायत संरचना लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editing ? `/api/team-members/${editing.id}` : '/api/team-members';
      const method = editing ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('save failed');
      await fetchMembers();
      setIsModalOpen(false);
      resetForm();
      toast.success(editing ? 'सदस्य अपडेट केला' : 'सदस्य जोडला');
    } catch {
      toast.error('सदस्य सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setFormData({
      name: member.name,
      nameEn: member.nameEn,
      designation: member.designation,
      designationEn: member.designationEn,
      phone: member.phone,
      email: member.email || '',
      imageUrl: member.imageUrl || '',
      order: member.order,
      isActive: member.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('हा सदस्य हटवायचा आहे का?')) return;
    try {
      const response = await fetch(`/api/team-members/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      await fetchMembers();
      toast.success('सदस्य हटवला');
    } catch {
      toast.error('सदस्य हटवताना त्रुटी');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-emerald-600" />
            पंचायत संरचना (सरपंच / सदस्य)
          </CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            सदस्य जोडा
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p>लोड होत आहे...</p>
        ) : members.length === 0 ? (
          <p className="text-gray-500">अद्याप सदस्य जोडलेले नाहीत.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold">{member.name}</h3>
                      <p className="text-sm text-gray-600">{member.designation}</p>
                      <p className="text-xs text-gray-500">{member.phone}</p>
                    </div>
                    <Badge variant={member.isActive ? 'default' : 'secondary'}>
                      {member.isActive ? 'सक्रिय' : 'निष्क्रिय'}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2 border-t">
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEdit(member)}>
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(member.id)}>
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
          <div className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-4">{editing ? 'सदस्य संपादित करा' : 'नवीन सदस्य'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>नाव (मराठी) *</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    required
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>पद (मराठी) *</Label>
                  <Input
                    value={formData.designation}
                    onChange={(e) => setFormData((p) => ({ ...p, designation: e.target.value }))}
                    required
                    placeholder="सरपंच / उपसरपंच / सदस्य"
                  />
                </div>
                <div>
                  <Label>पद (इंग्रजी)</Label>
                  <Input
                    value={formData.designationEn}
                    onChange={(e) => setFormData((p) => ({ ...p, designationEn: e.target.value }))}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>फोन *</Label>
                  <Input
                    value={formData.phone}
                    onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>ईमेल</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>फोटो URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData((p) => ({ ...p, imageUrl: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>क्रम</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((p) => ({ ...p, order: Number(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-end gap-2 pb-1">
                  <input
                    id="memberActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="memberActive">सक्रिय</Label>
                </div>
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
