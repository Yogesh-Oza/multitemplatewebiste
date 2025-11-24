import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const metrics = await prisma.impactDashboardMetric.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching impact dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch impact dashboard metrics' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, titleEn, value, target, unit, unitEn, color, icon, order, isActive } = body;

    const metric = await prisma.impactDashboardMetric.create({
      data: {
        title,
        titleEn,
        value,
        target,
        unit,
        unitEn,
        color,
        icon,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'ImpactDashboardMetric', metric.id, `Created impact dashboard metric: ${title}`);

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating impact dashboard metric:', error);
    return NextResponse.json(
      { error: 'Failed to create impact dashboard metric' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, titleEn, value, target, unit, unitEn, color, icon, order, isActive } = body;

    // Verify the metric belongs to this subdomain
    const existingMetric = await prisma.impactDashboardMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMetric) {
      return NextResponse.json({ 
        message: 'Metric not found or access denied' 
      }, { status: 404 });
    }

    const metric = await prisma.impactDashboardMetric.update({
      where: { id },
      data: {
        title,
        titleEn,
        value,
        target,
        unit,
        unitEn,
        color,
        icon,
        order: order !== undefined ? order : existingMetric.order,
        isActive: isActive !== undefined ? isActive : existingMetric.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'ImpactDashboardMetric', metric.id, `Updated impact dashboard metric: ${title}`);

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating impact dashboard metric:', error);
    return NextResponse.json(
      { error: 'Failed to update impact dashboard metric' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Verify the metric belongs to this subdomain
    const existingMetric = await prisma.impactDashboardMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMetric) {
      return NextResponse.json({ 
        message: 'Metric not found or access denied' 
      }, { status: 404 });
    }

    await prisma.impactDashboardMetric.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'ImpactDashboardMetric', id, `Deleted impact dashboard metric: ${existingMetric.title}`);

    return NextResponse.json({ message: 'Impact dashboard metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting impact dashboard metric:', error);
    return NextResponse.json(
      { error: 'Failed to delete impact dashboard metric' },
      { status: 500 }
    );
  }
}

