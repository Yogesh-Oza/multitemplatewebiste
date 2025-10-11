import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const districtId = searchParams.get('districtId');

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
      }
    });

    return NextResponse.json(subDistricts);
  } catch (error) {
    console.error('Error fetching sub-districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sub-districts' },
      { status: 500 }
    );
  }
}
