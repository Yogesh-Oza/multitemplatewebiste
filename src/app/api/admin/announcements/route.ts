import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
    const announcements = await prisma.announcement.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(announcements);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
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
        subdomainId,
      },
    });
    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
