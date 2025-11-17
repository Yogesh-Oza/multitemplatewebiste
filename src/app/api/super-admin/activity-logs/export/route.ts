import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { generateActivityLogsExcel } from '@/lib/activity-logs-excel-export';

export async function GET(request: NextRequest) {
  try {
    // Check authentication and super admin role
    const session = await getServerSession(authOptions);
    
    if (!session?.user || (session.user as any).role !== 'super_admin') {
      return NextResponse.json(
        { error: 'Unauthorized - Super admin access required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Filters (same as GET route)
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

    // Build where clause (same as GET route)
    const where: any = {};

    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
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

    // Fetch all logs matching filters (no pagination for export)
    const logs = await prisma.activityLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
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

    // Generate Excel file
    const excelBuffer = await generateActivityLogsExcel(logs);

    // Generate filename with date range if applicable
    let filename = 'activity-logs';
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate).toISOString().split('T')[0] : 'all';
      const end = endDate ? new Date(endDate).toISOString().split('T')[0] : 'all';
      filename += `-${start}-to-${end}`;
    } else {
      filename += `-${new Date().toISOString().split('T')[0]}`;
    }

    // Return Excel file as response
    return new NextResponse(new Uint8Array(excelBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}.xlsx"`,
      },
    });
  } catch (error) {
    console.error('Error generating Excel export:', error);
    return NextResponse.json(
      { error: 'Failed to generate Excel export' },
      { status: 500 }
    );
  }
}

