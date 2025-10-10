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

    const teamMembers = await prisma.teamMember.findMany({
      where: { subdomainId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
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
    const { name, nameEn, designation, designationEn, phone, email, imageUrl, isActive, order } = body;

    console.log('Team Members API - Create data:', body);

    const teamMember = await prisma.teamMember.create({
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
        subdomainId,
      },
    });

    console.log('Team Members API - Created team member:', teamMember);

    return NextResponse.json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: 'Failed to create team member' },
      { status: 500 }
    );
  }
}
