import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin, canDelete } from '@/lib/auth-helpers';

// GET /api/super-admin/campaign-forms/[formId] - Get specific campaign form
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { formId } = await params;

    const form = await prisma.campaignForm.findUnique({
      where: { id: formId },
      include: {
        sections: {
          include: {
            items: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        },
        submissions: {
          select: {
            id: true,
            status: true,
            submittedAt: true,
            subdomain: {
              select: {
                villageName: true,
                villageNameEn: true
              }
            }
          }
        },
        _count: {
          select: {
            sections: true,
            submissions: true
          }
        }
      }
    });

    if (!form) {
      return NextResponse.json(
        { error: 'Campaign form not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error fetching campaign form:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign form' },
      { status: 500 }
    );
  }
}

// PUT /api/super-admin/campaign-forms/[formId] - Update campaign form
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { formId } = await params;
    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      formMetadata,
      maxPossibleTotal,
      isActive,
      isDefault
    } = body;

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.campaignForm.updateMany({
        where: { 
          isDefault: true,
          id: { not: formId }
        },
        data: { isDefault: false }
      });
    }

    const form = await prisma.campaignForm.update({
      where: { id: formId },
      data: {
        ...(name && { name }),
        ...(nameEn && { nameEn }),
        ...(description !== undefined && { description }),
        ...(descriptionEn !== undefined && { descriptionEn }),
        ...(formMetadata && { formMetadata }),
        ...(maxPossibleTotal !== undefined && { maxPossibleTotal }),
        ...(isActive !== undefined && { isActive }),
        ...(isDefault !== undefined && { isDefault })
      }
    });

    return NextResponse.json(form);
  } catch (error) {
    console.error('Error updating campaign form:', error);
    return NextResponse.json(
      { error: 'Failed to update campaign form' },
      { status: 500 }
    );
  }
}

// DELETE /api/super-admin/campaign-forms/[formId] - Delete campaign form
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  try {
    // Check if user can delete (only full super_admin, not super_admin_viewer)
    const session = await getServerSession(authOptions);
    
    if (!canDelete(session)) {
      return NextResponse.json({ error: 'Unauthorized: Delete operations are restricted to super admin only' }, { status: 403 });
    }

    const { formId } = await params;

    // Check if form has submissions
    const submissionCount = await prisma.formSubmission.count({
      where: { campaignFormId: formId }
    });

    if (submissionCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete form with existing submissions' },
        { status: 400 }
      );
    }

    // Delete form and all related data
    await prisma.campaignForm.delete({
      where: { id: formId }
    });

    return NextResponse.json({ message: 'Campaign form deleted successfully' });
  } catch (error) {
    console.error('Error deleting campaign form:', error);
    return NextResponse.json(
      { error: 'Failed to delete campaign form' },
      { status: 500 }
    );
  }
}
