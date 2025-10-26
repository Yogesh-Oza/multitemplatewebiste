'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  GripVertical, 
  Save, 
  Eye,
  Settings,
  AlertCircle
} from 'lucide-react';

interface Section {
  id: string;
  title: string;
  titleEn: string;
  description?: string;
  descriptionEn?: string;
  order: number;
  isActive: boolean;
  isRequired: boolean;
  maxMarks: number;
  fields: Field[];
}

interface Field {
  id: string;
  fieldName: string;
  fieldNameEn: string;
  fieldType: string;
  formula?: string;
  validationRules?: any;
  order: number;
  isActive: boolean;
  isEditable: boolean;
  options?: any;
}

export default function FormBuilderPage() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showFieldModal, setShowFieldModal] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [editingField, setEditingField] = useState<Field | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/village-marking/sections');
      
      if (!response.ok) {
        throw new Error('Failed to fetch sections');
      }
      
      const data = await response.json();
      setSections(data.sections);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSection = async (sectionData: Partial<Section>) => {
    try {
      const response = await fetch('/api/super-admin/village-marking/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sectionData)
      });

      if (!response.ok) {
        throw new Error('Failed to create section');
      }

      await fetchSections();
      setShowSectionModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create section');
    }
  };

  const handleUpdateSection = async (id: string, sectionData: Partial<Section>) => {
    try {
      const response = await fetch('/api/super-admin/village-marking/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...sectionData })
      });

      if (!response.ok) {
        throw new Error('Failed to update section');
      }

      await fetchSections();
      setShowSectionModal(false);
      setEditingSection(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update section');
    }
  };

  const handleDeleteSection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/village-marking/sections?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete section');
      }

      await fetchSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete section');
    }
  };

  const handleCreateField = async (fieldData: Partial<Field>) => {
    if (!selectedSection) return;

    try {
      const response = await fetch('/api/super-admin/village-marking/fields', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...fieldData, sectionId: selectedSection.id })
      });

      if (!response.ok) {
        throw new Error('Failed to create field');
      }

      await fetchSections();
      setShowFieldModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create field');
    }
  };

  const handleUpdateField = async (id: string, fieldData: Partial<Field>) => {
    try {
      const response = await fetch('/api/super-admin/village-marking/fields', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...fieldData })
      });

      if (!response.ok) {
        throw new Error('Failed to update field');
      }

      await fetchSections();
      setShowFieldModal(false);
      setEditingField(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update field');
    }
  };

  const handleDeleteField = async (id: string) => {
    if (!confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/village-marking/fields?id=${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete field');
      }

      await fetchSections();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete field');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">फॉर्म बिल्डर</h1>
          <p className="text-gray-600">Form Builder - Create and manage village marking forms</p>
        </div>
        <Button onClick={() => setShowSectionModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Sections List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Sections</CardTitle>
              <CardDescription>Manage form sections</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {sections.map((section) => (
                  <div
                    key={section.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedSection?.id === section.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedSection(section)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{section.title}</h4>
                        <p className="text-sm text-gray-500">{section.titleEn}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={section.isActive ? "default" : "secondary"}>
                            {section.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                          <Badge variant="outline">
                            {section.fields.length} fields
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingSection(section);
                            setShowSectionModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSection(section.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fields Management */}
        <div className="lg:col-span-2">
          {selectedSection ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{selectedSection.title}</CardTitle>
                    <CardDescription>{selectedSection.titleEn}</CardDescription>
                  </div>
                  <Button onClick={() => setShowFieldModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Field
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {selectedSection.fields.map((field) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <div>
                          <h4 className="font-medium">{field.fieldName}</h4>
                          <p className="text-sm text-gray-500">{field.fieldNameEn}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline">{field.fieldType}</Badge>
                            {!field.isEditable && (
                              <Badge variant="secondary">Read-only</Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingField(field);
                            setShowFieldModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteField(field.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {selectedSection.fields.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No fields added yet. Click "Add Field" to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Settings className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Section</h3>
                <p className="text-gray-500">Choose a section from the sidebar to manage its fields.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Section Modal */}
      {showSectionModal && (
        <SectionModal
          section={editingSection}
          onSave={editingSection ? (data: Partial<Section>) => handleUpdateSection(editingSection.id, data) : handleCreateSection}
          onClose={() => {
            setShowSectionModal(false);
            setEditingSection(null);
          }}
        />
      )}

      {/* Field Modal */}
      {showFieldModal && selectedSection && (
        <FieldModal
          field={editingField}
          sectionId={selectedSection.id}
          onSave={editingField ? (data: Partial<Field>) => handleUpdateField(editingField.id, data) : handleCreateField}
          onClose={() => {
            setShowFieldModal(false);
            setEditingField(null);
          }}
        />
      )}
    </div>
  );
}

// Section Modal Component
function SectionModal({ 
  section, 
  onSave, 
  onClose 
}: { 
  section: Section | null; 
  onSave: (data: Partial<Section>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    title: section?.title || '',
    titleEn: section?.titleEn || '',
    description: section?.description || '',
    descriptionEn: section?.descriptionEn || '',
    maxMarks: section?.maxMarks || 0,
    isActive: section?.isActive ?? true,
    isRequired: section?.isRequired ?? true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {section ? 'Edit Section' : 'Create Section'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title (Marathi)</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="titleEn">Title (English)</Label>
            <Input
              id="titleEn"
              value={formData.titleEn}
              onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Marathi)</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="descriptionEn">Description (English)</Label>
            <Textarea
              id="descriptionEn"
              value={formData.descriptionEn}
              onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
            />
          </div>
          
          <div>
            <Label htmlFor="maxMarks">Maximum Marks</Label>
            <Input
              id="maxMarks"
              type="number"
              value={formData.maxMarks}
              onChange={(e) => setFormData({ ...formData, maxMarks: parseFloat(e.target.value) || 0 })}
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isRequired}
                onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
                className="mr-2"
              />
              Required
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {section ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Field Modal Component
function FieldModal({ 
  field, 
  sectionId, 
  onSave, 
  onClose 
}: { 
  field: Field | null; 
  sectionId: string; 
  onSave: (data: Partial<Field>) => void; 
  onClose: () => void; 
}) {
  const [formData, setFormData] = useState({
    fieldName: field?.fieldName || '',
    fieldNameEn: field?.fieldNameEn || '',
    fieldType: field?.fieldType || 'text',
    formula: field?.formula || '',
    isActive: field?.isActive ?? true,
    isEditable: field?.isEditable ?? true
  });

  const fieldTypes = [
    { value: 'udisht', label: 'उदिष्ट (Target)' },
    { value: 'sadhya', label: 'साध्य (Achievement)' },
    { value: 'percentage', label: 'टक्केवारी (Percentage)' },
    { value: 'marks', label: 'गुण (Marks)' },
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'dropdown', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
    { value: 'file', label: 'File' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'calculated', label: 'Calculated' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {field ? 'Edit Field' : 'Create Field'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fieldName">Field Name (Marathi)</Label>
            <Input
              id="fieldName"
              value={formData.fieldName}
              onChange={(e) => setFormData({ ...formData, fieldName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fieldNameEn">Field Name (English)</Label>
            <Input
              id="fieldNameEn"
              value={formData.fieldNameEn}
              onChange={(e) => setFormData({ ...formData, fieldNameEn: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="fieldType">Field Type</Label>
            <Select
              value={formData.fieldType}
              onValueChange={(value) => setFormData({ ...formData, fieldType: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {fieldTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {(formData.fieldType === 'percentage' || formData.fieldType === 'marks' || formData.fieldType === 'calculated') && (
            <div>
              <Label htmlFor="formula">Formula</Label>
              <Input
                id="formula"
                value={formData.formula}
                onChange={(e) => setFormData({ ...formData, formula: e.target.value })}
                placeholder="e.g., (sadhya/udisht)*100"
              />
            </div>
          )}
          
          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="mr-2"
              />
              Active
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isEditable}
                onChange={(e) => setFormData({ ...formData, isEditable: e.target.checked })}
                className="mr-2"
              />
              Editable
            </label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {field ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
