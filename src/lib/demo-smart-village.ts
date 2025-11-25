export interface InfrastructureHighlightPill {
  label: string;
  labelEn: string;
}

export interface InfrastructurePageSettingContent {
  heroTagline?: string;
  heroTaglineEn?: string;
  heroTitle: string;
  heroTitleEn: string;
  heroSubtitle: string;
  heroSubtitleEn: string;
  heroDescription: string;
  heroDescriptionEn: string;
  highlightPills: InfrastructureHighlightPill[];
  overviewHeading: string;
  overviewHeadingEn: string;
  overviewDescription: string;
  overviewDescriptionEn: string;
  ctaTitle: string;
  ctaTitleEn: string;
  ctaDescription: string;
  ctaDescriptionEn: string;
  ctaSubtext?: string;
  ctaSubtextEn?: string;
  ctaPrimaryAction?: string;
  ctaPrimaryActionEn?: string;
  ctaSecondaryAction?: string;
  ctaSecondaryActionEn?: string;
  governmentBadge?: string;
  governmentBadgeEn?: string;
  smartDashboardMeta?: Record<string, any>;
}

export const DEMO_INFRASTRUCTURE_PAGE_SETTING: InfrastructurePageSettingContent = {
  heroTagline: 'पायाभूत',
  heroTaglineEn: 'Infrastructure',
  heroTitle: 'ग्राम पायाभूत सुविधा आणि सुविधा',
  heroTitleEn: 'Village Infrastructure & Facilities',
  heroSubtitle: 'पायाभूत सुविधा आणि स्मार्ट व्हिलेज',
  heroSubtitleEn: 'Infrastructure & Smart Village',
  heroDescription: 'पाणीपुरवठा, स्वच्छता, रस्ते, शाळा, आरोग्य केंद्रे आणि इतर सुविधा',
  heroDescriptionEn: 'Water supply, sanitation, roads, schools, health centers and other amenities',
  highlightPills: [
    { label: 'पाणीपुरवठा', labelEn: 'Water Supply' },
    { label: 'रस्ते आणि दिवे', labelEn: 'Roads & Lighting' },
    { label: 'शाळा आणि आरोग्य', labelEn: 'Schools & Health' }
  ],
  overviewHeading: 'मूलभूत सुविधा',
  overviewHeadingEn: 'Core Facilities',
  overviewDescription: 'ग्राम पायाभूत सुविधांची माहिती',
  overviewDescriptionEn: 'Comprehensive overview of village infrastructure',
  ctaTitle: 'महाराष्ट्र शासन',
  ctaTitleEn: 'Government of Maharashtra',
  ctaDescription: 'सर्व पायाभूत सुविधा भारत सरकार आणि महाराष्ट्र शासनाच्या मार्गदर्शनाखाली विकसित',
  ctaDescriptionEn: 'All infrastructure facilities developed under the guidance of Government of India and Maharashtra Government',
  ctaSubtext: 'शासनाच्या मार्गदर्शक तत्त्वांचे संपूर्ण पालन',
  ctaSubtextEn: 'Fully compliant with Government development guidelines',
  ctaPrimaryAction: 'लाइव्ह स्थिती',
  ctaPrimaryActionEn: 'Live Status',
  ctaSecondaryAction: 'तपशील पहा',
  ctaSecondaryActionEn: 'View Details',
  governmentBadge: 'महाराष्ट्र शासन',
  governmentBadgeEn: 'Maharashtra Government',
  smartDashboardMeta: {
    statusLabel: 'रियल-टाइम स्थिती',
    statusLabelEn: 'Real-time Status',
    updatedLabel: 'अद्यतन',
    updatedLabelEn: 'Updated On'
  }
};

export const DEMO_INFRASTRUCTURE_FACILITIES = [
  {
    id: 'demo-facility-1',
    title: 'पाणीपुरवठा',
    titleEn: 'Water Supply',
    icon: 'Droplet',
    description: '२४x७ शुद्ध आणि उच्च दर्जाचा पाणीपुरवठा',
    descriptionEn: '24x7 purified and high-quality drinking water supply',
    order: 1,
    isActive: true
  },
  {
    id: 'demo-facility-2',
    title: 'रस्ते आणि दिवे',
    titleEn: 'Roads & Lighting',
    icon: 'MapPin',
    description: 'सर्व मुख्य रस्त्यांवर LED स्ट्रीटलाइट्स आणि पक्के रस्ते',
    descriptionEn: 'All major roads are paved with LED street lighting',
    order: 2,
    isActive: true
  },
  {
    id: 'demo-facility-3',
    title: 'शाळा आणि आरोग्य',
    titleEn: 'Schools & Health',
    icon: 'GraduationCap',
    description: 'ई-लर्निंगसह शाळा आणि २४x७ प्राथमिक आरोग्य केंद्र',
    descriptionEn: 'Smart classrooms with e-learning and a 24x7 primary health center',
    order: 3,
    isActive: true
  },
  {
    id: 'demo-facility-4',
    title: 'स्मार्ट व्हिलेज डॅशबोर्ड',
    titleEn: 'Smart Village Dashboard',
    icon: 'Gauge',
    description: 'रियल-टाइम डेटा आणि निर्णय समर्थन प्रणाली',
    descriptionEn: 'Real-time data and decision support dashboard',
    order: 4,
    isActive: true
  }
];

