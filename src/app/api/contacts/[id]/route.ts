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

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'Contact', contact.id, `Updated contact: ${contact.name}`);

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
    
    // Get contact before deleting for logging
    const existingContact = await prisma.contact.findFirst({
      where: { id, subdomainId }
    });

    if (!existingContact) {
      return NextResponse.json({ 
        message: 'Contact not found or access denied' 
      }, { status: 404 });
    }

    await prisma.contact.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Contact', id, `Deleted contact: ${existingContact.name}`);

    return NextResponse.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    return NextResponse.json(
      { error: 'Failed to delete contact' },
      { status: 500 }
    );
  }
}