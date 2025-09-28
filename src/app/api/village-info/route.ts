import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const villageInfo = await prisma.villageInfo.findFirst();
    console.log('Public API - Raw village info from DB:', villageInfo);
    
    if (!villageInfo) {
      return NextResponse.json({ 
        message: 'Village information not found' 
      }, { status: 404 });
    }

    // Transform the data to match the expected interface for the frontend
    const transformedData = {
      id: villageInfo.id,
      title: villageInfo.title,
      titleEn: villageInfo.titleEn,
      description: villageInfo.description,
      descriptionEn: villageInfo.descriptionEn,
      // Extract stats from JSON and flatten them
      families: villageInfo.stats?.families || 0,
      population: villageInfo.stats?.population || 0,
      gramPanchayatCount: villageInfo.stats?.gramPanchayatCount || 0,
      area: villageInfo.stats?.area || 0,
      // Keep original stats for admin use
      stats: villageInfo.stats,
      createdAt: villageInfo.createdAt,
      updatedAt: villageInfo.updatedAt
    };

    console.log('Public API - Transformed data:', transformedData);

    const response = NextResponse.json(transformedData);
    
    // Add cache-busting headers
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
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
    const { title, description, titleEn, descriptionEn, stats } = body;

    // Handle both old format (direct properties) and new format (stats array)
    let statsData;
    if (stats && Array.isArray(stats)) {
      // New format: stats array
      statsData = stats.reduce((acc, stat) => {
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
    } else {
      // Old format: direct properties
      const { families, population, gramPanchayatCount, area } = body;
      statsData = {
        families: parseInt(families) || 0,
        population: parseInt(population) || 0,
        gramPanchayatCount: parseInt(gramPanchayatCount) || 0,
        area: parseFloat(area) || 0,
      };
    }

    // First, try to find existing village info
    let villageInfo = await prisma.villageInfo.findFirst();
    
    if (villageInfo) {
      // Update existing record
      villageInfo = await prisma.villageInfo.update({
        where: { id: villageInfo.id },
        data: {
          title,
          description,
          titleEn,
          descriptionEn,
          stats: statsData,
        },
      });
    } else {
      // Create new record
      villageInfo = await prisma.villageInfo.create({
        data: {
          title,
          description,
          titleEn,
          descriptionEn,
          stats: statsData,
        },
      });
    }

    return NextResponse.json(villageInfo);
  } catch (error) {
    console.error('Error saving village info:', error);
    return NextResponse.json(
      { error: 'Failed to save village information' },
      { status: 500 }
    );
  }
}
