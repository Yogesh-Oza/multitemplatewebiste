import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const culturalHeritage = await prisma.culturalHeritage.findMany({
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
    const body = await request.json();
    const { id, title, titleEn, description, descriptionEn, imageUrl, category } = body;

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
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
