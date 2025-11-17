import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

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
    const { title, titleEn, description, descriptionEn, type, mediaUrl, category, isActive, order } = body;

    console.log('Gallery API - Update data:', body);

    const galleryItem = await prisma.gallery.update({
      where: { 
        id: id,
        subdomainId // Ensure the gallery item belongs to this subdomain
      },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        type,
        mediaUrl,
        category,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      },
    });

    console.log('Gallery API - Updated gallery item:', galleryItem);

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Gallery', galleryItem.id, `Updated gallery item: ${galleryItem.title}`);

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
    
    // Get gallery item before deleting for logging
    const existingItem = await prisma.gallery.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Gallery item not found or access denied' 
      }, { status: 404 });
    }

    await prisma.gallery.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Gallery', id, `Deleted gallery item: ${existingItem.title}`);

    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete gallery item' },
      { status: 500 }
    );
  }
}