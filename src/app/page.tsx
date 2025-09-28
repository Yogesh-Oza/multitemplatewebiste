import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { HistorySection } from '@/components/sections/history-section';
import { AnnouncementsSection } from '@/components/sections/announcements-section';
import { CulturalHeritageSection } from '@/components/sections/cultural-heritage-section';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutSection />
      <HistorySection />
      <AnnouncementsSection />
      <CulturalHeritageSection />
    </>
  );
}