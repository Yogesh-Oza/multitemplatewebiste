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
    const { name, nameEn, description, descriptionEn, category, location, contactInfo, workingHours, isActive, imageUrl } = body;

    // Verify the facility belongs to this subdomain
    const existingFacility = await prisma.facility.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingFacility) {
      return NextResponse.json({ 
        message: 'Facility not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const facility = await prisma.facility.update({
      where: { id },
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        category,
        location,
        contactInfo,
        workingHours,
        isActive,
        imageUrl,
      },
    });

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error updating facility:', error);
    return NextResponse.json(
      { error: 'Failed to update facility' },
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

    // Verify the facility belongs to this subdomain
    const existingFacility = await prisma.facility.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingFacility) {
      return NextResponse.json({ 
        message: 'Facility not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.facility.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    console.error('Error deleting facility:', error);
    return NextResponse.json(
      { error: 'Failed to delete facility' },
      { status: 500 }
    );
  }
}
