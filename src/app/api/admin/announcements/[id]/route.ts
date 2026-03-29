import { NextRequest, NextResponse } from 'next/server';
import { CommunicationKind } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { parseCommunicationPriority } from '@/lib/services/communications';
import { communicationPostToAdminAnnouncement } from '@/lib/admin-announcement-map';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.announcement },
    });
    if (post) {
      return NextResponse.json(communicationPostToAdminAnnouncement(post));
    }

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
    if (!isValid || !subdomainId) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;
    const data = await request.json();

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.announcement },
    });
    if (post) {
      const updated = await prisma.communicationPost.update({
        where: { id },
        data: {
          title: data.title,
          titleEn: data.titleEn ?? data.title,
          content: data.description,
          contentEn: data.descriptionEn ?? post.contentEn,
          legacyDate: data.date,
          fullDescription: data.fullDescription ?? post.fullDescription,
          image: data.image ?? data.imageUrl ?? post.image,
          category: data.category,
          priority: parseCommunicationPriority(data.priority),
          status: data.status,
          order: data.order ?? post.order,
          ...(data.publishAt !== undefined && {
            publishAt: data.publishAt ? new Date(data.publishAt) : null,
          }),
          ...(data.expireAt !== undefined && {
            expireAt: data.expireAt ? new Date(data.expireAt) : null,
          }),
        },
      });
      await logCrudActivity(request, 'UPDATE', 'CommunicationPost', id, `Updated announcement: ${data.title}`);
      return NextResponse.json(communicationPostToAdminAnnouncement(updated));
    }

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
    if (!isValid || !subdomainId) return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    const { id } = await params;

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.announcement },
    });
    if (post) {
      await prisma.communicationPost.delete({ where: { id } });
      await logCrudActivity(request, 'DELETE', 'CommunicationPost', id, `Deleted announcement: ${post.title}`);
      return NextResponse.json({ message: 'Announcement deleted successfully' });
    }

    const existing = await prisma.announcement.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Announcement not found' }, { status: 404 });
    await prisma.announcement.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'Announcement', id, `Deleted announcement: ${existing.title}`);
    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
