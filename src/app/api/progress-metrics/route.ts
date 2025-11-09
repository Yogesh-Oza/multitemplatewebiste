import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

// Default progress metrics
const defaultMetrics = [
  {
    key: 'sanitation',
    label: 'स्वच्छता कव्हरेज',
    labelEn: 'Sanitation Coverage',
    value: 85,
    unit: '%',
    target: 100,
    icon: 'CheckCircle',
    color: 'green',
    order: 0,
    isActive: true,
  },
  {
    key: 'electricity',
    label: 'वीजपुरवठा',
    labelEn: 'Electricity Supply',
    value: 92,
    unit: '%',
    target: 100,
    icon: 'Zap',
    color: 'yellow',
    order: 1,
    isActive: true,
  },
  {
    key: 'water',
    label: 'पाणीपुरवठा',
    labelEn: 'Water Supply',
    value: 78,
    unit: '%',
    target: 100,
    icon: 'Droplets',
    color: 'blue',
    order: 2,
    isActive: true,
  },
  {
    key: 'trees',
    label: 'वृक्षारोपण',
    labelEn: 'Tree Plantation',
    value: 1200,
    unit: 'झाडे',
    target: 2000,
    icon: 'TreePine',
    color: 'green',
    order: 3,
    isActive: true,
  },
];

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    let metrics = await prisma.progressMetric.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    // If no metrics exist, create default ones
    if (metrics.length === 0 && subdomainId) {
      try {
        await prisma.progressMetric.createMany({
          data: defaultMetrics.map(metric => ({
            ...metric,
            subdomainId: subdomainId,
          })),
        });

        metrics = await prisma.progressMetric.findMany({
          where: { subdomainId },
          orderBy: { order: 'asc' }
        });
      } catch (error) {
        console.error('Error creating default metrics:', error);
        return NextResponse.json(defaultMetrics);
      }
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching progress metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch progress metrics' },
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
    const { key, label, labelEn, value, unit, target, icon, color, order, isActive } = body;

    const metric = await prisma.progressMetric.create({
      data: {
        key,
        label,
        labelEn,
        value,
        unit,
        target,
        icon,
        color,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error creating progress metric:', error);
    return NextResponse.json(
      { error: 'Failed to create progress metric' },
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
    const { id, key, label, labelEn, value, unit, target, icon, color, order, isActive } = body;

    const existingMetric = await prisma.progressMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!existingMetric) {
      return NextResponse.json({ 
        message: 'Metric not found or access denied' 
      }, { status: 404 });
    }

    const metric = await prisma.progressMetric.update({
      where: { id },
      data: {
        key,
        label,
        labelEn,
        value,
        unit,
        target,
        icon,
        color,
        order: order !== undefined ? order : existingMetric.order,
        isActive: isActive !== undefined ? isActive : existingMetric.isActive,
      },
    });

    return NextResponse.json(metric);
  } catch (error) {
    console.error('Error updating progress metric:', error);
    return NextResponse.json(
      { error: 'Failed to update progress metric' },
      { status: 500 }
    );
  }
}

