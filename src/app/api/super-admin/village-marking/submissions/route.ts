import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: List all village submissions with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subdomainId = searchParams.get('subdomainId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');

    const where: any = {};
    if (subdomainId) {
      where.subdomainId = subdomainId;
    }
    if (status) {
      where.status = status;
    }
    if (search) {
      where.OR = [
        {
          subdomain: {
            villageName: {
              contains: search,
              mode: 'insensitive'
            }
          }
        },
        {
          subdomain: {
            villageNameEn: {
              contains: search,
              mode: 'insensitive'
            }
          }
        }
      ];
    }

    const skip = (page - 1) * limit;

    const [submissions, total] = await Promise.all([
      prisma.villageMarkingSubmission.findMany({
        where,
        include: {
          subdomain: {
            select: {
              subdomain: true,
              villageName: true,
              villageNameEn: true,
              districtName: true,
              subDistrictName: true
            }
          },
          template: {
            select: {
              name: true,
              nameEn: true
            }
          },
          section: {
            select: {
              title: true,
              titleEn: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.villageMarkingSubmission.count({ where })
    ]);

    return NextResponse.json({
      submissions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

// GET by ID: Detailed submission view
export async function GET_BY_ID(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const submission = await prisma.villageMarkingSubmission.findUnique({
      where: { id: params.id },
      include: {
        subdomain: {
          select: {
            subdomain: true,
            villageName: true,
            villageNameEn: true,
            districtName: true,
            subDistrictName: true
          }
        },
        template: {
          select: {
            name: true,
            nameEn: true
          }
        },
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
                formula: true
              }
            }
          },
          orderBy: {
            field: {
              order: 'asc'
            }
          }
        }
      }
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
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

// PUT: Approve/reject submission
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status, approvedBy } = body;

    if (!['approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be approved or rejected' },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      approvedBy: session.user?.id
    };

    if (status === 'approved') {
      updateData.approvedAt = new Date();
    }

    const submission = await prisma.villageMarkingSubmission.update({
      where: { id },
      data: updateData,
      include: {
        subdomain: {
          select: {
            subdomain: true,
            villageName: true,
            villageNameEn: true
          }
        }
      }
    });

    return NextResponse.json({ submission });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
