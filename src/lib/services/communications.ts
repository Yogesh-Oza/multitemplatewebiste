import { CommunicationKind, CommunicationPriority } from '@prisma/client';

export function publicCommsFilter(subdomainId: string, kind: CommunicationKind, now: Date) {
  return {
    subdomainId,
    kind,
    isActive: true,
    AND: [
      { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
      { OR: [{ expireAt: null }, { expireAt: { gt: now } }] },
    ],
  };
}

export function parseCommunicationPriority(v: string | null | undefined): CommunicationPriority {
  if (v === 'high' || v === 'low' || v === 'medium') return v;
  return 'medium';
}

export function parseCommunicationKind(v: string | null | undefined): CommunicationKind | null {
  if (v === 'announcement' || v === 'notice' || v === 'circular') return v;
  return null;
}
