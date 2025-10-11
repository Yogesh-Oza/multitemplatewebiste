import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is super admin
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const subdomain = await prisma.subdomain.findUnique({
      where: { id }
    });

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    return NextResponse.json(subdomain);
  } catch (error) {
    console.error('Error fetching subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subdomain' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is super admin
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      subdomain, 
      villageName, 
      villageNameEn, 
      contactPerson, 
      email, 
      phone, 
      address,
      status,
      isActive,
      adminUsername,
      adminPassword
    } = body;

    const updateData: any = {
      subdomain,
      villageName,
      villageNameEn,
      contactPerson,
      email,
      phone,
      address,
      status,
      isActive
    };

    // Only update admin credentials if provided
    if (adminUsername) {
      updateData.adminUsername = adminUsername;
    }
    
    if (adminPassword) {
      const bcrypt = require('bcryptjs');
      updateData.adminPassword = await bcrypt.hash(adminPassword, 12);
    }

    const updatedSubdomain = await prisma.subdomain.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedSubdomain);
  } catch (error) {
    console.error('Error updating subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to update subdomain' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check if user is super admin
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    // Check if subdomain exists
    const subdomain = await prisma.subdomain.findUnique({
      where: { id }
    });

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    // Delete the subdomain (this will cascade delete related data)
    await prisma.subdomain.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Subdomain deleted successfully' });
  } catch (error) {
    console.error('Error deleting subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to delete subdomain' },
      { status: 500 }
    );
  }
}
