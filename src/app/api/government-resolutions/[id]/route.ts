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

    const resolution = await prisma.governmentResolution.findFirst({
      where: { 
        id, 
        subdomainId,
        isActive: true 
      }
    });

    if (!resolution) {
      return NextResponse.json({ 
        message: 'Government resolution not found' 
      }, { status: 404 });
    }

    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error fetching government resolution:', error);
    return NextResponse.json(
      { error: 'Failed to fetch government resolution' },
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
      number, 
      date, 
      department, 
      departmentEn, 
      fileUrl, 
      category, 
      categoryEn,
      priority,
      priorityEn,
      description,
      descriptionEn,
      order,
      isActive
    } = body;

    // Verify the resolution belongs to this subdomain
    const existingResolution = await prisma.governmentResolution.findFirst({
      where: { id, subdomainId }
    });

    if (!existingResolution) {
      return NextResponse.json({ 
        message: 'Government resolution not found or access denied' 
      }, { status: 404 });
    }

    const resolution = await prisma.governmentResolution.update({
      where: { id },
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
        priority: priority || 'मध्यम',
        priorityEn: priorityEn || 'Medium',
        description: description || '',
        descriptionEn: descriptionEn || '',
        order: typeof order === 'number' ? order : existingResolution.order,
        isActive: typeof isActive === 'boolean' ? isActive : existingResolution.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'GovernmentResolution', resolution.id, `Updated government resolution: ${title}`);

    return NextResponse.json(resolution);
  } catch (error) {
    console.error('Error updating government resolution:', error);
    return NextResponse.json(
      { error: 'Failed to update government resolution' },
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

    // Verify the resolution belongs to this subdomain
    const existingResolution = await prisma.governmentResolution.findFirst({
      where: { id, subdomainId }
    });

    if (!existingResolution) {
      return NextResponse.json({ 
        message: 'Government resolution not found or access denied' 
      }, { status: 404 });
    }

    await prisma.governmentResolution.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'GovernmentResolution', id, `Deleted government resolution: ${existingResolution.title}`);

    return NextResponse.json({ message: 'Government resolution deleted successfully' });
  } catch (error) {
    console.error('Error deleting government resolution:', error);
    return NextResponse.json(
      { error: 'Failed to delete government resolution' },
      { status: 500 }
    );
  }
}
