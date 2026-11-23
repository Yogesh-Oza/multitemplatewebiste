'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!sectionId) return;
    const load = async () => {
      try {
        const res = await fetch(`/api/admin/gr-sections/tracker?sectionId=${sectionId}`);
        if (!res.ok) throw new Error('load failed');
        const data = await res.json();
        setSection((data.sections || [])[0] || null);
      } catch {
        toast.error('विभाग लोड करताना त्रुटी');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [sectionId]);

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
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
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

                <Link href={`/admin/gr-sections/${sectionId}/${sub.id}`}>
                  <Button className="w-full sm:w-auto">
                    {sub.infoOnly ? 'पहा' : 'फॉर्म उघडा'}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
