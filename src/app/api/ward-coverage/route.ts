import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  wardCoverageDemoData,
  WardCoverageDataData
} from '@/lib/demo-schemes-beneficiary';

const demoResponse = () => ({
  wards: wardCoverageDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const wards = await prisma.wardCoverageData.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (wards.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      wards: wards.map(w => ({
        ...w,
        schemes: Array.isArray(w.schemes) ? w.schemes : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching ward coverage data:', error);
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
    const payload = body as WardCoverageDataData;

    // Auto-calculate coverage percentage if not provided
    const coveragePercentage = payload.coveragePercentage || 
      (payload.totalHouseholds > 0 
        ? Math.round((payload.beneficiaries / payload.totalHouseholds) * 100) 
        : 0);

    const ward = await prisma.wardCoverageData.create({
      data: {
        ...payload,
        subdomainId,
        coveragePercentage,
        schemes: payload.schemes || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'WardCoverageData',
      ward.id,
      `Created ward coverage data for ${ward.wardName}`
    );

    return NextResponse.json(ward);
  } catch (error) {
    console.error('Error creating ward coverage data:', error);
    return NextResponse.json(
      { error: 'Failed to create ward coverage data' },
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
    const payload = body as WardCoverageDataData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Ward id is required' }, { status: 400 });
    }

    const existing = await prisma.wardCoverageData.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Ward not found' }, { status: 404 });
    }

    // Auto-calculate coverage percentage if beneficiaries or households changed
    const coveragePercentage = payload.coveragePercentage !== undefined
      ? payload.coveragePercentage
      : (payload.totalHouseholds > 0 
          ? Math.round((payload.beneficiaries / payload.totalHouseholds) * 100) 
          : existing.coveragePercentage);

    const ward = await prisma.wardCoverageData.update({
      where: { id: payload.id },
      data: {
        ...payload,
        coveragePercentage,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        schemes: payload.schemes || existing.schemes
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'WardCoverageData',
      ward.id,
      `Updated ward coverage data for ${ward.wardName}`
    );

    return NextResponse.json(ward);
  } catch (error) {
    console.error('Error updating ward coverage data:', error);
    return NextResponse.json(
      { error: 'Failed to update ward coverage data' },
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
      return NextResponse.json({ message: 'Ward id is required' }, { status: 400 });
    }

    const existing = await prisma.wardCoverageData.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Ward not found' }, { status: 404 });
    }

    await prisma.wardCoverageData.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'WardCoverageData',
      id,
      `Deleted ward coverage data for ${existing.wardName}`
    );

    return NextResponse.json({ message: 'Ward deleted successfully' });
  } catch (error) {
    console.error('Error deleting ward coverage data:', error);
    return NextResponse.json(
      { error: 'Failed to delete ward coverage data' },
      { status: 500 }
    );
  }
}

