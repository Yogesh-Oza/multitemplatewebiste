'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type Row = { id: string; titleMr: string; category: string; fees: number };

export default function AdminCitizenServicesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [titleMr, setTitleMr] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [descMr, setDescMr] = useState('');

  const load = async () => {
    const r = await fetch('/api/citizen-services');
    if (r.ok) setRows(await r.json());
  };

  useEffect(() => {
    load();
  }, []);

  const add = async () => {
    const r = await fetch('/api/citizen-services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titleMr,
        titleEn: titleEn || titleMr,
        descriptionMr: descMr,
        descriptionEn: descMr,
        category: 'other',
      }),
    });
    if (r.ok) {
      toast.success('जोडले');
      setTitleMr('');
      setTitleEn('');
      setDescMr('');
      load();
    } else toast.error('अयशस्वी');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">नागरिक सेवा</h1>
      <Card>
        <CardContent className="pt-6 space-y-3 max-w-lg">
          <div>
            <Label>शीर्षक (मराठी)</Label>
            <Input value={titleMr} onChange={(e) => setTitleMr(e.target.value)} />
          </div>
          <div>
            <Label>शीर्षक (En)</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} />
          </div>
          <div>
            <Label>वर्णन</Label>
            <Input value={descMr} onChange={(e) => setDescMr(e.target.value)} />
          </div>
          <Button onClick={add}>जोडा</Button>
        </CardContent>
      </Card>
      <div className="space-y-2">
        {rows.map((r) => (
          <Card key={r.id}>
            <CardContent className="py-3 flex justify-between items-center">
              <span>
                {r.titleMr} <span className="text-gray-500 text-sm">({r.category})</span>
              </span>
              <Button
                size="sm"
                variant="destructive"
                onClick={async () => {
                  const x = await fetch(`/api/citizen-services/${r.id}`, { method: 'DELETE' });
                  if (x.ok) {
                    toast.success('काढले');
                    load();
                  }
                }}
              >
                काढा
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
