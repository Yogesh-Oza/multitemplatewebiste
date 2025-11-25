import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardKpiMetric';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const metrics = await prisma.dashboardKpiMetric.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching KPI metrics:', error);
    return NextResponse.json({ error: 'Failed to fetch KPI metrics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const metric = await prisma.dashboardKpiMetric.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        value: Number(body.value) || 0,
        unit: body.unit,
        unitEn: body.unitEn,
        icon: body.icon ?? 'Target',
        color: body.color ?? 'blue',
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, metric.id, `Created KPI metric: ${metric.title}`);
    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating KPI metric:', error);
    return NextResponse.json({ error: 'Failed to create KPI metric' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = await prisma.dashboardKpiMetric.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Metric not found or access denied' }, { status: 404 });
    }

    const metric = await prisma.dashboardKpiMetric.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        value: Number(body.value) ?? existing.value,
        unit: body.unit,
        unitEn: body.unitEn,
        icon: body.icon ?? existing.icon,
        color: body.color ?? existing.color,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, metric.id, `Updated KPI metric: ${metric.title}`);
    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating KPI metric:', error);
    return NextResponse.json({ error: 'Failed to update KPI metric' }, { status: 500 });
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = await prisma.dashboardKpiMetric.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Metric not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardKpiMetric.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted KPI metric: ${existing.title}`);
    return NextResponse.json({ message: 'KPI metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting KPI metric:', error);
    return NextResponse.json({ error: 'Failed to delete KPI metric' }, { status: 500 });
  }
}

