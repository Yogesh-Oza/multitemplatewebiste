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

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause: any = { 
      subdomainId,
      isActive: true 
    };

    if (category) {
      whereClause.category = category;
    }

    const resolutions = await prisma.governmentResolution.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json(resolutions);
  } catch (error) {
    console.error('Error fetching government resolutions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch government resolutions' },
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
    const { 
      title, 
      titleEn, 
      number, 
      date, 
      department, 
      departmentEn, 
      fileUrl, 
      category, 
      categoryEn,
      order 
    } = body;

    const resolution = await prisma.governmentResolution.create({
      data: {
        title,
        titleEn,
        number,
        date: new Date(date),
        department,
        departmentEn,
        fileUrl,
        category,
        categoryEn,
        order: order || 0,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'GovernmentResolution', resolution.id, `Created government resolution: ${title}`);

    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error creating government resolution:', error);
    return NextResponse.json(
      { error: 'Failed to create government resolution' },
      { status: 500 }
    );
  }
}
