'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminCommunicationsPage() {
  const [kind, setKind] = useState<'announcement' | 'notice' | 'circular' | ''>('');
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const q = kind ? `?kind=${kind}` : '';
      const r = await fetch(`/api/admin/communications${q}`);
      if (!r.ok) throw new Error('fail');
      setItems(await r.json());
    } catch {
      toast.error('लोड अयशस्वी');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [kind]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">संप्रेषण (सर्व प्रकार)</h1>
        <p className="text-gray-600 mt-1">Communication posts — announcements, notices, circulars</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>प्रकार निवडा</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button variant={kind === '' ? 'default' : 'outline'} size="sm" onClick={() => setKind('')}>
            सर्व
          </Button>
          <Button
            variant={kind === 'announcement' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setKind('announcement')}
          >
            घोषणा
          </Button>
          <Button variant={kind === 'notice' ? 'default' : 'outline'} size="sm" onClick={() => setKind('notice')}>
            नोटिस
          </Button>
          <Button
            variant={kind === 'circular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setKind('circular')}
          >
            परिपत्रक
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <p>लोड होत आहे…</p>
      ) : (
        <div className="space-y-3">
          {(items as { id: string; title: string; kind: string; priority: string }[]).map((it) => (
            <Card key={it.id}>
              <CardContent className="py-4 flex flex-wrap justify-between gap-2">
                <div>
                  <p className="font-medium">{it.title}</p>
                  <p className="text-xs text-gray-500">
                    {it.kind} · {it.priority}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    const publishAt = window.prompt('publishAt ISO (blank to skip)');
                    const expireAt = window.prompt('expireAt ISO (blank to skip)');
                    const body: Record<string, string | null> = {};
                    if (publishAt) body.publishAt = publishAt;
                    if (expireAt) body.expireAt = expireAt;
                    const r = await fetch(`/api/communications/${it.id}`, {
                      method: 'PATCH',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(body),
                    });
                    if (r.ok) {
                      toast.success('अपडेट केले');
                      load();
                    } else toast.error('अयशस्वी');
                  }}
                >
                  तारीख समायोजन
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Card>
        <CardHeader>
          <CardTitle>नवीन नोटिस (झटपट)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-w-lg">
          <QuickNoticeForm onCreated={load} />
        </CardContent>
      </Card>
    </div>
  );
}

function QuickNoticeForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  return (
    <div className="space-y-3">
      <div>
        <Label>शीर्षक</Label>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>
      <div>
        <Label>मजकूर</Label>
        <Input value={content} onChange={(e) => setContent(e.target.value)} />
      </div>
      <Button
        onClick={async () => {
          const r = await fetch('/api/communications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              kind: 'notice',
              title,
              titleEn: title,
              content,
              priority: 'medium',
            }),
          });
          if (r.ok) {
            toast.success('नोटिस जोडला');
            setTitle('');
            setContent('');
            onCreated();
          } else toast.error('अयशस्वी');
        }}
      >
        जतन करा
      </Button>
    </div>
  );
}