export const DEMO_SMART_VILLAGE_METRICS = [
  {
    id: 'demo-metric-1',
    title: 'वीज पुरवठा',
    titleEn: 'Electricity Supply',
    type: 'electricity',
    status: 'चालू',
    statusEn: 'Operational',
    uptime: 95.2,
    supplyHours: 22,
    quality: 'चांगले',
    usage: '1250 kWh',
    pressure: null,
    metadata: {
      note: 'पुरवठा तास',
      qualityLabel: 'गुणवत्ता',
      usageLabel: 'वापर'
    },
    lastUpdated: '2025-11-20T12:14:02.000Z',
    order: 1,
    isActive: true
  },
  {
    id: 'demo-metric-2',
    title: 'पाणी पुरवठा',
    titleEn: 'Water Supply',
    type: 'water',
    status: 'उपलब्ध',
    statusEn: 'Available',
    uptime: 98.5,
    supplyHours: 20,
    quality: 'चांगले',
    usage: null,
    pressure: 'मध्यम',
    metadata: {
      pressureLabel: 'दाब'
    },
    lastUpdated: '2025-11-20T12:14:02.000Z',
    order: 2,
    isActive: true
  },
  {
    id: 'demo-metric-3',
    title: 'इंटरनेट',
    titleEn: 'Internet',
    type: 'internet',
    status: 'जोडले',
    statusEn: 'Connected',
    uptime: 99.1,
    supplyHours: null,
    quality: null,
    usage: null,
    pressure: null,
    metadata: {
      mobileNetwork: 'चांगले',
      wifiHotspots: 8
    },
    lastUpdated: '2024-12-01T00:00:00.000Z',
    order: 3,
    isActive: true
  },
  {
    id: 'demo-metric-4',
    title: 'हवामान',
    titleEn: 'Weather',
    type: 'weather',
    status: 'सूर्यप्रकाश',
    statusEn: 'Sunny',
    uptime: null,
    supplyHours: null,
    quality: 'हवेची गुणवत्ता: चांगले',
    usage: null,
    pressure: null,
    metadata: {
      temperature: '28°C',
      humidity: '65%',
      airQuality: 'चांगले'
    },
    lastUpdated: '2025-11-20T12:14:02.000Z',
    order: 4,
    isActive: true
  }
];

export const DEMO_SERVICE_STATUS_ITEMS = [
  {
    id: 'demo-service-1',
    title: 'पाणी पुरवठा',
    titleEn: 'Water Supply',
    status: 'चालू',
    statusEn: 'Operational',
    uptime: 98.5,
    responseTime: 2.3,
    description: 'Water supply monitoring and maintenance services',
    descriptionEn: 'Water supply monitoring and maintenance services',
    lastUpdated: '2024-12-01T00:00:00.000Z',
    order: 1,
    isActive: true
  },
  {
    id: 'demo-service-2',
    title: 'वीज पुरवठा',
    titleEn: 'Electricity Supply',
    status: 'चालू',
    statusEn: 'Operational',
    uptime: 95.2,
    responseTime: 1.8,
    description: 'Village-wide grid monitoring and energy tracking',
    descriptionEn: 'Village-wide grid monitoring and energy tracking',
    lastUpdated: '2024-12-01T00:00:00.000Z',
    order: 2,
    isActive: true
  },
  {
    id: 'demo-service-3',
    title: 'इंटरनेट सेवा',
    titleEn: 'Internet Service',
    status: 'चालू',
    statusEn: 'Operational',
    uptime: 99.1,
    responseTime: 0.5,
    description: 'Fiber backbone with community WiFi hotspots',
    descriptionEn: 'Fiber backbone with community WiFi hotspots',
    lastUpdated: '2024-12-01T00:00:00.000Z',
    order: 3,
    isActive: true
  },
  {
    id: 'demo-service-4',
    title: 'स्वच्छता सेवा',
    titleEn: 'Sanitation Service',
    status: 'देखभाल',
    statusEn: 'Maintenance',
    uptime: 92.3,
    responseTime: 4.2,
    description: 'Solid waste management and village cleanliness drives',
    descriptionEn: 'Solid waste management and village cleanliness drives',
    lastUpdated: '2024-12-01T00:00:00.000Z',
    order: 4,
    isActive: true
  }
];

