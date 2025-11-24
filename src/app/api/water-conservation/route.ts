import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  waterConservationProjectsDemoData,
  WaterConservationProjectData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  projects: waterConservationProjectsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const projects = await prisma.waterConservationProject.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (projects.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      projects,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching water conservation projects:', error);
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
    const payload = body as WaterConservationProjectData;

    const project = await prisma.waterConservationProject.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'WaterConservationProject',
      project.id,
      `Created water conservation project ${project.project}`
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating water conservation project:', error);
    return NextResponse.json(
      { error: 'Failed to create water conservation project' },
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
    const payload = body as WaterConservationProjectData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Project id is required' }, { status: 400 });
    }

    const existing = await prisma.waterConservationProject.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    const project = await prisma.waterConservationProject.update({
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
      'WaterConservationProject',
      project.id,
      `Updated water conservation project ${project.project}`
    );

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating water conservation project:', error);
    return NextResponse.json(
      { error: 'Failed to update water conservation project' },
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
      return NextResponse.json({ message: 'Project id is required' }, { status: 400 });
    }

    const existing = await prisma.waterConservationProject.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Project not found' }, { status: 404 });
    }

    await prisma.waterConservationProject.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'WaterConservationProject',
      id,
      `Deleted water conservation project ${existing.project}`
    );

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting water conservation project:', error);
    return NextResponse.json(
      { error: 'Failed to delete water conservation project' },
      { status: 500 }
    );
  }
}

