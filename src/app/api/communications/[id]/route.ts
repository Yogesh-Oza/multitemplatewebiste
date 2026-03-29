import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { parseCommunicationPriority } from '@/lib/services/communications';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const existing = await prisma.communicationPost.findFirst({
      where: { id, subdomainId },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.communicationPost.update({
      where: { id },
      data: {
        ...(body.category !== undefined && { category: body.category }),
        ...(body.priority !== undefined && { priority: parseCommunicationPriority(body.priority) }),
        ...(body.publishAt !== undefined && { publishAt: body.publishAt ? new Date(body.publishAt) : null }),
        ...(body.expireAt !== undefined && { expireAt: body.expireAt ? new Date(body.expireAt) : null }),
        ...(body.title !== undefined && { title: body.title }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
        ...(body.content !== undefined && { content: body.content }),
        ...(body.contentEn !== undefined && { contentEn: body.contentEn }),
        ...(body.image !== undefined && { image: body.image }),
        ...(body.fullDescription !== undefined && { fullDescription: body.fullDescription }),
        ...(body.legacyDate !== undefined && { legacyDate: body.legacyDate }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.attachments !== undefined && { attachments: body.attachments }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'CommunicationPost', id, `Updated communication: ${row.title}`);

    return NextResponse.json(row);
  } catch (error) {
    console.error('Error updating communication:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const existing = await prisma.communicationPost.findFirst({
      where: { id, subdomainId },
    });
    if (!existing) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    await prisma.communicationPost.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'CommunicationPost', id, `Deleted communication: ${existing.title}`);

    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error('Error deleting communication:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
