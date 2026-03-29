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

    const list = await prisma.citizenService.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load services' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.citizenService.create({
      data: {
        subdomainId,
        titleMr: body.titleMr ?? '',
        titleEn: body.titleEn ?? '',
        descriptionMr: body.descriptionMr ?? '',
        descriptionEn: body.descriptionEn ?? '',
        category: body.category ?? 'other',
        status: body.status ?? 'available',
        processingTimeMr: body.processingTimeMr ?? '',
        processingTimeEn: body.processingTimeEn ?? '',
        fees: Number(body.fees) || 0,
        requiredDocuments: body.requiredDocuments ?? [],
        formUrl: body.formUrl ?? null,
        applicationUrl: body.applicationUrl ?? null,
        iconName: body.iconName ?? 'FileText',
        colorClass: body.colorClass ?? 'bg-blue-500',
        onlineAvailable: body.onlineAvailable !== false,
        order: body.order ?? 0,
        isActive: body.isActive !== false,
      },
    });

    await logCrudActivity(request, 'CREATE', 'CitizenService', row.id, `Citizen service ${row.titleMr}`);
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
}
