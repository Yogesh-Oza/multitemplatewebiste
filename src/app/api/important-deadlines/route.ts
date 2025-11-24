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

    const deadlines = await prisma.importantDeadline.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(deadlines);
  } catch (error) {
    console.error('Error fetching important deadlines:', error);
    return NextResponse.json(
      { error: 'Failed to fetch important deadlines' },
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
      deadline, 
      time, 
      description, 
      descriptionEn, 
      instructions, 
      instructionsEn, 
      documents, 
      contactInfo, 
      priority, 
      status, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    const deadlineItem = await prisma.importantDeadline.create({
      data: {
        title,
        titleEn,
        type,
        deadline,
        time,
        description,
        descriptionEn,
        instructions: instructions || [],
        instructionsEn: instructionsEn || [],
        documents: documents || [],
        contactInfo: contactInfo || {},
        priority: priority || 'medium',
        status: status || 'upcoming',
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'ImportantDeadline', deadlineItem.id, `Created important deadline: ${title}`);

    return NextResponse.json(deadlineItem);
  } catch (error) {
    console.error('Error creating important deadline:', error);
    return NextResponse.json(
      { error: 'Failed to create important deadline' },
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
      deadline, 
      time, 
      description, 
      descriptionEn, 
      instructions, 
      instructionsEn, 
      documents, 
      contactInfo, 
      priority, 
      status, 
      lastUpdated, 
      order, 
      isActive 
    } = body;

    // Verify the deadline belongs to this subdomain
    const existingDeadline = await prisma.importantDeadline.findFirst({
      where: { id, subdomainId }
    });

    if (!existingDeadline) {
      return NextResponse.json({ 
        message: 'Important deadline not found or access denied' 
      }, { status: 404 });
    }

    const deadlineItem = await prisma.importantDeadline.update({
      where: { id },
      data: {
        title,
        titleEn,
        type,
        deadline,
        time,
        description,
        descriptionEn,
        instructions: instructions !== undefined ? instructions : existingDeadline.instructions,
        instructionsEn: instructionsEn !== undefined ? instructionsEn : existingDeadline.instructionsEn,
        documents: documents !== undefined ? documents : existingDeadline.documents,
        contactInfo: contactInfo !== undefined ? contactInfo : existingDeadline.contactInfo,
        priority: priority !== undefined ? priority : existingDeadline.priority,
        status: status !== undefined ? status : existingDeadline.status,
        lastUpdated: lastUpdated || new Date().toISOString(),
        order: order !== undefined ? order : existingDeadline.order,
        isActive: isActive !== undefined ? isActive : existingDeadline.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'ImportantDeadline', deadlineItem.id, `Updated important deadline: ${title}`);

    return NextResponse.json(deadlineItem);
  } catch (error) {
    console.error('Error updating important deadline:', error);
    return NextResponse.json(
      { error: 'Failed to update important deadline' },
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

    // Verify the deadline belongs to this subdomain
    const existingDeadline = await prisma.importantDeadline.findFirst({
      where: { id, subdomainId }
    });

    if (!existingDeadline) {
      return NextResponse.json({ 
        message: 'Important deadline not found or access denied' 
      }, { status: 404 });
    }

    await prisma.importantDeadline.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'ImportantDeadline', id, `Deleted important deadline: ${existingDeadline.title}`);

    return NextResponse.json({ message: 'Important deadline deleted successfully' });
  } catch (error) {
    console.error('Error deleting important deadline:', error);
    return NextResponse.json(
      { error: 'Failed to delete important deadline' },
      { status: 500 }
    );
  }
}

