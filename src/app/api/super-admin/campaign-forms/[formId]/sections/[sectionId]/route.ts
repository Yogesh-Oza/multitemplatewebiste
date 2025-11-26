import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin, canDelete } from '@/lib/auth-helpers';

// PUT /api/super-admin/campaign-forms/[formId]/sections/[sectionId] - Update section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; sectionId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { sectionId } = await params;
    const body = await request.json();
    const {
      title,
      description,
      maxMarks,
      isActive,
      isRequired,
      order
    } = body;

    const section = await prisma.formSection.update({
      where: { id: sectionId },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(maxMarks !== undefined && { maxMarks }),
        ...(isActive !== undefined && { isActive }),
        ...(isRequired !== undefined && { isRequired }),
        ...(order !== undefined && { order })
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(section);
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// DELETE /api/super-admin/campaign-forms/[formId]/sections/[sectionId] - Delete section
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; sectionId: string }> }
) {
  try {
    // Check if user can delete (only full super_admin, not super_admin_viewer)
    const session = await getServerSession(authOptions);
    
    if (!canDelete(session)) {
      return NextResponse.json({ error: 'Unauthorized: Delete operations are restricted to super admin only' }, { status: 403 });
    }

    const { sectionId } = await params;

    // Get all items in this section
    const items = await prisma.formItem.findMany({
      where: { sectionId },
      select: { id: true }
    });

    // Delete all FormItemValue records for items in this section
    if (items.length > 0) {
      const itemIds = items.map(item => item.id);
      await prisma.formItemValue.deleteMany({
        where: { itemId: { in: itemIds } }
      });
    }

    // Delete all FormItem records in this section
    await prisma.formItem.deleteMany({
      where: { sectionId }
    });

    // Delete all FormItemValue records directly related to this section
    await prisma.formItemValue.deleteMany({
      where: { sectionId }
    });

    // Finally, delete the FormSection
    await prisma.formSection.delete({
      where: { id: sectionId }
    });

    return NextResponse.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Error deleting section:', error);
    return NextResponse.json(
      { error: 'Failed to delete section' },
      { status: 500 }
    );
  }
}
