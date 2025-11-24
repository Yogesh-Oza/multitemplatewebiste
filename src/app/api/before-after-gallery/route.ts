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

    const galleryItems = await prisma.beforeAfterGallery.findMany({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(galleryItems);
  } catch (error) {
    console.error('Error fetching before/after gallery:', error);
    return NextResponse.json(
      { error: 'Failed to fetch before/after gallery' },
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
    const { 
      title, 
      titleEn, 
      beforeImage, 
      afterImage, 
      description, 
      descriptionEn, 
      impact, 
      impactEn, 
      year, 
      cost, 
      category, 
      categoryEn, 
      order, 
      isActive 
    } = body;

    const galleryItem = await prisma.beforeAfterGallery.create({
      data: {
        title,
        titleEn,
        beforeImage,
        afterImage,
        description,
        descriptionEn,
        impact,
        impactEn,
        year,
        cost,
        category,
        categoryEn,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'BeforeAfterGallery', galleryItem.id, `Created before/after gallery item: ${title}`);

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error creating before/after gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to create before/after gallery item' },
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
    const { 
      id,
      title, 
      titleEn, 
      beforeImage, 
      afterImage, 
      description, 
      descriptionEn, 
      impact, 
      impactEn, 
      year, 
      cost, 
      category, 
      categoryEn, 
      order, 
      isActive 
    } = body;

    // Verify the item belongs to this subdomain
    const existingItem = await prisma.beforeAfterGallery.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Gallery item not found or access denied' 
      }, { status: 404 });
    }

    const galleryItem = await prisma.beforeAfterGallery.update({
      where: { id },
      data: {
        title,
        titleEn,
        beforeImage,
        afterImage,
        description,
        descriptionEn,
        impact,
        impactEn,
        year,
        cost,
        category,
        categoryEn,
        order: order !== undefined ? order : existingItem.order,
        isActive: isActive !== undefined ? isActive : existingItem.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'BeforeAfterGallery', galleryItem.id, `Updated before/after gallery item: ${title}`);

    return NextResponse.json(galleryItem);
  } catch (error) {
    console.error('Error updating before/after gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to update before/after gallery item' },
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

    // Verify the item belongs to this subdomain
    const existingItem = await prisma.beforeAfterGallery.findFirst({
      where: { id, subdomainId }
    });

    if (!existingItem) {
      return NextResponse.json({ 
        message: 'Gallery item not found or access denied' 
      }, { status: 404 });
    }

    await prisma.beforeAfterGallery.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'BeforeAfterGallery', id, `Deleted before/after gallery item: ${existingItem.title}`);

    return NextResponse.json({ message: 'Before/after gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting before/after gallery item:', error);
    return NextResponse.json(
      { error: 'Failed to delete before/after gallery item' },
      { status: 500 }
    );
  }
}

