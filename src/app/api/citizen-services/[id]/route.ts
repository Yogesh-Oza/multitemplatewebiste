import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

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

    const existing = await prisma.citizenService.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const body = await request.json();
    const row = await prisma.citizenService.update({
      where: { id },
      data: {
        ...(body.titleMr !== undefined && { titleMr: body.titleMr }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
        ...(body.descriptionMr !== undefined && { descriptionMr: body.descriptionMr }),
        ...(body.descriptionEn !== undefined && { descriptionEn: body.descriptionEn }),
        ...(body.category !== undefined && { category: body.category }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.processingTimeMr !== undefined && { processingTimeMr: body.processingTimeMr }),
        ...(body.processingTimeEn !== undefined && { processingTimeEn: body.processingTimeEn }),
        ...(body.fees !== undefined && { fees: Number(body.fees) }),
        ...(body.requiredDocuments !== undefined && { requiredDocuments: body.requiredDocuments }),
        ...(body.formUrl !== undefined && { formUrl: body.formUrl }),
        ...(body.applicationUrl !== undefined && { applicationUrl: body.applicationUrl }),
        ...(body.iconName !== undefined && { iconName: body.iconName }),
        ...(body.colorClass !== undefined && { colorClass: body.colorClass }),
        ...(body.onlineAvailable !== undefined && { onlineAvailable: body.onlineAvailable }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'CitizenService', id, `Updated ${row.titleMr}`);
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
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

    const existing = await prisma.citizenService.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    await prisma.citizenService.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'CitizenService', id, `Deleted ${existing.titleMr}`);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
