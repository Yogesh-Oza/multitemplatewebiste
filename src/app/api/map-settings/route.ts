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

    const mapSettings = await prisma.mapSettings.findFirst({
      where: { subdomainId }
    });

    return NextResponse.json(mapSettings);
  } catch (error) {
    console.error('Error fetching map settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch map settings' },
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
    const { embedUrl, latitude, longitude, isActive } = body;

    console.log('Map Settings API - Create/Update data:', body);

    // Delete existing map settings for this subdomain
    await prisma.mapSettings.deleteMany({
      where: { subdomainId }
    });

    // Create new map settings
    const mapSettings = await prisma.mapSettings.create({
      data: {
        embedUrl,
        latitude,
        longitude,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    console.log('Map Settings API - Created map settings:', mapSettings);

    return NextResponse.json(mapSettings);
  } catch (error) {
    console.error('Error creating/updating map settings:', error);
    return NextResponse.json(
      { error: 'Failed to create/update map settings' },
      { status: 500 }
    );
  }
}
