"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

export default function BrandingPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    satyamevJayateLogoUrl: '',
    digitalIndiaLogoUrl: '',
    govDeptText: '',
    officialSiteText: '',
  });
  const [uploading, setUploading] = useState({
    satyamev: false,
    digitalIndia: false,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/village-info', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setForm({
            satyamevJayateLogoUrl: data.satyamevJayateLogoUrl || '/images/gov-logos/satyamev_jayate_logo.png',
            digitalIndiaLogoUrl: data.digitalIndiaLogoUrl || '/images/gov-logos/digital-india.png',
            govDeptText: data.govDeptText || 'शासन महाराष्ट्र • ग्रामीण विकास विभाग',
            officialSiteText: data.officialSiteText || 'अधिकृत ग्रामपंचायत संकेतस्थळ',
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleFileUpload = async (file: File, type: 'satyamev' | 'digitalIndia') => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('कृपया फक्त प्रतिमा फाइल निवडा');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('फाइल आकार 5MB पेक्षा कमी असावा');
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        const fieldName = type === 'satyamev' ? 'satyamevJayateLogoUrl' : 'digitalIndiaLogoUrl';
        setForm(prev => ({ ...prev, [fieldName]: result.imageUrl }));
        toast.success(`${type === 'satyamev' ? 'Satyamev Jayate' : 'Digital India'} लोगो अपलोड झाले`);
      } else {
        const error = await response.json();
        throw new Error(error.error || 'अपलोड अयशस्वी');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'अपलोड अयशस्वी');
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/village-info', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('ब्रँडिंग अपडेट झाले');
      } else {
        toast.error('सेव्ह करण्यात अडचण आली');
      }
    } catch (e) {
      toast.error('सेव्ह करण्यात अडचण आली');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="space-y-6">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">सरकारी ब्रँडिंग</h1>
        <p className="text-gray-600 mt-2">हेडरमधील Satyamev Jayate, Digital India आणि मजकूर बदला</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>सरकारी लोगो आणि मजकूर</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Satyamev Jayate Logo */}
          <div className="space-y-3">
            <Label>Satyamev Jayate लोगो</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input 
                  value={form.satyamevJayateLogoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, satyamevJayateLogoUrl: e.target.value }))}
                  placeholder="/images/gov-logos/satyamev_jayate_logo.png" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {uploading.satyamev ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'satyamev');
                    }}
                    disabled={uploading.satyamev}
                  />
                </label>
                {form.satyamevJayateLogoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, satyamevJayateLogoUrl: '/images/gov-logos/satyamev_jayate_logo.png' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {form.satyamevJayateLogoUrl && (
              <div className="mt-2">
                <div className="inline-block p-2 border rounded-lg bg-gray-50">
                  <Image
                    src={form.satyamevJayateLogoUrl}
                    alt="Satyamev Jayate Preview"
                    width={32}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Digital India Logo */}
          <div className="space-y-3">
            <Label>Digital India लोगो</Label>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Input 
                  value={form.digitalIndiaLogoUrl}
                  onChange={(e) => setForm((p) => ({ ...p, digitalIndiaLogoUrl: e.target.value }))}
                  placeholder="/images/gov-logos/digital-india.png" 
                />
              </div>
              <div className="flex items-center space-x-2">
                <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                  <Upload className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">
                    {uploading.digitalIndia ? 'अपलोड करत आहे...' : 'फाइल निवडा'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFileUpload(file, 'digitalIndia');
                    }}
                    disabled={uploading.digitalIndia}
                  />
                </label>
                {form.digitalIndiaLogoUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setForm(prev => ({ ...prev, digitalIndiaLogoUrl: '/images/gov-logos/digital-india.png' }))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
            {form.digitalIndiaLogoUrl && (
              <div className="mt-2">
                <div className="inline-block p-2 border rounded-lg bg-gray-50">
                  <Image
                    src={form.digitalIndiaLogoUrl}
                    alt="Digital India Preview"
                    width={80}
                    height={32}
                    className="object-contain"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Text Content */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="govDeptText">विभाग मजकूर</Label>
              <Input 
                id="govDeptText" 
                value={form.govDeptText}
                onChange={(e) => setForm((p) => ({ ...p, govDeptText: e.target.value }))}
                placeholder="शासन महाराष्ट्र • ग्रामीण विकास विभाग" 
              />
              <p className="text-xs text-gray-500 mt-1">हे मजकूर हेडरमधील डाव्या बाजूला दिसेल</p>
            </div>

            <div>
              <Label htmlFor="officialSiteText">अधिकृत संकेतस्थळ मजकूर</Label>
              <Input 
                id="officialSiteText" 
                value={form.officialSiteText}
                onChange={(e) => setForm((p) => ({ ...p, officialSiteText: e.target.value }))}
                placeholder="अधिकृत ग्रामपंचायत संकेतस्थळ" 
              />
              <p className="text-xs text-gray-500 mt-1">हे मजकूर हेडरमधील उजव्या बाजूला दिसेल</p>
            </div>
          </div>

          {/* File Upload Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <ImageIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-blue-900">फाइल अपलोड माहिती</h4>
                <p className="text-xs text-blue-700 mt-1">
                  • JPG, PNG, WebP स्वरूपातील प्रतिमा स्वीकारल्या जातात<br/>
                  • कमाल फाइल आकार: 5MB<br/>
                  • लोगो साठी शिफारस केलेले आकार: Satyamev Jayate (32x32px), Digital India (80x32px)
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button onClick={onSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? 'सेव्ह करत आहे...' : 'सेव्ह करा'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


