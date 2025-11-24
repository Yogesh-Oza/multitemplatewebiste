import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  waterSanitationDemoSnapshot,
  waterSanitationDemoFacilities,
  WaterSanitationSnapshotData,
  WaterSanitationFacilityData
} from '@/lib/demo-water-sanitation';

const demoResponse = () => ({
  snapshot: waterSanitationDemoSnapshot,
  facilities: waterSanitationDemoFacilities,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const snapshot = await prisma.waterSanitationSnapshot.findFirst({
      where: { subdomainId, isActive: true },
      include: {
        facilities: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      }
    });

    if (!snapshot) {
      return NextResponse.json(demoResponse());
    }

    const { facilities, ...snapshotData } = snapshot;

    return NextResponse.json({
      snapshot: snapshotData,
      facilities,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching water & sanitation data:', error);
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
    const { type, payload } = body as {
      type: 'snapshot' | 'facility';
      payload: Partial<WaterSanitationSnapshotData & WaterSanitationFacilityData>;
    };

    if (type === 'snapshot') {
      const existing = await prisma.waterSanitationSnapshot.findFirst({ where: { subdomainId } });
      let snapshot;

      if (existing) {
        snapshot = await prisma.waterSanitationSnapshot.update({
          where: { id: existing.id },
          data: {
            ...payload,
            isActive: payload.isActive ?? existing.isActive
          }
        });

        await logCrudActivity(
          request,
          'UPDATE',
          'WaterSanitationSnapshot',
          snapshot.id,
          `Updated water & sanitation snapshot for subdomain ${subdomainId}`
        );
      } else {
        snapshot = await prisma.waterSanitationSnapshot.create({
          data: {
            ...(payload as WaterSanitationSnapshotData),
            subdomainId,
            isActive: payload.isActive ?? true
          }
        });

        await logCrudActivity(
          request,
          'CREATE',
          'WaterSanitationSnapshot',
          snapshot.id,
          `Created water & sanitation snapshot for subdomain ${subdomainId}`
        );
      }

      return NextResponse.json(snapshot);
    }

    if (type === 'facility') {
      const snapshot = await prisma.waterSanitationSnapshot.findFirst({
        where: { subdomainId },
        select: { id: true }
      });

      const facility = await prisma.waterSanitationFacility.create({
        data: {
          ...(payload as WaterSanitationFacilityData),
          subdomainId,
          snapshotId: snapshot?.id ?? null
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'WaterSanitationFacility',
        facility.id,
        `Created facility ${facility.title}`
      );

      return NextResponse.json(facility);
    }

    return NextResponse.json({ message: 'Invalid payload type' }, { status: 400 });
  } catch (error) {
    console.error('Error saving water & sanitation data:', error);
    return NextResponse.json(
      { error: 'Failed to save water & sanitation data' },
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
    const { type, payload } = body as {
      type: 'facility';
      payload: Partial<WaterSanitationFacilityData> & { id: string };
    };

    if (type !== 'facility' || !payload?.id) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const existing = await prisma.waterSanitationFacility.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Facility not found' }, { status: 404 });
    }

    const facility = await prisma.waterSanitationFacility.update({
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
      'WaterSanitationFacility',
      facility.id,
      `Updated facility ${facility.title}`
    );

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating water & sanitation facility:', error);
    return NextResponse.json(
      { error: 'Failed to update facility' },
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
      return NextResponse.json({ message: 'Facility id is required' }, { status: 400 });
    }

    const existing = await prisma.waterSanitationFacility.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Facility not found' }, { status: 404 });
    }

    await prisma.waterSanitationFacility.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'WaterSanitationFacility',
      id,
      `Deleted facility ${existing.title}`
    );

    return NextResponse.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting water & sanitation facility:', error);
    return NextResponse.json(
      { error: 'Failed to delete facility' },
      { status: 500 }
    );
  }
}

