import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

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
    const { type, name, nameEn, designation, designationEn, phone, email, address, addressEn, workingHours, workingHoursEn, isActive } = body;

    console.log('Contacts API - Update data:', body);

    const contact = await prisma.contact.update({
      where: { 
        id: id,
        subdomainId // Ensure the contact belongs to this subdomain
      },
      data: {
        type,
        name,
        nameEn,
        designation,
        designationEn,
        phone,
        email,
        address,
        addressEn,
        workingHours,
        workingHoursEn,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    console.log('Contacts API - Updated contact:', contact);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    return NextResponse.json(
      { error: 'Failed to update contact' },
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
    await prisma.contact.delete({
      where: { 
        id: id,
        subdomainId // Ensure the contact belongs to this subdomain
      },
    });

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}