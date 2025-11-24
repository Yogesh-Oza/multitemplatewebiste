import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  villageTalentsDemoData,
  VillageTalentData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  talents: villageTalentsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const talents = await prisma.villageTalent.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (talents.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      talents: talents.map(talent => ({
        ...talent,
        services: Array.isArray(talent.services) ? talent.services : [],
        servicesEn: Array.isArray(talent.servicesEn) ? talent.servicesEn : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching village talents:', error);
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
    const payload = body as VillageTalentData;

    const talent = await prisma.villageTalent.create({
      data: {
        ...payload,
        subdomainId,
        services: payload.services || [],
        servicesEn: payload.servicesEn || [],
        rating: payload.rating || 0
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'VillageTalent',
      talent.id,
      `Created village talent ${talent.name}`
    );

    return NextResponse.json(talent);
  } catch (error) {
    console.error('Error creating village talent:', error);
    return NextResponse.json(
      { error: 'Failed to create village talent' },
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
    const payload = body as VillageTalentData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Talent id is required' }, { status: 400 });
    }

    const existing = await prisma.villageTalent.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Talent not found' }, { status: 404 });
    }

    const talent = await prisma.villageTalent.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        services: payload.services || existing.services,
        servicesEn: payload.servicesEn || existing.servicesEn,
        rating: payload.rating ?? existing.rating
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'VillageTalent',
      talent.id,
      `Updated village talent ${talent.name}`
    );

    return NextResponse.json(talent);
  } catch (error) {
    console.error('Error updating village talent:', error);
    return NextResponse.json(
      { error: 'Failed to update village talent' },
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
      return NextResponse.json({ message: 'Talent id is required' }, { status: 400 });
    }

    const existing = await prisma.villageTalent.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Talent not found' }, { status: 404 });
    }

    await prisma.villageTalent.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'VillageTalent',
      id,
      `Deleted village talent ${existing.name}`
    );

    return NextResponse.json({ message: 'Talent deleted successfully' });
  } catch (error) {
    console.error('Error deleting village talent:', error);
    return NextResponse.json(
      { error: 'Failed to delete village talent' },
      { status: 500 }
    );
  }
}

