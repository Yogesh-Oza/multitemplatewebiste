import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/campaign-form/submission - Get submission for current subdomain
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomainId = searchParams.get('subdomainId');
    const campaignFormId = searchParams.get('campaignFormId');

    if (!subdomainId || !campaignFormId || subdomainId === 'null') {
      return NextResponse.json(
        { error: 'SubdomainId and CampaignFormId are required' },
        { status: 400 }
      );
    }

    // Validate that subdomainId is a valid MongoDB ObjectId
    if (subdomainId === 'current' || subdomainId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid subdomainId format' },
        { status: 400 }
      );
    }

    const submission = await prisma.formSubmission.findFirst({
      where: {
        subdomainId,
        campaignFormId,
        status: { not: 'deleted' }
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
        itemValues: {
          include: {
            item: {
              select: {
                id: true,
                itemId: true,
                fieldName: true,
                fieldNameEn: true,
                maxMarks: true,
                itemType: true
              }
            },
            section: {
              select: {
                id: true,
                sectionId: true,
                title: true,
                titleEn: true
              }
            }
          }
        }
      }
    });

    if (!submission) {
      return NextResponse.json({
        submission: null,
        message: 'No submission found'
      });
    }

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error fetching submission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submission' },
      { status: 500 }
    );
  }
}

// POST /api/campaign-form/submission - Create or update submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      subdomainId,
      campaignFormId,
      basicInfo,
      itemValues,
      status = 'draft'
    } = body;

    if (!subdomainId || !campaignFormId) {
      return NextResponse.json(
        { error: 'SubdomainId and CampaignFormId are required' },
        { status: 400 }
      );
    }

    // Validate that subdomainId is a valid MongoDB ObjectId
    if (subdomainId === 'current' || subdomainId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid subdomainId format' },
        { status: 400 }
      );
    }

    // Check if submission already exists
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: {
        subdomainId,
        campaignFormId,
        status: { not: 'deleted' }
      }
    });

    let submission;

    if (existingSubmission) {
      // Update existing submission
      submission = await prisma.formSubmission.update({
        where: { id: existingSubmission.id },
        data: {
          basicInfo: basicInfo || existingSubmission.basicInfo,
          status,
          ...(status === 'submitted' && { submittedAt: new Date() })
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
          itemValues: {
            include: {
              item: {
                select: {
                  id: true,
                  itemId: true,
                  fieldName: true,
                  fieldNameEn: true,
                  maxMarks: true,
                  itemType: true
                }
              }
            }
          }
        }
      });
    } else {
      // Create new submission
      submission = await prisma.formSubmission.create({
        data: {
          subdomainId,
          campaignFormId,
          basicInfo: basicInfo || {},
          summary: {},
          submittedBy: body.submittedBy,
          status,
          ...(status === 'submitted' && { submittedAt: new Date() })
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
          itemValues: true
        }
      });
    }

    return NextResponse.json({
      submission,
      message: existingSubmission ? 'Submission updated' : 'Submission created'
    });
  } catch (error) {
    console.error('Error saving submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
