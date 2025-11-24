import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  trainingProgramsDemoData,
  TrainingProgramData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  programs: trainingProgramsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const programs = await prisma.trainingProgram.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (programs.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      programs,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching training programs:', error);
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
    const payload = body as TrainingProgramData;

    const program = await prisma.trainingProgram.create({
      data: {
        ...payload,
        subdomainId,
        enrolled: payload.enrolled || 0
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'TrainingProgram',
      program.id,
      `Created training program ${program.title}`
    );

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating training program:', error);
    return NextResponse.json(
      { error: 'Failed to create training program' },
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
    const payload = body as TrainingProgramData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Program id is required' }, { status: 400 });
    }

    const existing = await prisma.trainingProgram.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    const program = await prisma.trainingProgram.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        enrolled: payload.enrolled ?? existing.enrolled
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'TrainingProgram',
      program.id,
      `Updated training program ${program.title}`
    );

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating training program:', error);
    return NextResponse.json(
      { error: 'Failed to update training program' },
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
      return NextResponse.json({ message: 'Program id is required' }, { status: 400 });
    }

    const existing = await prisma.trainingProgram.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    await prisma.trainingProgram.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'TrainingProgram',
      id,
      `Deleted training program ${existing.title}`
    );

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting training program:', error);
    return NextResponse.json(
      { error: 'Failed to delete training program' },
      { status: 500 }
    );
  }
}

