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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const download = searchParams.get('download'); // For incrementing download counter
    const fileId = searchParams.get('id');

    // If download=true and id is provided, increment download counter
    if (download === 'true' && fileId) {
      const file = await prisma.downloadableFile.findFirst({
        where: { id: fileId, subdomainId }
      });

      if (file) {
        await prisma.downloadableFile.update({
          where: { id: fileId },
          data: { downloads: file.downloads + 1 }
        });
      }
    }

    // Build where clause
    const where: any = {
      subdomainId,
      isActive: true
    };

    if (category && category !== 'all') {
      where.category = category;
    }

    const files = await prisma.downloadableFile.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    // Filter by search term if provided
    let filteredFiles = files;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredFiles = files.filter(file => 
        file.name.toLowerCase().includes(searchLower) ||
        file.nameEn.toLowerCase().includes(searchLower) ||
        file.description.toLowerCase().includes(searchLower) ||
        file.descriptionEn.toLowerCase().includes(searchLower) ||
        (Array.isArray(file.tags) && file.tags.some((tag: string) => tag.toLowerCase().includes(searchLower)))
      );
    }

    return NextResponse.json(filteredFiles);
  } catch (error) {
    console.error('Error fetching downloadable files:', error);
    return NextResponse.json(
      { error: 'Failed to fetch downloadable files' },
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
      name, 
      nameEn, 
      description, 
      descriptionEn, 
      category, 
      type, 
      size, 
      url, 
      lastUpdated, 
      required, 
      tags, 
      order, 
      isActive 
    } = body;

    const file = await prisma.downloadableFile.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        category,
        type,
        size,
        url,
        downloads: 0,
        lastUpdated: lastUpdated || new Date().toISOString(),
        required: required || false,
        tags: tags || [],
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'DownloadableFile', file.id, `Created downloadable file: ${name}`);

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error creating downloadable file:', error);
    return NextResponse.json(
      { error: 'Failed to create downloadable file' },
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
      name, 
      nameEn, 
      description, 
      descriptionEn, 
      category, 
      type, 
      size, 
      url, 
      lastUpdated, 
      required, 
      tags, 
      order, 
      isActive 
    } = body;

    // Verify the file belongs to this subdomain
    const existingFile = await prisma.downloadableFile.findFirst({
      where: { id, subdomainId }
    });

    if (!existingFile) {
      return NextResponse.json({ 
        message: 'Downloadable file not found or access denied' 
      }, { status: 404 });
    }

    const file = await prisma.downloadableFile.update({
      where: { id },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        category,
        type,
        size,
        url,
        lastUpdated: lastUpdated || new Date().toISOString(),
        required: required !== undefined ? required : existingFile.required,
        tags: tags !== undefined ? tags : existingFile.tags,
        order: order !== undefined ? order : existingFile.order,
        isActive: isActive !== undefined ? isActive : existingFile.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'DownloadableFile', file.id, `Updated downloadable file: ${name}`);

    return NextResponse.json(file);
  } catch (error) {
    console.error('Error updating downloadable file:', error);
    return NextResponse.json(
      { error: 'Failed to update downloadable file' },
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

    // Verify the file belongs to this subdomain
    const existingFile = await prisma.downloadableFile.findFirst({
      where: { id, subdomainId }
    });

    if (!existingFile) {
      return NextResponse.json({ 
        message: 'Downloadable file not found or access denied' 
      }, { status: 404 });
    }

    await prisma.downloadableFile.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'DownloadableFile', id, `Deleted downloadable file: ${existingFile.name}`);

    return NextResponse.json({ message: 'Downloadable file deleted successfully' });
  } catch (error) {
    console.error('Error deleting downloadable file:', error);
    return NextResponse.json(
      { error: 'Failed to delete downloadable file' },
      { status: 500 }
    );
  }
}

