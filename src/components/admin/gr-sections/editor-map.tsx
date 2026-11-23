'use client';

import type { GrEditorKey } from '@/lib/gr-sections';
import { HeroImagesSection } from '@/components/admin/homepage/hero-images-section';
import { VillageInfoSection } from '@/components/admin/homepage/village-info-section';
import { NewsUpdatesSection } from '@/components/admin/homepage/news-updates-section';
import { DailyMessageSection } from '@/components/admin/homepage/daily-message-section';
import { ProgressMetricsSection } from '@/components/admin/homepage/progress-metrics-section';
import { HistorySection } from '@/components/admin/homepage/history-section';
import { LeadersSection } from '@/components/admin/homepage/leaders-section';
import { OfficeDetailsAdmin } from '@/components/admin/about/office-details-admin';
import { RolesAdmin } from '@/components/admin/about/roles-admin';
import { EmergencyContactsAdmin } from '@/components/admin/about/emergency-contacts-admin';
import { TeamMembersAdmin } from '@/components/admin/about/team-members-admin';
import { WeatherWidgetForm } from '@/components/admin/gr-sections/weather-widget-form';
import { VisionMissionForm } from '@/components/admin/gr-sections/vision-mission-form';
import { LanguageSwitchInfo } from '@/components/admin/gr-sections/language-switch-info';
import { WelcomeVideoAdmin } from '@/components/admin/gr-sections/welcome-video-admin';

export function GrSubsectionEditor({
  editor,
  sectionId,
  subSectionId,
}: {
  editor: GrEditorKey;
  sectionId: string;
  subSectionId: string;
}) {
  switch (editor) {
    case 'hero-banner':
      return <HeroImagesSection />;
    case 'quick-info':
      return <VillageInfoSection />;
    case 'news-updates':
      return <NewsUpdatesSection />;
    case 'weather-widget':
      return <WeatherWidgetForm sectionId={sectionId} subSectionId={subSectionId} />;
    case 'daily-message':
      return <DailyMessageSection />;
    case 'language-switch':
      return <LanguageSwitchInfo />;
    case 'welcome-video':
      return <WelcomeVideoAdmin />;
    case 'progress-meter':
      return <ProgressMetricsSection />;
    case 'village-history':
      return <HistorySection />;
    case 'panchayat-structure':
      return <TeamMembersAdmin />;
    case 'office-details':
      return <OfficeDetailsAdmin />;
    case 'roles-responsibilities':
      return <RolesAdmin />;
    case 'emergency-contacts':
      return <EmergencyContactsAdmin />;
    case 'vision-mission':
      return <VisionMissionForm sectionId={sectionId} subSectionId={subSectionId} />;
    case 'know-leaders':
      return <LeadersSection />;
    default:
      return (
        <p className="text-gray-500 text-sm">या उप-विभागासाठी फॉर्म लवकरच उपलब्ध होईल.</p>
      );
  }
}
