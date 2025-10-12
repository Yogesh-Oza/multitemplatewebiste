import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search');

    const whereClause: any = {};

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

    const districts = await prisma.district.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        nameMarathi: true
      },
      orderBy: {
        name: 'asc'
      },
      skip,
      take: limit
    });

    const total = await prisma.district.count({ where: whereClause });
    const hasMore = skip + limit < total;

    return NextResponse.json({
      data: districts,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch districts' },
      { status: 500 }
    );
  }
}
