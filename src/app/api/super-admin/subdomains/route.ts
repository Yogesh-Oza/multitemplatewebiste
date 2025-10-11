import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sendSubdomainEmail } from '@/lib/email';
import { generatePassword } from '@/lib/utils';

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
      description,
      districtId,
      districtName,
      subDistrictId,
      subDistrictName,
      villageId,
      villageNameLocal,
      sendEmail = true,
      status = 'active',
      isActive = true
    } = body;

    // Generate admin credentials
    const adminUsername = 'admin';
    const adminPassword = generatePassword();
    
    // Hash the admin password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    // Clean phone number
    const cleanPhone = phone.replace(/\D/g, '');

    // Create subdomain record and admin user in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create subdomain record
      const newSubdomain = await tx.subdomain.create({
        data: {
          subdomain,
          villageName,
          villageNameEn,
          contactPerson,
          email,
          phone: cleanPhone,
          address,
          description: description || '',
          districtId: districtId || '',
          districtName: districtName || '',
          subDistrictId: subDistrictId || '',
          subDistrictName: subDistrictName || '',
          villageId: villageId || '',
          villageNameLocal: villageNameLocal || '',
          adminUsername,
          adminPassword: hashedPassword,
          status,
          isActive
        }
      });

      // Create admin user for this subdomain
      const adminUser = await tx.adminUser.create({
        data: {
          username: adminUsername,
          email,
          password: hashedPassword,
          role: 'admin',
          subdomainId: newSubdomain.id,
          isActive: true
        }
      });

      return { newSubdomain, adminUser };
    });

    // Send email with credentials if requested
    if (sendEmail) {
      try {
        await sendSubdomainEmail({
          to: email,
          subdomain,
          villageName,
          adminUsername,
          adminPassword,
          contactPerson
        });
      } catch (emailError) {
        console.error('Email sending failed:', emailError);
        // Don't fail the creation if email fails
      }
    }

    return NextResponse.json(result.newSubdomain);
  } catch (error) {
    console.error('Error creating subdomain:', error);
    return NextResponse.json(
      { error: 'Failed to create subdomain' },
      { status: 500 }
    );
  }
}
