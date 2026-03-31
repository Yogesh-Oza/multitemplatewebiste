'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Row = {
  id: string;
  clauseKey: string;
  titleMr: string;
  complianceStatus: string;
  isMandatory: boolean;
};

type FormRow = {
  id: string;
  kind: string;
  labelMr: string;
  labelEn: string;
  url: string;
  order: number;
  isActive: boolean;
};

const emptyForm: Omit<FormRow, 'id'> = {
  kind: 'certificate_application',
  labelMr: '',
  labelEn: '',
  url: '',
  order: 0,
  isActive: true,
};

const KIND_OPTIONS = [
  { value: 'certificate_application', label: 'दाखला / Certificate application' },
  { value: 'first_appeal_sample', label: 'प्रथम अपील नमुना' },
  { value: 'second_appeal_sample', label: 'द्वितीय अपील नमुना' },
  { value: 'commission_appeal_sample', label: 'आयोग अपील नमुना' },
  { value: 'application', label: 'माहिती अर्ज (सामान्य)' },
  { value: 'first_appeal', label: 'प्रथम अपील (सामान्य)' },
  { value: 'second_appeal', label: 'द्वितीय अपील (सामान्य)' },
  { value: 'other', label: 'इतर' },
];

export default function AdminRtiPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [forms, setForms] = useState<FormRow[]>([]);
  const [formDraft, setFormDraft] = useState(emptyForm);
  const [editingFormId, setEditingFormId] = useState<string | null>(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const load = useCallback(async () => {
    const r = await fetch('/api/rti/disclosures');
    if (r.ok) setRows(await r.json());
  }, []);

  const loadForms = useCallback(async () => {
    const r = await fetch('/api/rti/forms?all=1');
    if (r.ok) setForms(await r.json());
  }, []);

  useEffect(() => {
    load();
    loadForms();
  }, [load, loadForms]);

  const seed = async () => {
    const r = await fetch('/api/rti/seed-defaults', { method: 'POST' });
    if (r.ok) {
      toast.success('डिफॉल्ट क्लॉज जोडले');
      load();
    } else toast.error('अयशस्वी');
  };

  const toggle = async (id: string, completed: boolean) => {
    const r = await fetch(`/api/rti/disclosures/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        complianceStatus: completed ? 'completed' : 'pending',
        lastVerifiedAt: new Date().toISOString(),
      }),
    });
    if (r.ok) {
      toast.success('अपडेट');
      load();
    } else toast.error('अयशस्वी');
  };

  const resetFormDraft = () => {
    setFormDraft(emptyForm);
    setEditingFormId(null);
  };

  const startEdit = (f: FormRow) => {
    setEditingFormId(f.id);
    setFormDraft({
      kind: f.kind,
      labelMr: f.labelMr,
      labelEn: f.labelEn,
      url: f.url,
      order: f.order,
      isActive: f.isActive,
    });
  };

  const saveForm = async () => {
    if (!formDraft.labelMr.trim() || !formDraft.url.trim()) {
      toast.error('शीर्षक आणि PDF URL आवश्यक आहेत');
      return;
    }
    try {
      if (editingFormId) {
        const r = await fetch(`/api/rti/forms/${editingFormId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDraft),
        });
        if (!r.ok) throw new Error();
        toast.success('अर्ज नमुना अपडेट केला');
      } else {
        const r = await fetch('/api/rti/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formDraft),
        });
        if (!r.ok) throw new Error();
        toast.success('अर्ज नमुना जोडला');
      }
      resetFormDraft();
      loadForms();
    } catch {
      toast.error('जतन अयशस्वी');
    }
  };

  const deleteForm = async (id: string) => {
    if (!confirm('हा नमुना हटवायचा?')) return;
    const r = await fetch(`/api/rti/forms/${id}`, { method: 'DELETE' });
    if (r.ok) {
      toast.success('हटवले');
      if (editingFormId === id) resetFormDraft();
      loadForms();
    } else toast.error('अयशस्वी');
  };

  const onPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPdf(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const r = await fetch('/api/upload/pdf', { method: 'POST', body: fd });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Upload failed');
      setFormDraft((prev) => ({ ...prev, url: data.url }));
      toast.success('PDF अपलोड केले — URL फील्डमध्ये भरले');
    } catch (err) {
      console.error(err);
      toast.error('PDF अपलोड अयशस्वी (URL हाताने टाका किंवा storage configuration तपासा)');
    } finally {
      setUploadingPdf(false);
      (e.target as HTMLInputElement).value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">RTI अनिवार्य प्रकटीकरण</h1>
          <p className="text-gray-600 mt-1">Compliance status per clause</p>
        </div>
        <Button onClick={seed}>डिफॉल्ट क्लॉज सीड करा</Button>
      </div>
      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardHeader className="flex flex-row items-center justify-between py-3">
              <CardTitle className="text-base font-medium">{row.titleMr}</CardTitle>
              <span className="text-xs text-gray-500">{row.clauseKey}</span>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant={row.complianceStatus === 'completed' ? 'default' : 'outline'}
                onClick={() => toggle(row.id, true)}
              >
                पूर्ण
              </Button>
              <Button
                size="sm"
                variant={row.complianceStatus === 'pending' ? 'secondary' : 'outline'}
                onClick={() => toggle(row.id, false)}
              >
                प्रलंबित
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>अर्ज नमुने (RTI PDF)</CardTitle>
          <CardDescription>
            सार्वजनिक RTI पृष्ठावर तक्त्यात दिसेल. फक्त PDF लिंक (उदा. /pdfs/Arj2.pdf किंवा अपलोड केलेला URL).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>प्रकार / Kind</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={formDraft.kind}
                onChange={(e) => setFormDraft({ ...formDraft, kind: e.target.value })}
              >
                {KIND_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label>क्रम (order)</Label>
              <Input
                type="number"
                value={formDraft.order}
                onChange={(e) => setFormDraft({ ...formDraft, order: Number(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>शीर्षक (मराठी) — तक्त्यात दिसेल</Label>
            <Input
              value={formDraft.labelMr}
              onChange={(e) => setFormDraft({ ...formDraft, labelMr: e.target.value })}
              placeholder="दाखला मिळणेकरिता अर्ज"
            />
          </div>
          <div className="space-y-2">
            <Label>शीर्षक (इंग्रजी) — उपशीर्षक</Label>
            <Input
              value={formDraft.labelEn}
              onChange={(e) => setFormDraft({ ...formDraft, labelEn: e.target.value })}
              placeholder="Application for certificate"
            />
          </div>
          <div className="space-y-2">
            <Label>PDF URL</Label>
            <Input
              value={formDraft.url}
              onChange={(e) => setFormDraft({ ...formDraft, url: e.target.value })}
              placeholder="/pdfs/Arj2.pdf किंवा https://..."
            />
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="text-sm"
                disabled={uploadingPdf}
                onChange={onPdfUpload}
              />
              {uploadingPdf ? <span className="text-xs text-gray-500">अपलोड होत आहे...</span> : null}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={saveForm}>{editingFormId ? 'अपडेट जतन करा' : 'नमुना जोडा'}</Button>
            {editingFormId ? (
              <Button type="button" variant="outline" onClick={resetFormDraft}>
                रद्द
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">सध्या जोडलेले नमुने</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {forms.length === 0 ? (
            <p className="text-sm text-gray-500">कोणतेही नमुने नाहीत. वर फॉर्म भरून जोडा किंवा db:seed चालवा.</p>
          ) : (
            forms.map((f) => (
              <div
                key={f.id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm">{f.labelMr}</p>
                  <p className="text-xs text-gray-500 truncate">{f.url}</p>
                  <p className="text-xs text-gray-400">order {f.order} · {f.kind}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button size="sm" variant="outline" onClick={() => startEdit(f)}>
                    संपादन
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteForm(f.id)}>
                    हटवा
                  </Button>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
