import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardAchievement';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const achievements = await prisma.dashboardAchievement.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Error fetching dashboard achievements:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard achievements' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const achievement = await prisma.dashboardAchievement.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        impact: body.impact,
        impactEn: body.impactEn,
        category: body.category,
        categoryEn: body.categoryEn,
        year: body.year,
        icon: body.icon ?? 'Award',
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, achievement.id, `Created achievement: ${achievement.title}`);
    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error creating dashboard achievement:', error);
    return NextResponse.json({ error: 'Failed to create dashboard achievement' }, { status: 500 });
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

    const existing = await prisma.dashboardAchievement.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Achievement not found or access denied' }, { status: 404 });
    }

    const achievement = await prisma.dashboardAchievement.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        impact: body.impact,
        impactEn: body.impactEn,
        category: body.category,
        categoryEn: body.categoryEn,
        year: body.year,
        icon: body.icon ?? existing.icon,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, achievement.id, `Updated achievement: ${achievement.title}`);
    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error updating dashboard achievement:', error);
    return NextResponse.json({ error: 'Failed to update dashboard achievement' }, { status: 500 });
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

    const existing = await prisma.dashboardAchievement.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Achievement not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardAchievement.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted achievement: ${existing.title}`);
    return NextResponse.json({ message: 'Dashboard achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard achievement:', error);
    return NextResponse.json({ error: 'Failed to delete dashboard achievement' }, { status: 500 });
  }
}

