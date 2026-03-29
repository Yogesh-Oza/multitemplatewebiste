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

    const list = await prisma.rtiFormLink.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load forms' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.rtiFormLink.create({
      data: {
        subdomainId,
        kind: body.kind ?? 'application',
        labelMr: body.labelMr ?? '',
        labelEn: body.labelEn ?? '',
        url: body.url ?? '',
        order: body.order ?? 0,
        isActive: body.isActive !== false,
      },
    });

    await logCrudActivity(request, 'CREATE', 'RtiFormLink', row.id, `RTI form link ${row.kind}`);
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create form link' }, { status: 500 });
  }
}
