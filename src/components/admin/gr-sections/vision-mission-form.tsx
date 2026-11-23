'use client';

import { useEffect, useState } from 'react';
import { Save, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface VisionContent {
  vision?: string;
  visionEn?: string;
  mission?: string;
  missionEn?: string;
  values?: string;
  valuesEn?: string;
}

export function VisionMissionForm({
  sectionId,
  subSectionId,
}: {
  sectionId: string;
  subSectionId: string;
}) {
  const [form, setForm] = useState<VisionContent>({
    vision: '',
    visionEn: '',
    mission: '',
    missionEn: '',
    values: '',
    valuesEn: '',
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(
          `/api/admin/gr-sections/content?sectionId=${sectionId}&subSectionId=${subSectionId}`
        );
        if (res.ok) {
          const data = await res.json();
          setForm({
            vision: data.content?.vision || '',
            visionEn: data.content?.visionEn || '',
            mission: data.content?.mission || '',
            missionEn: data.content?.missionEn || '',
            values: data.content?.values || '',
            valuesEn: data.content?.valuesEn || '',
          });
        }
      } catch {
        toast.error('दृष्टीकोन माहिती लोड करताना त्रुटी');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sectionId, subSectionId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/gr-sections/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sectionId, subSectionId, content: form }),
      });
      if (!res.ok) throw new Error('save failed');
      toast.success('दृष्टीकोन, ध्येय आणि मूल्ये सेव्ह केली');
    } catch {
      toast.error('सेव्ह करताना त्रुटी');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <p>लोड होत आहे...</p>;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-violet-600" />
          दृष्टीकोन, ध्येय आणि मूल्ये
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>दृष्टीकोन (मराठी) *</Label>
          <Textarea
            value={form.vision || ''}
            onChange={(e) => setForm((p) => ({ ...p, vision: e.target.value }))}
            rows={3}
          />
        </div>
        <div>
          <Label>दृष्टीकोन (इंग्रजी)</Label>
          <Textarea
            value={form.visionEn || ''}
            onChange={(e) => setForm((p) => ({ ...p, visionEn: e.target.value }))}
            rows={2}
          />
        </div>
        <div>
          <Label>ध्येय (मराठी) *</Label>
          <Textarea
            value={form.mission || ''}
            onChange={(e) => setForm((p) => ({ ...p, mission: e.target.value }))}
            rows={3}
          />
        </div>
        <div>
          <Label>ध्येय (इंग्रजी)</Label>
          <Textarea
            value={form.missionEn || ''}
            onChange={(e) => setForm((p) => ({ ...p, missionEn: e.target.value }))}
            rows={2}
          />
        </div>
        <div>
          <Label>मूलभूत मूल्ये (मराठी)</Label>
          <Textarea
            value={form.values || ''}
            onChange={(e) => setForm((p) => ({ ...p, values: e.target.value }))}
            rows={3}
            placeholder="प्रत्येक मूल्य नवीन ओळीवर लिहा"
          />
        </div>
        <div>
          <Label>मूलभूत मूल्ये (इंग्रजी)</Label>
          <Textarea
            value={form.valuesEn || ''}
            onChange={(e) => setForm((p) => ({ ...p, valuesEn: e.target.value }))}
            rows={2}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'सेव्ह होत आहे...' : 'सेव्ह करा'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
