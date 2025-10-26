import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/super-admin/campaign-forms/[formId]/sections/[sectionId] - Update section
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string; sectionId: string }> }
) {
  try {
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
    const { sectionId } = await params;

    // Check if section has items
    const itemCount = await prisma.formItem.count({
      where: { sectionId }
    });

    if (itemCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete section with existing items' },
        { status: 400 }
      );
    }

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
