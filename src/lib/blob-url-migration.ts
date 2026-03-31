export const VERCEL_BLOB_HOST_SUFFIX = '.public.blob.vercel-storage.com';

export type FieldKind = 'scalar' | 'stringArray' | 'json';

export interface ModelFieldSpec {
  field: string;
  kind: FieldKind;
}

export interface ModelMigrationSpec {
  model: string;
  delegate: string;
  fields: ModelFieldSpec[];
}

export const MODEL_MIGRATION_SPECS: ModelMigrationSpec[] = [
  {
    model: 'VillageInfo',
    delegate: 'villageInfo',
    fields: [
      { field: 'villageLogo', kind: 'scalar' },
      { field: 'satyamevJayateLogoUrl', kind: 'scalar' },
      { field: 'digitalIndiaLogoUrl', kind: 'scalar' },
    ],
  },
  { model: 'TimelineItem', delegate: 'timelineItem', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'Announcement', delegate: 'announcement', fields: [{ field: 'image', kind: 'scalar' }] },
  { model: 'CulturalHeritage', delegate: 'culturalHeritage', fields: [{ field: 'image', kind: 'scalar' }] },
  { model: 'HeroImage', delegate: 'heroImage', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'Program', delegate: 'program', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'Gallery', delegate: 'gallery', fields: [{ field: 'mediaUrl', kind: 'scalar' }] },
  { model: 'Facility', delegate: 'facility', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'TeamMember', delegate: 'teamMember', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'Leader', delegate: 'leader', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'IncomeExpense', delegate: 'incomeExpense', fields: [{ field: 'receiptUrl', kind: 'scalar' }] },
  { model: 'Department', delegate: 'department', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  {
    model: 'GovernmentScheme',
    delegate: 'governmentScheme',
    fields: [
      { field: 'website', kind: 'scalar' },
      { field: 'imageUrl', kind: 'scalar' },
    ],
  },
  {
    model: 'ApplicationProcessConfig',
    delegate: 'applicationProcessConfig',
    fields: [
      { field: 'applicationFormUrl', kind: 'scalar' },
      { field: 'sampleFormUrl', kind: 'scalar' },
    ],
  },
  {
    model: 'BeneficiaryStory',
    delegate: 'beneficiaryStory',
    fields: [
      { field: 'beforeImage', kind: 'scalar' },
      { field: 'afterImage', kind: 'scalar' },
    ],
  },
  {
    model: 'FooterContent',
    delegate: 'footerContent',
    fields: [
      { field: 'footerSatyamevJayateLogoUrl', kind: 'scalar' },
      { field: 'footerDigitalIndiaLogoUrl', kind: 'scalar' },
    ],
  },
  { model: 'GovernmentResolution', delegate: 'governmentResolution', fields: [{ field: 'fileUrl', kind: 'scalar' }] },
  {
    model: 'Project',
    delegate: 'project',
    fields: [
      { field: 'photosBefore', kind: 'stringArray' },
      { field: 'photosAfter', kind: 'stringArray' },
    ],
  },
  { model: 'Complaint', delegate: 'complaint', fields: [{ field: 'attachments', kind: 'stringArray' }] },
  { model: 'JobOpportunity', delegate: 'jobOpportunity', fields: [{ field: 'applicationUrl', kind: 'scalar' }] },
  { model: 'Tender', delegate: 'tender', fields: [{ field: 'tenderUrl', kind: 'scalar' }] },
  { model: 'TrainingProgram', delegate: 'trainingProgram', fields: [{ field: 'registrationUrl', kind: 'scalar' }] },
  { model: 'FPOGroup', delegate: 'fPOGroup', fields: [{ field: 'joinUrl', kind: 'scalar' }] },
  { model: 'School', delegate: 'school', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'ScholarshipScheme', delegate: 'scholarshipScheme', fields: [{ field: 'applicationUrl', kind: 'scalar' }] },
  { model: 'StudentAchievement', delegate: 'studentAchievement', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'CareerGuidance', delegate: 'careerGuidance', fields: [{ field: 'registrationUrl', kind: 'scalar' }] },
  { model: 'YouthSuccessStory', delegate: 'youthSuccessStory', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  { model: 'AdoptedTree', delegate: 'adoptedTree', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  {
    model: 'EducationItem',
    delegate: 'educationItem',
    fields: [
      { field: 'links', kind: 'stringArray' },
      { field: 'images', kind: 'stringArray' },
    ],
  },
  {
    model: 'EnvironmentInitiative',
    delegate: 'environmentInitiative',
    fields: [{ field: 'images', kind: 'stringArray' }],
  },
  { model: 'SocialFeed', delegate: 'socialFeed', fields: [{ field: 'url', kind: 'scalar' }] },
  { model: 'NewsItem', delegate: 'newsItem', fields: [{ field: 'imageUrl', kind: 'scalar' }] },
  {
    model: 'BeforeAfterGallery',
    delegate: 'beforeAfterGallery',
    fields: [
      { field: 'beforeImage', kind: 'scalar' },
      { field: 'afterImage', kind: 'scalar' },
    ],
  },
  { model: 'MeetingNotification', delegate: 'meetingNotification', fields: [{ field: 'documents', kind: 'json' }] },
  { model: 'Circular', delegate: 'circular', fields: [{ field: 'attachments', kind: 'json' }] },
  { model: 'ImportantDeadline', delegate: 'importantDeadline', fields: [{ field: 'documents', kind: 'json' }] },
  { model: 'DownloadableFile', delegate: 'downloadableFile', fields: [{ field: 'url', kind: 'scalar' }] },
  { model: 'CalendarEvent', delegate: 'calendarEvent', fields: [{ field: 'documents', kind: 'json' }] },
  {
    model: 'CommunicationPost',
    delegate: 'communicationPost',
    fields: [
      { field: 'image', kind: 'scalar' },
      { field: 'attachments', kind: 'json' },
    ],
  },
  { model: 'RtiMandatoryDisclosureItem', delegate: 'rtiMandatoryDisclosureItem', fields: [{ field: 'documentUrl', kind: 'scalar' }] },
  { model: 'RtiFormLink', delegate: 'rtiFormLink', fields: [{ field: 'url', kind: 'scalar' }] },
  { model: 'GramSabhaMeeting', delegate: 'gramSabhaMeeting', fields: [{ field: 'documents', kind: 'json' }] },
  {
    model: 'CitizenService',
    delegate: 'citizenService',
    fields: [
      { field: 'formUrl', kind: 'scalar' },
      { field: 'applicationUrl', kind: 'scalar' },
    ],
  },
];

export function isVercelBlobUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.hostname.endsWith(VERCEL_BLOB_HOST_SUFFIX);
  } catch {
    return false;
  }
}

export function collectBlobUrls(value: unknown): string[] {
  if (typeof value === 'string') {
    return isVercelBlobUrl(value) ? [value] : [];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => collectBlobUrls(entry));
  }

  if (value && typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).flatMap((entry) => collectBlobUrls(entry));
  }

  return [];
}

