import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: { 
        id, 
        subdomainId 
      }
    });

    if (!project) {
      return NextResponse.json({ 
        message: 'Project not found' 
      }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Verify the project belongs to this subdomain
    const existingProject = await prisma.project.findFirst({
      where: { id, subdomainId }
    });

    if (!existingProject) {
      return NextResponse.json({ 
        message: 'Project not found or access denied' 
      }, { status: 404 });
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        status,
        budget,
        photosBefore: photosBefore || [],
        photosAfter: photosAfter || [],
        impactMetrics: impactMetrics || [],
        category,
        categoryEn,
        isFeatured,
        order: order || 0,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Project', project.id, `Updated project: ${title}`);

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    // Verify the project belongs to this subdomain
    const existingProject = await prisma.project.findFirst({
      where: { id, subdomainId }
    });

    if (!existingProject) {
      return NextResponse.json({ 
        message: 'Project not found or access denied' 
      }, { status: 404 });
    }

    await prisma.project.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Project', id, `Deleted project: ${existingProject.title}`);

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
