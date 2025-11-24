import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  studentAchievementsDemoData,
  StudentAchievementData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  achievements: studentAchievementsDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const achievements = await prisma.studentAchievement.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (achievements.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      achievements,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching student achievements:', error);
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
    const payload = body as StudentAchievementData;

    const achievement = await prisma.studentAchievement.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'StudentAchievement',
      achievement.id,
      `Created student achievement ${achievement.name}`
    );

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error creating student achievement:', error);
    return NextResponse.json(
      { error: 'Failed to create student achievement' },
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
    const payload = body as StudentAchievementData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Achievement id is required' }, { status: 400 });
    }

    const existing = await prisma.studentAchievement.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Achievement not found' }, { status: 404 });
    }

    const achievement = await prisma.studentAchievement.update({
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
      'StudentAchievement',
      achievement.id,
      `Updated student achievement ${achievement.name}`
    );

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Error updating student achievement:', error);
    return NextResponse.json(
      { error: 'Failed to update student achievement' },
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
      return NextResponse.json({ message: 'Achievement id is required' }, { status: 400 });
    }

    const existing = await prisma.studentAchievement.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Achievement not found' }, { status: 404 });
    }

    await prisma.studentAchievement.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'StudentAchievement',
      id,
      `Deleted student achievement ${existing.name}`
    );

    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Error deleting student achievement:', error);
    return NextResponse.json(
      { error: 'Failed to delete student achievement' },
      { status: 500 }
    );
  }
}

