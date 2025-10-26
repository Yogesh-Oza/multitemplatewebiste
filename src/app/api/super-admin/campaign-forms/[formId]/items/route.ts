import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/super-admin/campaign-forms/[formId]/items - Update multiple item orders
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
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

    // Update each item's order
    for (const orderData of orders) {
      await prisma.formItem.update({
        where: { id: orderData.id },
        data: { order: orderData.order }
      });
    }

    return NextResponse.json({ message: 'Item orders updated successfully' });
  } catch (error) {
    console.error('Error updating item orders:', error);
    return NextResponse.json(
      { error: 'Failed to update item orders' },
      { status: 500 }
    );
  }
}

// GET /api/super-admin/campaign-forms/[formId]/items - Get items for a form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    const where: any = {
      section: {
        campaignFormId: formId
      }
    };

    if (sectionId) {
      where.sectionId = sectionId;
    }

    const items = await prisma.formItem.findMany({
      where,
      include: {
        section: {
          select: {
            id: true,
            title: true,
            titleEn: true,
            sectionId: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

// POST /api/super-admin/campaign-forms/[formId]/items - Create new item
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    const { formId } = await params;
    const body = await request.json();
    const {
      sectionId,
      itemId,
      itemType = 'simple',
      fieldName,
      fieldNameEn,
      description,
      actionType,
      targets,
      unit,
      maxMarks = 0,
      isActive = true,
      isEditable = true
    } = body;

    // Validate required fields
    if (!sectionId || !itemId || !fieldName || !fieldNameEn) {
      return NextResponse.json(
        { error: 'SectionId, ItemId, FieldName, and FieldNameEn are required' },
        { status: 400 }
      );
    }

    // Verify section belongs to this form
    const section = await prisma.formSection.findFirst({
      where: {
        id: sectionId,
        campaignFormId: formId
      }
    });

    if (!section) {
      return NextResponse.json(
        { error: 'Section not found or does not belong to this form' },
        { status: 404 }
      );
    }

    // Get the next order value
    const lastItem = await prisma.formItem.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastItem?.order || 0) + 1;

    const item = await prisma.formItem.create({
      data: {
        sectionId,
        itemId,
        itemType,
        fieldName,
        fieldNameEn,
        description,
        actionType,
        targets: targets || {},
        unit,
        maxMarks,
        isActive,
        isEditable,
        order: nextOrder
      },
      include: {
        section: {
          select: {
            id: true,
            title: true,
            titleEn: true,
            sectionId: true
          }
        }
      }
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
