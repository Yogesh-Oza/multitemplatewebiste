import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const villageInfo = await prisma.villageInfo.findFirst();
    return NextResponse.json(villageInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch village info' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    const villageInfo = await prisma.villageInfo.create({
      data: {
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        stats: data.stats,
      },
    });

    return NextResponse.json(villageInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create village info' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    const villageInfo = await prisma.villageInfo.upsert({
      where: { id: data.id || '' },
      update: {
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        stats: data.stats,
      },
      create: {
        title: data.title,
        titleEn: data.titleEn,
        description: data.description,
        descriptionEn: data.descriptionEn,
        stats: data.stats,
      },
    });

    return NextResponse.json(villageInfo);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update village info' }, { status: 500 });
  }
}
