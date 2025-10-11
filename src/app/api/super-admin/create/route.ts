import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await prisma.adminUser.findFirst({
      where: { role: 'super_admin' }
    });

    if (existingSuperAdmin) {
      return NextResponse.json({ 
        message: 'Super admin already exists',
        user: {
          username: existingSuperAdmin.username,
          email: existingSuperAdmin.email,
          role: existingSuperAdmin.role
        }
      });
    }

    // Create super admin user
    const hashedPassword = await bcrypt.hash('admin123', 12);
    
    const superAdmin = await prisma.adminUser.create({
      data: {
        username: 'superadmin',
        email: 'admin@mahagp.in',
        password: hashedPassword,
        role: 'super_admin',
        isActive: true
      }
    });

    return NextResponse.json({
      message: 'Super admin created successfully',
      user: {
        username: superAdmin.username,
        email: superAdmin.email,
        role: superAdmin.role,
        password: 'admin123' // Only for initial creation
      }
    });
  } catch (error) {
    console.error('Error creating super admin:', error);
    return NextResponse.json(
      { error: 'Failed to create super admin' },
      { status: 500 }
    );
  }
}
