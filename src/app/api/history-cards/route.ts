import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const historyCards = await prisma.historyCard.findMany({
      where: { subdomainId },
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
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

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
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'HistoryCard', historyCard.id, `Created history card: ${title}`);

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
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, title, titleEn, description, descriptionEn, gradient, icon } = body;

    // Verify the history card belongs to this subdomain
    const existingCard = await prisma.historyCard.findFirst({
      where: { id, subdomainId }
    });

    if (!existingCard) {
      return NextResponse.json({ 
        message: 'History card not found or access denied' 
      }, { status: 404 });
    }

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

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'HistoryCard', historyCard.id, `Updated history card: ${title}`);

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

    // Verify the history card belongs to this subdomain
    const existingCard = await prisma.historyCard.findFirst({
      where: { id, subdomainId }
    });

    if (!existingCard) {
      return NextResponse.json({ 
        message: 'History card not found or access denied' 
      }, { status: 404 });
    }

    await prisma.historyCard.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'HistoryCard', id, `Deleted history card: ${existingCard.title}`);

    return NextResponse.json({ message: 'History card deleted successfully' });
  } catch (error) {
    console.error('Error deleting history card:', error);
    return NextResponse.json(
      { error: 'Failed to delete history card' },
      { status: 500 }
    );
  }
}
