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
    const { title, titleEn, description, descriptionEn, date, location, category, imageUrl, status } = body;

    // Verify the program belongs to this subdomain
    const existingProgram = await prisma.program.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingProgram) {
      return NextResponse.json({ 
        message: 'Program not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const program = await prisma.program.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        date: new Date(date),
        location,
        category,
        imageUrl,
        status,
      },
    });

    return NextResponse.json(program);
  } catch (error) {
    console.error('Error updating program:', error);
    return NextResponse.json(
      { error: 'Failed to update program' },
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

    // Verify the program belongs to this subdomain
    const existingProgram = await prisma.program.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingProgram) {
      return NextResponse.json({ 
        message: 'Program not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.program.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}
