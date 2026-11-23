'use client';

import { Badge } from '@/components/ui/badge';
import type { RefreshStatus } from '@/lib/gr-sections';
import { statusLabelMr } from '@/lib/gr-sections';
import { cn } from '@/lib/utils';

export function RefreshStatusBadge({
  status,
  daysLeft,
}: {
  status: RefreshStatus;
  daysLeft: number | null;
}) {
  const className = cn(
    'text-xs font-medium',
    status === 'ok' && 'bg-emerald-100 text-emerald-800 hover:bg-emerald-100',
    status === 'warning' && 'bg-amber-100 text-amber-800 hover:bg-amber-100',
    status === 'overdue' && 'bg-red-100 text-red-800 hover:bg-red-100',
    status === 'never' && 'bg-gray-100 text-gray-700 hover:bg-gray-100'
  );

  let label = statusLabelMr(status);
  if ((status === 'ok' || status === 'warning') && daysLeft !== null) {
    label = `${daysLeft} दिवस शिल्लक`;
  }

  return <Badge className={className}>{label}</Badge>;
}

export function sectionCardTone(status: RefreshStatus | string, comingSoon?: boolean) {
  if (comingSoon) return 'border-gray-200 bg-gray-50 opacity-80';
  if (status === 'overdue' || status === 'never') return 'border-red-200 bg-red-50/40';
  if (status === 'warning') return 'border-amber-200 bg-amber-50/40';
  return 'border-emerald-200 bg-emerald-50/30';
}
