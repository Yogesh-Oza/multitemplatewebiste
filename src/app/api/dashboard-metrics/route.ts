import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    // For now, return static metrics
    // Later, these will be stored in DashboardMetric model
    const metrics = [
      {
        key: 'sanitation',
        label: 'स्वच्छता कव्हरेज',
        labelEn: 'Sanitation Coverage',
        value: 85,
        unit: '%',
        target: 100,
        icon: 'CheckCircle',
        color: 'green'
      },
      {
        key: 'electricity',
        label: 'वीजपुरवठा',
        labelEn: 'Electricity Supply',
        value: 92,
        unit: '%',
        target: 100,
        icon: 'Zap',
        color: 'yellow'
      },
      {
        key: 'water',
        label: 'पाणीपुरवठा',
        labelEn: 'Water Supply',
        value: 78,
        unit: '%',
        target: 100,
        icon: 'Droplets',
        color: 'blue'
      },
      {
        key: 'trees',
        label: 'वृक्षारोपण',
        labelEn: 'Tree Plantation',
        value: 1200,
        unit: 'झाडे',
        target: 2000,
        icon: 'TreePine',
        color: 'green'
      }
    ];

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}
