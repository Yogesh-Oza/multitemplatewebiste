import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  schoolsDemoData,
  SchoolData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  schools: schoolsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const schools = await prisma.school.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (schools.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      schools: schools.map(school => ({
        ...school,
        facilities: Array.isArray(school.facilities) ? school.facilities : [],
        facilitiesEn: Array.isArray(school.facilitiesEn) ? school.facilitiesEn : [],
        achievements: Array.isArray(school.achievements) ? school.achievements : [],
        achievementsEn: Array.isArray(school.achievementsEn) ? school.achievementsEn : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching schools:', error);
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
    const payload = body as SchoolData;

    const school = await prisma.school.create({
      data: {
        ...payload,
        subdomainId,
        facilities: payload.facilities || [],
        facilitiesEn: payload.facilitiesEn || [],
        achievements: payload.achievements || [],
        achievementsEn: payload.achievementsEn || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'School',
      school.id,
      `Created school ${school.name}`
    );

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json(
      { error: 'Failed to create school' },
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
    const payload = body as SchoolData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'School id is required' }, { status: 400 });
    }

    const existing = await prisma.school.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    const school = await prisma.school.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        facilities: payload.facilities || existing.facilities,
        facilitiesEn: payload.facilitiesEn || existing.facilitiesEn,
        achievements: payload.achievements || existing.achievements,
        achievementsEn: payload.achievementsEn || existing.achievementsEn
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'School',
      school.id,
      `Updated school ${school.name}`
    );

    return NextResponse.json(school);
  } catch (error) {
    console.error('Error updating school:', error);
    return NextResponse.json(
      { error: 'Failed to update school' },
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
      return NextResponse.json({ message: 'School id is required' }, { status: 400 });
    }

    const existing = await prisma.school.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'School not found' }, { status: 404 });
    }

    await prisma.school.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'School',
      id,
      `Deleted school ${existing.name}`
    );

    return NextResponse.json({ message: 'School deleted successfully' });
  } catch (error) {
    console.error('Error deleting school:', error);
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    );
  }
}

