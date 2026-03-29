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

    const existing = await prisma.rtiFormLink.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const body = await request.json();
    const row = await prisma.rtiFormLink.update({
      where: { id },
      data: {
        ...(body.kind !== undefined && { kind: String(body.kind) }),
        ...(body.labelMr !== undefined && { labelMr: body.labelMr }),
        ...(body.labelEn !== undefined && { labelEn: body.labelEn }),
        ...(body.url !== undefined && { url: body.url }),
        ...(body.order !== undefined && { order: Number(body.order) }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'RtiFormLink', id, `RTI form ${row.kind}`);
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

    const existing = await prisma.rtiFormLink.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    await prisma.rtiFormLink.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'RtiFormLink', id, `RTI form ${existing.kind}`);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
