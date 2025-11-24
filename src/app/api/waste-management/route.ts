import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  wasteManagementProgramsDemoData,
  WasteManagementProgramData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  programs: wasteManagementProgramsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const programs = await prisma.wasteManagementProgram.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (programs.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      programs: programs.map(program => ({
        ...program,
        benefits: Array.isArray(program.benefits) ? program.benefits : [],
        benefitsEn: Array.isArray(program.benefitsEn) ? program.benefitsEn : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching waste management programs:', error);
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
    const payload = body as WasteManagementProgramData;

    const program = await prisma.wasteManagementProgram.create({
      data: {
        ...payload,
        subdomainId,
        benefits: payload.benefits || [],
        benefitsEn: payload.benefitsEn || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'WasteManagementProgram',
      program.id,
      `Created waste management program ${program.type}`
    );

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating waste management program:', error);
    return NextResponse.json(
      { error: 'Failed to create waste management program' },
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
    const payload = body as WasteManagementProgramData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Program id is required' }, { status: 400 });
    }

    const existing = await prisma.wasteManagementProgram.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    const program = await prisma.wasteManagementProgram.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        benefits: payload.benefits || existing.benefits,
        benefitsEn: payload.benefitsEn || existing.benefitsEn
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'WasteManagementProgram',
      program.id,
      `Updated waste management program ${program.type}`
    );

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating waste management program:', error);
    return NextResponse.json(
      { error: 'Failed to update waste management program' },
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

    const existing = await prisma.wasteManagementProgram.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Program not found' }, { status: 404 });
    }

    await prisma.wasteManagementProgram.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'WasteManagementProgram',
      id,
      `Deleted waste management program ${existing.type}`
    );

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting waste management program:', error);
    return NextResponse.json(
      { error: 'Failed to delete waste management program' },
      { status: 500 }
    );
  }
}

