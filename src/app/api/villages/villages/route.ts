import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subDistrictId = searchParams.get('subDistrictId');
    const search = searchParams.get('search');

    if (!subDistrictId) {
      return NextResponse.json(
        { error: 'Sub-district ID is required' },
        { status: 400 }
      );
    }

    const whereClause: any = {
      subDistrictId: subDistrictId
    };

    // Add search functionality
    if (search && search.length > 0) {
      whereClause.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          nameMarathi: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const villages = await prisma.village.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nameMarathi: true,
        subDistrictId: true
      },
      orderBy: {
        name: 'asc'
      },
      take: search ? 50 : 100 // Limit results for performance, fewer when searching
    });

    return NextResponse.json(villages);
  } catch (error) {
    console.error('Error fetching villages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch villages' },
      { status: 500 }
    );
  }
}
