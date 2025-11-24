import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  fpoGroupsDemoData,
  FPOGroupData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  groups: fpoGroupsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const groups = await prisma.fpoGroup.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (groups.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      groups: groups.map(group => ({
        ...group,
        activities: Array.isArray(group.activities) ? group.activities : [],
        activitiesEn: Array.isArray(group.activitiesEn) ? group.activitiesEn : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching FPO groups:', error);
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
    const payload = body as FPOGroupData;

    const group = await prisma.fpoGroup.create({
      data: {
        ...payload,
        subdomainId,
        activities: payload.activities || [],
        activitiesEn: payload.activitiesEn || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'FPOGroup',
      group.id,
      `Created FPO group ${group.name}`
    );

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error creating FPO group:', error);
    return NextResponse.json(
      { error: 'Failed to create FPO group' },
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
    const payload = body as FPOGroupData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Group id is required' }, { status: 400 });
    }

    const existing = await prisma.fpoGroup.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    const group = await prisma.fpoGroup.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        activities: payload.activities || existing.activities,
        activitiesEn: payload.activitiesEn || existing.activitiesEn
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'FPOGroup',
      group.id,
      `Updated FPO group ${group.name}`
    );

    return NextResponse.json(group);
  } catch (error) {
    console.error('Error updating FPO group:', error);
    return NextResponse.json(
      { error: 'Failed to update FPO group' },
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
      return NextResponse.json({ message: 'Group id is required' }, { status: 400 });
    }

    const existing = await prisma.fpoGroup.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Group not found' }, { status: 404 });
    }

    await prisma.fpoGroup.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'FPOGroup',
      id,
      `Deleted FPO group ${existing.name}`
    );

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting FPO group:', error);
    return NextResponse.json(
      { error: 'Failed to delete FPO group' },
      { status: 500 }
    );
  }
}

