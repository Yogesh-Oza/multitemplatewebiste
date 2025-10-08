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

    const heroImages = await prisma.heroImage.findMany({
      where: { isActive: true, subdomainId },
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(heroImages);
  } catch (error) {
    console.error('Error fetching hero images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch hero images' },
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
    const { imageUrl, title, description, isActive } = body;

    const heroImage = await prisma.heroImage.create({
      data: {
        imageUrl,
        title: title || '',
        description: description || '',
        isActive: isActive || true,
        subdomainId,
      },
    });

    return NextResponse.json(heroImage);
  } catch (error) {
    console.error('Error creating hero image:', error);
    return NextResponse.json(
      { error: 'Failed to create hero image' },
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
    const { id, imageUrl, title, description, isActive } = body;

    // Verify the hero image belongs to this subdomain
    const existingImage = await prisma.heroImage.findFirst({
      where: { id, subdomainId }
    });

    if (!existingImage) {
      return NextResponse.json({ 
        message: 'Hero image not found or access denied' 
      }, { status: 404 });
    }

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        imageUrl,
        title: title || '',
        description: description || '',
        isActive,
      },
    });

    return NextResponse.json(heroImage);
  } catch (error) {
    console.error('Error updating hero image:', error);
    return NextResponse.json(
      { error: 'Failed to update hero image' },
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

    // Verify the hero image belongs to this subdomain
    const existingImage = await prisma.heroImage.findFirst({
      where: { id, subdomainId }
    });

    if (!existingImage) {
      return NextResponse.json({ 
        message: 'Hero image not found or access denied' 
      }, { status: 404 });
    }

    await prisma.heroImage.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Hero image deleted successfully' });
  } catch (error) {
    console.error('Error deleting hero image:', error);
    return NextResponse.json(
      { error: 'Failed to delete hero image' },
      { status: 500 }
    );
  }
}
