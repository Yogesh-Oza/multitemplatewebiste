'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, FileText, CheckCircle, ArrowUp, ArrowDown, X, Download, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  applicationProcessDemoConfig,
  ApplicationProcessConfigData,
  ApplicationStep,
  RequiredDocument
} from '@/lib/demo-schemes-beneficiary';

const emptyStep: ApplicationStep = {
  step: 1,
  title: '',
  titleEn: '',
  description: '',
  descriptionEn: '',
  icon: 'CheckCircle',
  color: 'text-blue-600',
  bgColor: 'bg-blue-50'
};

const emptyDocument: RequiredDocument = {
  name: '',
  nameEn: '',
  required: true,
  description: '',
  descriptionEn: ''
};

export default function ApplicationProcessAdminPage() {
  const [loading, setLoading] = useState(true);
  const [config, setConfig] = useState<ApplicationProcessConfigData>(applicationProcessDemoConfig);
  const [isDemo, setIsDemo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [stepModalOpen, setStepModalOpen] = useState(false);
  const [documentModalOpen, setDocumentModalOpen] = useState(false);
  const [stepForm, setStepForm] = useState<ApplicationStep>(emptyStep);
  const [documentForm, setDocumentForm] = useState<RequiredDocument>(emptyDocument);
  const [editingStepIndex, setEditingStepIndex] = useState<number | null>(null);
  const [editingDocumentIndex, setEditingDocumentIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/application-process');
      if (response.ok) {
        const data = await response.json();
        setConfig({
          steps: data.steps || applicationProcessDemoConfig.steps,
          requiredDocuments: data.requiredDocuments || applicationProcessDemoConfig.requiredDocuments,
          applicationFormUrl: data.applicationFormUrl || '',
          sampleFormUrl: data.sampleFormUrl || '',
          isActive: data.isActive ?? true
        });
        setIsDemo(Boolean(data.isDemo));
      } else {
        toast.error('डेटा लोड करताना त्रुटी आली');
      }
    } catch (error) {
      console.error(error);
      toast.error('डेटा लोड करताना त्रुटी आली');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/application-process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (!response.ok) {
        throw new Error('Failed to save config');
      }

      toast.success('अर्ज प्रक्रिया माहिती जतन केली');
      setIsDemo(false);
      await fetchData();
    } catch (error) {
      console.error(error);
      toast.error('माहिती जतन करण्यात अडचण आली');
    } finally {
      setSaving(false);
    }
  };

  const openStepModal = (step?: ApplicationStep, index?: number) => {
    if (step && index !== undefined) {
      setEditingStepIndex(index);
      setStepForm(step);
    } else {
      setEditingStepIndex(null);
      setStepForm({ ...emptyStep, step: (config.steps?.length || 0) + 1 });
    }
    setStepModalOpen(true);
  };

  const handleStepSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSteps = [...(config.steps || [])];
    if (editingStepIndex !== null) {
      newSteps[editingStepIndex] = stepForm;
    } else {
      newSteps.push(stepForm);
    }
    // Reorder steps
    newSteps.forEach((step, idx) => {
      step.step = idx + 1;
    });
    setConfig({ ...config, steps: newSteps });
    setStepModalOpen(false);
    setEditingStepIndex(null);
    setStepForm(emptyStep);
  };

  const handleStepDelete = (index: number) => {
    if (!confirm('ही पायरी हटवायची आहे?')) return;
    const newSteps = config.steps.filter((_, i) => i !== index);
    newSteps.forEach((step, idx) => {
      step.step = idx + 1;
    });
    setConfig({ ...config, steps: newSteps });
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newSteps = [...config.steps];
    if (direction === 'up' && index > 0) {
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index], newSteps[index + 1]] = [newSteps[index + 1], newSteps[index]];
    }
    newSteps.forEach((step, idx) => {
      step.step = idx + 1;
    });
    setConfig({ ...config, steps: newSteps });
  };

  const openDocumentModal = (doc?: RequiredDocument, index?: number) => {
    if (doc && index !== undefined) {
      setEditingDocumentIndex(index);
      setDocumentForm(doc);
    } else {
      setEditingDocumentIndex(null);
      setDocumentForm(emptyDocument);
    }
    setDocumentModalOpen(true);
  };

  const handleDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newDocs = [...(config.requiredDocuments || [])];
    if (editingDocumentIndex !== null) {
      newDocs[editingDocumentIndex] = documentForm;
    } else {
      newDocs.push(documentForm);
    }
    setConfig({ ...config, requiredDocuments: newDocs });
    setDocumentModalOpen(false);
    setEditingDocumentIndex(null);
    setDocumentForm(emptyDocument);
  };

  const handleDocumentDelete = (index: number) => {
    if (!confirm('हा दस्तावेज हटवायचा आहे?')) return;
    const newDocs = config.requiredDocuments.filter((_, i) => i !== index);
    setConfig({ ...config, requiredDocuments: newDocs });
  };

  const iconOptions = [
    { value: 'CheckCircle', label: 'Check Circle' },
    { value: 'FileText', label: 'File Text' },
    { value: 'User', label: 'User' },
    { value: 'ArrowRight', label: 'Arrow Right' },
    { value: 'Clock', label: 'Clock' }
  ];

  const colorOptions = [
    { value: 'text-blue-600', bg: 'bg-blue-50', label: 'Blue' },
    { value: 'text-green-600', bg: 'bg-green-50', label: 'Green' },
    { value: 'text-purple-600', bg: 'bg-purple-50', label: 'Purple' },
    { value: 'text-orange-600', bg: 'bg-orange-50', label: 'Orange' },
    { value: 'text-indigo-600', bg: 'bg-indigo-50', label: 'Indigo' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">अर्ज प्रक्रिया व्यवस्थापन</h1>
        <p className="text-gray-600 mt-2">
          अर्ज प्रक्रियेच्या पायऱ्या आणि आवश्यक कागदपत्रे व्यवस्थापित करा.
        </p>
        {isDemo && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              सध्या तुम्ही डेमो डेटा पाहत आहात. माहिती जतन केल्यावर हे विभाग तुमच्या गावाच्या वास्तविक
              माहितीने भरले जाईल.
            </p>
          </div>
        )}
      </div>

      {/* Steps Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>अर्ज प्रक्रिया पायऱ्या</CardTitle>
              <CardDescription>अर्ज प्रक्रियेच्या पायऱ्या जोडा, संपादित करा किंवा हटवा.</CardDescription>
            </div>
            <Button onClick={() => openStepModal()}>
              <Plus className="h-4 w-4 mr-2" />
              नवीन पायरी
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {config.steps?.map((step, index) => (
              <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  <Badge variant="outline">Step {step.step}</Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold">{step.title}</h4>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveStep(index, 'up')}
                    disabled={index === 0}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveStep(index, 'down')}
                    disabled={index === config.steps.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => openStepModal(step, index)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleStepDelete(index)} className="text-red-600">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
            {(!config.steps || config.steps.length === 0) && (
              <p className="text-center text-gray-500 py-8">कोणतीही पायरी नाही. नवीन पायरी जोडा.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Documents Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>आवश्यक कागदपत्रे</CardTitle>
              <CardDescription>आवश्यक कागदपत्रांची यादी व्यवस्थापित करा.</CardDescription>
            </div>
            <Button onClick={() => openDocumentModal()}>
              <Plus className="h-4 w-4 mr-2" />
              नवीन दस्तावेज
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {config.requiredDocuments?.map((doc, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold">{doc.name}</h4>
                    <p className="text-sm text-gray-600">{doc.description}</p>
                    <Badge className={doc.required ? 'bg-red-100 text-red-700 mt-2' : 'bg-yellow-100 text-yellow-700 mt-2'}>
                      {doc.required ? 'आवश्यक' : 'पर्यायी'}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openDocumentModal(doc, index)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDocumentDelete(index)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            {(!config.requiredDocuments || config.requiredDocuments.length === 0) && (
              <p className="text-center text-gray-500 py-8 col-span-2">कोणतेही दस्तावेज नाहीत. नवीन दस्तावेज जोडा.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Form URLs */}
      <Card>
        <CardHeader>
          <CardTitle>फॉर्म URL</CardTitle>
          <CardDescription>अर्ज फॉर्म डाउनलोड आणि नमुना फॉर्म URL जोडा.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>अर्ज फॉर्म डाउनलोड URL</Label>
            <Input
              value={config.applicationFormUrl || ''}
              onChange={(e) => setConfig({ ...config, applicationFormUrl: e.target.value })}
              placeholder="https://example.com/form.pdf"
            />
          </div>
          <div>
            <Label>नमुना फॉर्म URL</Label>
            <Input
              value={config.sampleFormUrl || ''}
              onChange={(e) => setConfig({ ...config, sampleFormUrl: e.target.value })}
              placeholder="https://example.com/sample-form.pdf"
            />
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? 'जतन होत आहे...' : 'सर्व माहिती जतन करा'}
        </Button>
      </div>

      {/* Step Modal */}
      {stepModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingStepIndex !== null ? 'पायरी संपादित करा' : 'नवीन पायरी जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setStepModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleStepSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>शीर्षक (मराठी)</Label>
                    <Input
                      value={stepForm.title}
                      onChange={(e) => setStepForm({ ...stepForm, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>शीर्षक (English)</Label>
                    <Input
                      value={stepForm.titleEn}
                      onChange={(e) => setStepForm({ ...stepForm, titleEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={stepForm.description}
                    onChange={(e) => setStepForm({ ...stepForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={stepForm.descriptionEn}
                    onChange={(e) => setStepForm({ ...stepForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>Icon</Label>
                    <select
                      value={stepForm.icon}
                      onChange={(e) => setStepForm({ ...stepForm, icon: e.target.value })}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {iconOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>रंग</Label>
                    <select
                      value={stepForm.color}
                      onChange={(e) => {
                        const selected = colorOptions.find(c => c.value === e.target.value);
                        if (selected) {
                          setStepForm({ ...stepForm, color: selected.value, bgColor: selected.bg });
                        }
                      }}
                      className="w-full px-3 py-2 border rounded-md"
                    >
                      {colorOptions.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setStepModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Document Modal */}
      {documentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-semibold">
                  {editingDocumentIndex !== null ? 'दस्तावेज संपादित करा' : 'नवीन दस्तावेज जोडा'}
                </h3>
                <Button variant="ghost" onClick={() => setDocumentModalOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleDocumentSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label>नाव (मराठी)</Label>
                    <Input
                      value={documentForm.name}
                      onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label>नाव (English)</Label>
                    <Input
                      value={documentForm.nameEn}
                      onChange={(e) => setDocumentForm({ ...documentForm, nameEn: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label>वर्णन (मराठी)</Label>
                  <Textarea
                    value={documentForm.description}
                    onChange={(e) => setDocumentForm({ ...documentForm, description: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div>
                  <Label>वर्णन (English)</Label>
                  <Textarea
                    value={documentForm.descriptionEn}
                    onChange={(e) => setDocumentForm({ ...documentForm, descriptionEn: e.target.value })}
                    rows={2}
                    required
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={documentForm.required}
                    onChange={(e) => setDocumentForm({ ...documentForm, required: e.target.checked })}
                    className="h-4 w-4"
                  />
                  <Label className="cursor-pointer">आवश्यक</Label>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setDocumentModalOpen(false)}>
                    रद्द करा
                  </Button>
                  <Button type="submit">जतन करा</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

