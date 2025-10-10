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

// POST endpoint removed - only PUT should be used for admin updates
// This prevents duplicate record creation

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    console.log('Admin API - Subdomain validation:', { isValid, subdomainId });
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const data = await request.json();
    console.log('Admin API - Received data:', data);
    
    // Store stats as array directly (no transformation needed)
    const statsData = Array.isArray(data.stats) ? data.stats : [];
    console.log('Admin API - Stats data:', statsData);
    
    // First, delete any existing records for this subdomain to prevent duplicates
    await prisma.villageInfo.deleteMany({
      where: { subdomainId }
    });
    
    console.log('Admin API - Deleted existing records for subdomain:', subdomainId);
    
    // Create a new record
    const villageInfo = await prisma.villageInfo.create({
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
    
    console.log('Admin API - Created new record:', villageInfo.id);

    console.log('Admin API - Final result:', villageInfo);
    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error updating village info:', error);
    return NextResponse.json({ error: 'Failed to update village info' }, { status: 500 });
  }
}
