import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomainAccess } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const where: any = { subdomainId: subdomainId, isActive: true };
    
    if (type) where.type = type;
    if (category) where.category = category;

    const employment = await prisma.employment.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(employment);
  } catch (error) {
    console.error('Employment GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch employment data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      type, 
      title, 
      titleEn, 
      organization, 
      organizationEn, 
      location, 
      locationEn, 
      lastDate, 
      link, 
      description, 
      descriptionEn, 
      category, 
      categoryEn 
    } = body;

    if (!type || !title || !titleEn || !organization || !organizationEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const employment = await prisma.employment.create({
      data: {
        type,
        title,
        titleEn,
        organization,
        organizationEn,
        location: location || '',
        locationEn: locationEn || '',
        lastDate: lastDate ? new Date(lastDate) : null,
        link: link || null,
        description: description || '',
        descriptionEn: descriptionEn || '',
        category: category || '',
        categoryEn: categoryEn || '',
        isActive: true,
        order: 0,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(employment, { status: 201 });
  } catch (error) {
    console.error('Employment POST error:', error);
    return NextResponse.json({ error: 'Failed to create employment entry' }, { status: 500 });
  }
}
