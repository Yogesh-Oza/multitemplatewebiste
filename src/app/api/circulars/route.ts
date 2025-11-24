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

    const circulars = await prisma.circular.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(circulars);
  } catch (error) {
    console.error('Error fetching circulars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch circulars' },
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
      type, 
      department, 
      departmentEn, 
      number, 
      date, 
      priority, 
      status, 
      description, 
      descriptionEn, 
      content, 
      contentEn, 
      attachments, 
      issuedBy, 
      issuedByEn, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    const circular = await prisma.circular.create({
      data: {
        title,
        titleEn,
        type,
        department,
        departmentEn,
        number,
        date,
        priority: priority || 'medium',
        status: status || 'active',
        description,
        descriptionEn,
        content,
        contentEn,
        attachments: attachments || [],
        issuedBy,
        issuedByEn,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Circular', circular.id, `Created circular: ${title}`);

    return NextResponse.json(circular);
  } catch (error) {
    console.error('Error creating circular:', error);
    return NextResponse.json(
      { error: 'Failed to create circular' },
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
    const { 
      id, 
      title, 
      titleEn, 
      type, 
      department, 
      departmentEn, 
      number, 
      date, 
      priority, 
      status, 
      description, 
      descriptionEn, 
      content, 
      contentEn, 
      attachments, 
      issuedBy, 
      issuedByEn, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    // Verify the circular belongs to this subdomain
    const existingCircular = await prisma.circular.findFirst({
      where: { id, subdomainId }
    });

    if (!existingCircular) {
      return NextResponse.json({ 
        message: 'Circular not found or access denied' 
      }, { status: 404 });
    }

    const circular = await prisma.circular.update({
      where: { id },
      data: {
        title,
        titleEn,
        type,
        department,
        departmentEn,
        number,
        date,
        priority: priority !== undefined ? priority : existingCircular.priority,
        status: status !== undefined ? status : existingCircular.status,
        description,
        descriptionEn,
        content,
        contentEn,
        attachments: attachments !== undefined ? attachments : existingCircular.attachments,
        issuedBy,
        issuedByEn,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order !== undefined ? order : existingCircular.order,
        isActive: isActive !== undefined ? isActive : existingCircular.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Circular', circular.id, `Updated circular: ${title}`);

    return NextResponse.json(circular);
  } catch (error) {
    console.error('Error updating circular:', error);
    return NextResponse.json(
      { error: 'Failed to update circular' },
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

    // Verify the circular belongs to this subdomain
    const existingCircular = await prisma.circular.findFirst({
      where: { id, subdomainId }
    });

    if (!existingCircular) {
      return NextResponse.json({ 
        message: 'Circular not found or access denied' 
      }, { status: 404 });
    }

    await prisma.circular.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Circular', id, `Deleted circular: ${existingCircular.title}`);

    return NextResponse.json({ message: 'Circular deleted successfully' });
  } catch (error) {
    console.error('Error deleting circular:', error);
    return NextResponse.json(
      { error: 'Failed to delete circular' },
      { status: 500 }
    );
  }
}