export function rewriteBlobUrls(
  value: unknown,
  mapper: (url: string) => string | undefined
): { value: unknown; changed: boolean; changedUrls: string[] } {
  if (typeof value === 'string') {
    if (!isVercelBlobUrl(value)) {
      return { value, changed: false, changedUrls: [] };
    }

    const mapped = mapper(value);
    if (!mapped || mapped === value) {
      return { value, changed: false, changedUrls: [] };
    }

    return { value: mapped, changed: true, changedUrls: [value] };
  }

  if (Array.isArray(value)) {
    let changed = false;
    const changedUrls: string[] = [];
    const next = value.map((entry) => {
      const result = rewriteBlobUrls(entry, mapper);
      changed ||= result.changed;
      changedUrls.push(...result.changedUrls);
      return result.value;
    });

    return { value: changed ? next : value, changed, changedUrls };
  }

  if (value && typeof value === 'object') {
    let changed = false;
    const changedUrls: string[] = [];
    const nextEntries = Object.entries(value as Record<string, unknown>).map(([key, entry]) => {
      const result = rewriteBlobUrls(entry, mapper);
      changed ||= result.changed;
      changedUrls.push(...result.changedUrls);
      return [key, result.value] as const;
    });

    return {
      value: changed ? Object.fromEntries(nextEntries) : value,
      changed,
      changedUrls,
    };
  }

  return { value, changed: false, changedUrls: [] };
}
