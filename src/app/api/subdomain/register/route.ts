import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendSubdomainEmail } from '@/lib/email';
import { generatePassword } from '@/lib/utils';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      subdomain, 
      villageName, 
      villageNameEn, 
      contactPerson, 
      email, 
      phone, 
      address, 
      description 
    } = body;

    // Validate required fields
    if (!subdomain || !villageName || !villageNameEn || !contactPerson || !email || !phone || !address) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Validate subdomain format
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain) || subdomain.length < 3 || subdomain.length > 20) {
      return NextResponse.json(
        { error: 'Invalid subdomain format' },
        { status: 400 }
      );
    }

    // Check if subdomain already exists
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: { subdomain }
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'Subdomain already exists' },
        { status: 409 }
      );
    }

    // Check if email already exists
    const existingEmail = await prisma.subdomain.findFirst({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Generate admin credentials
    const adminPassword = generatePassword();
    const adminUsername = `${subdomain}_admin`;

    // Create subdomain record
    const newSubdomain = await prisma.subdomain.create({
      data: {
        subdomain,
        villageName,
        villageNameEn,
        contactPerson,
        email,
        phone,
        address,
        description: description || '',
        adminUsername,
        adminPassword,
        status: 'pending', // Will be activated after DNS setup
        isActive: false
      }
    });

    // Create admin user for this subdomain
    await prisma.adminUser.create({
      data: {
        username: adminUsername,
        email,
        password: adminPassword, // In production, hash this password
        role: 'admin',
        subdomainId: newSubdomain.id,
        isActive: true
      }
    });

    // Send email with credentials
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
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Subdomain created successfully',
      subdomain: newSubdomain.subdomain,
      adminUrl: `https://${subdomain}.mahagp.in/admin`
    });

  } catch (error) {
    console.error('Subdomain registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain parameter required' },
        { status: 400 }
      );
    }

    const subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      include: {
        adminUsers: true
      }
    });

    if (!subdomainData) {
      return NextResponse.json(
        { error: 'Subdomain not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      subdomain: subdomainData.subdomain,
      villageName: subdomainData.villageName,
      villageNameEn: subdomainData.villageNameEn,
      status: subdomainData.status,
      isActive: subdomainData.isActive,
      createdAt: subdomainData.createdAt
    });

  } catch (error) {
    console.error('Subdomain fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
