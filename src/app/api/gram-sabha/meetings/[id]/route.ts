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

    const existing = await prisma.gramSabhaMeeting.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    const body = await request.json();
    const row = await prisma.gramSabhaMeeting.update({
      where: { id },
      data: {
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.agenda !== undefined && { agenda: body.agenda }),
        ...(body.agendaEn !== undefined && { agendaEn: body.agendaEn }),
        ...(body.attendanceCount !== undefined && { attendanceCount: Number(body.attendanceCount) }),
        ...(body.quorumMet !== undefined && { quorumMet: Boolean(body.quorumMet) }),
        ...(body.resolutions !== undefined && { resolutions: body.resolutions }),
        ...(body.documents !== undefined && { documents: body.documents }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        ...(body.order !== undefined && { order: body.order }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'GramSabhaMeeting', id, 'Updated Gram Sabha meeting');
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

    const existing = await prisma.gramSabhaMeeting.findFirst({ where: { id, subdomainId } });
    if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 });

    await prisma.gramSabhaMeeting.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', 'GramSabhaMeeting', id, 'Deleted Gram Sabha meeting');
    return NextResponse.json({ message: 'Deleted' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
