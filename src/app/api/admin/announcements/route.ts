import { NextRequest, NextResponse } from 'next/server';
import { CommunicationKind } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { parseCommunicationPriority } from '@/lib/services/communications';
import { communicationPostToAdminAnnouncement } from '@/lib/admin-announcement-map';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
    const posts = await prisma.communicationPost.findMany({
      where: { subdomainId, kind: CommunicationKind.announcement },
      orderBy: { createdAt: 'desc' },
    });
    if (posts.length > 0) {
      return NextResponse.json(posts.map(communicationPostToAdminAnnouncement));
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
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
    const data = await request.json();
    const announcement = await prisma.communicationPost.create({
      data: {
        subdomainId,
        kind: CommunicationKind.announcement,
        title: data.title,
        titleEn: data.titleEn ?? data.title,
        content: data.description,
        contentEn: data.descriptionEn ?? '',
        legacyDate: data.date,
        fullDescription: data.fullDescription ?? null,
        image: data.image,
        category: data.category,
        priority: parseCommunicationPriority(data.priority),
        status: data.status,
        order: data.order || 0,
        publishAt: data.publishAt ? new Date(data.publishAt) : new Date(),
        expireAt: data.expireAt ? new Date(data.expireAt) : null,
        isActive: true,
      },
    });

    await logCrudActivity(
      request,
      'CREATE',
      'CommunicationPost',
      announcement.id,
      `Created announcement: ${data.title}`
    );

    return NextResponse.json(communicationPostToAdminAnnouncement(announcement));
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 });
  }
}
