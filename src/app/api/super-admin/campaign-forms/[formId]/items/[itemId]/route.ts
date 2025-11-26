import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin, canDelete } from '@/lib/auth-helpers';

// PUT /api/super-admin/campaign-forms/[formId]/items/[itemId] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; itemId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
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
      order,
      itemType
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
        ...(order !== undefined && { order }),
        ...(itemType !== undefined && { itemType })
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
    // Check if user can delete (only full super_admin, not super_admin_viewer)
    const session = await getServerSession(authOptions);
    
    if (!canDelete(session)) {
      return NextResponse.json({ error: 'Unauthorized: Delete operations are restricted to super admin only' }, { status: 403 });
    }

    const { itemId } = await params;

    // First, delete all related FormItemValue records
    await prisma.formItemValue.deleteMany({
      where: { itemId }
    });

    // Then delete the FormItem
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
