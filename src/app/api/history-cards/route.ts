import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const historyCards = await prisma.historyCard.findMany({
      orderBy: { createdAt: 'asc' }
    });

    return NextResponse.json(historyCards);
  } catch (error) {
    console.error('Error fetching history cards:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history cards' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, titleEn, description, descriptionEn, gradient, icon } = body;

    const historyCard = await prisma.historyCard.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        gradient,
        icon,
      },
    });

    return NextResponse.json(historyCard);
  } catch (error) {
    console.error('Error creating history card:', error);
    return NextResponse.json(
      { error: 'Failed to create history card' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, titleEn, description, descriptionEn, gradient, icon } = body;

    const historyCard = await prisma.historyCard.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        gradient,
        icon,
      },
    });

    return NextResponse.json(historyCard);
  } catch (error) {
    console.error('Error updating history card:', error);
    return NextResponse.json(
      { error: 'Failed to update history card' },
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

    await prisma.historyCard.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'History card deleted successfully' });
  } catch (error) {
    console.error('Error deleting history card:', error);
    return NextResponse.json(
      { error: 'Failed to delete history card' },
      { status: 500 }
    );
  }
}
