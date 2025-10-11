import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const departments = await prisma.department.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(departments);
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch departments' },
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
    const { name, nameEn, description, descriptionEn, head, headEn, phone, email, address, addressEn, workingHours, workingHoursEn, isActive } = body;

    const department = await prisma.department.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        head: head || '',
        headEn: headEn || '',
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

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json(
      { error: 'Failed to create department' },
      { status: 500 }
    );
  }
}
