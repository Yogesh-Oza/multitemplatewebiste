import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardProgressIndicator';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const indicators = await prisma.dashboardProgressIndicator.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(indicators);
  } catch (error) {
    console.error('Error fetching progress indicators:', error);
    return NextResponse.json({ error: 'Failed to fetch progress indicators' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const indicator = await prisma.dashboardProgressIndicator.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        value: Number(body.value) || 0,
        unit: body.unit ?? '%',
        icon: body.icon ?? 'Activity',
        color: body.color ?? 'blue',
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, indicator.id, `Created progress indicator: ${indicator.title}`);
    return NextResponse.json(indicator);
  } catch (error) {
    console.error('Error creating progress indicator:', error);
    return NextResponse.json({ error: 'Failed to create progress indicator' }, { status: 500 });
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

    const existing = await prisma.dashboardProgressIndicator.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Indicator not found or access denied' }, { status: 404 });
    }

    const indicator = await prisma.dashboardProgressIndicator.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        value: Number(body.value) ?? existing.value,
        unit: body.unit ?? existing.unit,
        icon: body.icon ?? existing.icon,
        color: body.color ?? existing.color,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, indicator.id, `Updated progress indicator: ${indicator.title}`);
    return NextResponse.json(indicator);
  } catch (error) {
    console.error('Error updating progress indicator:', error);
    return NextResponse.json({ error: 'Failed to update progress indicator' }, { status: 500 });
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

    const existing = await prisma.dashboardProgressIndicator.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Indicator not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardProgressIndicator.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted progress indicator: ${existing.title}`);
    return NextResponse.json({ message: 'Progress indicator deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress indicator:', error);
    return NextResponse.json({ error: 'Failed to delete progress indicator' }, { status: 500 });
  }
}

