import { redirect } from 'next/navigation';
import { FacilitiesSection } from '@/components/sections/facilities-section';
import { WaterSanitationSection } from '@/components/sections/water-sanitation-section';
import RoadsLightingSection from '@/components/sections/roads-lighting-section';
import EducationHealthSection from '@/components/sections/education-health-section';
import GISInfrastructureMapSection from '@/components/sections/gis-infrastructure-map-section';
import SmartVillageDashboardSection from '@/components/sections/smart-village-dashboard-section';
import { prisma } from '@/lib/prisma';
import {
  DEMO_INFRASTRUCTURE_PAGE_SETTING,
  InfrastructureHighlightPill,
  InfrastructurePageSettingContent
} from '@/lib/demo-smart-village';

type AmenitiesPageProps = {
  params: Promise<{
    subdomain: string;
  }>;
};

type InfrastructurePageSettingView = InfrastructurePageSettingContent & {
  isDemo: boolean;
  smartDashboardMeta?: Record<string, any> | null;
};

const toHighlightPills = (value: unknown): InfrastructureHighlightPill[] => {
  if (!Array.isArray(value)) return [];
  return value.map((pill) => ({
    label: typeof pill?.label === 'string' ? pill.label : '',
    labelEn: typeof pill?.labelEn === 'string' ? pill.labelEn : ''
  }));
};

const buildPageSetting = (record?: any): InfrastructurePageSettingView => {
  if (!record) {
    return {
      ...DEMO_INFRASTRUCTURE_PAGE_SETTING,
      isDemo: true,
      smartDashboardMeta: DEMO_INFRASTRUCTURE_PAGE_SETTING.smartDashboardMeta ?? undefined
    };
  }

  return {
    heroTagline: record.heroTagline ?? '',
    heroTaglineEn: record.heroTaglineEn ?? '',
    heroTitle: record.heroTitle ?? '',
    heroTitleEn: record.heroTitleEn ?? '',
    heroSubtitle: record.heroSubtitle ?? '',
    heroSubtitleEn: record.heroSubtitleEn ?? '',
    heroDescription: record.heroDescription ?? '',
    heroDescriptionEn: record.heroDescriptionEn ?? '',
    highlightPills: toHighlightPills(record.highlightPills).filter(
      (pill: InfrastructureHighlightPill) => pill.label || pill.labelEn
    ),
    overviewHeading: record.overviewHeading ?? '',
    overviewHeadingEn: record.overviewHeadingEn ?? '',
    overviewDescription: record.overviewDescription ?? '',
    overviewDescriptionEn: record.overviewDescriptionEn ?? '',
    ctaTitle: record.ctaTitle ?? '',
    ctaTitleEn: record.ctaTitleEn ?? '',
    ctaDescription: record.ctaDescription ?? '',
    ctaDescriptionEn: record.ctaDescriptionEn ?? '',
    ctaSubtext: record.ctaSubtext ?? '',
    ctaSubtextEn: record.ctaSubtextEn ?? '',
    ctaPrimaryAction: record.ctaPrimaryAction ?? '',
    ctaPrimaryActionEn: record.ctaPrimaryActionEn ?? '',
    ctaSecondaryAction: record.ctaSecondaryAction ?? '',
    ctaSecondaryActionEn: record.ctaSecondaryActionEn ?? '',
    governmentBadge: record.governmentBadge ?? '',
    governmentBadgeEn: record.governmentBadgeEn ?? '',
    smartDashboardMeta: (record.smartDashboardMeta as Record<string, any>) ?? undefined,
    isDemo: false
  };
};

