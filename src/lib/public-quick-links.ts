export type PublicQuickLinkId = 'rti' | 'rts' | 'library';

export type PublicQuickLinkResolved = {
  id: PublicQuickLinkId;
  url: string;
  label: string;
  enabled: boolean;
};

export const QUICK_LINK_URLS: Record<PublicQuickLinkId, string> = {
  rti: 'https://rtionline.maharashtra.gov.in/',
  rts: 'https://aaplesarkar.mahaonline.gov.in/en/Login/Login',
  library: 'https://www.esahity.com/',
};

const DEFAULT_LABEL_BY_ID: Record<PublicQuickLinkId, string> = {
  rti: 'Online माहिती अधिकार अर्ज करणेसाठी',
  rts: 'Online महाराष्ट्र राज्य लोकसेवा हक्क अंतर्गत अर्ज करणेसाठी',
  library: 'वाचनालय संगणकीकृत',
};

export type PublicQuickLinksStored = {
  /** When false, hide the whole strip (defaults to true) */
  stripEnabled?: boolean;
  items?: Array<{
    id: PublicQuickLinkId;
    label?: string;
    /** Per-link hide */
    enabled?: boolean;
  }>;
};

const DEFAULT_IDS: PublicQuickLinkId[] = ['rti', 'rts', 'library'];

export function getDefaultPublicQuickLinksStored(): Required<
  Pick<PublicQuickLinksStored, 'stripEnabled' | 'items'>
> {
  return {
    stripEnabled: true,
    items: DEFAULT_IDS.map((id) => ({
      id,
      label: DEFAULT_LABEL_BY_ID[id],
      enabled: true,
    })),
  };
}

function isQuickLinkId(value: unknown): value is PublicQuickLinkId {
  return value === 'rti' || value === 'rts' || value === 'library';
}

/**
 * Resolves stored village overrides with fixed URLs and default labels.
 */
export function resolvePublicQuickLinksForDisplay(
  raw: unknown | null | undefined
): PublicQuickLinkResolved[] {
  const defaults = getDefaultPublicQuickLinksStored();
  const stored = raw && typeof raw === 'object' ? (raw as PublicQuickLinksStored) : null;

  if (stored?.stripEnabled === false) {
    return [];
  }

  const byId = new Map<PublicQuickLinkId, { label: string; enabled: boolean }>();
  for (const row of defaults.items) {
    byId.set(row.id, { label: row.label, enabled: row.enabled !== false });
  }

  if (Array.isArray(stored?.items)) {
    for (const it of stored.items) {
      if (!it || !isQuickLinkId(it.id)) continue;
      const base = byId.get(it.id);
      if (!base) continue;
      byId.set(it.id, {
        label: typeof it.label === 'string' && it.label.trim() ? it.label.trim() : base.label,
        enabled: it.enabled !== false,
      });
    }
  }

  return DEFAULT_IDS.map((id) => {
    const row = byId.get(id)!;
    return {
      id,
      url: QUICK_LINK_URLS[id],
      label: row.label,
      enabled: row.enabled,
    };
  }).filter((x) => x.enabled);
}

/** Normalizes admin payload into a safe shape for DB. */
export function normalizePublicQuickLinksForSave(raw: unknown): Required<
  Pick<PublicQuickLinksStored, 'stripEnabled' | 'items'>
> {
  const defaults = getDefaultPublicQuickLinksStored();
  if (!raw || typeof raw !== 'object') {
    return defaults;
  }
  const o = raw as PublicQuickLinksStored;
  const stripEnabled = o.stripEnabled !== false;

  const items = DEFAULT_IDS.map((id) => {
    const fromBody = Array.isArray(o.items) ? o.items.find((x) => x?.id === id) : undefined;
    return {
      id,
      label:
        typeof fromBody?.label === 'string' && fromBody.label.trim()
          ? fromBody.label.trim()
          : DEFAULT_LABEL_BY_ID[id],
      enabled: fromBody?.enabled !== false,
    };
  });

  return { stripEnabled, items };
}
