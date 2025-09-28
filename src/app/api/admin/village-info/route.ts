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
    
    // Transform stats array to the format expected by the database
    const statsData = data.stats.reduce((acc: any, stat: any) => {
      if (stat.label === 'कुटुंबे' || stat.labelEn === 'Families') {
        acc.families = parseInt(stat.value) || 0;
      } else if (stat.label === 'लोकसंख्या' || stat.labelEn === 'Population') {
        acc.population = parseInt(stat.value) || 0;
      } else if (stat.label === 'ग्रामपंचायत' || stat.labelEn === 'Gram Panchayat') {
        acc.gramPanchayatCount = parseInt(stat.value) || 0;
      } else if (stat.label === 'क्षेत्रफळ (हेक्टर)' || stat.labelEn === 'Area (Hectares)') {
        acc.area = parseFloat(stat.value) || 0;
      }
      return acc;
    }, { families: 0, population: 0, gramPanchayatCount: 0, area: 0 });
    
    // First, try to find existing village info
    let villageInfo = await prisma.villageInfo.findFirst();
    
    if (villageInfo) {
      // Update existing record
      villageInfo = await prisma.villageInfo.update({
        where: { id: villageInfo.id },
        data: {
          title: data.title,
          titleEn: data.titleEn,
          description: data.description,
          descriptionEn: data.descriptionEn,
          stats: statsData,
        },
      });
    } else {
      // Create new record
      villageInfo = await prisma.villageInfo.create({
        data: {
          title: data.title,
          titleEn: data.titleEn,
          description: data.description,
          descriptionEn: data.descriptionEn,
          stats: statsData,
        },
      });
    }

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error updating village info:', error);
    return NextResponse.json({ error: 'Failed to update village info' }, { status: 500 });
  }
}
