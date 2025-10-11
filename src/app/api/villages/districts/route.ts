import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const districts = await prisma.district.findMany({
      select: {
        id: true,
        name: true,
        nameMarathi: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(districts);
  } catch (error) {
    console.error('Error fetching districts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch districts' },
      { status: 500 }
    );
  }
}
