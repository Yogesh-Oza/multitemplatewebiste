'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshStatusBadge } from '@/components/admin/gr-sections/status-badge';
import { GrSubsectionEditor } from '@/components/admin/gr-sections/editor-map';
import { getSubsection, type GrEditorKey, type RefreshStatus } from '@/lib/gr-sections';
import { toast } from 'sonner';

interface ActivityRow {
  id: string;
  action: string;
  model: string;
  description: string;
  userName: string;
  createdAt: string;
}

export default function GrSubsectionFormPage() {
  const params = useParams();
  const sectionId = String(params.sectionId || '');
  const subId = String(params.subId || '');
  const match = getSubsection(sectionId, subId);

  const [status, setStatus] = useState<RefreshStatus>('never');
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const [lastUpdatedBy, setLastUpdatedBy] = useState<string | null>(null);
  const [activities, setActivities] = useState<ActivityRow[]>([]);
  const [isReviewing, setIsReviewing] = useState(false);

  const loadMeta = async () => {
    try {
      const [trackerRes, activityRes] = await Promise.all([
        fetch(`/api/admin/gr-sections/tracker?sectionId=${sectionId}`),
        fetch(
          `/api/admin/gr-sections/activity?sectionId=${sectionId}&subSectionId=${subId}&limit=10`
        ),
      ]);

      if (trackerRes.ok) {
        const data = await trackerRes.json();
        const section = (data.sections || [])[0];
        const sub = section?.subsections?.find((s: { id: string }) => s.id === subId);
        if (sub) {
          setStatus(sub.status);
          setDaysLeft(sub.daysLeft);
          setLastUpdatedAt(sub.lastUpdatedAt);
          setLastUpdatedBy(sub.lastUpdatedBy);
        }
      }

      if (activityRes.ok) {
        const data = await activityRes.json();
        setActivities(data.activities || []);
      }
    } catch {
      // silent — form still usable
    }
  };

  useEffect(() => {
    if (sectionId && subId) loadMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionId, subId]);

  const markReviewed = async () => {
    setIsReviewing(true);
    try {
      const res = await fetch('/api/admin/gr-sections/tracker', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId,
          subSectionId: subId,
          markReviewed: true,
        }),
      });
      if (!res.ok) throw new Error('review failed');
      toast.success('माहिती तपासली म्हणून नोंदवली');
      await loadMeta();
    } catch {
      toast.error('तपासणी नोंदवताना त्रुटी');
    } finally {
      setIsReviewing(false);
    }
  };

  if (!match) {
    return (
      <div className="space-y-4">
        <Link href="/admin/gr-sections" className="inline-flex items-center text-sm text-blue-700">
          मागे
        </Link>
        <p>उप-विभाग सापडला नाही</p>
      </div>
    );
  }

  const { section, subsection } = match;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500 mb-3">
            <Link href="/admin/gr-sections" className="text-blue-700 hover:underline">
              विभाग
            </Link>
            <span>/</span>
            <Link href={`/admin/gr-sections/${sectionId}`} className="text-blue-700 hover:underline">
              {section.titleMr}
            </Link>
            <span>/</span>
            <span className="text-gray-800">{subsection.titleMr}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{subsection.titleMr}</h1>
          <p className="text-sm text-gray-500">{subsection.titleEn}</p>
          <p className="text-sm text-gray-600 mt-2">{subsection.helpMr}</p>
        </div>

        {!subsection.infoOnly && (
          <Button
            variant="outline"
            className="shrink-0 self-start"
            onClick={markReviewed}
            disabled={isReviewing}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            {isReviewing ? 'नोंदवत आहे...' : 'माहिती तपासली, बदल नाही'}
          </Button>
        )}
      </div>

      <Card className="border-blue-100 bg-blue-50/40">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-3">
            <RefreshStatusBadge status={status} daysLeft={daysLeft} />
            {lastUpdatedAt ? (
              <span className="text-sm text-gray-700">
                शेवटचे अद्यतन:{' '}
                {new Date(lastUpdatedAt).toLocaleString('mr-IN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                  second: '2-digit',
                  hour12: true,
                })}
                {lastUpdatedBy ? ` · ${lastUpdatedBy}` : ''}
              </span>
            ) : (
              <span className="text-sm text-gray-500">शेवटचे अद्यतन: अद्याप नाही</span>
            )}
          </div>
        </CardContent>
      </Card>

      <div>
        <GrSubsectionEditor
          editor={subsection.editor as GrEditorKey}
          sectionId={sectionId}
          subSectionId={subId}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">अलीकडील बदल</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-sm text-gray-500">अद्याप कोणतेही बदल नोंदलेले नाहीत.</p>
          ) : (
            <ul className="space-y-3">
              {activities.map((item) => (
                <li key={item.id} className="border-b border-gray-100 pb-3 last:border-0">
                  <p className="text-sm text-gray-900">{item.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.userName} · {item.action} · {item.model} ·{' '}
                    {new Date(item.createdAt).toLocaleString('mr-IN')}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
