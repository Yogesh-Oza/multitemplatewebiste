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

    const facilities = await prisma.infrastructureFacility.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Error fetching infrastructure facilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch infrastructure facilities' },
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
      icon,
      description,
      descriptionEn,
      order = 0,
      isActive = true
    } = body;

    const facility = await prisma.infrastructureFacility.create({
      data: {
        title,
        titleEn,
        icon,
        description,
        descriptionEn,
        order,
        isActive,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'InfrastructureFacility',
      facility.id,
      `Created infrastructure facility: ${title}`
    );

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error creating infrastructure facility:', error);
    return NextResponse.json(
      { error: 'Failed to create infrastructure facility' },
      { status: 500 }
    );
  }
}

