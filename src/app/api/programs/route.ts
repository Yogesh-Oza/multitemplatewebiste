import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const programs = await prisma.program.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error fetching programs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { title, titleEn, description, descriptionEn, date, time, location, category, imageUrl, status } = body;

    console.log('Programs API - Received data:', body);

    const program = await prisma.program.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        date: new Date(date),
        time,
        location,
        category,
        imageUrl,
        status,
        subdomainId,
      },
    });

    console.log('Programs API - Created program:', program);

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error creating program:', error);
    return NextResponse.json(
      { error: 'Failed to create program' },
      { status: 500 }
    );
  }
}
