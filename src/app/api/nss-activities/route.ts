import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  nssActivitiesDemoData,
  NSSActivityData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  activities: nssActivitiesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const activities = await prisma.nSSActivity.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (activities.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      activities,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching NSS activities:', error);
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
    const payload = body as NSSActivityData;

    const activity = await prisma.nSSActivity.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'NSSActivity',
      activity.id,
      `Created NSS activity ${activity.title}`
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating NSS activity:', error);
    return NextResponse.json(
      { error: 'Failed to create NSS activity' },
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
    const payload = body as NSSActivityData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Activity id is required' }, { status: 400 });
    }

    const existing = await prisma.nSSActivity.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }

    const activity = await prisma.nSSActivity.update({
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
      'NSSActivity',
      activity.id,
      `Updated NSS activity ${activity.title}`
    );

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating NSS activity:', error);
    return NextResponse.json(
      { error: 'Failed to update NSS activity' },
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
      return NextResponse.json({ message: 'Activity id is required' }, { status: 400 });
    }

    const existing = await prisma.nSSActivity.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Activity not found' }, { status: 404 });
    }

    await prisma.nSSActivity.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'NSSActivity',
      id,
      `Deleted NSS activity ${existing.title}`
    );

    return NextResponse.json({ message: 'Activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting NSS activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete NSS activity' },
      { status: 500 }
    );
  }
}

