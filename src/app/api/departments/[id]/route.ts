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
    const { name, nameEn, description, descriptionEn, head, headEn, phone, email, address, addressEn, workingHours, workingHoursEn, isActive } = body;

    // Verify the department belongs to this subdomain
    const existingDepartment = await prisma.department.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingDepartment) {
      return NextResponse.json({ 
        message: 'Department not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const department = await prisma.department.update({
      where: { id },
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
        isActive,
      },
    });

    return NextResponse.json(department);
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json(
      { error: 'Failed to update department' },
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

    // Verify the department belongs to this subdomain
    const existingDepartment = await prisma.department.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingDepartment) {
      return NextResponse.json({ 
        message: 'Department not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.department.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Department deleted successfully' });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json(
      { error: 'Failed to delete department' },
      { status: 500 }
    );
  }
}
