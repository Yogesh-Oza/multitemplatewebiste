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
    const level = searchParams.get('level');

    const where: any = { subdomainId: subdomainId, isActive: true };
    
    if (level) where.level = level;

    const leadership = await prisma.leadership.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(leadership);
  } catch (error) {
    console.error('Leadership GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch leadership data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { name, nameEn, designation, designationEn, photo, level } = body;

    if (!name || !nameEn || !designation || !designationEn || !level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const leadership = await prisma.leadership.create({
      data: {
        name,
        nameEn,
        designation,
        designationEn,
        photo: photo || null,
        level,
        isActive: true,
        order: 0,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(leadership, { status: 201 });
  } catch (error) {
    console.error('Leadership POST error:', error);
    return NextResponse.json({ error: 'Failed to create leadership entry' }, { status: 500 });
  }
}
