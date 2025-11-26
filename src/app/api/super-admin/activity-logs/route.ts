import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/auth-helpers';

export async function GET(request: NextRequest) {
  try {
    // Check if user is super admin or super_admin_viewer
    const session = await getServerSession(authOptions);
    
    if (!isSuperAdmin(session)) {
      return NextResponse.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Sorting
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const orderBy: any = { [sortBy]: sortOrder };

    // Filters
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const userEmail = searchParams.get('userEmail');
    const userName = searchParams.get('userName');
    const districtName = searchParams.get('districtName');
    const subDistrictName = searchParams.get('subDistrictName');
    const action = searchParams.get('action');
    const model = searchParams.get('model');
    const subdomainId = searchParams.get('subdomainId');

    // Build where clause
    const where: any = {};

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add one day to include the entire end date
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        where.createdAt.lte = end;
      }
    }

    // User filters
    if (userId) {
      where.userId = userId;
    }
    if (userEmail) {
      // MongoDB doesn't support case-insensitive search directly, use regex
      where.userEmail = { $regex: userEmail, $options: 'i' } as any;
    }
    if (userName) {
      where.userName = { $regex: userName, $options: 'i' } as any;
    }

    // Location filters
    if (districtName) {
      where.districtName = districtName;
    }
    if (subDistrictName) {
      where.subDistrictName = subDistrictName;
    }

    // Action and model filters
    if (action) {
      where.action = action;
    }
    if (model) {
      where.model = model;
    }
    if (subdomainId) {
      where.subdomainId = subdomainId;
    }

    // Get total count for pagination
    const total = await prisma.activityLog.count({ where });

    // Fetch logs with pagination and sorting
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        action: true,
        model: true,
        modelId: true,
        userName: true,
        userEmail: true,
        subdomainName: true,
        villageName: true,
        districtName: true,
        subDistrictName: true,
        description: true,
        createdAt: true,
      },
    });

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      logs,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activity logs' },
      { status: 500 }
    );
  }
}

