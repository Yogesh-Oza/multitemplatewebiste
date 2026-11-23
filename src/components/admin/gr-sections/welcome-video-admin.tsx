'use client';

import { useEffect, useState } from 'react';
import { FileVideo, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { FileUpload } from '@/components/ui/file-upload';

interface WelcomeVideo {
  url: string;
  title: string;
  description: string;
  type: 'youtube' | 'upload';
  uploadedFile: string;
  isActive: boolean;
}

const DEFAULT_VIDEO: WelcomeVideo = {
  url: '',
  title: 'गावाचे स्वागत व्हिडिओ',
  description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
  type: 'youtube',
  uploadedFile: '',
  isActive: true,
};

export function WelcomeVideoAdmin() {
  const [villageInfo, setVillageInfo] = useState<Record<string, unknown> | null>(null);
  const [video, setVideo] = useState<WelcomeVideo>(DEFAULT_VIDEO);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/village-info');
        if (res.ok) {
          const data = await res.json();
          setVillageInfo(data);
          const wv = data.welcomeVideo || {};
          setVideo({
            url: wv.url || '',
            title: wv.title || DEFAULT_VIDEO.title,
            description: wv.description || DEFAULT_VIDEO.description,
            type: wv.type === 'upload' ? 'upload' : 'youtube',
            uploadedFile: wv.uploadedFile || '',
            isActive: wv.isActive !== false,
          });
        }
      } catch {
        toast.error('वेलकम व्हिडिओ लोड करताना त्रुटी');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    if (!villageInfo) {
      toast.error('गाव माहिती सापडली नाही');
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/village-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...villageInfo,
          welcomeVideo: video,
        }),
      });
      if (!res.ok) throw new Error('save failed');
      toast.success('वेलकम व्हिडिओ सेव्ह केला');
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
          <FileVideo className="h-5 w-5 text-rose-600" />
          वेलकम व्हिडिओ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={video.type === 'youtube'}
              onChange={() => setVideo((p) => ({ ...p, type: 'youtube', uploadedFile: '' }))}
            />
            YouTube
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              checked={video.type === 'upload'}
              onChange={() => setVideo((p) => ({ ...p, type: 'upload', url: '' }))}
            />
            अपलोड
          </label>
        </div>

        {video.type === 'youtube' ? (
          <div>
            <Label>YouTube URL</Label>
            <Input
              value={video.url}
              onChange={(e) => setVideo((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
        ) : (
          <div>
            <Label>व्हिडिओ फाइल</Label>
            <FileUpload
              accept="video/*"
              onUpload={(url) =>
                setVideo((p) => ({ ...p, uploadedFile: url, type: 'upload' }))
              }
            />
            {video.uploadedFile && (
              <p className="text-xs text-green-700 mt-2">अपलोड झाले: {video.uploadedFile.split('/').pop()}</p>
            )}
          </div>
        )}

        <div>
          <Label>शीर्षक</Label>
          <Input
            value={video.title}
            onChange={(e) => setVideo((p) => ({ ...p, title: e.target.value }))}
          />
        </div>
        <div>
          <Label>वर्णन</Label>
          <Textarea
            value={video.description}
            onChange={(e) => setVideo((p) => ({ ...p, description: e.target.value }))}
          />
        </div>
        <div className="flex items-center gap-2">
          <input
            id="videoActive"
            type="checkbox"
            checked={video.isActive}
            onChange={(e) => setVideo((p) => ({ ...p, isActive: e.target.checked }))}
          />
          <Label htmlFor="videoActive">सक्रिय</Label>
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
