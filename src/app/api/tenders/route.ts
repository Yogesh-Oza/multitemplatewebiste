import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  tendersDemoData,
  TenderData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  tenders: tendersDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const tenders = await prisma.tender.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (tenders.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      tenders,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching tenders:', error);
    return NextResponse.json(demoResponse(), { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const payload = body as TenderData;

    const tender = await prisma.tender.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'Tender',
      tender.id,
      `Created tender ${tender.title}`
    );

    return NextResponse.json(tender);
  } catch (error) {
    console.error('Error creating tender:', error);
    return NextResponse.json(
      { error: 'Failed to create tender' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const payload = body as TenderData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Tender id is required' }, { status: 400 });
    }

    const existing = await prisma.tender.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Tender not found' }, { status: 404 });
    }

    const tender = await prisma.tender.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'Tender',
      tender.id,
      `Updated tender ${tender.title}`
    );

    return NextResponse.json(tender);
  } catch (error) {
    console.error('Error updating tender:', error);
    return NextResponse.json(
      { error: 'Failed to update tender' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Tender id is required' }, { status: 400 });
    }

    const existing = await prisma.tender.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Tender not found' }, { status: 404 });
    }

    await prisma.tender.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'Tender',
      id,
      `Deleted tender ${existing.title}`
    );

    return NextResponse.json({ message: 'Tender deleted successfully' });
  } catch (error) {
    console.error('Error deleting tender:', error);
    return NextResponse.json(
      { error: 'Failed to delete tender' },
      { status: 500 }
    );
  }
}

