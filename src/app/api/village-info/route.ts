import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    let villageInfo = await prisma.villageInfo.findFirst({
      where: { subdomainId: subdomainId! },
      orderBy: { createdAt: 'desc' } // Get the most recent record
    });
    
    if (!villageInfo) {
      // Auto-create village info record for this subdomain
      const subdomainData = await prisma.subdomain.findUnique({
        where: { id: subdomainId! },
        select: { subdomain: true, villageName: true, villageNameEn: true }
      });
      
      if (!subdomainData) {
        return NextResponse.json({ 
          message: 'Subdomain not found' 
        }, { status: 404 });
      }
      
      // Create default village info for this subdomain
      villageInfo = await prisma.villageInfo.create({
        data: {
          title: `${subdomainData.villageName} ग्रामपंचायत`,
          titleEn: `${subdomainData.villageNameEn} Gram Panchayat`,
          description: `${subdomainData.villageName} ग्रामपंचायतची माहिती`,
          descriptionEn: `Information about ${subdomainData.villageNameEn} Gram Panchayat`,
          sectionOneTitle: '',
          sectionOneBody: '',
          sectionTwoTitle: '',
          sectionTwoBody: '',
          sectionThreeTitle: '',
          sectionThreeBody: '',
          stats: [
            { value: '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
            { value: '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
            { value: '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
            { value: '654.455', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' }
          ],
          subdomainId: subdomainId
        }
      });
    }

    // Return the data as-is since we're now using the stats array format
    const response = NextResponse.json(villageInfo);
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error) {
    console.error('Error fetching village info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch village information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, titleEn, descriptionEn, stats,
      sectionOneTitle, sectionOneBody,
      sectionTwoTitle, sectionTwoBody,
      sectionThreeTitle, sectionThreeBody,
      villageLogo, villageName, villageNameEn,
      satyamevJayateLogoUrl, digitalIndiaLogoUrl, govDeptText, officialSiteText } = body;

    // Store stats as array directly
    const statsData = stats && Array.isArray(stats) ? stats : [];

    // First, try to find existing village info for this subdomain
    const existingVillageInfo = await prisma.villageInfo.findFirst({
      where: { subdomainId }
    });
    
    let villageInfo;
    if (existingVillageInfo) {
      // Update existing record
      villageInfo = await prisma.villageInfo.update({
        where: { id: existingVillageInfo.id },
        data: {
          title,
          description,
          titleEn,
          descriptionEn,
          sectionOneTitle: sectionOneTitle ?? '',
          sectionOneBody: sectionOneBody ?? '',
          sectionTwoTitle: sectionTwoTitle ?? '',
          sectionTwoBody: sectionTwoBody ?? '',
          sectionThreeTitle: sectionThreeTitle ?? '',
          sectionThreeBody: sectionThreeBody ?? '',
          villageLogo: villageLogo ?? '',
          villageName: villageName ?? '',
          villageNameEn: villageNameEn ?? '',
          satyamevJayateLogoUrl: satyamevJayateLogoUrl ?? undefined,
          digitalIndiaLogoUrl: digitalIndiaLogoUrl ?? undefined,
          govDeptText: govDeptText ?? undefined,
          officialSiteText: officialSiteText ?? undefined,
          stats: statsData,
        },
      });
    } else {
      // Create new record
      villageInfo = await prisma.villageInfo.create({
        data: {
          title,
          description,
          titleEn,
          descriptionEn,
          sectionOneTitle: sectionOneTitle ?? '',
          sectionOneBody: sectionOneBody ?? '',
          sectionTwoTitle: sectionTwoTitle ?? '',
          sectionTwoBody: sectionTwoBody ?? '',
          sectionThreeTitle: sectionThreeTitle ?? '',
          sectionThreeBody: sectionThreeBody ?? '',
          villageLogo: villageLogo ?? '',
          villageName: villageName ?? '',
          villageNameEn: villageNameEn ?? '',
          satyamevJayateLogoUrl: satyamevJayateLogoUrl ?? undefined,
          digitalIndiaLogoUrl: digitalIndiaLogoUrl ?? undefined,
          govDeptText: govDeptText ?? undefined,
          officialSiteText: officialSiteText ?? undefined,
          stats: statsData,
          subdomainId,
        },
      });
    }

    // Log activity
    await logCrudActivity(request, existingVillageInfo ? 'UPDATE' : 'CREATE', 'VillageInfo', villageInfo.id, `Updated village information`);

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error saving village info:', error);
    return NextResponse.json(
      { error: 'Failed to save village information' },
      { status: 500 }
    );
  }
}
