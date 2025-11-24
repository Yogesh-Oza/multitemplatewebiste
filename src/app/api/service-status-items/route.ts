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

    const services = await prisma.serviceStatusItem.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(services);
  } catch (error) {
    console.error('Error fetching service status items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service status items' },
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
      status,
      statusEn,
      uptime = null,
      responseTime = null,
      description = null,
      descriptionEn = null,
      lastUpdated = null,
      order = 0,
      isActive = true
    } = body;

    const service = await prisma.serviceStatusItem.create({
      data: {
        title,
        titleEn,
        status,
        statusEn,
        uptime,
        responseTime,
        description,
        descriptionEn,
        lastUpdated: lastUpdated ? new Date(lastUpdated) : null,
        order,
        isActive,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'ServiceStatusItem',
      service.id,
      `Created service status item: ${title}`
    );

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error creating service status item:', error);
    return NextResponse.json(
      { error: 'Failed to create service status item' },
      { status: 500 }
    );
  }
}

