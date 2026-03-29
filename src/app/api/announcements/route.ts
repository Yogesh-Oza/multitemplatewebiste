import { NextRequest, NextResponse } from 'next/server';
import { CommunicationKind } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { publicCommsFilter, parseCommunicationPriority } from '@/lib/services/communications';
import { communicationPostToAnnouncementShape } from '@/lib/communication-mappers';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const now = new Date();
    const posts = await prisma.communicationPost.findMany({
      where: publicCommsFilter(subdomainId, CommunicationKind.announcement, now),
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    if (posts.length > 0) {
      return NextResponse.json(posts.map(communicationPostToAnnouncementShape));
    }

    const announcements = await prisma.announcement.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { date: 'desc' },
      take: 100,
    });

    const mapped = announcements.map((a) => ({
      id: a.id,
      title: a.title,
      description: a.description,
      date: a.date,
      imageUrl: a.image,
      priority: a.priority,
      status: a.status,
      category: a.category,
      fullDescription: a.fullDescription ?? undefined,
      _source: 'legacy' as const,
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const { title, description, date, imageUrl, priority, status, category } = body;

    const announcement = await prisma.communicationPost.create({
      data: {
        subdomainId,
        kind: CommunicationKind.announcement,
        title,
        titleEn: body.titleEn ?? title,
        content: description,
        contentEn: body.descriptionEn ?? '',
        image: imageUrl ?? '',
        legacyDate: date,
        priority: parseCommunicationPriority(priority),
        status: status ?? 'active',
        category: category ?? 'सामान्य',
        fullDescription: body.fullDescription ?? null,
        publishAt: body.publishAt ? new Date(body.publishAt) : new Date(),
        expireAt: body.expireAt ? new Date(body.expireAt) : null,
        isActive: true,
        order: body.order ?? 0,
      },
    });

    await logCrudActivity(
      request,
      'CREATE',
      'CommunicationPost',
      announcement.id,
      `Created announcement: ${title}`
    );

    return NextResponse.json(communicationPostToAnnouncementShape(announcement));
  } catch (error) {
    console.error('Error creating announcement:', error);
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, description, date, imageUrl, priority, status, category } = body;

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.announcement },
    });

    if (post) {
      const updated = await prisma.communicationPost.update({
        where: { id },
        data: {
          title,
          titleEn: body.titleEn ?? title,
          content: description,
          contentEn: body.descriptionEn ?? post.contentEn,
          image: imageUrl ?? post.image,
          legacyDate: date,
          priority: parseCommunicationPriority(priority),
          status,
          category,
          fullDescription: body.fullDescription ?? post.fullDescription,
          ...(body.publishAt !== undefined && {
            publishAt: body.publishAt ? new Date(body.publishAt) : null,
          }),
          ...(body.expireAt !== undefined && {
            expireAt: body.expireAt ? new Date(body.expireAt) : null,
          }),
        },
      });
      await logCrudActivity(request, 'UPDATE', 'CommunicationPost', id, `Updated announcement: ${title}`);
      return NextResponse.json(communicationPostToAnnouncementShape(updated));
    }

    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, subdomainId },
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ message: 'Announcement not found or access denied' }, { status: 404 });
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

    await logCrudActivity(request, 'UPDATE', 'Announcement', announcement.id, `Updated announcement: ${title}`);

    return NextResponse.json({
      id: announcement.id,
      title: announcement.title,
      description: announcement.description,
      date: announcement.date,
      imageUrl: announcement.image,
      priority: announcement.priority,
      status: announcement.status,
      category: announcement.category,
      _source: 'legacy' as const,
    });
  } catch (error) {
    console.error('Error updating announcement:', error);
    return NextResponse.json({ error: 'Failed to update announcement' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.announcement },
    });

    if (post) {
      await prisma.communicationPost.delete({ where: { id } });
      await logCrudActivity(request, 'DELETE', 'CommunicationPost', id, `Deleted announcement: ${post.title}`);
      return NextResponse.json({ message: 'Announcement deleted successfully' });
    }

    const existingAnnouncement = await prisma.announcement.findFirst({
      where: { id, subdomainId },
    });

    if (!existingAnnouncement) {
      return NextResponse.json({ message: 'Announcement not found or access denied' }, { status: 404 });
    }

    await prisma.announcement.delete({
      where: { id },
    });

    await logCrudActivity(
      request,
      'DELETE',
      'Announcement',
      id,
      `Deleted announcement: ${existingAnnouncement.title}`
    );

    return NextResponse.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    return NextResponse.json({ error: 'Failed to delete announcement' }, { status: 500 });
  }
}
