'use client';

import { HeroImagesSection } from '@/components/admin/homepage/hero-images-section';
import { VillageInfoSection } from '@/components/admin/homepage/village-info-section';
import { LeadersSection } from '@/components/admin/homepage/leaders-section';
import { ProgressMetricsSection } from '@/components/admin/homepage/progress-metrics-section';
import { QRCodeSettingsSection } from '@/components/admin/homepage/qr-code-settings-section';
import { NewsUpdatesSection } from '@/components/admin/homepage/news-updates-section';
import { DailyMessageSection } from '@/components/admin/homepage/daily-message-section';
import { AnnouncementsSection } from '@/components/admin/homepage/announcements-section';
import { HistorySection } from '@/components/admin/homepage/history-section';
import { CulturalHeritageSection } from '@/components/admin/homepage/cultural-heritage-section';
import { FooterContentSection } from '@/components/admin/homepage/footer-content-section';

export default function VillageInfoPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Homepage</h1>
        <p className="text-gray-600 mt-2">गावाची मुख्य माहिती, आकडेवारी आणि होमपेज व्यवस्थापन</p>
      </div>

      {/* Sections in order matching frontend homepage */}
      <div className="space-y-6">
        {/* 1. Hero Images Section */}
        <HeroImagesSection />

        {/* 2. Village Info Section */}
        <VillageInfoSection />

        {/* 3. Leaders Section */}
        <LeadersSection />

        {/* 4. Progress Metrics Section */}
        <ProgressMetricsSection />

        {/* 5. QR Code Settings Section */}
        <QRCodeSettingsSection />

        {/* 6. News Updates Section */}
        <NewsUpdatesSection />

        {/* 7. Daily Message Section */}
        <DailyMessageSection />

        {/* 8. Announcements Section */}
        <AnnouncementsSection />

        {/* 9. History Management Section */}
        <HistorySection />

        {/* 10. Cultural Heritage Section */}
        <CulturalHeritageSection />

        {/* 11. Footer Content Management Section */}
        <FooterContentSection />
      </div>
    </div>
  );
}
