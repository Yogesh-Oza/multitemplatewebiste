import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/super-admin/campaign-forms/[formId]/items/[itemId] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;
    const body = await request.json();
    const {
      fieldName,
      fieldNameEn,
      description,
      actionType,
      targets,
      unit,
      maxMarks,
      isActive,
      isEditable,
      order
    } = body;

    const item = await prisma.formItem.update({
      where: { id: itemId },
      data: {
        ...(fieldName && { fieldName }),
        ...(fieldNameEn && { fieldNameEn }),
        ...(description !== undefined && { description }),
        ...(actionType !== undefined && { actionType }),
        ...(targets && { targets }),
        ...(unit !== undefined && { unit }),
        ...(maxMarks !== undefined && { maxMarks }),
        ...(isActive !== undefined && { isActive }),
        ...(isEditable !== undefined && { isEditable }),
        ...(order !== undefined && { order })
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

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE /api/super-admin/campaign-forms/[formId]/items/[itemId] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; itemId: string }> }
) {
  try {
    const { itemId } = await params;


    await prisma.formItem.delete({
      where: { id: itemId }
    });

    return NextResponse.json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error('Error deleting item:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
