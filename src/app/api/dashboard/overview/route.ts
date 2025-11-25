import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardOverview';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const overview = await prisma.dashboardOverview.findFirst({
      where: { subdomainId },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard overview' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const overview = await prisma.dashboardOverview.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        subtitle: body.subtitle,
        subtitleEn: body.subtitleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        highlightText: body.highlightText,
        highlightTextEn: body.highlightTextEn,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, overview.id, `Created dashboard overview: ${overview.title}`);

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error creating dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to create dashboard overview' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const existing = await prisma.dashboardOverview.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Overview not found or access denied' }, { status: 404 });
    }

    const overview = await prisma.dashboardOverview.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        subtitle: body.subtitle,
        subtitleEn: body.subtitleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        highlightText: body.highlightText,
        highlightTextEn: body.highlightTextEn,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, overview.id, `Updated dashboard overview: ${overview.title}`);

    return NextResponse.json(overview);
  } catch (error) {
    console.error('Error updating dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to update dashboard overview' }, { status: 500 });
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
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const overview = await prisma.dashboardOverview.findFirst({ where: { id, subdomainId } });
    if (!overview) {
      return NextResponse.json({ message: 'Overview not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardOverview.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted dashboard overview: ${overview.title}`);

    return NextResponse.json({ message: 'Dashboard overview deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard overview:', error);
    return NextResponse.json({ error: 'Failed to delete dashboard overview' }, { status: 500 });
  }
}

