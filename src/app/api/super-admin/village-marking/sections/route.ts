import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all sections with fields
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subdomainId = searchParams.get('subdomainId');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (subdomainId) {
      where.subdomainId = subdomainId;
    }
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const sections = await prisma.villageMarkingSection.findMany({
      where,
      include: {
        fields: {
          orderBy: { order: 'asc' }
        },
        subdomain: {
          select: {
            subdomain: true,
            villageName: true,
            villageNameEn: true
          }
        }
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sections' },
      { status: 500 }
    );
  }
}

// POST: Create new section
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      maxMarks,
      subdomainId,
      isActive = true,
      isRequired = true
    } = body;

    // Get the next order number
    const lastSection = await prisma.villageMarkingSection.findFirst({
      where: { subdomainId: subdomainId || null },
      orderBy: { order: 'desc' }
    });
    const nextOrder = (lastSection?.order || 0) + 1;

    const section = await prisma.villageMarkingSection.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        maxMarks: parseFloat(maxMarks) || 0,
        subdomainId: subdomainId || null,
        isActive,
        isRequired,
        order: nextOrder,
        createdBy: session.user?.id
      }
    });

    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    console.error('Error creating section:', error);
    return NextResponse.json(
      { error: 'Failed to create section' },
      { status: 500 }
    );
  }
}

// PUT: Update section
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      title,
      titleEn,
      description,
      descriptionEn,
      maxMarks,
      isActive,
      isRequired,
      order
    } = body;

    const section = await prisma.villageMarkingSection.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        maxMarks: parseFloat(maxMarks) || 0,
        isActive,
        isRequired,
        order: parseInt(order) || 0
      }
    });

    return NextResponse.json({ section });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json(
      { error: 'Failed to update section' },
      { status: 500 }
    );
  }
}

// DELETE: Delete section
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
        { error: 'Section ID is required' },
        { status: 400 }
      );
    }

    // Check if section has submissions
    const submissions = await prisma.villageMarkingSubmission.findMany({
      where: { sectionId: id }
    });

    if (submissions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete section with existing submissions' },
        { status: 400 }
      );
    }

    // Delete all fields first
    await prisma.villageMarkingField.deleteMany({
      where: { sectionId: id }
    });

    // Delete the section
    await prisma.villageMarkingSection.delete({
      where: { id }
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
