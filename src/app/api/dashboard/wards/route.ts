import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

const MODEL_NAME = 'DashboardWardComparison';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const wards = await prisma.dashboardWardComparison.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(wards);
  } catch (error) {
    console.error('Error fetching dashboard wards:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard wards' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const ward = await prisma.dashboardWardComparison.create({
      data: {
        name: body.name,
        nameEn: body.nameEn,
        population: Number(body.population) || 0,
        households: Number(body.households) || 0,
        sanitation: Number(body.sanitation) || 0,
        waterSupply: Number(body.waterSupply) || 0,
        electricity: Number(body.electricity) || 0,
        projects: Number(body.projects) || 0,
        complaints: Number(body.complaints) || 0,
        resolvedComplaints: Number(body.resolvedComplaints) || 0,
        order: body.order ?? 0,
        isActive: body.isActive ?? true,
        subdomainId,
      },
    });

    await logCrudActivity(request, 'CREATE', MODEL_NAME, ward.id, `Created ward record: ${ward.name}`);
    return NextResponse.json(ward);
  } catch (error) {
    console.error('Error creating dashboard ward:', error);
    return NextResponse.json({ error: 'Failed to create dashboard ward' }, { status: 500 });
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

    const existing = await prisma.dashboardWardComparison.findFirst({ where: { id: body.id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Ward record not found or access denied' }, { status: 404 });
    }

    const ward = await prisma.dashboardWardComparison.update({
      where: { id: body.id },
      data: {
        name: body.name,
        nameEn: body.nameEn,
        population: Number(body.population) ?? existing.population,
        households: Number(body.households) ?? existing.households,
        sanitation: Number(body.sanitation) ?? existing.sanitation,
        waterSupply: Number(body.waterSupply) ?? existing.waterSupply,
        electricity: Number(body.electricity) ?? existing.electricity,
        projects: Number(body.projects) ?? existing.projects,
        complaints: Number(body.complaints) ?? existing.complaints,
        resolvedComplaints: Number(body.resolvedComplaints) ?? existing.resolvedComplaints,
        order: body.order ?? existing.order,
        isActive: body.isActive ?? existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', MODEL_NAME, ward.id, `Updated ward record: ${ward.name}`);
    return NextResponse.json(ward);
  } catch (error) {
    console.error('Error updating dashboard ward:', error);
    return NextResponse.json({ error: 'Failed to update dashboard ward' }, { status: 500 });
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

    const existing = await prisma.dashboardWardComparison.findFirst({ where: { id, subdomainId } });
    if (!existing) {
      return NextResponse.json({ message: 'Ward record not found or access denied' }, { status: 404 });
    }

    await prisma.dashboardWardComparison.delete({ where: { id } });
    await logCrudActivity(request, 'DELETE', MODEL_NAME, id, `Deleted ward record: ${existing.name}`);
    return NextResponse.json({ message: 'Dashboard ward deleted successfully' });
  } catch (error) {
    console.error('Error deleting dashboard ward:', error);
    return NextResponse.json({ error: 'Failed to delete dashboard ward' }, { status: 500 });
  }
}

