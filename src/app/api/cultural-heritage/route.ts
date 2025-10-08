import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const culturalHeritage = await prisma.culturalHeritage.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(culturalHeritage);
  } catch (error) {
    console.error('Error fetching cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cultural heritage' },
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
    const { title, titleEn, description, descriptionEn, imageUrl, category } = body;

    const culturalHeritage = await prisma.culturalHeritage.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        image: imageUrl,
        category: category || 'सांस्कृतिक वारसा',
        subdomainId,
      },
    });

    return NextResponse.json(culturalHeritage);
  } catch (error) {
    console.error('Error creating cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to create cultural heritage' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, titleEn, description, descriptionEn, imageUrl, category } = body;

    // Verify the cultural heritage belongs to this subdomain
    const existingHeritage = await prisma.culturalHeritage.findFirst({
      where: { id, subdomainId }
    });

    if (!existingHeritage) {
      return NextResponse.json({ 
        message: 'Cultural heritage not found or access denied' 
      }, { status: 404 });
    }

    const culturalHeritage = await prisma.culturalHeritage.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        image: imageUrl,
        category: category || 'सांस्कृतिक वारसा',
      },
    });

    return NextResponse.json(culturalHeritage);
  } catch (error) {
    console.error('Error updating cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to update cultural heritage' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    // Verify the cultural heritage belongs to this subdomain
    const existingHeritage = await prisma.culturalHeritage.findFirst({
      where: { id, subdomainId }
    });

    if (!existingHeritage) {
      return NextResponse.json({ 
        message: 'Cultural heritage not found or access denied' 
      }, { status: 404 });
    }

    await prisma.culturalHeritage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Cultural heritage deleted successfully' });
  } catch (error) {
    console.error('Error deleting cultural heritage:', error);
    return NextResponse.json(
      { error: 'Failed to delete cultural heritage' },
      { status: 500 }
    );
  }
}
