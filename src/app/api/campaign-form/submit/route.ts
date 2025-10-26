import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/campaign-form/submit - Submit form for verification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      submissionId,
      itemValues,
      basicInfo,
      summary
    } = body;

    if (!submissionId) {
      return NextResponse.json(
        { error: 'SubmissionId is required' },
        { status: 400 }
      );
    }

    // Update submission status and data
    const submission = await prisma.formSubmission.update({
      where: { id: submissionId },
      data: {
        status: 'submitted',
        submittedAt: new Date(),
        basicInfo: basicInfo || {},
        summary: summary || {},
        totalMarks: summary?.grandTotal || 0,
        totalMaxMarks: summary?.maxPossibleTotal || 0
      },
      include: {
        campaignForm: {
          select: {
            id: true,
            name: true,
            nameEn: true,
            maxPossibleTotal: true
          }
        },
        subdomain: {
          select: {
            villageName: true,
            villageNameEn: true
          }
        }
      }
    });

    // Save item values
    if (itemValues && Array.isArray(itemValues)) {
      // Delete existing item values
      await prisma.formItemValue.deleteMany({
        where: { submissionId }
      });

      // Create new item values
      const itemValueData = itemValues.map((itemValue: any) => ({
        submissionId,
        itemId: itemValue.itemId,
        sectionId: itemValue.sectionId,
        target: itemValue.target, // Legacy field
        targetValue: itemValue.targetValue,
        targetPercentage: itemValue.targetPercentage,
        achieved: itemValue.achieved,
        percentage: itemValue.percentage,
        marks: itemValue.marks,
        innovations: itemValue.innovations
      }));

      await prisma.formItemValue.createMany({
        data: itemValueData
      });
    }

    return NextResponse.json({
      submission,
      message: 'Form submitted successfully for verification'
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json(
      { error: 'Failed to submit form' },
      { status: 500 }
    );
  }
}
