'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAdminContext } from '@/components/providers/admin-context';
import { 
  ArrowLeft,
  Save,
  Send,
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  Calculator,
  Target,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CampaignForm {
  id: string;
  name: string;
  nameEn: string;
  formMetadata: {
    campaignName?: string;
    year?: string;
    formType?: string;
  };
  maxPossibleTotal: number;
  sections: FormSection[];
}

interface FormSection {
  id: string;
  sectionId: number;
  title: string;
  description?: string;
  maxMarks: number;
  order: number;
  items: FormItem[];
}

interface FormItem {
  id: string;
  itemId: string;
  sectionId: string;
  itemType: string;
  fieldName: string;
  description?: string;
  targets?: any;
  unit?: string;
  maxMarks: number;
  order: number;
  subItems: FormItem[];
  parentItemId?: string;
}

interface ItemValue {
  itemId: string;
  sectionId: string;
  target: number; // Legacy field
  targetValue: number; // Target Value (e.g., 100)
  targetPercentage: number; // Target Percentage (e.g., 80%)
  achieved: number;
  percentage: number;
  marks: number;
  innovations?: string[];
}

interface SectionProgress {
  sectionId: string;
  achievedMarks: number;
  maxMarks: number;
  percentage: number;
}

export default function CampaignFormPage() {
  const router = useRouter();
  const { subdomainId } = useAdminContext();
  const [campaignForm, setCampaignForm] = useState<CampaignForm | null>(null);
  const [submission, setSubmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [itemValues, setItemValues] = useState<Map<string, ItemValue>>(new Map());
  const [sectionProgress, setSectionProgress] = useState<Map<string, SectionProgress>>(new Map());
  const [basicInfo, setBasicInfo] = useState<any>(null);
  const [populationCategory, setPopulationCategory] = useState('below2000');

  // Auto-save timer
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
  }, [subdomainId]);

  // Initialize target percentage for all items when form loads
  useEffect(() => {
    if (campaignForm && populationCategory) {
      const newValues = new Map(itemValues);
      let hasUpdates = false;

      campaignForm.sections.forEach(section => {
        section.items.forEach(item => {
          const currentValue = newValues.get(item.id);
          if (currentValue) {
            const targetPercentage = getTargetForPopulation(item);
            if (currentValue.targetPercentage !== targetPercentage) {
              const calculated = calculateItemMarks(item, currentValue.targetValue, targetPercentage, currentValue.achieved);
              newValues.set(item.id, { ...currentValue, targetPercentage, ...calculated });
              hasUpdates = true;
            }
          }
        });
      });

      if (hasUpdates) {
        setItemValues(newValues);
      }
    }
  }, [campaignForm, populationCategory]);

  // Auto-save effect
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    const timer = setTimeout(() => {
      if (itemValues.size > 0) {
        saveDraft();
      }
    }, 120000); // 2 minutes

    setAutoSaveTimer(timer);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [itemValues]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Wait for subdomainId to be available
      if (!subdomainId) {
        console.log('Waiting for subdomainId...');
        return;
      }
      
      // Get the default campaign form
      const formResponse = await fetch('/api/super-admin/campaign-forms');
      const formData = await formResponse.json();
      
      if (formResponse.ok && formData.forms.length > 0) {
        const defaultForm = formData.forms.find((form: any) => form.isDefault) || formData.forms[0];
        console.log('Loaded campaign form:', defaultForm);
        console.log('Form sections:', defaultForm.sections);
        if (defaultForm.sections && defaultForm.sections.length > 0) {
          console.log('First section items:', defaultForm.sections[0].items);
          if (defaultForm.sections[0].items && defaultForm.sections[0].items.length > 0) {
            console.log('First item:', defaultForm.sections[0].items[0]);
          }
        }
        setCampaignForm(defaultForm);

        // Get existing submission
        const submissionResponse = await fetch(`/api/campaign-form/submission?subdomainId=${subdomainId}&campaignFormId=${defaultForm.id}`);
        const submissionData = await submissionResponse.json();
        
        if (submissionResponse.ok && submissionData.submission) {
          setSubmission(submissionData.submission);
          
          // Load existing item values
          const existingValues = new Map<string, ItemValue>();
          submissionData.submission.itemValues?.forEach((itemValue: any) => {
            existingValues.set(itemValue.item.id, {
              itemId: itemValue.item.id,
              sectionId: itemValue.sectionId || itemValue.section?.id || '',
              target: itemValue.target || 0, // Legacy field
              targetValue: itemValue.targetValue || 0,
              targetPercentage: itemValue.targetPercentage || 100,
              achieved: itemValue.achieved || 0,
              percentage: itemValue.percentage || 0,
              marks: itemValue.marks || 0,
              innovations: itemValue.innovations || []
            });
          });
          setItemValues(existingValues);
        }

        // Get basic info for population category
        const basicInfoResponse = await fetch(`/api/campaign-form/basic-info?subdomainId=${subdomainId}`);
        const basicInfoData = await basicInfoResponse.json();
        
        if (basicInfoResponse.ok && basicInfoData.basicInfo) {
          setBasicInfo(basicInfoData.basicInfo);
          setPopulationCategory(basicInfoData.basicInfo.populationCategory || 'below2000');
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load campaign form');
    } finally {
      setLoading(false);
    }
  };

  const getTargetForPopulation = (item: FormItem) => {
    if (!item.targets) return 0;
    const target = item.targets[populationCategory];
    if (typeof target === 'string' && target.includes('%')) {
      return parseFloat(target.replace('%', ''));
    }
    return parseFloat(target) || 0;
  };

  const calculateItemMarks = (item: FormItem, targetValue: number, targetPercentage: number, achieved: number): { percentage: number; marks: number } => {
    if (targetValue <= 0 || targetPercentage <= 0) return { percentage: 0, marks: 0 };
    
    // Calculate the target based on target percentage of target value
    const actualTarget = (targetValue * targetPercentage) / 100;
    
    // Calculate percentage based on achieved vs actual target
    const percentage = Math.min((achieved / actualTarget) * 100, 100);
    const marks = (percentage / 100) * item.maxMarks;
    
    return {
      percentage: Math.round(percentage * 100) / 100,
      marks: Math.round(marks * 100) / 100
    };
  };

  const updateItemValue = (itemId: string, field: keyof ItemValue, value: any) => {
    const item = findItemById(itemId);
    if (!item) return;

    // Find the section ID for this item
    let sectionId = item.sectionId;
    if (!sectionId && campaignForm) {
      for (const section of campaignForm.sections) {
        if (section.items.some(i => i.id === itemId) || section.items.some(i => i.subItems.some(si => si.id === itemId))) {
          sectionId = section.id;
          break;
        }
      }
    }


    setItemValues(prev => {
      const newValues = new Map(prev);
      const currentValue = newValues.get(itemId) || {
        itemId,
        sectionId: sectionId || '',
        target: 0, // Legacy field
        targetValue: 0,
        targetPercentage: 100, // Default to 100%
        achieved: 0,
        percentage: 0,
        marks: 0,
        innovations: []
      };

      let updatedValue = { ...currentValue, [field]: value };

      // Recalculate if targetValue or achieved changed
      if (field === 'targetValue' || field === 'achieved') {
        const targetValue = field === 'targetValue' ? value : currentValue.targetValue;
        const targetPercentage = getTargetForPopulation(item); // Get from population-based targets
        const achieved = field === 'achieved' ? value : currentValue.achieved;
        const calculated = calculateItemMarks(item, targetValue, targetPercentage, achieved);
        updatedValue = { ...updatedValue, ...calculated, targetPercentage };
      }

      newValues.set(itemId, updatedValue);
      return newValues;
    });
  };

  const findItemById = (itemId: string): FormItem | null => {
    if (!campaignForm) return null;
    
    for (const section of campaignForm.sections) {
      for (const item of section.items) {
        if (item.id === itemId) return item;
      }
    }
    return null;
  };

  const calculateSectionProgress = (section: FormSection) => {
    let achievedMarks = 0;
    let maxMarks = 0;

    section.items.forEach(item => {
      if (item.itemType === 'innovation') {
        // For innovation items, count innovations
        const itemValue = itemValues.get(item.id);
        if (itemValue && itemValue.innovations) {
          const innovationCount = itemValue.innovations.length;
          achievedMarks += Math.min(innovationCount, 5); // Max 5 marks
        }
        maxMarks += item.maxMarks;
      } else {
        // Regular items
        const itemValue = itemValues.get(item.id);
        if (itemValue) {
          achievedMarks += itemValue.marks;
        }
        maxMarks += item.maxMarks;
      }
    });

    const percentage = maxMarks > 0 ? Math.round((achievedMarks / maxMarks) * 100) : 0;

    return { achievedMarks, maxMarks, percentage };
  };

  const updateSectionProgress = () => {
    if (!campaignForm) return;

    const newProgress = new Map<string, SectionProgress>();
    
    campaignForm.sections.forEach(section => {
      const progress = calculateSectionProgress(section);
      newProgress.set(section.id, {
        sectionId: section.id,
        ...progress
      });
    });

    setSectionProgress(newProgress);
  };

  useEffect(() => {
    updateSectionProgress();
  }, [itemValues, campaignForm]);

  // Initialize target values when form loads
  useEffect(() => {
    if (campaignForm && populationCategory) {
      const newValues = new Map(itemValues);
      let hasChanges = false;

      campaignForm.sections.forEach(section => {
        section.items.forEach(item => {
          if (!newValues.has(item.id)) {
            newValues.set(item.id, {
              itemId: item.id,
              sectionId: item.sectionId || section.id, // Use section.id as fallback
              target: 0, // Legacy field
              targetValue: 0, // User will enter this
              targetPercentage: getTargetForPopulation(item), // Auto-set from population
              achieved: 0,
              percentage: 0,
              marks: 0,
              innovations: []
            });
            hasChanges = true;
          }

        });
      });

      if (hasChanges) {
        setItemValues(newValues);
      }
    }
  }, [campaignForm, populationCategory]);

  const getTotalMarks = () => {
    let total = 0;
    let maxTotal = 0;

    sectionProgress.forEach(progress => {
      total += progress.achievedMarks;
      maxTotal += progress.maxMarks;
    });

    return { total, maxTotal };
  };

  const saveDraft = async () => {
    try {
      const { total, maxTotal } = getTotalMarks();
      
      const response = await fetch('/api/campaign-form/submission', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subdomainId: 'current',
          campaignFormId: campaignForm?.id,
          basicInfo,
          itemValues: Array.from(itemValues.values()),
          summary: {
            grandTotal: total,
            maxPossibleTotal: maxTotal,
            sectionTotals: Object.fromEntries(sectionProgress)
          },
          status: 'draft'
        })
      });

      if (response.ok) {
        setLastSaved(new Date());
        toast.success('Draft saved automatically');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const { total, maxTotal } = getTotalMarks();
      
      const itemValuesArray = Array.from(itemValues.values());

      const response = await fetch('/api/campaign-form/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission?.id,
          itemValues: itemValuesArray,
          basicInfo,
          summary: {
            grandTotal: total,
            maxPossibleTotal: maxTotal,
            sectionTotals: Object.fromEntries(sectionProgress)
          }
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Form submitted successfully!');
        router.push('/admin/campaign-form/results');
      } else {
        toast.error(data.error || 'Failed to submit form');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Failed to submit form');
    } finally {
      setSubmitting(false);
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

  const addInnovation = (itemId: string) => {
    const itemValue = itemValues.get(itemId);
    if (itemValue) {
      const newInnovations = [...(itemValue.innovations || []), ''];
      updateItemValue(itemId, 'innovations', newInnovations);
    }
  };

  const updateInnovation = (itemId: string, index: number, value: string) => {
    const itemValue = itemValues.get(itemId);
    if (itemValue) {
      const newInnovations = [...(itemValue.innovations || [])];
      newInnovations[index] = value;
      updateItemValue(itemId, 'innovations', newInnovations);
    }
  };

  const removeInnovation = (itemId: string, index: number) => {
    const itemValue = itemValues.get(itemId);
    if (itemValue) {
      const newInnovations = (itemValue.innovations || []).filter((_, i) => i !== index);
      updateItemValue(itemId, 'innovations', newInnovations);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading campaign form...</p>
        </div>
      </div>
    );
  }

  if (!campaignForm) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Campaign Form Available</h3>
        <p className="text-muted-foreground">
          Please contact the administrator to set up a campaign form.
        </p>
      </div>
    );
  }

  const { total, maxTotal } = getTotalMarks();
  const overallPercentage = maxTotal > 0 ? Math.round((total / maxTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/admin/campaign-form">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{campaignForm.name}</h1>
            <p className="text-muted-foreground">{campaignForm.nameEn}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">
                {campaignForm.formMetadata.year || '2025-2026'}
              </Badge>
              <Badge variant="secondary">
                Population: {populationCategory}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveDraft} variant="outline" disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            <Send className="h-4 w-4 mr-2" />
            {submitting ? 'Submitting...' : 'Submit Form'}
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Overall Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{total.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Marks Achieved</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{overallPercentage}%</div>
              <div className="text-sm text-muted-foreground">Completion</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{maxTotal.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Max Possible</div>
            </div>
          </div>
          <div className="mt-4">
            <Progress value={overallPercentage} className="h-2" />
          </div>
          {lastSaved && (
            <p className="text-xs text-muted-foreground mt-2">
              Last saved: {lastSaved.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Form Sections */}
      <div className="space-y-4">
        {campaignForm.sections
          .sort((a, b) => (a.order || 0) - (b.order || 0))
          .map((section) => (
          <Card key={section.id} className="border-l-4 border-l-blue-500">
            <CardHeader
              className="cursor-pointer"
              onClick={() => toggleSection(section.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <div>
                    <CardTitle className="text-lg">
                      Section {section.sectionId}: {section.title}
                    </CardTitle>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {sectionProgress.get(section.id)?.achievedMarks || 0} / {sectionProgress.get(section.id)?.maxMarks || 0} marks
                  </Badge>
                  <Badge variant="secondary">
                    {sectionProgress.get(section.id)?.percentage || 0}%
                  </Badge>
                </div>
              </div>
            </CardHeader>
            {expandedSections.has(section.id) && (
              <CardContent>
                <div className="space-y-6">
                  {section.items
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h4 className="font-medium">{item.fieldName}</h4>
                        {item.description && (
                          <p className="text-sm text-blue-600 mt-1">{item.description}</p>
                        )}
                      </div>

                      {item.itemType === 'innovation' ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Innovation Items (Max 5, 1 mark each)</Label>
                            <Button
                              size="sm"
                              onClick={() => addInnovation(item.id)}
                              disabled={(itemValues.get(item.id)?.innovations?.length || 0) >= 5}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Innovation
                            </Button>
                          </div>
                          {(itemValues.get(item.id)?.innovations || []).map((innovation, index) => (
                            <div key={index} className="flex gap-2">
                              <Input
                                value={innovation}
                                onChange={(e) => updateInnovation(item.id, index, e.target.value)}
                                placeholder="Describe the innovation"
                                className="flex-1"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeInnovation(item.id, index)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                          <div className="text-sm text-muted-foreground">
                            Innovations: {(itemValues.get(item.id)?.innovations?.length || 0)}/5
                          </div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                          <div>
                            <Label>Target (उदिष्ट) </Label>
                            <Input
                              type="number"
                              value={itemValues.get(item.id)?.targetValue || 0}
                              onChange={(e) => updateItemValue(item.id, 'targetValue', parseFloat(e.target.value) || 0)}
                              placeholder="Enter target value"
                            />
                          </div>
                          <div>
                            <Label>Achieved (साध्य)</Label>
                            <Input
                              type="number"
                              value={itemValues.get(item.id)?.achieved || 0}
                              onChange={(e) => updateItemValue(item.id, 'achieved', parseFloat(e.target.value) || 0)}
                              placeholder="Achieved"
                            />
                          </div>
                          <div>
                            <Label>Population-based Targets</Label>
                            <Input
                              value={`${getTargetForPopulation(item)}%`}
                              disabled
                              className="bg-muted"
                              placeholder="Auto-set from population"
                            />
                          </div>
                          <div>
                            <Label>Achieved Percentage</Label>
                            <Input
                              value={`${itemValues.get(item.id)?.percentage || 0}%`}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                          <div>
                            <Label>Marks (गुण)</Label>
                            <Input
                              value={itemValues.get(item.id)?.marks || 0}
                              disabled
                              className="bg-muted"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
