import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(
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
    const timelineItem = await prisma.timelineItem.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!timelineItem) {
      return NextResponse.json({ 
        message: 'Timeline item not found' 
      }, { status: 404 });
    }

    return NextResponse.json(timelineItem);
  } catch (error) {
    console.error('Error fetching timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch timeline item' },
      { status: 500 }
    );
  }
}

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
    const { year, title, titleEn, description, descriptionEn, side, order, isActive } = body;

    // Verify the timeline item belongs to this subdomain
    const existingItem = await prisma.timelineItem.findFirst({
      where: { 
        id,
        subdomainId 
      }
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
        side: side || 'left',
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    return NextResponse.json(timelineItem);
  } catch (error) {
    console.error('Error updating timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to update timeline item' },
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
    // Verify the timeline item belongs to this subdomain
    const existingItem = await prisma.timelineItem.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Timeline item not found or access denied' 
      }, { status: 404 });
    }

    await prisma.timelineItem.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Timeline item deleted successfully' });
  } catch (error) {
    console.error('Error deleting timeline item:', error);
    return NextResponse.json(
      { error: 'Failed to delete timeline item' },
      { status: 500 }
    );
  }
}
