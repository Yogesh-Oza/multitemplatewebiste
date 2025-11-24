import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const metrics = await prisma.smartVillageMetric.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching smart village metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch smart village metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
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

    const metric = await prisma.smartVillageMetric.create({
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
        isActive,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'SmartVillageMetric',
      metric.id,
      `Created smart village metric: ${title}`
    );

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating smart village metric:', error);
    return NextResponse.json(
      { error: 'Failed to create smart village metric' },
      { status: 500 }
    );
  }
}

