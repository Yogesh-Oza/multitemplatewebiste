'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Megaphone, Calendar } from 'lucide-react';

type Post = {
  id: string;
  title: string;
  titleEn: string;
  content: string;
  priority: string;
  category?: string | null;
  publishAt?: string | null;
  expireAt?: string | null;
  legacyDate?: string | null;
};

export function CommunicationsKindSection({
  kind,
  titleMr,
  titleEn,
}: {
  kind: 'notice' | 'announcement' | 'circular';
  titleMr: string;
  titleEn: string;
}) {
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/communications?kind=${kind}`);
        if (!r.ok) throw new Error('fetch failed');
        const data = await r.json();
        if (!cancelled) setItems(data);
      } catch {
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [kind]);

  if (loading) {
    return (
      <div className="py-12 text-center text-gray-600">
        लोड होत आहे… / Loading…
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-gray-600">
        सध्या कोणतीही नोंद उपलब्ध नाही. / No items to display.
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900">{titleMr}</h2>
          <p className="text-gray-600 mt-2">{titleEn}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {items.map((p) => (
            <Card key={p.id} className="border-blue-100 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between gap-2">
                <CardTitle className="text-lg font-semibold text-blue-900">{p.title}</CardTitle>
                <Badge
                  className={
                    p.priority === 'high'
                      ? 'bg-red-500'
                      : p.priority === 'low'
                        ? 'bg-green-600'
                        : 'bg-amber-500'
                  }
                >
                  {p.priority}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3 text-gray-700">
                <p className="text-sm line-clamp-6 whitespace-pre-wrap">{p.content}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  {p.category && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                      <Megaphone className="h-3 w-3" />
                      {p.category}
                    </span>
                  )}
                  {(p.legacyDate || p.publishAt) && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {p.legacyDate || (p.publishAt && p.publishAt.slice(0, 10))}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
