'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

type Row = {
  id: string;
  clauseKey: string;
  titleMr: string;
  complianceStatus: string;
  isMandatory: boolean;
};

export default function AdminRtiPage() {
  const [rows, setRows] = useState<Row[]>([]);

  const load = useCallback(async () => {
    const r = await fetch('/api/rti/disclosures');
    if (r.ok) setRows(await r.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
              <Button size="sm" variant={row.complianceStatus === 'completed' ? 'default' : 'outline'} onClick={() => toggle(row.id, true)}>
                पूर्ण
              </Button>
              <Button size="sm" variant={row.complianceStatus === 'pending' ? 'secondary' : 'outline'} onClick={() => toggle(row.id, false)}>
                प्रलंबित
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
