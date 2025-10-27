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
    const status = searchParams.get('status');

    const where: any = { subdomainId: subdomainId, isActive: true };
    
    if (type) where.type = type;
    if (status) where.status = status;

    const infrastructure = await prisma.infrastructure.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(infrastructure);
  } catch (error) {
    console.error('Infrastructure GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch infrastructure data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { type, name, nameEn, location, status, details, imageUrl } = body;

    if (!type || !name || !nameEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const infrastructure = await prisma.infrastructure.create({
      data: {
        type,
        name,
        nameEn,
        location: location || {},
        status: status || 'planned',
        details: details || {},
        imageUrl: imageUrl || null,
        isActive: true,
        order: 0,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(infrastructure, { status: 201 });
  } catch (error) {
    console.error('Infrastructure POST error:', error);
    return NextResponse.json({ error: 'Failed to create infrastructure entry' }, { status: 500 });
  }
}
