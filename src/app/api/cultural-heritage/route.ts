import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const heritage = await prisma.culturalHeritage.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(heritage);
  } catch (error) {
    console.error('Error fetching cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cultural heritage' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    console.log('Cultural Heritage API - Subdomain validation:', { isValid, subdomainId });
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, titleEn, description, descriptionEn, image, category } = body;
    
    console.log('Cultural Heritage API - Received data:', { title, image, category });

    const heritage = await prisma.culturalHeritage.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        image,
        category: category || 'सांस्कृतिक',
        subdomainId,
      },
    });

    console.log('Cultural Heritage API - Created heritage:', heritage.id);
    
    // Log activity
    await logCrudActivity(request, 'CREATE', 'CulturalHeritage', heritage.id, `Created cultural heritage: ${title}`);

    return NextResponse.json(heritage);
  } catch (error) {
    console.error('Error creating cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to create cultural heritage' },
      { status: 500 }
    );
  }
}