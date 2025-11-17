import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const contacts = await prisma.contact.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
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
    const { type, name, nameEn, designation, designationEn, phone, email, address, addressEn, workingHours, workingHoursEn, isActive } = body;

    console.log('Contacts API - Create data:', body);

    const contact = await prisma.contact.create({
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
        subdomainId,
      },
    });

    console.log('Contacts API - Created contact:', contact);

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Contact', contact.id, `Created contact: ${name}`);

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to create contact' },
      { status: 500 }
    );
  }
}
