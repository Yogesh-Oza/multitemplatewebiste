/**
 * GR-ordered website sections registry.
 * Sections 1–2 are fully defined; 3–16 are placeholders for later.
 */

export type GrEditorKey =
  | 'hero-banner'
  | 'quick-info'
  | 'news-updates'
  | 'weather-widget'
  | 'daily-message'
  | 'language-switch'
  | 'welcome-video'
  | 'progress-meter'
  | 'village-history'
  | 'panchayat-structure'
  | 'office-details'
  | 'roles-responsibilities'
  | 'emergency-contacts'
  | 'vision-mission'
  | 'know-leaders'
  | 'none';

export interface GrSubsection {
  id: string;
  titleMr: string;
  titleEn: string;
  helpMr: string;
  editor: GrEditorKey;
  publicPath: string;
  anchor: string;
  /** ActivityLog model names that count as an update of this sub-section */
  models: string[];
  defaultRefreshDays: number;
  /** Info-only: no editable form */
  infoOnly?: boolean;
}

export interface GrSection {
  id: string;
  number: number;
  titleMr: string;
  titleEn: string;
  icon: string;
  comingSoon?: boolean;
  subsections: GrSubsection[];
}

const DEFAULT_REFRESH = 30;

export const GR_SECTIONS: GrSection[] = [
  {
    id: 'home',
    number: 1,
    titleMr: 'मुख्यपृष्ठ (गाव एक दृष्टिक्षेपात)',
    titleEn: 'Home Page',
    icon: 'Home',
    subsections: [
      {
        id: 'hero-banner',
        titleMr: 'हिरो बॅनर',
        titleEn: 'Hero Banner',
        helpMr: 'गावाचा फोटो, लोगो आणि घोषवाक्य अपलोड करा.',
        editor: 'hero-banner',
        publicPath: '/',
        anchor: 'hero',
        models: ['HeroImage', 'HomepageSettings'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'quick-info',
        titleMr: 'त्वरित माहिती',
        titleEn: 'Quick Info',
        helpMr: 'लोकसंख्या, घरसंख्या, साक्षरता दर, प्रभाग, क्षेत्रफळ आणि पाण्याचे स्रोत भरा.',
        editor: 'quick-info',
        publicPath: '/',
        anchor: 'quick-info',
        models: ['VillageInfo'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'news-updates',
        titleMr: 'ताज्या बातम्या व अद्यतन',
        titleEn: 'Latest News & Updates',
        helpMr: 'गावातील ताज्या बातम्या आणि अद्यतने जोडा.',
        editor: 'news-updates',
        publicPath: '/',
        anchor: 'news-updates',
        models: ['NewsItem'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'weather-widget',
        titleMr: 'लाइव्ह हवामान विजेट',
        titleEn: 'Live Weather Widget',
        helpMr: 'हवामान API किंवा Google हवामान लिंक जोडा.',
        editor: 'weather-widget',
        publicPath: '/',
        anchor: 'weather',
        models: ['SectionContent'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'daily-message',
        titleMr: 'आजचा सुविचार / पंचायत संदेश',
        titleEn: 'Quote of the Day / Panchayat Message',
        helpMr: 'आजचा सुविचार किंवा पंचायत संदेश लिहा.',
        editor: 'daily-message',
        publicPath: '/',
        anchor: 'daily-message',
        models: ['DailyMessage'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'language-switch',
        titleMr: 'भाषा बदल',
        titleEn: 'Language Switcher',
        helpMr: 'मराठी, हिंदी आणि इंग्रजी भाषांतर स्वयंचलित आहे. येथे फॉर्म भरण्याची गरज नाही.',
        editor: 'language-switch',
        publicPath: '/',
        anchor: 'language-switch',
        models: [],
        defaultRefreshDays: DEFAULT_REFRESH,
        infoOnly: true,
      },
      {
        id: 'welcome-video',
        titleMr: 'वेलकम व्हिडिओ',
        titleEn: 'Welcome Video',
        helpMr: 'सरपंच किंवा युवकांचा छोटा स्वागत व्हिडिओ अपलोड करा.',
        editor: 'welcome-video',
        publicPath: '/',
        anchor: 'welcome-video',
        models: ['VillageInfo'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'progress-meter',
        titleMr: 'प्रगती मीटर',
        titleEn: 'Progress Meter',
        helpMr: 'समृद्ध पंचायत, स्वच्छता टक्केवारी, नळजोडणी इत्यादी प्रगती आकडे भरा.',
        editor: 'progress-meter',
        publicPath: '/',
        anchor: 'progress-meter',
        models: ['ProgressMetric'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
    ],
  },
  {
    id: 'about',
    number: 2,
    titleMr: 'ग्रामपंचायतीबद्दल',
    titleEn: 'About the Gram Panchayat',
    icon: 'Info',
    subsections: [
      {
        id: 'village-history',
        titleMr: 'गावाचा इतिहास',
        titleEn: 'Village History',
        helpMr: 'गावाचा ऐतिहासिक आढावा आणि टाइमलाइन भरा.',
        editor: 'village-history',
        publicPath: '/',
        anchor: 'village-history',
        models: ['HistoryCard', 'TimelineItem'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'panchayat-structure',
        titleMr: 'पंचायत संरचना',
        titleEn: 'Panchayat Structure',
        helpMr: 'सरपंच, उपसरपंच आणि सदस्यांची नावे व तपशील भरा.',
        editor: 'panchayat-structure',
        publicPath: '/about',
        anchor: 'panchayat-structure',
        models: ['TeamMember'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'office-details',
        titleMr: 'कार्यालय पत्ता, वेळ आणि संपर्क',
        titleEn: 'Office Details',
        helpMr: 'पंचायत कार्यालयाचा पत्ता, कार्यालयीन वेळ आणि संपर्क माहिती भरा.',
        editor: 'office-details',
        publicPath: '/about',
        anchor: 'office-details',
        models: ['OfficeDetails'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'roles-responsibilities',
        titleMr: 'भूमिका व जबाबदाऱ्या',
        titleEn: 'Roles & Responsibilities',
        helpMr: 'कोण काय करतो ते स्पष्ट करा.',
        editor: 'roles-responsibilities',
        publicPath: '/about',
        anchor: 'roles-responsibilities',
        models: ['Role'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'emergency-contacts',
        titleMr: 'मुख्य संपर्क / आपत्कालीन क्रमांक',
        titleEn: 'Key / Emergency Contacts',
        helpMr: 'आरोग्य केंद्र, पोलीस, रुग्णवाहिका, रक्तपेढी, अग्निशमन इत्यादी क्रमांक जोडा.',
        editor: 'emergency-contacts',
        publicPath: '/about',
        anchor: 'emergency-contacts',
        models: ['EmergencyContact'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'vision-mission',
        titleMr: 'दृष्टीकोन, ध्येय आणि मूल्ये',
        titleEn: 'Vision, Mission & Core Values',
        helpMr: 'दृष्टीकोन, ध्येय आणि मूलभूत मूल्ये लिहा.',
        editor: 'vision-mission',
        publicPath: '/about',
        anchor: 'vision-mission',
        models: ['SectionContent'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
      {
        id: 'know-leaders',
        titleMr: 'आपले नेते ओळखा',
        titleEn: 'Know Your Leaders',
        helpMr: 'प्रत्येक नेत्याची ओळख आणि संक्षिप्त माहिती जोडा.',
        editor: 'know-leaders',
        publicPath: '/',
        anchor: 'know-leaders',
        models: ['Leader'],
        defaultRefreshDays: DEFAULT_REFRESH,
      },
    ],
  },
  // Placeholders 3–16
  {
    id: 'projects',
    number: 3,
    titleMr: 'प्रमुख प्रकल्प आणि उपक्रम',
    titleEn: 'Key Projects & Initiatives',
    icon: 'FolderOpen',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'schemes',
    number: 4,
    titleMr: 'योजना आणि लाभार्थी माहिती',
    titleEn: 'Schemes & Beneficiary Information',
    icon: 'Award',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'announcements',
    number: 5,
    titleMr: 'घोषणा आणि परिपत्रके',
    titleEn: 'Announcements & Circulars',
    icon: 'Megaphone',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'infrastructure',
    number: 6,
    titleMr: 'ग्राम पायाभूत सुविधा आणि सुविधा',
    titleEn: 'Village Infrastructure & Facilities',
    icon: 'Wrench',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'budget',
    number: 7,
    titleMr: 'अर्थसंकल्प आणि पारदर्शकता',
    titleEn: 'Finance & Budget Transparency',
    icon: 'DollarSign',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'citizen-services',
    number: 8,
    titleMr: 'नागरिक सेवा आणि फॉर्म्स',
    titleEn: 'Citizen Services & Forms',
    icon: 'FileText',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'culture',
    number: 9,
    titleMr: 'आमचे गाव – ओळख आणि संस्कृती',
    titleEn: 'Our Village – Identity & Culture',
    icon: 'History',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'employment',
    number: 10,
    titleMr: 'रोजगार आणि कौशल्य विकास',
    titleEn: 'Employment & Skill Development',
    icon: 'Briefcase',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'education',
    number: 11,
    titleMr: 'शिक्षण आणि युवक कोपरा',
    titleEn: 'Education & Youth Corner',
    icon: 'GraduationCap',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'grievance',
    number: 12,
    titleMr: 'तक्रार निवारण आणि फीडबॅक',
    titleEn: 'Grievance Redressal & Feedback',
    icon: 'MessageSquare',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'environment',
    number: 13,
    titleMr: 'पर्यावरण आणि शाश्वत विकास',
    titleEn: 'Environment & Sustainability',
    icon: 'Leaf',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'gallery',
    number: 14,
    titleMr: 'गॅलरी आणि मीडिया',
    titleEn: 'Gallery & Media',
    icon: 'Camera',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'contact',
    number: 15,
    titleMr: 'संपर्क आणि सहकार्य',
    titleEn: 'Contact & Collaboration',
    icon: 'Phone',
    comingSoon: true,
    subsections: [],
  },
  {
    id: 'dashboard',
    number: 16,
    titleMr: 'डॅशबोर्ड: माझे गाव, माझी प्रगती',
    titleEn: 'Dashboard: My Village, My Progress',
    icon: 'BarChart3',
    comingSoon: true,
    subsections: [],
  },
];

export function getSectionById(sectionId: string): GrSection | undefined {
  return GR_SECTIONS.find((s) => s.id === sectionId);
}

export function getSubsection(
  sectionId: string,
  subId: string
): { section: GrSection; subsection: GrSubsection } | undefined {
  const section = getSectionById(sectionId);
  if (!section) return undefined;
  const subsection = section.subsections.find((s) => s.id === subId);
  if (!subsection) return undefined;
  return { section, subsection };
}

/** Map activity-log model name → list of { sectionId, subSectionId } */
export function getSubsectionsForModel(
  model: string
): Array<{ sectionId: string; subSectionId: string }> {
  const matches: Array<{ sectionId: string; subSectionId: string }> = [];
  for (const section of GR_SECTIONS) {
    for (const sub of section.subsections) {
      if (sub.models.includes(model)) {
        matches.push({ sectionId: section.id, subSectionId: sub.id });
      }
    }
  }
  return matches;
}

export type RefreshStatus = 'ok' | 'warning' | 'overdue' | 'never';

export function computeRefreshStatus(
  lastUpdatedAt: Date | string | null | undefined,
  refreshDays: number
): { status: RefreshStatus; daysSince: number | null; daysLeft: number | null } {
  if (!lastUpdatedAt) {
    return { status: 'never', daysSince: null, daysLeft: null };
  }
  const last = typeof lastUpdatedAt === 'string' ? new Date(lastUpdatedAt) : lastUpdatedAt;
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysSince = Math.floor((Date.now() - last.getTime()) / msPerDay);
  const daysLeft = refreshDays - daysSince;
  if (daysLeft <= 0) return { status: 'overdue', daysSince, daysLeft };
  if (daysLeft <= 7) return { status: 'warning', daysSince, daysLeft };
  return { status: 'ok', daysSince, daysLeft };
}

export function statusLabelMr(status: RefreshStatus): string {
  switch (status) {
    case 'ok':
      return 'अद्ययावत';
    case 'warning':
      return 'लवकरच मुदत';
    case 'overdue':
      return 'मुदत संपली';
    case 'never':
      return 'अद्याप भरलेले नाही';
  }
}
