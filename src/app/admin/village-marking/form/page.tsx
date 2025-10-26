'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  Send, 
  AlertCircle, 
  CheckCircle,
  Calculator,
  Info,
  Eye,
  EyeOff
} from 'lucide-react';

interface Field {
  id: string;
  fieldName: string;
  fieldNameEn: string;
  fieldType: string;
  formula?: string;
  isEditable: boolean;
  order: number;
}

interface FieldValue {
  fieldId: string;
  udisht?: number;
  sadhya?: number;
  percentage?: number;
  marks?: number;
  textValue?: string;
  numberValue?: number;
  dateValue?: string;
  fileUrl?: string;
  checkboxValue?: boolean;
  calculatedValue?: number;
}

interface Section {
  id: string;
  title: string;
  titleEn: string;
  description?: string;
  maxMarks: number;
  fields: Field[];
}

interface Submission {
  id: string;
  status: string;
  totalMarks: number;
  totalMaxMarks: number;
  section: Section;
  fieldValues: FieldValue[];
}

export default function MarkingFormPage() {
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [fieldValues, setFieldValues] = useState<{ [key: string]: FieldValue }>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [showCalculations, setShowCalculations] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    fetchSubmission();
    // Auto-save every 2 minutes
    const interval = setInterval(autoSave, 120000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubmission = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/village-marking/submission');
      
      if (!response.ok) {
        throw new Error('Failed to fetch submission');
      }
      
      const data = await response.json();
      setSubmission(data.submission);
      
      if (data.submission) {
        // Initialize field values
        const values: { [key: string]: FieldValue } = {};
        data.submission.fieldValues.forEach((fv: any) => {
          values[fv.fieldId] = {
            fieldId: fv.fieldId,
            udisht: fv.udisht,
            sadhya: fv.sadhya,
            percentage: fv.percentage,
            marks: fv.marks,
            textValue: fv.textValue,
            numberValue: fv.numberValue,
            dateValue: fv.dateValue,
            fileUrl: fv.fileUrl,
            checkboxValue: fv.checkboxValue,
            calculatedValue: fv.calculatedValue
          };
        });
        setFieldValues(values);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const autoSave = async () => {
    if (!submission || submission.status !== 'draft') return;
    
    try {
      await saveSubmission(true);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  };

  const saveSubmission = async (isDraft = true) => {
    if (!submission) return;

    try {
      setSaving(true);
      const response = await fetch('/api/village-marking/submission', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id,
          fieldValues: Object.values(fieldValues),
          totalMarks: submission.totalMarks,
          totalMaxMarks: submission.totalMaxMarks
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save submission');
      }

      if (!isDraft) {
        setSuccess('Form submitted successfully!');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save submission');
    } finally {
      setSaving(false);
    }
  };

  const submitForApproval = async () => {
    if (!submission) return;

    try {
      setSaving(true);
      const response = await fetch('/api/village-marking/submission', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          submissionId: submission.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit for approval');
      }

      setSuccess('Form submitted for approval!');
      await fetchSubmission(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit for approval');
    } finally {
      setSaving(false);
    }
  };

  const handleFieldChange = async (fieldId: string, value: any, fieldType: string) => {
    const newFieldValues = { ...fieldValues };
    
    if (!newFieldValues[fieldId]) {
      newFieldValues[fieldId] = { fieldId };
    }

    // Update the specific field value
    if (fieldType === 'udisht' || fieldType === 'sadhya') {
      newFieldValues[fieldId][fieldType] = parseFloat(value) || 0;
      
      // Calculate percentage and marks if both udisht and sadhya are available
      const udisht = newFieldValues[fieldId].udisht || 0;
      const sadhya = newFieldValues[fieldId].sadhya || 0;
      
      if (udisht > 0) {
        const percentage = (sadhya / udisht) * 100;
        newFieldValues[fieldId].percentage = percentage;
        
        // Calculate marks based on percentage
        const marks = calculateMarksFromPercentage(percentage);
        newFieldValues[fieldId].marks = marks;
      }
    } else {
      newFieldValues[fieldId][fieldType] = value;
    }

    setFieldValues(newFieldValues);

    // Auto-save after a delay
    setTimeout(() => {
      if (submission?.status === 'draft') {
        saveSubmission(true);
      }
    }, 2000);
  };

  const calculateMarksFromPercentage = (percentage: number): number => {
    if (percentage >= 90) return 10;
    if (percentage >= 75) return 8;
    if (percentage >= 60) return 6;
    if (percentage >= 50) return 4;
    return 2;
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const toggleCalculations = (fieldId: string) => {
    setShowCalculations(prev => ({
      ...prev,
      [fieldId]: !prev[fieldId]
    }));
  };

  const renderField = (field: Field) => {
    const fieldValue = fieldValues[field.id] || { fieldId: field.id };
    const isReadOnly = !field.isEditable || field.fieldType === 'percentage' || field.fieldType === 'marks';

    switch (field.fieldType) {
      case 'udisht':
      case 'sadhya':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <div className="flex gap-2">
              <Input
                id={field.id}
                type="number"
                value={fieldValue[field.fieldType] || ''}
                onChange={(e) => handleFieldChange(field.id, e.target.value, field.fieldType)}
                placeholder={`Enter ${field.fieldName}`}
                min="0"
                step="0.01"
                className="flex-1"
              />
              {fieldValue.percentage !== undefined && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => toggleCalculations(field.id)}
                >
                  {showCalculations[field.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              )}
            </div>
            {showCalculations[field.id] && fieldValue.percentage !== undefined && (
              <div className="p-3 bg-blue-50 rounded-lg text-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Calculation Details</span>
                </div>
                <div className="space-y-1 text-gray-600">
                  <div>उदिष्ट (Target): {fieldValue.udisht || 0}</div>
                  <div>साध्य (Achievement): {fieldValue.sadhya || 0}</div>
                  <div>टक्केवारी (Percentage): {fieldValue.percentage?.toFixed(2)}%</div>
                  <div>गुण (Marks): {fieldValue.marks || 0}</div>
                </div>
              </div>
            )}
          </div>
        );

      case 'percentage':
      case 'marks':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={fieldValue[field.fieldType] || ''}
              readOnly
              className="bg-gray-50"
            />
            <div className="text-sm text-gray-500">
              Auto-calculated based on उदिष्ट and साध्य values
            </div>
          </div>
        );

      case 'text':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <Textarea
              id={field.id}
              value={fieldValue.textValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, 'textValue')}
              placeholder={`Enter ${field.fieldName}`}
              rows={3}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <Input
              id={field.id}
              type="number"
              value={fieldValue.numberValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, 'numberValue')}
              placeholder={`Enter ${field.fieldName}`}
              min="0"
              step="0.01"
            />
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={fieldValue.dateValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, 'dateValue')}
            />
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <input
                id={field.id}
                type="checkbox"
                checked={fieldValue.checkboxValue || false}
                onChange={(e) => handleFieldChange(field.id, e.target.checked, 'checkboxValue')}
                className="rounded"
              />
              <Label htmlFor={field.id}>
                {field.fieldName} / {field.fieldNameEn}
              </Label>
            </div>
          </div>
        );

      default:
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.fieldName} / {field.fieldNameEn}
            </Label>
            <Input
              id={field.id}
              value={fieldValue.textValue || ''}
              onChange={(e) => handleFieldChange(field.id, e.target.value, 'textValue')}
              placeholder={`Enter ${field.fieldName}`}
            />
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-gray-500 text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Form Available</h2>
          <p className="text-gray-600 mb-4">No marking form has been created yet.</p>
          <Button onClick={() => window.location.href = '/admin/village-marking'}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">गुणांक फॉर्म</h1>
          <p className="text-gray-600">Marking Form - {submission.section.title}</p>
        </div>
        <div className="flex gap-2">
          <Badge variant={submission.status === 'draft' ? 'secondary' : 'default'}>
            {submission.status}
          </Badge>
        </div>
      </div>

      {/* Alerts */}
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

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success</h3>
              <p className="text-sm text-green-700 mt-1">{success}</p>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{submission.section.title}</CardTitle>
          <CardDescription>{submission.section.titleEn}</CardDescription>
          {submission.section.description && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start">
                <Info className="w-4 h-4 text-blue-600 mt-0.5 mr-2" />
                <p className="text-sm text-blue-800">{submission.section.description}</p>
              </div>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {submission.section.fields.map((field) => (
              <div key={field.id} className="p-4 border rounded-lg">
                {renderField(field)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {submission.status === 'draft' && 'Form is saved as draft. Changes are auto-saved.'}
          {submission.status === 'submitted' && 'Form has been submitted for review.'}
          {submission.status === 'approved' && 'Form has been approved.'}
          {submission.status === 'rejected' && 'Form has been rejected. Please review and resubmit.'}
        </div>
        <div className="flex gap-2">
          {submission.status === 'draft' && (
            <>
              <Button
                variant="outline"
                onClick={() => saveSubmission(true)}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Draft'}
              </Button>
              <Button
                onClick={submitForApproval}
                disabled={saving}
              >
                <Send className="w-4 h-4 mr-2" />
                {saving ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            </>
          )}
          {submission.status === 'rejected' && (
            <Button
              onClick={submitForApproval}
              disabled={saving}
            >
              <Send className="w-4 h-4 mr-2" />
              {saving ? 'Resubmitting...' : 'Resubmit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
