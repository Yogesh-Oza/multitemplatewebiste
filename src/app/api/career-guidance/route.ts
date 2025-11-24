import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  careerGuidanceDemoData,
  CareerGuidanceData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  sessions: careerGuidanceDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const sessions = await prisma.careerGuidance.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (sessions.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      sessions,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching career guidance:', error);
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
    const payload = body as CareerGuidanceData;

    const session = await prisma.careerGuidance.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'CareerGuidance',
      session.id,
      `Created career guidance session ${session.title}`
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error creating career guidance:', error);
    return NextResponse.json(
      { error: 'Failed to create career guidance' },
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
    const payload = body as CareerGuidanceData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Session id is required' }, { status: 400 });
    }

    const existing = await prisma.careerGuidance.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    const session = await prisma.careerGuidance.update({
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
      'CareerGuidance',
      session.id,
      `Updated career guidance session ${session.title}`
    );

    return NextResponse.json(session);
  } catch (error) {
    console.error('Error updating career guidance:', error);
    return NextResponse.json(
      { error: 'Failed to update career guidance' },
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
      return NextResponse.json({ message: 'Session id is required' }, { status: 400 });
    }

    const existing = await prisma.careerGuidance.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Session not found' }, { status: 404 });
    }

    await prisma.careerGuidance.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'CareerGuidance',
      id,
      `Deleted career guidance session ${existing.title}`
    );

    return NextResponse.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Error deleting career guidance:', error);
    return NextResponse.json(
      { error: 'Failed to delete career guidance' },
      { status: 500 }
    );
  }
}

