import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const officeDetails = await prisma.officeDetails.findFirst({
      where: { subdomainId }
    });

    return NextResponse.json(officeDetails);
  } catch (error) {
    console.error('Error fetching office details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch office details' },
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
    const { address, addressEn, phone, email, workingHours, workingHoursEn, isActive } = body;

    console.log('Office Details API - Create/Update data:', body);

    // Delete existing office details for this subdomain
    await prisma.officeDetails.deleteMany({
      where: { subdomainId }
    });

    // Create new office details
    const officeDetails = await prisma.officeDetails.create({
      data: {
        address,
        addressEn,
        phone,
        email,
        workingHours,
        workingHoursEn,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    console.log('Office Details API - Created office details:', officeDetails);

    return NextResponse.json(officeDetails);
  } catch (error) {
    console.error('Error creating/updating office details:', error);
    return NextResponse.json(
      { error: 'Failed to create/update office details' },
      { status: 500 }
    );
  }
}
