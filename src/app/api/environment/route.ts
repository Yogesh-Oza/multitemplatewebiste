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

    const where: any = { subdomainId: subdomainId, isActive: true };
    
    if (type) where.type = type;

    const environment = await prisma.environment.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(environment);
  } catch (error) {
    console.error('Environment GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch environment data' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, titleEn, target, achieved, metrics, description, descriptionEn, imageUrl } = body;

    if (!type || !title || !titleEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const environment = await prisma.environment.create({
      data: {
        type,
        title,
        titleEn,
        target: target || null,
        achieved: achieved || null,
        metrics: metrics || {},
        description: description || '',
        descriptionEn: descriptionEn || '',
        imageUrl: imageUrl || null,
        isActive: true,
        order: 0,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(environment, { status: 201 });
  } catch (error) {
    console.error('Environment POST error:', error);
    return NextResponse.json({ error: 'Failed to create environment entry' }, { status: 500 });
  }
}
