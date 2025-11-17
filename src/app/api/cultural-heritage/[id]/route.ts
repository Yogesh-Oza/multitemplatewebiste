import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, titleEn, description, descriptionEn, image, category } = body;

    // Verify the heritage belongs to this subdomain
    const existingHeritage = await prisma.culturalHeritage.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingHeritage) {
      return NextResponse.json({ 
        message: 'Cultural heritage not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const heritage = await prisma.culturalHeritage.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        image,
        category: category || 'सांस्कृतिक',
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'CulturalHeritage', heritage.id, `Updated cultural heritage: ${title}`);

    return NextResponse.json(heritage);
  } catch (error) {
    console.error('Error updating cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to update cultural heritage' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;

    // Verify the heritage belongs to this subdomain
    const existingHeritage = await prisma.culturalHeritage.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingHeritage) {
      return NextResponse.json({ 
        message: 'Cultural heritage not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.culturalHeritage.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'CulturalHeritage', id, `Deleted cultural heritage: ${existingHeritage.title}`);

    return NextResponse.json({ message: 'Cultural heritage deleted successfully' });
  } catch (error) {
    console.error('Error deleting cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to delete cultural heritage' },
      { status: 500 }
    );
  }
}
