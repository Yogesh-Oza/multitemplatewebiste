'use client';

import type { PublicQuickLinkResolved } from '@/lib/public-quick-links';

type Props = {
  links: PublicQuickLinkResolved[];
};

export function PublicQuickLinksTicker({ links }: Props) {
  if (!links.length) return null;

  const segments = links.map((link) => (
    <a
      key={link.id}
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center rounded-full border border-white/25 bg-white/10 px-4 py-1 text-sm font-medium text-white transition hover:bg-white/20"
    >
      {link.label}
    </a>
  ));

  return (
    <div className="w-full border-b border-white/10 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
      <div className="relative overflow-hidden py-2">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-slate-900 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-slate-900 to-transparent" />
        <div className="animate-public-quick-links-marquee flex w-max flex-nowrap whitespace-nowrap">
          <div className="flex shrink-0 items-center gap-8 pr-8">{segments}</div>
          <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden>
            {segments}
          </div>
        </div>
      </div>
    </div>
  );
}
