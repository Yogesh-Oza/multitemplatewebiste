import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const metric = await prisma.smartVillageMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!metric) {
      return NextResponse.json(
        { message: 'Smart village metric not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error fetching smart village metric:', error);
    return NextResponse.json(
      { error: 'Failed to fetch smart village metric' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const existing = await prisma.smartVillageMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Smart village metric not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      type,
      status,
      statusEn,
      uptime = null,
      supplyHours = null,
      quality = null,
      usage = null,
      pressure = null,
      metadata = null,
      lastUpdated = null,
      order = 0,
      isActive = true
    } = body;

    const metric = await prisma.smartVillageMetric.update({
      where: { id },
      data: {
        title,
        titleEn,
        type,
        status,
        statusEn,
        uptime,
        supplyHours,
        quality,
        usage,
        pressure,
        metadata,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
        order,
        isActive
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'SmartVillageMetric',
      metric.id,
      `Updated smart village metric: ${title}`
    );

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating smart village metric:', error);
    return NextResponse.json(
      { error: 'Failed to update smart village metric' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const existing = await prisma.smartVillageMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Smart village metric not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.smartVillageMetric.delete({
      where: { id }
    });

    await logCrudActivity(
      request,
      'DELETE',
      'SmartVillageMetric',
      id,
      `Deleted smart village metric: ${existing.title}`
    );

    return NextResponse.json({ message: 'Smart village metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting smart village metric:', error);
    return NextResponse.json(
      { error: 'Failed to delete smart village metric' },
      { status: 500 }
    );
  }
}

