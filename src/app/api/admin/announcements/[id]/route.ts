import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;
    const announcement = await prisma.announcement.findFirst({
      where: { id, subdomainId },
    });

    if (!announcement) {
      return NextResponse.json({ error: 'Announcement not found' }, { status: 404 });
    }

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch announcement' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;
    const data = await request.json();
    // Ensure the announcement belongs to this subdomain
    const existing = await prisma.announcement.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date,
        description: data.description,
        fullDescription: data.fullDescription,
        image: data.image ?? data.imageUrl,
        category: data.category,
        priority: data.priority,
        status: data.status,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Announcement', announcement.id, `Updated announcement: ${data.title}`);

    return NextResponse.json(announcement);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;
    // Ensure the announcement belongs to this subdomain
    const existing = await prisma.announcement.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    await prisma.announcement.delete({ where: { id } });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Announcement', id, `Deleted announcement: ${existing.title}`);

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
