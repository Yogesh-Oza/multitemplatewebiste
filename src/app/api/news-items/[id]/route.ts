import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

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

    const newsItem = await prisma.newsItem.findFirst({
      where: { id, subdomainId }
    });

    if (!newsItem) {
      return NextResponse.json({ 
        message: 'News item not found or access denied' 
      }, { status: 404 });
    }

    await prisma.newsItem.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'News item deleted successfully' });
  } catch (error) {
    console.error('Error deleting news item:', error);
    return NextResponse.json(
      { error: 'Failed to delete news item' },
      { status: 500 }
    );
  }
}

