import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { logCrudActivity } from '@/lib/activity-log-helper';
import { prisma } from '@/lib/prisma';
import { coerceBreakdownArray } from '@/lib/demo-dashboard-data';
import { validateSubdomain } from '@/lib/subdomain';
import type { DashboardContentStatBreakdown } from '@/types/dashboard';

const MODEL_NAME = 'DashboardContentStat';

const toJsonBreakdown = (data?: DashboardContentStatBreakdown[]) =>
  JSON.parse(JSON.stringify(data ?? [])) as Prisma.JsonArray;

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const stats = await prisma.dashboardContentStat.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard content stats:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard content stats' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const breakdown = coerceBreakdownArray(body.breakdown);

    const stat = await prisma.dashboardContentStat.create({
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        value: Number(body.value) || 0,
        unit: body.unit,
        icon: body.icon,
        color: body.color ?? 'blue',
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        breakdown: toJsonBreakdown(breakdown),
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, stat.id, `Created dashboard stat: ${stat.title}`);
    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error creating dashboard content stat:', error);
    return NextResponse.json({ error: 'Failed to create dashboard content stat' }, { status: 500 });
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

    const existing = await prisma.dashboardContentStat.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Stat not found or access denied' }, { status: 404 });
    }

    const breakdown = body.breakdown !== undefined ? coerceBreakdownArray(body.breakdown) : undefined;

    const stat = await prisma.dashboardContentStat.update({
      where: { id: body.id },
      data: {
        title: body.title,
        titleEn: body.titleEn,
        description: body.description,
        descriptionEn: body.descriptionEn,
        value: Number(body.value) ?? existing.value,
        unit: body.unit,
        icon: body.icon,
        color: body.color ?? existing.color,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
        breakdown: breakdown !== undefined ? toJsonBreakdown(breakdown) : existing.breakdown,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, stat.id, `Updated dashboard stat: ${stat.title}`);
    return NextResponse.json(stat);
  } catch (error) {
    console.error('Error updating dashboard content stat:', error);
    return NextResponse.json({ error: 'Failed to update dashboard content stat' }, { status: 500 });
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

    const existing = await prisma.dashboardContentStat.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Stat not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardContentStat.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted dashboard stat: ${existing.title}`);
    return NextResponse.json({ message: 'Dashboard content stat deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard content stat:', error);
    return NextResponse.json({ error: 'Failed to delete dashboard content stat' }, { status: 500 });
  }
}

