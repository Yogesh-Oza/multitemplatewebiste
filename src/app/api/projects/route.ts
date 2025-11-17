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
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    const whereClause: any = { 
      subdomainId,
      isActive: true 
    };

    if (status) {
      whereClause.status = status;
    }

    if (featured === 'true') {
      whereClause.isFeatured = true;
    }

    if (category) {
      whereClause.category = category;
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
      take: limit,
      skip: offset
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
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
      description, 
      descriptionEn, 
      startDate, 
      endDate, 
      status, 
      budget, 
      photosBefore, 
      photosAfter, 
      impactMetrics, 
      category, 
      categoryEn,
      isFeatured,
      order 
    } = body;

    const project = await prisma.project.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status: status || 'upcoming',
        budget: budget || null,
        photosBefore: photosBefore || [],
        photosAfter: photosAfter || [],
        impactMetrics: impactMetrics || [],
        category,
        categoryEn,
        isFeatured: isFeatured || false,
        order: order || 0,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Project', project.id, `Created project: ${title}`);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
