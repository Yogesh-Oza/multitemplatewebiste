import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  environmentEventsDemoData,
  EnvironmentEventData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  events: environmentEventsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const events = await prisma.environmentEvent.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (events.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      events,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching environment events:', error);
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
    const payload = body as EnvironmentEventData;

    const event = await prisma.environmentEvent.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'EnvironmentEvent',
      event.id,
      `Created environment event ${event.title}`
    );

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error creating environment event:', error);
    return NextResponse.json(
      { error: 'Failed to create environment event' },
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
    const payload = body as EnvironmentEventData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Event id is required' }, { status: 400 });
    }

    const existing = await prisma.environmentEvent.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    const event = await prisma.environmentEvent.update({
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
      'EnvironmentEvent',
      event.id,
      `Updated environment event ${event.title}`
    );

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating environment event:', error);
    return NextResponse.json(
      { error: 'Failed to update environment event' },
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
      return NextResponse.json({ message: 'Event id is required' }, { status: 400 });
    }

    const existing = await prisma.environmentEvent.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Event not found' }, { status: 404 });
    }

    await prisma.environmentEvent.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'EnvironmentEvent',
      id,
      `Deleted environment event ${existing.title}`
    );

    return NextResponse.json({ message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error deleting environment event:', error);
    return NextResponse.json(
      { error: 'Failed to delete environment event' },
      { status: 500 }
    );
  }
}

