'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshStatusBadge } from '@/components/admin/gr-sections/status-badge';
import type { RefreshStatus } from '@/lib/gr-sections';
import { toast } from 'sonner';

interface SubRow {
  id: string;
  titleMr: string;
  titleEn: string;
  helpMr: string;
  infoOnly: boolean;
  refreshDays: number;
  lastUpdatedAt: string | null;
  lastUpdatedBy: string | null;
  status: RefreshStatus;
  daysSince: number | null;
  daysLeft: number | null;
}

interface SectionPayload {
  id: string;
  number: number;
  titleMr: string;
  titleEn: string;
  comingSoon: boolean;
  subsections: SubRow[];
}

export default function GrSectionDetailPage() {
  const params = useParams();
  const sectionId = String(params.sectionId || '');
  const [section, setSection] = useState<SectionPayload | null>(null);
  const [refreshDrafts, setRefreshDrafts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/gr-sections/tracker?sectionId=${sectionId}`);
      if (!res.ok) throw new Error('load failed');
      const data = await res.json();
      const found = (data.sections || [])[0] || null;
      setSection(found);
      if (found) {
        const drafts: Record<string, number> = {};
        for (const sub of found.subsections) drafts[sub.id] = sub.refreshDays;
        setRefreshDrafts(drafts);
      }
    } catch {
      toast.error('विभाग लोड करताना त्रुटी');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (sectionId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId]);

  const saveRefreshDays = async (subId: string) => {
    const days = refreshDrafts[subId];
    if (!days || days < 1) {
      toast.error('किमान १ दिवस आवश्यक');
      return;
    }
    try {
      const res = await fetch('/api/admin/gr-sections/tracker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          subSectionId: subId,
          refreshDays: days,
        }),
      });
      if (!res.ok) throw new Error('save failed');
      toast.success('कालावधी सेव्ह केला');
      await load();
    } catch {
      toast.error('कालावधी सेव्ह करताना त्रुटी');
    }
  };

  if (isLoading) return <p>लोड होत आहे...</p>;
  if (!section) return <p>विभाग सापडला नाही</p>;
  if (section.comingSoon) {
    return (
      <div className="space-y-4">
        <Link href="/admin/gr-sections" className="inline-flex items-center text-sm text-blue-700">
          <ArrowLeft className="h-4 w-4 mr-1" />
          मागे
        </Link>
        <p>हा विभाग लवकरच उपलब्ध होईल.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/gr-sections" className="inline-flex items-center text-sm text-blue-700 mb-3">
          <ArrowLeft className="h-4 w-4 mr-1" />
          सर्व विभाग
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {section.number}. {section.titleMr}
        </h1>
        <p className="text-sm text-gray-500">{section.titleEn}</p>
        <p className="text-sm text-gray-600 mt-2">उप-विभाग निवडा आणि फॉर्म भरा.</p>
      </div>

      <div className="space-y-3">
        {section.subsections.map((sub, index) => (
          <Card key={sub.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center text-sm font-semibold shrink-0">
                      {index + 1}
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">{sub.titleMr}</h2>
                      <p className="text-xs text-gray-500">{sub.titleEn}</p>
                      <p className="text-sm text-gray-600 mt-1">{sub.helpMr}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <RefreshStatusBadge status={sub.status} daysLeft={sub.daysLeft} />
                        {sub.lastUpdatedAt && (
                          <span className="text-xs text-gray-500">
                            शेवटचे अद्यतन:{' '}
                            {new Date(sub.lastUpdatedAt).toLocaleDateString('mr-IN')}
                            {sub.lastUpdatedBy ? ` · ${sub.lastUpdatedBy}` : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
                  {!sub.infoOnly && (
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-[11px] text-gray-500 mb-1">अद्ययावत कालावधी (दिवस)</p>
                        <Input
                          type="number"
                          min={1}
                          className="w-24 h-9"
                          value={refreshDrafts[sub.id] ?? sub.refreshDays}
                          onChange={(e) =>
                            setRefreshDrafts((p) => ({
                              ...p,
                              [sub.id]: Number(e.target.value) || 30,
                            }))
                          }
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-5"
                        onClick={() => saveRefreshDays(sub.id)}
                      >
                        <Save className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  )}
                  <Link href={`/admin/gr-sections/${sectionId}/${sub.id}`}>
                    <Button className="w-full sm:w-auto">
                      {sub.infoOnly ? 'पहा' : 'फॉर्म उघडा'}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