export default async function SubdomainAmenitiesPage({ params }: AmenitiesPageProps) {
  const { subdomain } = await params;

  const subdomainData = await prisma.subdomain.findUnique({
    where: { subdomain },
    include: {
      infrastructurePageSettings: {
        orderBy: { updatedAt: 'desc' },
        take: 1
      }
    }
  });

  if (!subdomainData || !subdomainData.isActive) {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    redirect(baseUrl);
  }

  const pageSettingRecord = subdomainData.infrastructurePageSettings?.[0];
  const pageSetting = buildPageSetting(pageSettingRecord);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-blue-600">पा</div>
          </div>
          <div className="absolute top-20 right-20 w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="text-lg font-bold text-blue-600">सु</div>
          </div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <div className="text-sm font-bold text-blue-600">वि</div>
          </div>
        </div>

        <div className="container mx-auto px-4 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              {pageSetting.heroTagline && (
                <div className="p-4 rounded-2xl bg-white/20 text-white mr-4 backdrop-blur-sm">
                  <div className="text-2xl font-bold">{pageSetting.heroTagline}</div>
                </div>
              )}
              <h1 className="text-4xl md:text-5xl font-bold">{pageSetting.heroTitle}</h1>
            </div>
            <p className="text-xl md:text-2xl mb-4 opacity-90">
              {pageSetting.heroSubtitleEn || pageSetting.heroTitleEn}
            </p>
            <p className="text-lg mb-6 opacity-80">{pageSetting.heroDescription}</p>
            {pageSetting.heroDescriptionEn && (
              <p className="text-base mb-6 opacity-70">{pageSetting.heroDescriptionEn}</p>
            )}
            {pageSetting.isDemo && (
              <p className="text-xs uppercase tracking-wider text-white/90 mb-4">
                डेमो डेटा - प्रशासनामधून अपडेट करा
              </p>
            )}
            {pageSetting.highlightPills.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 text-sm">
                {pageSetting.highlightPills.map((pill, index) => (
                  <div
                    key={`pill-${index}`}
                    className="flex items-center bg-white/10 px-4 py-2 rounded-full backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 bg-white rounded-full mr-2"></div>
                    <span>{pill.label || pill.labelEn}</span>
                  </div>
                ))}
              </div>
            )}
            {(pageSetting.overviewHeading ||
              pageSetting.overviewHeadingEn ||
              pageSetting.overviewDescription) && (
              <div className="mt-10 space-y-2 opacity-90">
                {pageSetting.overviewHeading && (
                  <p className="text-lg font-semibold">{pageSetting.overviewHeading}</p>
                )}
                {pageSetting.overviewHeadingEn && (
                  <p className="text-base text-white/80">{pageSetting.overviewHeadingEn}</p>
                )}
                {pageSetting.overviewDescription && (
                  <p className="text-base">{pageSetting.overviewDescription}</p>
                )}
                {pageSetting.overviewDescriptionEn && (
                  <p className="text-sm text-white/80">{pageSetting.overviewDescriptionEn}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Smart Village Dashboard Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SmartVillageDashboardSection metaLabels={pageSetting.smartDashboardMeta ?? undefined} />
        </div>
      </section>

      {/* Water Supply & Sanitation Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <WaterSanitationSection />
        </div>
      </section>

      {/* Roads & Street Lighting Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <RoadsLightingSection />
        </div>
      </section>

      {/* Education & Health Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="container mx-auto px-4">
          <EducationHealthSection />
        </div>
      </section>

      {/* GIS Infrastructure Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <GISInfrastructureMapSection />
        </div>
      </section>

      {/* Basic Facilities Section */}
      <section className="py-16 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <FacilitiesSection />
        </div>
      </section>

      {/* Government Compliance Footer */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-3 rounded-full bg-white/20">
                <div className="text-xl font-bold">
                  {pageSetting.governmentBadge || 'महाराष्ट्र'}
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold">{pageSetting.ctaTitle || 'महाराष्ट्र शासन'}</h3>
                <p className="text-lg opacity-90">
                  {pageSetting.ctaTitleEn || 'Government of Maharashtra'}
                </p>
              </div>
            </div>
            <p className="text-lg opacity-80 mb-4">{pageSetting.ctaDescription}</p>
            <p className="text-sm opacity-70">{pageSetting.ctaDescriptionEn}</p>
            {(pageSetting.ctaPrimaryAction || pageSetting.ctaSecondaryAction) && (
              <div className="flex flex-wrap gap-3 justify-center mt-6">
                {pageSetting.ctaPrimaryAction && (
                  <span className="px-4 py-2 bg-white text-blue-700 rounded-full text-sm font-semibold">
                    {pageSetting.ctaPrimaryAction}
                  </span>
                )}
                {pageSetting.ctaSecondaryAction && (
                  <span className="px-4 py-2 border border-white/60 rounded-full text-sm font-semibold">
                    {pageSetting.ctaSecondaryAction}
                  </span>
                )}
              </div>
            )}
            {pageSetting.ctaSubtext && (
              <p className="text-xs opacity-70 mt-4">{pageSetting.ctaSubtext}</p>
            )}
            {pageSetting.ctaSubtextEn && (
              <p className="text-xs opacity-70">{pageSetting.ctaSubtextEn}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
