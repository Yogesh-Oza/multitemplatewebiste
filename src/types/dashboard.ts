export interface TimestampedEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  isActive?: boolean;
  order?: number;
}

export interface DashboardOverview extends TimestampedEntity {
  title: string;
  titleEn: string;
  subtitle: string;
  subtitleEn: string;
  description?: string | null;
  descriptionEn?: string | null;
  highlightText?: string | null;
  highlightTextEn?: string | null;
}

export interface DashboardKpiMetric extends TimestampedEntity {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  value: number;
  unit?: string | null;
  unitEn?: string | null;
  icon: string;
  color: string;
}

export interface DashboardProgressIndicator extends TimestampedEntity {
  title: string;
  titleEn: string;
  value: number;
  unit?: string | null;
  icon: string;
  color: string;
}

export interface DashboardContentStatBreakdown {
  label: string;
  labelEn?: string;
  value: number;
  color?: string;
}

export interface DashboardContentStat extends TimestampedEntity {
  title: string;
  titleEn: string;
  description?: string | null;
  descriptionEn?: string | null;
  value: number;
  unit?: string | null;
  icon?: string | null;
  color: string;
  breakdown?: DashboardContentStatBreakdown[];
}

export interface DashboardWardComparison extends TimestampedEntity {
  name: string;
  nameEn: string;
  population: number;
  households: number;
  sanitation: number;
  waterSupply: number;
  electricity: number;
  projects: number;
  complaints: number;
  resolvedComplaints: number;
}

export interface DashboardAchievement extends TimestampedEntity {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  impact: string;
  impactEn: string;
  category: string;
  categoryEn: string;
  year: string;
  icon: string;
}

export interface DashboardRecentActivity extends TimestampedEntity {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  activityDate: string;
  icon: string;
  color: string;
}

