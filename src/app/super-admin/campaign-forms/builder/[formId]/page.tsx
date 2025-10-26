'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Save, 
  ArrowLeft,
  Settings,
  Eye,
  Trash2,
  Edit,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Target,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import PopulationTargetConfig from '@/components/admin/population-target-config';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Sortable Section Component
function SortableSection({ 
  section, 
  isExpanded, 
  editingSection, 
  sectionEditData, 
  setSectionEditData,
  onToggle, 
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete 
}: {
  section: FormSection;
  isExpanded: boolean;
  editingSection: string | null;
  sectionEditData: any;
  setSectionEditData: (data: any) => void;
  onToggle: (id: string) => void;
  onStartEdit: (section: FormSection) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader
          className="cursor-pointer"
          onClick={() => onToggle(section.id)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </div>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <div>
                {editingSection === section.id ? (
                  <div className="space-y-2">
                    <Input
                      value={sectionEditData.title || ''}
                      onChange={(e) => setSectionEditData((prev: any) => ({ ...prev, title: e.target.value }))}
                      placeholder="Section title (Marathi)"
                      className="text-lg font-semibold w-full min-w-0"
                      style={{ minWidth: '300px' }}
                    />
                  </div>
                ) : (
                  <div>
                    <CardTitle className="text-lg">
                      Section {section.sectionId}: {section.title}
                    </CardTitle>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {section.items.length} items
              </Badge>
              <Badge variant="secondary">
                {section.maxMarks} marks
              </Badge>
              {editingSection === section.id ? (
                <div className="flex gap-1">
                  <Button size="sm" onClick={onSaveEdit}>
                    <Save className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={onCancelEdit}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onStartEdit(section);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(section.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}

// Sortable Item Component
function SortableItem({ 
  item, 
  editingItem, 
  itemEditData, 
  setItemEditData,
  onStartEdit, 
  onSaveEdit, 
  onCancelEdit, 
  onDelete,
  onUpdateTargets
}: {
  item: FormItem;
  editingItem: string | null;
  itemEditData: any;
  setItemEditData: (data: any) => void;
  onStartEdit: (item: FormItem) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onDelete: (id: string) => void;
  onUpdateTargets: (itemId: string, targets: any) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? 'opacity-50' : ''}
    >
      {editingItem === item.id ? (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`fieldName-${item.id}`}>Field Name (Marathi)</Label>
                <Input
                  id={`fieldName-${item.id}`}
                  value={itemEditData.fieldName || ''}
                  onChange={(e) => setItemEditData((prev: any) => ({ ...prev, fieldName: e.target.value }))}
                  placeholder="Enter field name in Marathi"
                />
              </div>
              <div>
                <Label htmlFor={`maxMarks-${item.id}`}>Max Marks</Label>
                <Input
                  id={`maxMarks-${item.id}`}
                  type="number"
                  step="0.1"
                  value={itemEditData.maxMarks || 0}
                  onChange={(e) => setItemEditData((prev: any) => ({ ...prev, maxMarks: parseFloat(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor={`description-${item.id}`}>Description</Label>
                <Input
                  id={`description-${item.id}`}
                  value={itemEditData.description || ''}
                  onChange={(e) => setItemEditData((prev: any) => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter description"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={onSaveEdit}>
                <Save className="h-3 w-3 mr-1" />
                Save
              </Button>
              <Button size="sm" variant="outline" onClick={onCancelEdit}>
                Cancel
              </Button>
            </div>
            
            {/* Population Target Configuration */}
            <div className="mt-4">
              <PopulationTargetConfig
                itemId={item.id}
                fieldName={itemEditData.fieldName || item.fieldName}
                currentTargets={itemEditData.targets || item.targets}
                onSave={onUpdateTargets}
              />
            </div>
          </div>
        </Card>
      ) : (
        <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-3 w-3 text-muted-foreground" />
            </div>
            <span className="font-mono text-sm">{item.itemId}</span>
            <span>{item.fieldName}</span>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {item.maxMarks} marks
            </Badge>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onStartEdit(item)}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(item.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

interface CampaignForm {
  id: string;
  name: string;
  nameEn: string;
  description?: string;
  formMetadata: {
    campaignName?: string;
    year?: string;
    formType?: string;
  };
  maxPossibleTotal: number;
  isActive: boolean;
  isDefault: boolean;
  sections: FormSection[];
}

interface FormSection {
  id: string;
  sectionId: number;
  title: string;
  titleEn: string;
  description?: string;
  maxMarks: number;
  order: number;
  items: FormItem[];
}

interface FormItem {
  id: string;
  itemId: string;
  itemType: string;
  fieldName: string;
  description?: string;
  targets?: any;
  unit?: string;
  maxMarks: number;
  order: number;
}

export default function FormBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const formId = params.formId as string;
  const isNew = formId === 'new';

  const [form, setForm] = useState<CampaignForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [showFormMetadata, setShowFormMetadata] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [itemEditData, setItemEditData] = useState<any>({});
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionEditData, setSectionEditData] = useState<any>({});
  const [showTargetConfig, setShowTargetConfig] = useState<string | null>(null);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Form metadata state
  const [formData, setFormData] = useState({
    name: '',
    nameEn: '',
    description: '',
    campaignName: '',
    year: '',
    formType: '',
    maxPossibleTotal: 100,
    isActive: true,
    isDefault: false
  });

  useEffect(() => {
    if (isNew) {
      setLoading(false);
      setShowFormMetadata(true);
    } else {
      fetchForm();
    }
  }, [formId]);

  const fetchForm = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/campaign-forms/${formId}`);
      const data = await response.json();

      if (response.ok) {
        setForm(data);
        setFormData({
          name: data.name,
          nameEn: data.nameEn,
          description: data.description || '',
          campaignName: data.formMetadata?.campaignName || '',
          year: data.formMetadata?.year || '',
          formType: data.formMetadata?.formType || '',
          maxPossibleTotal: data.maxPossibleTotal,
          isActive: data.isActive,
          isDefault: data.isDefault
        });
      } else {
        toast.error(data.error || 'Failed to fetch form');
        router.push('/super-admin/campaign-forms');
      }
    } catch (error) {
      console.error('Error fetching form:', error);
      toast.error('Failed to fetch form');
    } finally {
      setLoading(false);
    }
  };

  const saveForm = async () => {
    try {
      setSaving(true);
      const url = isNew ? '/api/super-admin/campaign-forms' : `/api/super-admin/campaign-forms/${formId}`;
      const method = isNew ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          formMetadata: {
            campaignName: formData.campaignName,
            year: formData.year,
            formType: formData.formType
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        // If we have a form with sections, update their order in the background
        if (form && form.sections.length > 0) {
          // Run order updates in background without blocking UI
          updateSectionOrders().catch(error => {
            console.error('Background order update failed:', error);
          });
        }
        
        toast.success(isNew ? 'Form created successfully' : 'Form updated successfully');
        if (isNew) {
          router.push(`/super-admin/campaign-forms/builder/${data.id}`);
        }
      } else {
        toast.error(data.error || 'Failed to save form');
      }
    } catch (error) {
      console.error('Error saving form:', error);
      toast.error('Failed to save form');
    } finally {
      setSaving(false);
    }
  };

  const updateSectionOrders = async () => {
    if (!form?.id) return;

    try {
      const updatePromises = [];

      // Update section orders only if there are sections and orders need updating
      if (form.sections.length > 0) {
        const sectionOrders = form.sections.map((section, index) => ({
          id: section.id,
          order: index + 1
        }));

        // Check if section orders actually need updating
        const needsSectionUpdate = sectionOrders.some((order, index) => 
          form.sections[index]?.order !== order.order
        );

        if (needsSectionUpdate) {
          updatePromises.push(
            fetch(`/api/super-admin/campaign-forms/${form.id}/sections`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orders: sectionOrders })
            }).catch(error => {
              console.error('Error updating section orders:', error);
            })
          );
        }
      }

      // Update item orders for each section in parallel
      for (const section of form.sections) {
        if (section.items.length > 0) {
          const itemOrders = section.items.map((item, index) => ({
            id: item.id,
            order: index + 1
          }));

          // Check if item orders actually need updating
          const needsItemUpdate = itemOrders.some((order, index) => 
            section.items[index]?.order !== order.order
          );

          if (needsItemUpdate) {
            updatePromises.push(
              fetch(`/api/super-admin/campaign-forms/${form.id}/items`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders: itemOrders })
              }).catch(error => {
                console.error('Error updating item orders for section:', section.id, error);
              })
            );
          }
        }
      }

      // Wait for all updates to complete in parallel
      if (updatePromises.length > 0) {
        await Promise.all(updatePromises);
      }
    } catch (error) {
      console.error('Error updating orders:', error);
      // Don't show error to user as the main form save was successful
    }
  };

  const addSection = async () => {
    if (!form?.id) {
      toast.error('Please save the form first');
      return;
    }

    try {
      const sectionId = (form.sections.length || 0) + 1;
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          title: `Section ${sectionId}`,
          titleEn: `Section ${sectionId}`,
          description: '',
          maxMarks: 0
        })
      });

      if (response.ok) {
        toast.success('Section added successfully');
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add section');
      }
    } catch (error) {
      console.error('Error adding section:', error);
      toast.error('Failed to add section');
    }
  };

  const addItem = async (sectionId: string) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    try {
      const section = form.sections.find(s => s.id === sectionId);
      if (!section) {
        toast.error('Section not found');
        return;
      }

      const itemId = `${section.sectionId}.${(section.items.length || 0) + 1}`;
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          itemId,
          itemType: 'simple',
          fieldName: `Item ${itemId}`,
          fieldNameEn: `Item ${itemId}`,
          description: '',
          maxMarks: 1,
          targets: {
            below2000: "100%",
            between2000_5000: "100%",
            above5000: "100%"
          }
        })
      });

      if (response.ok) {
        toast.success('Item added successfully');
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to add item');
      }
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const updateItem = async (itemId: string, updates: any) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        toast.success('Item updated successfully');
        setEditingItem(null);
        setItemEditData({});
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update item');
      }
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    }
  };

  const startEditingItem = (item: FormItem) => {
    setEditingItem(item.id);
    setItemEditData({
      fieldName: item.fieldName,
      description: item.description || '',
      maxMarks: item.maxMarks,
      targets: item.targets || {
        below2000: "100%",
        between2000_5000: "100%",
        above5000: "100%"
      }
    });
  };

  const cancelEditingItem = () => {
    setEditingItem(null);
    setItemEditData({});
  };

  const saveItemEdit = () => {
    if (editingItem) {
      updateItem(editingItem, itemEditData);
    }
  };

  const updatePopulationTargets = async (itemId: string, targets: any) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/items/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targets })
      });

      if (response.ok) {
        toast.success('Population targets updated successfully');
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update targets');
      }
    } catch (error) {
      console.error('Error updating targets:', error);
      toast.error('Failed to update targets');
    }
  };

  const startEditingSection = (section: FormSection) => {
    setEditingSection(section.id);
    setSectionEditData({
      title: section.title,
      description: section.description || '',
      maxMarks: section.maxMarks
    });
  };

  const cancelEditingSection = () => {
    setEditingSection(null);
    setSectionEditData({});
  };

  const updateSection = async (sectionId: string, updates: any) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/sections/${sectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        toast.success('Section updated successfully');
        setEditingSection(null);
        setSectionEditData({});
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to update section');
      }
    } catch (error) {
      console.error('Error updating section:', error);
      toast.error('Failed to update section');
    }
  };

  const saveSectionEdit = () => {
    if (editingSection) {
      updateSection(editingSection, sectionEditData);
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    if (!confirm('Are you sure you want to delete this section? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/sections/${sectionId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Section deleted successfully');
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete section');
      }
    } catch (error) {
      console.error('Error deleting section:', error);
      toast.error('Failed to delete section');
    }
  };

  const deleteItem = async (itemId: string) => {
    if (!form?.id) {
      toast.error('Form not loaded');
      return;
    }

    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/campaign-forms/${form.id}/items/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Item deleted successfully');
        fetchForm();
      } else {
        const data = await response.json();
        toast.error(data.error || 'Failed to delete item');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Failed to delete item');
    }
  };

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleSectionDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && form) {
      const oldIndex = form.sections.findIndex(section => section.id === active.id);
      const newIndex = form.sections.findIndex(section => section.id === over?.id);
      
      const newSections = arrayMove(form.sections, oldIndex, newIndex);
      
      // Update local state with new order
      setForm(prev => prev ? { ...prev, sections: newSections } : null);
    }
  };

  const handleItemDragEnd = (event: DragEndEvent, sectionId: string) => {
    const { active, over } = event;
    
    if (active.id !== over?.id && form) {
      const section = form.sections.find(s => s.id === sectionId);
      if (!section) return;
      
      const oldIndex = section.items.findIndex(item => item.id === active.id);
      const newIndex = section.items.findIndex(item => item.id === over?.id);
      
      const newItems = arrayMove(section.items, oldIndex, newIndex);
      
      // Update local state with new order
      setForm(prev => {
        if (!prev) return null;
        return {
          ...prev,
          sections: prev.sections.map(s => 
            s.id === sectionId ? { ...s, items: newItems } : s
          )
        };
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading form builder...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.push('/super-admin/campaign-forms')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Forms
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isNew ? 'Create New Form' : 'Form Builder'}
            </h1>
            <p className="text-muted-foreground">
              {isNew ? 'Create a new campaign form' : `Editing: ${form?.name}`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFormMetadata(!showFormMetadata)}
          >
            <Settings className="h-4 w-4 mr-2" />
            Form Settings
          </Button>
          <Button onClick={saveForm} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Form'}
          </Button>
        </div>
      </div>

      {/* Form Metadata */}
      {showFormMetadata && (
        <Card>
          <CardHeader>
            <CardTitle>Form Metadata</CardTitle>
            <CardDescription>
              Configure the basic information for this campaign form
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Form Name (Marathi)</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter form name in Marathi"
                />
              </div>
              <div>
                <Label htmlFor="nameEn">Form Name (English)</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData(prev => ({ ...prev, nameEn: e.target.value }))}
                  placeholder="Enter form name in English"
                />
              </div>
              <div>
                <Label htmlFor="campaignName">Campaign Name</Label>
                <Input
                  id="campaignName"
                  value={formData.campaignName}
                  onChange={(e) => setFormData(prev => ({ ...prev, campaignName: e.target.value }))}
                  placeholder="e.g., समृद्ध पंचायत राज अभियान"
                />
              </div>
              <div>
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  placeholder="e.g., 2025-2026"
                />
              </div>
              <div>
                <Label htmlFor="formType">Form Type</Label>
                <Input
                  id="formType"
                  value={formData.formType}
                  onChange={(e) => setFormData(prev => ({ ...prev, formType: e.target.value }))}
                  placeholder="e.g., अभियान अंतर्गत मोहीम कालावधीतील ग्रामपंचायतीसाठी प्रश्नावली"
                />
              </div>
              <div>
                <Label htmlFor="maxPossibleTotal">Maximum Possible Total</Label>
                <Input
                  id="maxPossibleTotal"
                  type="number"
                  value={formData.maxPossibleTotal}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPossibleTotal: parseFloat(e.target.value) || 100 }))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter form description"
                rows={3}
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                />
                Active
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
                />
                Default Form
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sections */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Sections</CardTitle>
              <CardDescription>
                Manage form sections and their items
              </CardDescription>
            </div>
            {form?.id && (
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!form?.id ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Please save the form first to add sections
              </p>
            </div>
          ) : form.sections.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No sections added yet
              </p>
              <Button onClick={addSection}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Section
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleSectionDragEnd}
            >
              <SortableContext
                items={form.sections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {form.sections.map((section) => (
                    <div key={section.id}>
                      <SortableSection
                        section={section}
                        isExpanded={expandedSections.has(section.id)}
                        editingSection={editingSection}
                        sectionEditData={sectionEditData}
                        setSectionEditData={setSectionEditData}
                        onToggle={toggleSection}
                        onStartEdit={startEditingSection}
                        onSaveEdit={saveSectionEdit}
                        onCancelEdit={cancelEditingSection}
                        onDelete={deleteSection}
                      />
                      {expandedSections.has(section.id) && (
                        <CardContent>
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={(event) => handleItemDragEnd(event, section.id)}
                          >
                            <SortableContext
                              items={section.items.map(i => i.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              <div className="space-y-2">
                                {section.items.map((item) => (
                                  <SortableItem
                                    key={item.id}
                                    item={item}
                                    editingItem={editingItem}
                                    itemEditData={itemEditData}
                                    setItemEditData={setItemEditData}
                                    onStartEdit={startEditingItem}
                                    onSaveEdit={saveItemEdit}
                                    onCancelEdit={cancelEditingItem}
                                    onDelete={deleteItem}
                                    onUpdateTargets={updatePopulationTargets}
                                  />
                                ))}
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full"
                                  onClick={() => addItem(section.id)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add Item
                                </Button>
                              </div>
                            </SortableContext>
                          </DndContext>
                        </CardContent>
                      )}
                    </div>
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
