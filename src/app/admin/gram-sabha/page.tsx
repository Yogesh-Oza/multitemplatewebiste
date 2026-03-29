'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export default function AdminGramSabhaPage() {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [agenda, setAgenda] = useState('');
  const [agendaEn, setAgendaEn] = useState('');
  const [attendance, setAttendance] = useState('0');
  const [quorum, setQuorum] = useState(true);

  const submit = async () => {
    const r = await fetch('/api/gram-sabha/meetings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        agenda,
        agendaEn,
        attendanceCount: Number(attendance) || 0,
        quorumMet: quorum,
        resolutions: [],
        documents: [],
      }),
    });
    if (r.ok) {
      toast.success('नोंद जोडली');
      setAgenda('');
      setAgendaEn('');
    } else toast.error('अयशस्वी');
  };

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-3xl font-bold">ग्राम सभा नोंद</h1>
      <div>
        <Label>तारीख</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>
      <div>
        <Label>कार्यसूची (मराठी)</Label>
        <Textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={4} />
      </div>
      <div>
        <Label>Agenda (En)</Label>
        <Textarea value={agendaEn} onChange={(e) => setAgendaEn(e.target.value)} rows={3} />
      </div>
      <div>
        <Label>उपस्थिती</Label>
        <Input value={attendance} onChange={(e) => setAttendance(e.target.value)} />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" checked={quorum} onChange={(e) => setQuorum(e.target.checked)} id="q" />
        <Label htmlFor="q">कोरम पूर्ण</Label>
      </div>
      <Button onClick={submit}>जतन</Button>
    </div>
  );
}
