import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const announcements = await prisma.announcement.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const announcement = await prisma.announcement.create({
      data: {
        title: data.title,
        date: data.date,
        description: data.description,
        fullDescription: data.fullDescription,
        image: data.image,
        category: data.category,
        priority: data.priority,
        status: data.status,
        order: data.order || 0,
      },
    });

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
