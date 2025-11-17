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

    const galleryItems = await prisma.gallery.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery items' },
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
    const { title, titleEn, description, descriptionEn, type, mediaUrl, category, isActive, order } = body;

    console.log('Gallery API - Create data:', body);

    const galleryItem = await prisma.gallery.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        type,
        mediaUrl,
        category,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
        subdomainId,
      },
    });

    console.log('Gallery API - Created gallery item:', galleryItem);

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Gallery', galleryItem.id, `Created gallery item: ${title}`);

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create gallery item' },
      { status: 500 }
    );
  }
}