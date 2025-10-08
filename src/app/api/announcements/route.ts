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

    const announcements = await prisma.announcement.findMany({
      where: { subdomainId },
      orderBy: { date: 'desc' },
      take: 10
    });

    return NextResponse.json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json(
      { error: 'Failed to fetch announcements' },
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
    const { title, description, date, imageUrl, priority, status, category } = body;

    const announcement = await prisma.announcement.create({
      data: {
        title,
        description,
        date,
        image: imageUrl,
        priority,
        status,
        category,
        subdomainId,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to create announcement' },
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
    const { id, title, description, date, imageUrl, priority, status, category } = body;

    // Verify the announcement belongs to this subdomain
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, subdomainId }
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ 
        message: 'Announcement not found or access denied' 
      }, { status: 404 });
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title,
        description,
        date,
        image: imageUrl,
        priority,
        status,
        category,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json(
      { error: 'Failed to update announcement' },
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

    // Verify the announcement belongs to this subdomain
    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, subdomainId }
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ 
        message: 'Announcement not found or access denied' 
      }, { status: 404 });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json(
      { error: 'Failed to delete announcement' },
      { status: 500 }
    );
  }
}
