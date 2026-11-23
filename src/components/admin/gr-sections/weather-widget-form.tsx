'use client';

import { useEffect, useState } from 'react';
import { CloudSun, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface WeatherContent {
  googleLink?: string;
  locationLabel?: string;
  embedUrl?: string;
}

export function WeatherWidgetForm({
  sectionId,
  subSectionId,
}: {
  sectionId: string;
  subSectionId: string;
}) {
  const [form, setForm] = useState<WeatherContent>({
    googleLink: '',
    locationLabel: '',
    embedUrl: '',
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
            googleLink: data.content?.googleLink || '',
            locationLabel: data.content?.locationLabel || '',
            embedUrl: data.content?.embedUrl || '',
          });
        }
      } catch {
        toast.error('हवामान माहिती लोड करताना त्रुटी');
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
      toast.success('हवामान विजेट सेव्ह केले');
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
          <CloudSun className="h-5 w-5 text-sky-600" />
          लाइव्ह हवामान विजेट
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>गावाचे स्थान / लेबल</Label>
          <Input
            value={form.locationLabel || ''}
            onChange={(e) => setForm((p) => ({ ...p, locationLabel: e.target.value }))}
            placeholder="उदा. पुणे, महाराष्ट्र"
          />
        </div>
        <div>
          <Label>Google हवामान लिंक</Label>
          <Input
            value={form.googleLink || ''}
            onChange={(e) => setForm((p) => ({ ...p, googleLink: e.target.value }))}
            placeholder="https://www.google.com/search?q=weather+..."
          />
          <p className="text-xs text-gray-500 mt-1">नागरिक या लिंकवरून हवामान पाहू शकतील.</p>
        </div>
        <div>
          <Label>Embed URL (पर्यायी)</Label>
          <Input
            value={form.embedUrl || ''}
            onChange={(e) => setForm((p) => ({ ...p, embedUrl: e.target.value }))}
            placeholder="https://..."
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
