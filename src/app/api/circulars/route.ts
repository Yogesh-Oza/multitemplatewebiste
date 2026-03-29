import { NextRequest, NextResponse } from 'next/server';
import { CommunicationKind } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { publicCommsFilter, parseCommunicationPriority } from '@/lib/services/communications';
import { communicationPostToCircularShape } from '@/lib/communication-mappers';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const now = new Date();
    const posts = await prisma.communicationPost.findMany({
      where: publicCommsFilter(subdomainId, CommunicationKind.circular, now),
      orderBy: { order: 'asc' },
    });

    if (posts.length > 0) {
      return NextResponse.json(posts.map(communicationPostToCircularShape));
    }

    const circulars = await prisma.circular.findMany({
      where: {
        subdomainId,
        isActive: true,
      },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(circulars);
  } catch (error) {
    console.error('Error fetching circulars:', error);
    return NextResponse.json({ error: 'Failed to fetch circulars' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      type,
      department,
      departmentEn,
      number,
      date,
      priority,
      status,
      description,
      descriptionEn,
      content,
      contentEn,
      attachments,
      issuedBy,
      issuedByEn,
      lastUpdated,
      order,
      isActive,
    } = body;

    const mainContent = content ?? description ?? '';
    const mainContentEn = contentEn ?? descriptionEn ?? '';

    const circular = await prisma.communicationPost.create({
      data: {
        subdomainId,
        kind: CommunicationKind.circular,
        title,
        titleEn,
        content: mainContent,
        contentEn: mainContentEn,
        circularType: type || 'circular',
        department,
        departmentEn,
        referenceNumber: number,
        legacyDate: date,
        priority: parseCommunicationPriority(priority),
        status: status || 'active',
        attachments: attachments || [],
        issuedBy,
        issuedByEn,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        publishAt: body.publishAt ? new Date(body.publishAt) : new Date(),
        expireAt: body.expireAt ? new Date(body.expireAt) : null,
      },
    });

    await logCrudActivity(request, 'CREATE', 'CommunicationPost', circular.id, `Created circular: ${title}`);

    return NextResponse.json(communicationPostToCircularShape(circular));
  } catch (error) {
    console.error('Error creating circular:', error);
    return NextResponse.json({ error: 'Failed to create circular' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const {
      id,
      title,
      titleEn,
      type,
      department,
      departmentEn,
      number,
      date,
      priority,
      status,
      description,
      descriptionEn,
      content,
      contentEn,
      attachments,
      issuedBy,
      issuedByEn,
      lastUpdated,
      order,
      isActive,
    } = body;

    const post = await prisma.communicationPost.findFirst({
      where: { id, subdomainId, kind: CommunicationKind.circular },
    });

    if (post) {
      const mainContent = content ?? description ?? post.content;
      const mainContentEn = contentEn ?? descriptionEn ?? post.contentEn;
      const updated = await prisma.communicationPost.update({
        where: { id },
        data: {
          title,
          titleEn,
          content: mainContent,
          contentEn: mainContentEn,
          circularType: type ?? post.circularType,
          department,
          departmentEn,
          referenceNumber: number ?? post.referenceNumber,
          legacyDate: date ?? post.legacyDate,
          priority: priority !== undefined ? parseCommunicationPriority(priority) : post.priority,
          status: status !== undefined ? status : post.status,
          attachments: attachments !== undefined ? attachments : post.attachments,
          issuedBy,
          issuedByEn,
          lastUpdated: lastUpdated || new Date().toISOString(),
          order: order !== undefined ? order : post.order,
          isActive: isActive !== undefined ? isActive : post.isActive,
          ...(body.publishAt !== undefined && {
            publishAt: body.publishAt ? new Date(body.publishAt) : null,
          }),
          ...(body.expireAt !== undefined && {
            expireAt: body.expireAt ? new Date(body.expireAt) : null,
          }),
        },
      });
      await logCrudActivity(request, 'UPDATE', 'CommunicationPost', id, `Updated circular: ${title}`);
      return NextResponse.json(communicationPostToCircularShape(updated));
    }

    const existingCircular = await prisma.circular.findFirst({
      where: { id, subdomainId },
    });

    if (!existingCircular) {
      return NextResponse.json({ message: 'Circular not found or access denied' }, { status: 404 });
    }

    const circular = await prisma.circular.update({
      where: { id },
      data: {
        title,
        titleEn,
        type,
        department,
        departmentEn,
        number,
        date,
        priority: priority !== undefined ? priority : existingCircular.priority,
        status: status !== undefined ? status : existingCircular.status,
        description,
        descriptionEn,
        content,
        contentEn,
        attachments: attachments !== undefined ? attachments : existingCircular.attachments,
        issuedBy,
        issuedByEn,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order !== undefined ? order : existingCircular.order,
        isActive: isActive !== undefined ? isActive : existingCircular.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', 'Circular', circular.id, `Updated circular: ${title}`);

    return NextResponse.json(circular);
  } catch (error) {
    console.error('Error updating circular:', error);
    return NextResponse.json({ error: 'Failed to update circular' }, { status: 500 });
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
      where: { id, subdomainId, kind: CommunicationKind.circular },
    });

    if (post) {
      await prisma.communicationPost.delete({ where: { id } });
      await logCrudActivity(request, 'DELETE', 'CommunicationPost', id, `Deleted circular: ${post.title}`);
      return NextResponse.json({ message: 'Circular deleted successfully' });
    }

    const existingCircular = await prisma.circular.findFirst({
      where: { id, subdomainId },
    });

    if (!existingCircular) {
      return NextResponse.json({ message: 'Circular not found or access denied' }, { status: 404 });
    }

    await prisma.circular.delete({
      where: { id },
    });

    await logCrudActivity(request, 'DELETE', 'Circular', id, `Deleted circular: ${existingCircular.title}`);

    return NextResponse.json({ message: 'Circular deleted successfully' });
  } catch (error) {
    console.error('Error deleting circular:', error);
    return NextResponse.json({ error: 'Failed to delete circular' }, { status: 500 });
  }
}
