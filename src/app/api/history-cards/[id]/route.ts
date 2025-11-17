import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    const historyCard = await prisma.historyCard.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!historyCard) {
      return NextResponse.json({ 
        message: 'History card not found' 
      }, { status: 404 });
    }

    return NextResponse.json(historyCard);
  } catch (error) {
    console.error('Error fetching history card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch history card' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, titleEn, description, descriptionEn, gradient, icon, order, isActive } = body;

    // Verify the history card belongs to this subdomain
    const existingCard = await prisma.historyCard.findFirst({
      where: { 
        id,
        subdomainId 
      }
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
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    // Verify the history card belongs to this subdomain
    const existingCard = await prisma.historyCard.findFirst({
      where: { 
        id,
        subdomainId 
      }
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
