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

    const facility = await prisma.infrastructureFacility.findFirst({
      where: { id, subdomainId }
    });

    if (!facility) {
      return NextResponse.json(
        { message: 'Infrastructure facility not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error fetching infrastructure facility:', error);
    return NextResponse.json(
      { error: 'Failed to fetch infrastructure facility' },
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

    const existing = await prisma.infrastructureFacility.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Infrastructure facility not found or access denied' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      icon,
      description,
      descriptionEn,
      order = 0,
      isActive = true
    } = body;

    const facility = await prisma.infrastructureFacility.update({
      where: { id },
      data: {
        title,
        titleEn,
        icon,
        description,
        descriptionEn,
        order,
        isActive
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'InfrastructureFacility',
      facility.id,
      `Updated infrastructure facility: ${title}`
    );

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating infrastructure facility:', error);
    return NextResponse.json(
      { error: 'Failed to update infrastructure facility' },
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

    const existing = await prisma.infrastructureFacility.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json(
        { message: 'Infrastructure facility not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.infrastructureFacility.delete({
      where: { id }
    });

    await logCrudActivity(
      request,
      'DELETE',
      'InfrastructureFacility',
      id,
      `Deleted infrastructure facility: ${existing.title}`
    );

    return NextResponse.json({ message: 'Infrastructure facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting infrastructure facility:', error);
    return NextResponse.json(
      { error: 'Failed to delete infrastructure facility' },
      { status: 500 }
    );
  }
}

