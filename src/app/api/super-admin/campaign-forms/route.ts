import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/auth-helpers';

// GET /api/super-admin/campaign-forms - Get all campaign forms
export async function GET(request: NextRequest) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { nameEn: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }
    if (status) {
      where.isActive = status === 'active';
    } else {
      // By default, only show active forms
      where.isActive = true;
    }

    const [forms, total] = await Promise.all([
      prisma.campaignForm.findMany({
        where,
        include: {
          sections: {
            include: {
              items: true
            },
            orderBy: { order: 'asc' }
          },
          submissions: {
            select: {
              id: true,
              status: true,
              submittedAt: true
            }
          },
          _count: {
            select: {
              sections: true,
              submissions: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.campaignForm.count({ where })
    ]);

    return NextResponse.json({
      forms,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching campaign forms:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaign forms' },
      { status: 500 }
    );
  }
}

// POST /api/super-admin/campaign-forms - Create new campaign form
export async function POST(request: NextRequest) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const {
      name,
      nameEn,
      description,
      descriptionEn,
      formMetadata,
      maxPossibleTotal = 100,
      isActive = true,
      isDefault = false
    } = body;

    // Validate required fields
    if (!name || !nameEn) {
      return NextResponse.json(
        { error: 'Name and NameEn are required' },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await prisma.campaignForm.updateMany({
        where: { isDefault: true },
        data: { isDefault: false }
      });
    }

    const form = await prisma.campaignForm.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        formMetadata: formMetadata || {},
        maxPossibleTotal,
        isActive,
        isDefault,
        createdBy: body.createdBy
      },
      include: {
        sections: {
          include: {
            items: true
          },
          orderBy: { order: 'asc' }
        }
      }
    });

    return NextResponse.json(form, { status: 201 });
  } catch (error) {
    console.error('Error creating campaign form:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign form' },
      { status: 500 }
    );
  }
}
