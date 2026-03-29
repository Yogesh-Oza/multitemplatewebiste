import { NextRequest, NextResponse } from 'next/server';
import { CommunicationKind, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { publicCommsFilter, parseCommunicationKind, parseCommunicationPriority } from '@/lib/services/communications';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const kindParam = parseCommunicationKind(searchParams.get('kind'));
    const category = searchParams.get('category') || undefined;
    const priority = searchParams.get('priority') || undefined;
    const now = new Date();

    const where: Prisma.CommunicationPostWhereInput = kindParam
      ? publicCommsFilter(subdomainId, kindParam, now)
      : {
          subdomainId,
          isActive: true,
          AND: [
            { OR: [{ publishAt: null }, { publishAt: { lte: now } }] },
            { OR: [{ expireAt: null }, { expireAt: { gt: now } }] },
          ],
        };

    if (category) where.category = category;
    if (priority === 'high' || priority === 'medium' || priority === 'low') {
      where.priority = priority;
    }

    const items = await prisma.communicationPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 200,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching communications:', error);
    return NextResponse.json({ error: 'Failed to fetch communications' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const kind = parseCommunicationKind(body.kind) || CommunicationKind.announcement;

    const row = await prisma.communicationPost.create({
      data: {
        subdomainId,
        kind,
        category: body.category ?? null,
        priority: parseCommunicationPriority(body.priority),
        publishAt: body.publishAt ? new Date(body.publishAt) : new Date(),
        expireAt: body.expireAt ? new Date(body.expireAt) : null,
        title: body.title,
        titleEn: body.titleEn ?? body.title,
        content: body.content ?? body.description ?? '',
        contentEn: body.contentEn ?? '',
        image: body.image ?? body.imageUrl ?? null,
        fullDescription: body.fullDescription ?? null,
        legacyDate: body.legacyDate ?? body.date ?? null,
        status: body.status ?? null,
        circularType: body.circularType ?? body.type ?? null,
        department: body.department ?? null,
        departmentEn: body.departmentEn ?? null,
        referenceNumber: body.referenceNumber ?? body.number ?? null,
        issuedBy: body.issuedBy ?? null,
        issuedByEn: body.issuedByEn ?? null,
        attachments: body.attachments ?? null,
        lastUpdated: body.lastUpdated ?? new Date().toISOString(),
        isActive: body.isActive !== false,
        order: body.order ?? 0,
      },
    });

    await logCrudActivity(request, 'CREATE', 'CommunicationPost', row.id, `Created ${kind}: ${row.title}`);

    return NextResponse.json(row);
  } catch (error) {
    console.error('Error creating communication:', error);
    return NextResponse.json({ error: 'Failed to create communication' }, { status: 500 });
  }
}
