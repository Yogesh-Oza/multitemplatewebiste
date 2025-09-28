import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const villageInfo = await prisma.villageInfo.findFirst();
    
    if (!villageInfo) {
      return NextResponse.json({ 
        message: 'Village information not found' 
      }, { status: 404 });
    }

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error fetching village info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch village information' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, titleEn, descriptionEn, families, population, gramPanchayatCount, area } = body;

    const villageInfo = await prisma.villageInfo.upsert({
      where: { id: 'default' },
      update: {
        title,
        description,
        titleEn,
        descriptionEn,
        families: parseInt(families),
        population: parseInt(population),
        gramPanchayatCount: parseInt(gramPanchayatCount),
        area: parseFloat(area),
      },
      create: {
        id: 'default',
        title,
        description,
        titleEn,
        descriptionEn,
        families: parseInt(families),
        population: parseInt(population),
        gramPanchayatCount: parseInt(gramPanchayatCount),
        area: parseFloat(area),
      },
    });

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error saving village info:', error);
    return NextResponse.json(
      { error: 'Failed to save village information' },
      { status: 500 }
    );
  }
}
