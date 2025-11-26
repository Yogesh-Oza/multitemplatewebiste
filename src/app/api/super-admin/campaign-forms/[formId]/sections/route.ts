import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/auth-helpers';

// PATCH /api/super-admin/campaign-forms/[formId]/sections - Update multiple section orders
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { formId } = await params;
    
    // Check if request has body
    const contentLength = request.headers.get('content-length');
    if (!contentLength || contentLength === '0') {
      return NextResponse.json(
        { error: 'Request body is required' },
        { status: 400 }
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { orders } = body;

    if (!orders || !Array.isArray(orders)) {
      return NextResponse.json(
        { error: 'Invalid orders data - expected array of {id, order} objects' },
        { status: 400 }
      );
    }

    // Validate each order object
    for (const orderData of orders) {
      if (!orderData.id || typeof orderData.order !== 'number') {
        return NextResponse.json(
          { error: 'Invalid order data - each item must have id and order' },
          { status: 400 }
        );
      }
    }

    // Update each section's order
    for (const orderData of orders) {
      await prisma.formSection.update({
        where: { id: orderData.id },
        data: { order: orderData.order }
      });
    }

    return NextResponse.json({ message: 'Section orders updated successfully' });
  } catch (error) {
    console.error('Error updating section orders:', error);
    return NextResponse.json(
      { error: 'Failed to update section orders' },
      { status: 500 }
    );
  }
}

// GET /api/super-admin/campaign-forms/[formId]/sections - Get sections for a form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { formId } = await params;

    const sections = await prisma.formSection.findMany({
      where: { campaignFormId: formId },
      include: {
        items: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(sections);
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// POST /api/super-admin/campaign-forms/[formId]/sections - Create new section
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { formId } = await params;
    const body = await request.json();
    const {
      sectionId,
      title,
      titleEn,
      description,
      maxMarks = 0,
      isActive = true,
      isRequired = true,
      parentSectionId
    } = body;

    // Validate required fields
    if (!title || !titleEn || !sectionId) {
      return NextResponse.json(
        { error: 'Title, TitleEn, and SectionId are required' },
        { status: 400 }
      );
    }

    // Get the next order value
    const lastSection = await prisma.formSection.findFirst({
      where: { campaignFormId: formId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastSection?.order || 0) + 1;

    const section = await prisma.formSection.create({
      data: {
        campaignFormId: formId,
        sectionId,
        title,
        titleEn,
        description,
        maxMarks,
        isActive,
        isRequired,
        parentSectionId,
        order: nextOrder
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}
