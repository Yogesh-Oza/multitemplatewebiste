import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const list = await prisma.gramSabhaMeeting.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { date: 'desc' },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load meetings' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.gramSabhaMeeting.create({
      data: {
        subdomainId,
        date: new Date(body.date),
        agenda: body.agenda ?? '',
        agendaEn: body.agendaEn ?? '',
        attendanceCount: Number(body.attendanceCount) || 0,
        quorumMet: Boolean(body.quorumMet),
        resolutions: body.resolutions ?? [],
        documents: body.documents ?? [],
        isActive: body.isActive !== false,
        order: body.order ?? 0,
      },
    });

    await logCrudActivity(request, 'CREATE', 'GramSabhaMeeting', row.id, `Gram Sabha meeting ${row.date}`);

    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create meeting' }, { status: 500 });
  }
}
