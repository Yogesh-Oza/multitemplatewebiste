export interface HeroImage {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export interface HomepageSettings {
  id?: string;
  mainHeading: string;
  subtitle: string;
  isActive: boolean;
}

export interface Leader {
  id?: string;
  name: string;
  role: string;
  roleEn: string;
  imageUrl: string;
  order: number;
  isActive: boolean;
}

export interface ProgressMetric {
  id?: string;
  key: string;
  label: string;
  labelEn: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
  order: number;
  isActive: boolean;
}

export interface NewsItem {
  id?: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  category: string;
  categoryColor: string;
  isUrgent: boolean;
  order: number;
  isActive: boolean;
}

export interface DailyMessage {
  id?: string;
  message: string;
  authorTitle: string;
  date: string;
  category: string;
  icon: string;
  color: string;
  isActive: boolean;
}

export interface QRCodeSettings {
  id?: string;
  propertyTaxQrData: string;
  waterTaxQrData: string;
  propertyTaxInstruction: string;
  waterTaxInstruction: string;
  isActive: boolean;
}

export interface Announcement {
  id?: string;
  title: string;
  date: string;
  description: string;
  fullDescription?: string;
  image: string;
  category: string;
  priority: string;
  status: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface HistoryCard {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  gradient: string;
  icon: string;
  isActive?: boolean;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TimelineItem {
  id: string;
  year: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  side: string;
  order?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CulturalHeritage {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  image: string;
  category: string;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
  icon: string;
}

export interface FooterContent {
  id?: string;
  description: string;
  socialMedia: SocialMediaLink[];
  officeName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  footerSatyamevJayateLogoUrl?: string;
  footerDigitalIndiaLogoUrl?: string;
  footerGovDeptText?: string;
  footerOwnershipText?: string;
}

