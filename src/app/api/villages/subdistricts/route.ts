import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    if (!districtId) {
      return NextResponse.json(
        { error: 'District ID is required' },
        { status: 400 }
      );
    }

    const subDistricts = await prisma.subDistrict.findMany({
      where: {
        districtId: districtId
      },
      select: {
        id: true,
        name: true,
        nameMarathi: true,
        districtId: true
      },
      orderBy: {
        name: 'asc'
      },
      skip,
      take: limit
    });

    const total = await prisma.subDistrict.count({
      where: { districtId: districtId }
    });
    const hasMore = skip + limit < total;

    return NextResponse.json({
      data: subDistricts,
      pagination: {
        page,
        limit,
        total,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching sub-districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sub-districts' },
      { status: 500 }
    );
  }
}
