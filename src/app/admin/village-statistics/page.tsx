'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminVillageStatisticsPage() {
  const y = new Date().getFullYear();
  const [year, setYear] = useState(String(y));
  const [population, setPopulation] = useState('');
  const [voters, setVoters] = useState('');
  const [wards, setWards] = useState('');

  const save = async () => {
    const r = await fetch('/api/village-statistics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year: Number(year),
        population: Number(population) || 0,
        voters: Number(voters) || 0,
        wards: Number(wards) || 0,
      }),
    });
    if (r.ok) toast.success('जतन केले');
    else toast.error('अयशस्वी');
  };

  return (
    <div className="space-y-6 max-w-md">
      <h1 className="text-3xl font-bold">ग्राम सांख्यिकी</h1>
      <div>
        <Label>वर्ष</Label>
        <Input value={year} onChange={(e) => setYear(e.target.value)} />
      </div>
      <div>
        <Label>लोकसंख्या</Label>
        <Input value={population} onChange={(e) => setPopulation(e.target.value)} />
      </div>
      <div>
        <Label>मतदार</Label>
        <Input value={voters} onChange={(e) => setVoters(e.target.value)} />
      </div>
      <div>
        <Label>वॉर्ड</Label>
        <Input value={wards} onChange={(e) => setWards(e.target.value)} />
      </div>
      <Button onClick={save}>Upsert</Button>
    </div>
  );
}
