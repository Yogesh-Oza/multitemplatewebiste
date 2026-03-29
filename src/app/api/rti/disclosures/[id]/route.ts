import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { RtiComplianceStatus } from '@prisma/client';

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

    const existing = await prisma.rtiMandatoryDisclosureItem.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const body = await request.json();
    const row = await prisma.rtiMandatoryDisclosureItem.update({
      where: { id },
      data: {
        ...(body.titleMr !== undefined && { titleMr: body.titleMr }),
        ...(body.titleEn !== undefined && { titleEn: body.titleEn }),
        ...(body.contentMr !== undefined && { contentMr: body.contentMr }),
        ...(body.contentEn !== undefined && { contentEn: body.contentEn }),
        ...(body.documentUrl !== undefined && { documentUrl: body.documentUrl }),
        ...(body.isMandatory !== undefined && { isMandatory: body.isMandatory }),
        ...(body.complianceStatus !== undefined && {
          complianceStatus:
            body.complianceStatus === 'completed'
              ? RtiComplianceStatus.completed
              : RtiComplianceStatus.pending,
        }),
        ...(body.lastVerifiedAt !== undefined && {
          lastVerifiedAt: body.lastVerifiedAt ? new Date(body.lastVerifiedAt) : null,
        }),
        ...(body.order !== undefined && { order: body.order }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'RtiMandatoryDisclosureItem', id, `RTI disclosure ${row.clauseKey}`);
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

    const existing = await prisma.rtiMandatoryDisclosureItem.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    await prisma.rtiMandatoryDisclosureItem.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'RtiMandatoryDisclosureItem', id, `Deleted RTI ${existing.clauseKey}`);
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
