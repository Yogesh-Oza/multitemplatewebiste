import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardRecentActivity';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const activities = await prisma.dashboardRecentActivity.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching dashboard activities:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const activity = await prisma.dashboardRecentActivity.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        activityDate: body.activityDate ? new Date(body.activityDate) : new Date(),
        icon: body.icon ?? 'Activity',
        color: body.color ?? 'green',
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, activity.id, `Created activity: ${activity.title}`);
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error creating dashboard activity:', error);
    return NextResponse.json({ error: 'Failed to create dashboard activity' }, { status: 500 });
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

    const existing = await prisma.dashboardRecentActivity.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Activity not found or access denied' }, { status: 404 });
    }

    const activity = await prisma.dashboardRecentActivity.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        activityDate: body.activityDate ? new Date(body.activityDate) : existing.activityDate,
        icon: body.icon ?? existing.icon,
        color: body.color ?? existing.color,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, activity.id, `Updated activity: ${activity.title}`);
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error updating dashboard activity:', error);
    return NextResponse.json({ error: 'Failed to update dashboard activity' }, { status: 500 });
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

    const existing = await prisma.dashboardRecentActivity.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Activity not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardRecentActivity.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted activity: ${existing.title}`);
    return NextResponse.json({ message: 'Dashboard activity deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard activity:', error);
    return NextResponse.json({ error: 'Failed to delete dashboard activity' }, { status: 500 });
  }
}

