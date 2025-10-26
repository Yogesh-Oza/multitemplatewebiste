import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateCampaignFormExcel } from '@/lib/campaign-form-excel-export';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { submissionId, subdomainId, campaignFormId } = body;

    if (!submissionId && !subdomainId) {
      return NextResponse.json(
        { error: 'SubmissionId or SubdomainId is required' },
        { status: 400 }
      );
    }

    let submission;

    if (submissionId === 'current' || !submissionId) {
      // Handle "current" case - find the submission for the current subdomain
      if (!subdomainId || !campaignFormId) {
        return NextResponse.json(
          { error: 'SubdomainId and CampaignFormId are required when using "current"' },
          { status: 400 }
        );
      }

      submission = await prisma.formSubmission.findFirst({
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
              formMetadata: true
            }
          },
          subdomain: {
            select: {
              villageName: true,
              villageNameEn: true
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
    } else {
      // Handle specific submissionId case
      submission = await prisma.formSubmission.findUnique({
        where: { id: submissionId },
        include: {
          campaignForm: {
            select: {
              id: true,
              name: true,
              nameEn: true,
              formMetadata: true
            }
          },
          subdomain: {
            select: {
              villageName: true,
              villageNameEn: true
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
    }

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Prepare data for Excel generation
    const excelData = {
      basicInfo: (submission.basicInfo as any) || {},
      campaignInfo: {
        name: submission.campaignForm.name,
        nameEn: submission.campaignForm.nameEn,
        year: (submission.campaignForm.formMetadata as any)?.year || '2025-2026',
        campaignName: (submission.campaignForm.formMetadata as any)?.campaignName || 'Campaign'
      },
      summary: {
        grandTotal: submission.totalMarks || 0,
        maxPossibleTotal: submission.totalMaxMarks || 100,
        percentage: submission.totalMarks && submission.totalMaxMarks ? 
          Math.round((submission.totalMarks / submission.totalMaxMarks) * 100) : 0,
        submittedAt: submission.submittedAt?.toISOString() || submission.createdAt.toISOString(),
        status: submission.status
      },
      sectionResults: await getSectionResults(submission),
      innovations: []
    };

    // Generate Excel file
    const excelBuffer = await generateCampaignFormExcel(excelData);

    // Return Excel file as response
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="campaign-form-results-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });

  } catch (error) {
    console.error('Error generating Excel export:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel export' },
      { status: 500 }
    );
  }
}

async function getSectionResults(submission: any) {
  // Get all sections for the campaign form
  const sections = await prisma.formSection.findMany({
    where: { campaignFormId: submission.campaignFormId },
    include: {
      items: true
    },
    orderBy: { order: 'asc' }
  });

  return sections.map(section => {
    // Calculate section marks from item values
    let achievedMarks = 0;
    const items: any[] = [];

    section.items.forEach(item => {
      const itemValue = submission.itemValues.find((iv: any) => iv.itemId === item.id);
      if (itemValue) {
        achievedMarks += itemValue.marks;
        
        if (item.itemType === 'yesno') {
          // Yes/No items
          items.push({
            itemId: item.itemId,
            fieldName: item.fieldName,
            fieldNameEn: item.fieldNameEn,
            target: 'होय/नाही (Yes/No)',
            achieved: itemValue.isCompleted ? 'होय (Yes)' : 'नाही (No)',
            percentage: itemValue.isCompleted ? 100 : 0,
            marks: itemValue.marks || 0,
            isSubItem: false
          });
        } else {
          // Simple items
          items.push({
            itemId: item.itemId,
            fieldName: item.fieldName,
            fieldNameEn: item.fieldNameEn,
            target: itemValue.target || 0,
            achieved: itemValue.achieved || 0,
            percentage: itemValue.percentage || 0,
            marks: itemValue.marks || 0,
            isSubItem: false
          });
        }
      }
    });

    const percentage = section.maxMarks > 0 ? Math.round((achievedMarks / section.maxMarks) * 100) : 0;

    return {
      sectionId: section.sectionId,
      title: section.title,
      titleEn: section.titleEn,
      achievedMarks,
      maxMarks: section.maxMarks,
      percentage,
      items
    };
  });
}

