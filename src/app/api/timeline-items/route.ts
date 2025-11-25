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

    const timelineItems = await prisma.timelineItem.findMany({
      where: { 
        subdomainId
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(timelineItems);
  } catch (error) {
    console.error('Error fetching timeline items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline items' },
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
    const { year, title, titleEn, description, descriptionEn, imageUrl, side, order, isActive } = body;

    const timelineItem = await prisma.timelineItem.create({
      data: {
        year,
        title,
        titleEn,
        description,
        descriptionEn,
        imageUrl: imageUrl || null,
        side: side || 'left',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'TimelineItem', timelineItem.id, `Created timeline item: ${title} (${year})`);

    return NextResponse.json(timelineItem);
  } catch (error) {
    console.error('Error creating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to create timeline item' },
      { status: 500 }
    );
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

    const body = await request.json();
    const { id, year, title, titleEn, description, descriptionEn, imageUrl, side, order, isActive } = body;

    // Verify the timeline item belongs to this subdomain
    const existingItem = await prisma.timelineItem.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Timeline item not found or access denied' 
      }, { status: 404 });
    }

    const timelineItem = await prisma.timelineItem.update({
      where: { id },
      data: {
        year,
        title,
        titleEn,
        description,
        descriptionEn,
        imageUrl: imageUrl !== undefined ? imageUrl : existingItem.imageUrl,
        side: side || 'left',
        order: order !== undefined ? order : existingItem.order,
        isActive: isActive !== undefined ? isActive : existingItem.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'TimelineItem', timelineItem.id, `Updated timeline item: ${title} (${year})`);

    return NextResponse.json(timelineItem);
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to update timeline item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Verify the timeline item belongs to this subdomain
    const existingItem = await prisma.timelineItem.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Timeline item not found or access denied' 
      }, { status: 404 });
    }

    await prisma.timelineItem.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'TimelineItem', id, `Deleted timeline item: ${existingItem.title} (${existingItem.year})`);

    return NextResponse.json({ message: 'Timeline item deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeline item' },
      { status: 500 }
    );
  }
}
