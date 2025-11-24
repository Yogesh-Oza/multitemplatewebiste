'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Download, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface DownloadableFile {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  category: string;
  type: string;
  size: string;
  url: string;
  downloads: number;
  lastUpdated: string;
  required: boolean;
  tags: string[];
  isActive: boolean;
  order: number;
}

export default function DownloadableFilesAdmin() {
  const [files, setFiles] = useState<DownloadableFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFile, setEditingFile] = useState<DownloadableFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    descriptionEn: '',
    category: 'form',
    type: 'PDF',
    size: '',
    url: '',
    lastUpdated: new Date().toISOString().split('T')[0],
    required: false,
    tags: [] as string[],
    isActive: true,
    order: 0
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/downloadable-files');
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
      toast.error('फाइल्स लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/downloadable-files';
      const method = editingFile ? 'PUT' : 'POST';
      
      const body = editingFile 
        ? { ...formData, id: editingFile.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        await fetchFiles();
        setIsModalOpen(false);
        setEditingFile(null);
        resetForm();
        toast.success(editingFile ? 'फाइल अपडेट केली' : 'फाइल जोडली');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving file:', error);
      toast.error('फाइल सेव्ह करताना त्रुटी');
    }
  };

  const handleEdit = (file: DownloadableFile) => {
    setEditingFile(file);
    setFormData({
      name: file.name,
      nameEn: file.nameEn,
      description: file.description,
      descriptionEn: file.descriptionEn,
      category: file.category,
      type: file.type,
      size: file.size,
      url: file.url,
      lastUpdated: file.lastUpdated,
      required: file.required,
      tags: Array.isArray(file.tags) ? file.tags : [],
      isActive: file.isActive,
      order: file.order
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('तुम्हाला खात्री आहे की तुम्ही ही फाइल हटवू इच्छिता?')) {
      try {
        const response = await fetch(`/api/downloadable-files?id=${id}`, { 
          method: 'DELETE' 
        });
        if (response.ok) {
          await fetchFiles();
          toast.success('फाइल हटवली');
        } else {
          throw new Error('Failed to delete');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        toast.error('फाइल हटवताना त्रुटी');
      }
    }
  };

  const handleToggleActive = async (file: DownloadableFile) => {
    try {
      const response = await fetch('/api/downloadable-files', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: file.id,
          ...file,
          isActive: !file.isActive
        })
      });
      if (response.ok) {
        await fetchFiles();
        toast.success(file.isActive ? 'फाइल निष्क्रिय केली' : 'फाइल सक्रिय केली');
      }
    } catch (error) {
      console.error('Error toggling file:', error);
      toast.error('त्रुटी');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      nameEn: '',
      description: '',
      descriptionEn: '',
      category: 'form',
      type: 'PDF',
      size: '',
      url: '',
      lastUpdated: new Date().toISOString().split('T')[0],
      required: false,
      tags: [],
      isActive: true,
      order: 0
    });
    setTagInput('');
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         file.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (Array.isArray(file.tags) && file.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesCategory = selectedCategory === 'all' || file.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
          <h2 className="text-2xl font-bold text-gray-900">डाउनलोड विभाग</h2>
          <p className="text-gray-600 mt-1">Download Section Management</p>
        </div>
        <Button onClick={() => {
          setEditingFile(null);
          resetForm();
          setIsModalOpen(true);
        }} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          नवीन फाइल जोडा
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="फाइल शोधा..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="px-4 py-2 border rounded-md">
          <option value="all">सर्व</option>
          <option value="form">फॉर्म</option>
          <option value="document">दस्तावेज</option>
          <option value="pdf">पीडीएफ</option>
          <option value="image">चित्रे</option>
          <option value="archive">आर्काइव्ह</option>
        </select>
      </div>

      {filteredFiles.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Download className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">कोणतीही फाइल नाही</h3>
            <p className="text-gray-500 mb-4">नवीन फाइल जोडण्यासाठी वरील बटणावर क्लिक करा</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{file.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{file.nameEn}</p>
                  </div>
                  {file.required && (
                    <Badge className="bg-red-100 text-red-700">आवश्यक</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="text-gray-600">
                    <strong>प्रकार:</strong> {file.type} • <strong>आकार:</strong> {file.size}
                  </div>
                  <div className="text-gray-600">
                    <strong>डाउनलोड:</strong> {file.downloads}
                  </div>
                  {Array.isArray(file.tags) && file.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {file.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(file)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(file)}>
                    {file.isActive ? 'निष्क्रिय करा' : 'सक्रिय करा'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(file.id)}>
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
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold">{editingFile ? 'फाइल संपादित करा' : 'नवीन फाइल जोडा'}</h3>
                <Button variant="ghost" size="sm" onClick={() => {
                  setIsModalOpen(false);
                  setEditingFile(null);
                  resetForm();
                }}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>नाव (Marathi)</Label>
                    <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                  </div>
                  <div>
                    <Label>Name (English)</Label>
                    <Input value={formData.nameEn} onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (Marathi)</Label>
                  <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required />
                </div>

                <div>
                  <Label>Description (English)</Label>
                  <Input value={formData.descriptionEn} onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })} required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>श्रेणी</Label>
                    <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-3 py-2 border rounded-md" required>
                      <option value="form">फॉर्म</option>
                      <option value="document">दस्तावेज</option>
                      <option value="pdf">पीडीएफ</option>
                      <option value="image">चित्रे</option>
                      <option value="archive">आर्काइव्ह</option>
                    </select>
                  </div>
                  <div>
                    <Label>प्रकार</Label>
                    <Input value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} placeholder="PDF" required />
                  </div>
                  <div>
                    <Label>आकार</Label>
                    <Input value={formData.size} onChange={(e) => setFormData({ ...formData, size: e.target.value })} placeholder="2.5 MB" required />
                  </div>
                </div>

                <div>
                  <Label>URL</Label>
                  <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} required />
                </div>

                <div>
                  <Label>टॅग</Label>
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input value={tagInput} onChange={(e) => setTagInput(e.target.value)} placeholder="टॅग जोडा" />
                      <Button type="button" onClick={addTag}>जोडा</Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" checked={formData.required} onChange={(e) => setFormData({ ...formData, required: e.target.checked })} />
                  <Label>आवश्यक</Label>
                </div>

                <div className="flex gap-2">
                  <Button type="submit">{editingFile ? 'अपडेट करा' : 'जोडा'}</Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setIsModalOpen(false);
                    setEditingFile(null);
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

