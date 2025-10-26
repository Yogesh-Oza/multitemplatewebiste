import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all templates
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');

    const where: any = {};
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const templates = await prisma.villageMarkingTemplate.findMany({
      where,
      include: {
        submissions: {
          select: {
            id: true,
            status: true,
            totalMarks: true,
            totalMaxMarks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

// POST: Create template with sections/fields
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      isActive = true,
      isDefault = false,
      sections = []
    } = body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.villageMarkingTemplate.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    const template = await prisma.villageMarkingTemplate.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        isActive,
        isDefault,
        createdBy: session.user?.id
      }
    });

    // If sections are provided, create them
    if (sections.length > 0) {
      for (const sectionData of sections) {
        const section = await prisma.villageMarkingSection.create({
          data: {
            ...sectionData,
            subdomainId: null, // Global template
            createdBy: session.user?.id
          }
        });

        // Create default fields for the section
        const defaultFields = [
          {
            fieldName: 'उदिष्ट',
            fieldNameEn: 'Target',
            fieldType: 'udisht',
            isEditable: true,
            order: 1,
            validationRules: {
              required: true,
              min: 0,
              message: 'उदिष्ट मूल्य 0 पेक्षा जास्त असावे'
            }
          },
          {
            fieldName: 'साध्य',
            fieldNameEn: 'Achievement',
            fieldType: 'sadhya',
            isEditable: true,
            order: 2,
            validationRules: {
              required: true,
              min: 0,
              message: 'साध्य मूल्य 0 पेक्षा जास्त किंवा समान असावे'
            }
          },
          {
            fieldName: 'टक्केवारी',
            fieldNameEn: 'Percentage',
            fieldType: 'percentage',
            formula: '(sadhya/udisht)*100',
            isEditable: false,
            order: 3,
            validationRules: {
              readonly: true
            }
          },
          {
            fieldName: 'गुण',
            fieldNameEn: 'Marks',
            fieldType: 'marks',
            formula: 'IF(percentage >= 90, 10, IF(percentage >= 75, 8, IF(percentage >= 60, 6, IF(percentage >= 50, 4, 2))))',
            isEditable: false,
            order: 4,
            validationRules: {
              readonly: true
            }
          }
        ];

        for (const fieldData of defaultFields) {
          await prisma.villageMarkingField.create({
            data: {
              ...fieldData,
              sectionId: section.id,
              isActive: true
            }
          });
        }
      }
    }

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}

// PUT: Update template
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      nameEn,
      description,
      descriptionEn,
      isActive,
      isDefault
    } = body;

    // If this is set as default, unset other defaults
    if (isDefault) {
      await prisma.villageMarkingTemplate.updateMany({
        where: { 
          isDefault: true,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    const template = await prisma.villageMarkingTemplate.update({
      where: { id },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        isActive,
        isDefault
      }
    });

    return NextResponse.json({ template });
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
      { status: 500 }
    );
  }
}

// DELETE: Delete template
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
        { error: 'Template ID is required' },
        { status: 400 }
      );
    }

    // Check if template has submissions
    const submissions = await prisma.villageMarkingSubmission.findMany({
      where: { templateId: id }
    });

    if (submissions.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete template with existing submissions' },
        { status: 400 }
      );
    }

    // Delete the template
    await prisma.villageMarkingTemplate.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Template deleted successfully' });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
