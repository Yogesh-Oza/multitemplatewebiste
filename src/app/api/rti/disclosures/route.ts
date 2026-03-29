import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import { RtiComplianceStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('complianceStatus');
    const where: { subdomainId: string; isActive: boolean; complianceStatus?: RtiComplianceStatus } = {
      subdomainId,
      isActive: true,
    };
    if (status === 'pending' || status === 'completed') {
      where.complianceStatus = status;
    }

    const list = await prisma.rtiMandatoryDisclosureItem.findMany({
      where,
      orderBy: [{ order: 'asc' }, { clauseKey: 'asc' }],
    });
    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load disclosures' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.rtiMandatoryDisclosureItem.create({
      data: {
        subdomainId,
        clauseKey: body.clauseKey,
        titleMr: body.titleMr ?? '',
        titleEn: body.titleEn ?? '',
        contentMr: body.contentMr ?? '',
        contentEn: body.contentEn ?? '',
        documentUrl: body.documentUrl ?? null,
        isMandatory: body.isMandatory !== false,
        complianceStatus: body.complianceStatus === 'completed' ? RtiComplianceStatus.completed : RtiComplianceStatus.pending,
        lastVerifiedAt: body.lastVerifiedAt ? new Date(body.lastVerifiedAt) : null,
        order: body.order ?? 0,
        isActive: body.isActive !== false,
      },
    });

    await logCrudActivity(request, 'CREATE', 'RtiMandatoryDisclosureItem', row.id, `RTI clause ${row.clauseKey}`);
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create disclosure item' }, { status: 500 });
  }
}
