'use client';

import { useEffect, useState } from 'react';
import { Edit, Eye, EyeOff, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

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

const emptyForm = {
  title: '',
  titleEn: '',
  description: '',
  responsibilities: [] as string[],
  icon: 'Users',
  color: 'from-blue-500 to-indigo-600',
  order: 0,
  isActive: true,
};

export function RolesAdmin() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [newResponsibility, setNewResponsibility] = useState('');

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (response.ok) {
        const data = await response.json();
        setRoles(data.filter((r: Role) => !r.isDemo));
      }
    } catch {
      toast.error('भूमिका लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const resetForm = () => {
    setFormData(emptyForm);
    setNewResponsibility('');
    setEditingRole(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/roles', {
        method: editingRole ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingRole ? { ...formData, id: editingRole.id } : formData),
      });
      if (!response.ok) throw new Error('save failed');
      await fetchRoles();
      setIsModalOpen(false);
      resetForm();
      toast.success(editingRole ? 'भूमिका अपडेट केली' : 'भूमिका जोडली');
    } catch {
      toast.error('भूमिका सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setFormData({
      title: role.title,
      titleEn: role.titleEn,
      description: role.description,
      responsibilities: Array.isArray(role.responsibilities) ? role.responsibilities : [],
      icon: role.icon,
      color: role.color,
      order: role.order,
      isActive: role.isActive,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('तुम्हाला खात्री आहे की तुम्ही ही भूमिका हटवू इच्छिता?')) return;
    try {
      const response = await fetch(`/api/roles?id=${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('delete failed');
      await fetchRoles();
      toast.success('भूमिका हटवली');
    } catch {
      toast.error('भूमिका हटवताना त्रुटी');
    }
  };

  const handleToggle = async (role: Role) => {
    try {
      const response = await fetch('/api/roles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...role, isActive: !role.isActive }),
      });
      if (!response.ok) throw new Error('toggle failed');
      await fetchRoles();
      toast.success(role.isActive ? 'भूमिका निष्क्रिय केली' : 'भूमिका सक्रिय केली');
    } catch {
      toast.error('त्रुटी');
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            भूमिका व जबाबदाऱ्या
          </CardTitle>
          <Button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            नवीन भूमिका जोडा
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
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
                    <Button variant="outline" size="sm" onClick={() => handleEdit(role)} className="flex-1">
                      <Edit className="h-4 w-4 mr-1" />
                      संपादित
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleToggle(role)}>
                      {role.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(role.id)}
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
            <h2 className="text-xl font-bold mb-4">{editingRole ? 'भूमिका संपादित करा' : 'नवीन भूमिका'}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>शीर्षक (मराठी) *</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label>शीर्षक (इंग्रजी)</Label>
                  <Input
                    value={formData.titleEn}
                    onChange={(e) => setFormData((p) => ({ ...p, titleEn: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <Label>वर्णन *</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label>जबाबदाऱ्या</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newResponsibility}
                    onChange={(e) => setNewResponsibility(e.target.value)}
                    placeholder="जबाबदारी लिहा"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (!newResponsibility.trim()) return;
                      setFormData((p) => ({
                        ...p,
                        responsibilities: [...p.responsibilities, newResponsibility.trim()],
                      }));
                      setNewResponsibility('');
                    }}
                  >
                    जोडा
                  </Button>
                </div>
                <ul className="space-y-1">
                  {formData.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-center justify-between text-sm bg-gray-50 px-3 py-2 rounded">
                      <span>{item}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setFormData((p) => ({
                            ...p,
                            responsibilities: p.responsibilities.filter((_, i) => i !== index),
                          }))
                        }
                      >
                        <Trash2 className="h-3 w-3 text-red-500" />
                      </Button>
                    </li>
                  ))}
                </ul>
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
                    id="roleIsActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                  />
                  <Label htmlFor="roleIsActive">सक्रिय</Label>
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
