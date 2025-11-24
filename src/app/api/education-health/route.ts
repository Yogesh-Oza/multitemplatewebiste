import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  educationHealthDemoSnapshot,
  educationHealthDemoFacilities,
  EducationHealthSnapshotData,
  EducationHealthFacilityData
} from '@/lib/demo-education-health';

const demoResponse = () => ({
  snapshot: educationHealthDemoSnapshot,
  facilities: educationHealthDemoFacilities,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const snapshot = await prisma.educationHealthSnapshot.findFirst({
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
      facilities: facilities.map(f => ({
        ...f,
        services: Array.isArray(f.services) ? f.services : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching education & health data:', error);
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
      payload: Partial<EducationHealthSnapshotData & EducationHealthFacilityData>;
    };

    if (type === 'snapshot') {
      const existing = await prisma.educationHealthSnapshot.findFirst({ where: { subdomainId } });
      let snapshot;

      if (existing) {
        snapshot = await prisma.educationHealthSnapshot.update({
          where: { id: existing.id },
          data: {
            ...payload,
            isActive: payload.isActive ?? existing.isActive
          }
        });

        await logCrudActivity(
          request,
          'UPDATE',
          'EducationHealthSnapshot',
          snapshot.id,
          `Updated education & health snapshot for subdomain ${subdomainId}`
        );
      } else {
        snapshot = await prisma.educationHealthSnapshot.create({
          data: {
            ...(payload as EducationHealthSnapshotData),
            subdomainId,
            isActive: payload.isActive ?? true
          }
        });

        await logCrudActivity(
          request,
          'CREATE',
          'EducationHealthSnapshot',
          snapshot.id,
          `Created education & health snapshot for subdomain ${subdomainId}`
        );
      }

      return NextResponse.json(snapshot);
    }

    if (type === 'facility') {
      const snapshot = await prisma.educationHealthSnapshot.findFirst({
        where: { subdomainId },
        select: { id: true }
      });

      const facility = await prisma.educationHealthFacility.create({
        data: {
          ...(payload as EducationHealthFacilityData),
          subdomainId,
          snapshotId: snapshot?.id ?? null,
          services: (payload as EducationHealthFacilityData).services || []
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'EducationHealthFacility',
        facility.id,
        `Created facility ${facility.title}`
      );

      return NextResponse.json(facility);
    }

    return NextResponse.json({ message: 'Invalid payload type' }, { status: 400 });
  } catch (error) {
    console.error('Error saving education & health data:', error);
    return NextResponse.json(
      { error: 'Failed to save education & health data' },
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
      payload: Partial<EducationHealthFacilityData> & { id: string };
    };

    if (type !== 'facility' || !payload?.id) {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const existing = await prisma.educationHealthFacility.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Facility not found' }, { status: 404 });
    }

    const facility = await prisma.educationHealthFacility.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        services: (payload as EducationHealthFacilityData).services || existing.services
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'EducationHealthFacility',
      facility.id,
      `Updated facility ${facility.title}`
    );

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating education & health facility:', error);
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

    const existing = await prisma.educationHealthFacility.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Facility not found' }, { status: 404 });
    }

    await prisma.educationHealthFacility.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'EducationHealthFacility',
      id,
      `Deleted facility ${existing.title}`
    );

    return NextResponse.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting education & health facility:', error);
    return NextResponse.json(
      { error: 'Failed to delete facility' },
      { status: 500 }
    );
  }
}

