import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  greenInitiativesDemoData,
  GreenInitiativeData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  initiatives: greenInitiativesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const initiatives = await prisma.greenInitiative.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (initiatives.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      initiatives,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching green initiatives:', error);
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
    const payload = body as GreenInitiativeData;

    const initiative = await prisma.greenInitiative.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'GreenInitiative',
      initiative.id,
      `Created green initiative ${initiative.title}`
    );

    return NextResponse.json(initiative);
  } catch (error) {
    console.error('Error creating green initiative:', error);
    return NextResponse.json(
      { error: 'Failed to create green initiative' },
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
    const payload = body as GreenInitiativeData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Initiative id is required' }, { status: 400 });
    }

    const existing = await prisma.greenInitiative.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Initiative not found' }, { status: 404 });
    }

    const initiative = await prisma.greenInitiative.update({
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
      'GreenInitiative',
      initiative.id,
      `Updated green initiative ${initiative.title}`
    );

    return NextResponse.json(initiative);
  } catch (error) {
    console.error('Error updating green initiative:', error);
    return NextResponse.json(
      { error: 'Failed to update green initiative' },
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
      return NextResponse.json({ message: 'Initiative id is required' }, { status: 400 });
    }

    const existing = await prisma.greenInitiative.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Initiative not found' }, { status: 404 });
    }

    await prisma.greenInitiative.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'GreenInitiative',
      id,
      `Deleted green initiative ${existing.title}`
    );

    return NextResponse.json({ message: 'Initiative deleted successfully' });
  } catch (error) {
    console.error('Error deleting green initiative:', error);
    return NextResponse.json(
      { error: 'Failed to delete green initiative' },
      { status: 500 }
    );
  }
}

