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

    const service = await prisma.serviceStatusItem.findFirst({
      where: { id, subdomainId }
    });

    if (!service) {
      return NextResponse.json(
        { message: 'Service status item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error fetching service status item:', error);
    return NextResponse.json(
      { error: 'Failed to fetch service status item' },
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

    const existing = await prisma.serviceStatusItem.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Service status item not found or access denied' },
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

    const service = await prisma.serviceStatusItem.update({
      where: { id },
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
        isActive
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'ServiceStatusItem',
      service.id,
      `Updated service status item: ${title}`
    );

    return NextResponse.json(service);
  } catch (error) {
    console.error('Error updating service status item:', error);
    return NextResponse.json(
      { error: 'Failed to update service status item' },
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

    const existing = await prisma.serviceStatusItem.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Service status item not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.serviceStatusItem.delete({
      where: { id }
    });

    await logCrudActivity(
      request,
      'DELETE',
      'ServiceStatusItem',
      id,
      `Deleted service status item: ${existing.title}`
    );

    return NextResponse.json({ message: 'Service status item deleted successfully' });
  } catch (error) {
    console.error('Error deleting service status item:', error);
    return NextResponse.json(
      { error: 'Failed to delete service status item' },
      { status: 500 }
    );
  }
}

