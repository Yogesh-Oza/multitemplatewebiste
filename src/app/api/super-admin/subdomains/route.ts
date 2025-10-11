import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if user is super admin
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const subdomains = await prisma.subdomain.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(subdomains);
  } catch (error) {
    console.error('Error fetching subdomains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subdomains' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is super admin
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      subdomain, 
      villageName, 
      villageNameEn, 
      contactPerson, 
      email, 
      phone, 
      address,
      status = 'active',
      isActive = true,
      adminUsername = 'admin',
      adminPassword = 'admin123'
    } = body;

    // Hash the admin password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const newSubdomain = await prisma.subdomain.create({
      data: {
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
        adminPassword: hashedPassword
      }
    });

    return NextResponse.json(newSubdomain);
  } catch (error) {
    console.error('Error creating subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to create subdomain' },
      { status: 500 }
    );
  }
}
