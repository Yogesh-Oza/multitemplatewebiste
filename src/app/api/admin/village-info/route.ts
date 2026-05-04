import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  getDefaultPublicQuickLinksStored,
  normalizePublicQuickLinksForSave,
} from '@/lib/public-quick-links';

const DEFAULT_WELCOME_VIDEO = {
  url: '',
  title: 'गावाचे स्वागत व्हिडिओ',
  description: 'सरपंच किंवा युवकांकडून गावाच्या यशाबद्दल छोटा व्हिडिओ क्लिप',
  isActive: false,
  type: 'youtube' as const,
  uploadedFile: ''
};

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
    const villageInfo = await prisma.villageInfo.findFirst({ where: { subdomainId } });
    return NextResponse.json({
      ...(villageInfo ?? {}),
      welcomeVideo: villageInfo?.welcomeVideo ?? DEFAULT_WELCOME_VIDEO,
      publicQuickLinks: villageInfo?.publicQuickLinks
        ? normalizePublicQuickLinksForSave(villageInfo.publicQuickLinks)
        : getDefaultPublicQuickLinksStored(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch village info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const data = await request.json();
    const statsData = Array.isArray(data.stats) ? data.stats : [];
    const welcomeVideo =
      data.welcomeVideo && typeof data.welcomeVideo === 'object'
        ? {
            ...DEFAULT_WELCOME_VIDEO,
            ...data.welcomeVideo,
            type: data.welcomeVideo.type === 'upload' ? 'upload' : 'youtube',
          }
        : DEFAULT_WELCOME_VIDEO;

    const publicQuickLinks = normalizePublicQuickLinksForSave(data.publicQuickLinks);

    // Ensure a single record per subdomain: delete then create
    await prisma.villageInfo.deleteMany({ where: { subdomainId } });

    const payload: any = {
      title: data.title ?? '',
      titleEn: data.titleEn ?? 'About Our Village',
      description: data.description ?? '',
      descriptionEn: data.descriptionEn ?? 'Village information',
      villageLogo: data.villageLogo ?? null,
      villageName: data.villageName ?? null,
      villageNameEn: data.villageNameEn ?? null,
      satyamevJayateLogoUrl: data.satyamevJayateLogoUrl ?? '/images/gov-logos/satyamev_jayate_logo.png',
      digitalIndiaLogoUrl: data.digitalIndiaLogoUrl ?? '/images/gov-logos/digital-india.png',
      govDeptText: data.govDeptText ?? 'शासन महाराष्ट्र • ग्रामीण विकास विभाग',
      officialSiteText: data.officialSiteText ?? 'अधिकृत ग्रामपंचायत संकेतस्थळ',
      sectionOneTitle: data.sectionOneTitle ?? '',
      sectionOneBody: data.sectionOneBody ?? '',
      sectionTwoTitle: data.sectionTwoTitle ?? '',
      sectionTwoBody: data.sectionTwoBody ?? '',
      sectionThreeTitle: data.sectionThreeTitle ?? '',
      sectionThreeBody: data.sectionThreeBody ?? '',
      welcomeVideo,
      publicQuickLinks,
      stats: statsData,
      subdomainId,
    };

    const result = await prisma.villageInfo.create({ data: payload });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'VillageInfo', result.id, `Updated village information via admin panel`);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update village info' }, { status: 500 });
  }
}
