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
    const { title, titleEn, description, descriptionEn, date, time, location, category, imageUrl, status } = body;

    console.log('Programs API - Update data:', body);

    const program = await prisma.program.update({
      where: { 
        id: id,
        subdomainId // Ensure the program belongs to this subdomain
      },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        date: new Date(date),
        time,
        location,
        category,
        imageUrl,
        status,
      },
    });

    console.log('Programs API - Updated program:', program);

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Program', program.id, `Updated program: ${program.title}`);

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
    
    // Get program before deleting for logging
    const existingProgram = await prisma.program.findFirst({
      where: { id, subdomainId }
    });

    if (!existingProgram) {
      return NextResponse.json({ 
        message: 'Program not found or access denied' 
      }, { status: 404 });
    }

    await prisma.program.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Program', id, `Deleted program: ${existingProgram.title}`);

    return NextResponse.json({ message: 'Program deleted successfully' });
  } catch (error) {
    console.error('Error deleting program:', error);
    return NextResponse.json(
      { error: 'Failed to delete program' },
      { status: 500 }
    );
  }
}