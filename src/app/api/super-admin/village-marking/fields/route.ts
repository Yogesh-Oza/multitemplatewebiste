import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List fields by section
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (sectionId) {
      where.sectionId = sectionId;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const fields = await prisma.villageMarkingField.findMany({
      where,
      include: {
        section: {
          select: {
            title: true,
            titleEn: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ fields });
  } catch (error) {
    console.error('Error fetching fields:', error);
    return NextResponse.json(
      { error: 'Failed to fetch fields' },
      { status: 500 }
    );
  }
}

// POST: Create field with formula
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      sectionId,
      fieldName,
      fieldNameEn,
      fieldType,
      formula,
      validationRules,
      options,
      isActive = true,
      isEditable = true
    } = body;

    // Get the next order number for this section
    const lastField = await prisma.villageMarkingField.findFirst({
      where: { sectionId },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastField?.order || 0) + 1;

    const field = await prisma.villageMarkingField.create({
      data: {
        sectionId,
        fieldName,
        fieldNameEn,
        fieldType,
        formula: formula || null,
        validationRules: validationRules || null,
        options: options || null,
        isActive,
        isEditable,
        order: nextOrder
      }
    });

    return NextResponse.json({ field }, { status: 201 });
  } catch (error) {
    console.error('Error creating field:', error);
    return NextResponse.json(
      { error: 'Failed to create field' },
      { status: 500 }
    );
  }
}

// PUT: Update field configuration
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      fieldName,
      fieldNameEn,
      fieldType,
      formula,
      validationRules,
      options,
      isActive,
      isEditable,
      order
    } = body;

    const field = await prisma.villageMarkingField.update({
      where: { id },
      data: {
        fieldName,
        fieldNameEn,
        fieldType,
        formula: formula || null,
        validationRules: validationRules || null,
        options: options || null,
        isActive,
        isEditable,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json({ field });
  } catch (error) {
    console.error('Error updating field:', error);
    return NextResponse.json(
      { error: 'Failed to update field' },
      { status: 500 }
    );
  }
}

// DELETE: Delete field
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Field ID is required' },
        { status: 400 }
      );
    }

    // Check if field has values
    const fieldValues = await prisma.villageMarkingFieldValue.findMany({
      where: { fieldId: id }
    });

    if (fieldValues.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete field with existing values' },
        { status: 400 }
      );
    }

    // Delete the field
    await prisma.villageMarkingField.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Field deleted successfully' });
  } catch (error) {
    console.error('Error deleting field:', error);
    return NextResponse.json(
      { error: 'Failed to delete field' },
      { status: 500 }
    );
  }
}
