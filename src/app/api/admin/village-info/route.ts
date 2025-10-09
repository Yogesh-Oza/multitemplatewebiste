import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const villageInfo = await prisma.villageInfo.findFirst({
      where: { subdomainId }
    });
    return NextResponse.json(villageInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch village info' }, { status: 500 });
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

    const data = await request.json();
    
    const villageInfo = await prisma.villageInfo.create({
      data: {
        title: data.title,
        titleEn: data.titleEn || 'About Our Village',
        description: data.description,
        descriptionEn: data.descriptionEn || 'Village information',
        sectionOneTitle: data.sectionOneTitle ?? '',
        sectionOneBody: data.sectionOneBody ?? '',
        sectionTwoTitle: data.sectionTwoTitle ?? '',
        sectionTwoBody: data.sectionTwoBody ?? '',
        sectionThreeTitle: data.sectionThreeTitle ?? '',
        sectionThreeBody: data.sectionThreeBody ?? '',
        stats: data.stats || [],
        subdomainId,
      },
    });

    return NextResponse.json(villageInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create village info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const data = await request.json();
    
    // Store stats as array directly (no transformation needed)
    const statsData = Array.isArray(data.stats) ? data.stats : [];
    
    // First, try to find existing village info for this subdomain
    let villageInfo = await prisma.villageInfo.findFirst({
      where: { subdomainId }
    });
    
    if (villageInfo) {
      // Update existing record
      villageInfo = await prisma.villageInfo.update({
        where: { id: villageInfo.id },
        data: {
          title: data.title,
          titleEn: data.titleEn || 'About Our Village', // Keep default English
          description: data.description,
          descriptionEn: data.descriptionEn || 'Village information', // Keep default English
          sectionOneTitle: data.sectionOneTitle ?? '',
          sectionOneBody: data.sectionOneBody ?? '',
          sectionTwoTitle: data.sectionTwoTitle ?? '',
          sectionTwoBody: data.sectionTwoBody ?? '',
          sectionThreeTitle: data.sectionThreeTitle ?? '',
          sectionThreeBody: data.sectionThreeBody ?? '',
          stats: statsData,
        },
      });
    } else {
      // Create new record
      villageInfo = await prisma.villageInfo.create({
        data: {
          title: data.title,
          titleEn: data.titleEn || 'About Our Village', // Keep default English
          description: data.description,
          descriptionEn: data.descriptionEn || 'Village information', // Keep default English
          sectionOneTitle: data.sectionOneTitle ?? '',
          sectionOneBody: data.sectionOneBody ?? '',
          sectionTwoTitle: data.sectionTwoTitle ?? '',
          sectionTwoBody: data.sectionTwoBody ?? '',
          sectionThreeTitle: data.sectionThreeTitle ?? '',
          sectionThreeBody: data.sectionThreeBody ?? '',
          stats: statsData,
          subdomainId,
        },
      });
    }

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error updating village info:', error);
    return NextResponse.json({ error: 'Failed to update village info' }, { status: 500 });
  }
}
