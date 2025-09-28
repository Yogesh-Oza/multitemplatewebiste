import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const heroImages = await prisma.heroImage.findMany({
      where: { isActive: true },
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
    const body = await request.json();
    const { imageUrl, altText, isActive } = body;

    const heroImage = await prisma.heroImage.create({
      data: {
        imageUrl,
        altText,
        isActive: isActive || true,
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
    const body = await request.json();
    const { id, imageUrl, altText, isActive } = body;

    const heroImage = await prisma.heroImage.update({
      where: { id },
      data: {
        imageUrl,
        altText,
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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
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
