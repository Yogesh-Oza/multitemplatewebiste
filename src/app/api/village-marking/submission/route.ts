import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Get current village submission
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'draft';

    const submission = await prisma.villageMarkingSubmission.findFirst({
      where: {
        subdomainId: session.user?.subdomainId,
        status
      },
      include: {
        section: {
          select: {
            title: true,
            titleEn: true,
            maxMarks: true
          }
        },
        fieldValues: {
          include: {
            field: {
              select: {
                fieldName: true,
                fieldNameEn: true,
                fieldType: true,
                formula: true,
                isEditable: true
              }
            }
          },
          orderBy: {
            field: {
              order: 'asc'
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

// POST: Create new submission (draft)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { sectionId, templateId } = body;

    // Check if draft already exists
    const existingDraft = await prisma.villageMarkingSubmission.findFirst({
      where: {
        subdomainId: session.user?.subdomainId,
        status: 'draft'
      }
    });

    if (existingDraft) {
      return NextResponse.json(
        { error: 'Draft submission already exists' },
        { status: 400 }
      );
    }

    const submission = await prisma.villageMarkingSubmission.create({
      data: {
        subdomainId: session.user?.subdomainId!,
        templateId: templateId || null,
        sectionId: sectionId || null,
        submittedBy: session.user?.id!,
        status: 'draft',
        totalMarks: 0,
        totalMaxMarks: 0
      }
    });

    return NextResponse.json({ submission }, { status: 201 });
  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    );
  }
}

// PUT: Update submission values
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId, fieldValues, totalMarks, totalMaxMarks } = body;

    // Update submission
    const submission = await prisma.villageMarkingSubmission.update({
      where: { id: submissionId },
      data: {
        totalMarks: parseFloat(totalMarks) || 0,
        totalMaxMarks: parseFloat(totalMaxMarks) || 0
      }
    });

    // Update field values
    for (const fieldValue of fieldValues) {
      const { fieldId, sectionId, udisht, sadhya, percentage, marks, textValue, numberValue, dateValue, fileUrl, checkboxValue, calculatedValue } = fieldValue;

      await prisma.villageMarkingFieldValue.upsert({
        where: {
          submissionId_fieldId: {
            submissionId,
            fieldId
          }
        },
        update: {
          udisht: udisht ? parseFloat(udisht) : null,
          sadhya: sadhya ? parseFloat(sadhya) : null,
          percentage: percentage ? parseFloat(percentage) : null,
          marks: marks ? parseFloat(marks) : null,
          textValue,
          numberValue: numberValue ? parseFloat(numberValue) : null,
          dateValue: dateValue ? new Date(dateValue) : null,
          fileUrl,
          checkboxValue,
          calculatedValue: calculatedValue ? parseFloat(calculatedValue) : null
        },
        create: {
          submissionId,
          fieldId,
          sectionId,
          udisht: udisht ? parseFloat(udisht) : null,
          sadhya: sadhya ? parseFloat(sadhya) : null,
          percentage: percentage ? parseFloat(percentage) : null,
          marks: marks ? parseFloat(marks) : null,
          textValue,
          numberValue: numberValue ? parseFloat(numberValue) : null,
          dateValue: dateValue ? new Date(dateValue) : null,
          fileUrl,
          checkboxValue,
          calculatedValue: calculatedValue ? parseFloat(calculatedValue) : null
        }
      });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}

// PATCH: Submit for approval
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { submissionId } = body;

    const submission = await prisma.villageMarkingSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'submitted',
        submittedAt: new Date()
      }
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error submitting for approval:', error);
    return NextResponse.json(
      { error: 'Failed to submit for approval' },
      { status: 500 }
    );
  }
}
