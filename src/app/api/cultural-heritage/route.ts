import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

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
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, titleEn, description, descriptionEn, imageUrl } = body;

    const heritage = await prisma.culturalHeritage.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        imageUrl,
        subdomainId,
      },
    });

    return NextResponse.json(heritage);
  } catch (error) {
    console.error('Error creating cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to create cultural heritage' },
      { status: 500 }
    );
  }
}