import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  jobOpportunitiesDemoData,
  JobOpportunityData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  jobs: jobOpportunitiesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const jobs = await prisma.jobOpportunity.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (jobs.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      jobs: jobs.map(job => ({
        ...job,
        requirements: Array.isArray(job.requirements) ? job.requirements : [],
        requirementsEn: Array.isArray(job.requirementsEn) ? job.requirementsEn : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching job opportunities:', error);
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
    const payload = body as JobOpportunityData;

    const job = await prisma.jobOpportunity.create({
      data: {
        ...payload,
        subdomainId,
        requirements: payload.requirements || [],
        requirementsEn: payload.requirementsEn || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'JobOpportunity',
      job.id,
      `Created job opportunity ${job.title}`
    );

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to create job opportunity' },
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
    const payload = body as JobOpportunityData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Job id is required' }, { status: 400 });
    }

    const existing = await prisma.jobOpportunity.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    const job = await prisma.jobOpportunity.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        requirements: payload.requirements || existing.requirements,
        requirementsEn: payload.requirementsEn || existing.requirementsEn
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'JobOpportunity',
      job.id,
      `Updated job opportunity ${job.title}`
    );

    return NextResponse.json(job);
  } catch (error) {
    console.error('Error updating job opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to update job opportunity' },
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
      return NextResponse.json({ message: 'Job id is required' }, { status: 400 });
    }

    const existing = await prisma.jobOpportunity.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    await prisma.jobOpportunity.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'JobOpportunity',
      id,
      `Deleted job opportunity ${existing.title}`
    );

    return NextResponse.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job opportunity:', error);
    return NextResponse.json(
      { error: 'Failed to delete job opportunity' },
      { status: 500 }
    );
  }
}

