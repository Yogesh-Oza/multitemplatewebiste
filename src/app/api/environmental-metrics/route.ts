import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  environmentalMetricsDemoData,
  EnvironmentalMetricData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  metrics: environmentalMetricsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const metrics = await prisma.environmentalMetric.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (metrics.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      metrics,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching environmental metrics:', error);
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
    const payload = body as EnvironmentalMetricData;

    const metric = await prisma.environmentalMetric.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'EnvironmentalMetric',
      metric.id,
      `Created environmental metric ${metric.metric}`
    );

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating environmental metric:', error);
    return NextResponse.json(
      { error: 'Failed to create environmental metric' },
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
    const payload = body as EnvironmentalMetricData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Metric id is required' }, { status: 400 });
    }

    const existing = await prisma.environmentalMetric.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Metric not found' }, { status: 404 });
    }

    const metric = await prisma.environmentalMetric.update({
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
      'EnvironmentalMetric',
      metric.id,
      `Updated environmental metric ${metric.metric}`
    );

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating environmental metric:', error);
    return NextResponse.json(
      { error: 'Failed to update environmental metric' },
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
      return NextResponse.json({ message: 'Metric id is required' }, { status: 400 });
    }

    const existing = await prisma.environmentalMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Metric not found' }, { status: 404 });
    }

    await prisma.environmentalMetric.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'EnvironmentalMetric',
      id,
      `Deleted environmental metric ${existing.metric}`
    );

    return NextResponse.json({ message: 'Metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting environmental metric:', error);
    return NextResponse.json(
      { error: 'Failed to delete environmental metric' },
      { status: 500 }
    );
  }
}

