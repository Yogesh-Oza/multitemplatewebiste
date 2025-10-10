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
    const { name, nameEn, designation, designationEn, phone, email, imageUrl, isActive, order } = body;

    console.log('Team Members API - Update data:', body);

    const teamMember = await prisma.teamMember.update({
      where: { 
        id: id,
        subdomainId // Ensure the team member belongs to this subdomain
      },
      data: {
        name,
        nameEn,
        designation,
        designationEn,
        phone,
        email,
        imageUrl,
        isActive: isActive !== undefined ? isActive : true,
        order: order || 0,
      },
    });

    console.log('Team Members API - Updated team member:', teamMember);

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { error: 'Failed to update team member' },
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
    await prisma.teamMember.delete({
      where: { 
        id: id,
        subdomainId // Ensure the team member belongs to this subdomain
      },
    });

    return NextResponse.json({ message: 'Team member deleted successfully' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
