import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  scholarshipSchemesDemoData,
  ScholarshipSchemeData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  schemes: scholarshipSchemesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const schemes = await prisma.scholarshipScheme.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (schemes.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      schemes,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching scholarship schemes:', error);
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
    const payload = body as ScholarshipSchemeData;

    const scheme = await prisma.scholarshipScheme.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'ScholarshipScheme',
      scheme.id,
      `Created scholarship scheme ${scheme.name}`
    );

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Error creating scholarship scheme:', error);
    return NextResponse.json(
      { error: 'Failed to create scholarship scheme' },
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
    const payload = body as ScholarshipSchemeData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Scheme id is required' }, { status: 400 });
    }

    const existing = await prisma.scholarshipScheme.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Scheme not found' }, { status: 404 });
    }

    const scheme = await prisma.scholarshipScheme.update({
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
      'ScholarshipScheme',
      scheme.id,
      `Updated scholarship scheme ${scheme.name}`
    );

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Error updating scholarship scheme:', error);
    return NextResponse.json(
      { error: 'Failed to update scholarship scheme' },
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
      return NextResponse.json({ message: 'Scheme id is required' }, { status: 400 });
    }

    const existing = await prisma.scholarshipScheme.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Scheme not found' }, { status: 404 });
    }

    await prisma.scholarshipScheme.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'ScholarshipScheme',
      id,
      `Deleted scholarship scheme ${existing.name}`
    );

    return NextResponse.json({ message: 'Scheme deleted successfully' });
  } catch (error) {
    console.error('Error deleting scholarship scheme:', error);
    return NextResponse.json(
      { error: 'Failed to delete scholarship scheme' },
      { status: 500 }
    );
  }
}

