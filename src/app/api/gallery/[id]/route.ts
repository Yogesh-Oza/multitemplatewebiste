import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

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
    const { title, titleEn, description, descriptionEn, imageUrl, category, isActive, order } = body;

    // Verify the gallery item belongs to this subdomain
    const existingItem = await prisma.gallery.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Gallery item not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const galleryItem = await prisma.gallery.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        imageUrl,
        category,
        isActive,
        order,
      },
    });

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update gallery item' },
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

    // Verify the gallery item belongs to this subdomain
    const existingItem = await prisma.gallery.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Gallery item not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.gallery.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}
