import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { applyDefaultGovernanceTemplateToSubdomain } from '@/lib/apply-default-governance-template';
import { sendSubdomainEmail } from '@/lib/email';
import { generatePassword } from '@/lib/utils';
import bcrypt from 'bcryptjs';

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
      description,
      districtId,
      districtName,
      subDistrictId,
      subDistrictName,
      villageId,
      villageNameLocal
    } = body;


    // Validate required fields
    if (!subdomain || !villageName || !villageNameEn || !contactPerson || !email || !phone || !districtId || !subDistrictId || !villageId) {
      return NextResponse.json(
        { error: 'कृपया सर्व आवश्यक फील्ड भरा' },
        { status: 400 }
      );
    }

    // Enhanced subdomain validation
    const subdomainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
    if (!subdomainRegex.test(subdomain) || subdomain.length < 3 || subdomain.length > 20) {
      return NextResponse.json(
        { error: 'अवैध सबडोमेन स्वरूप. फक्त लोअरकेस अक्षरे, संख्या आणि हायफन वापरा (3-20 अक्षरे)' },
        { status: 400 }
      );
    }

    // Check for reserved words
    const reservedWords = ['www', 'admin', 'api', 'mail', 'ftp', 'blog', 'shop', 'app', 'test', 'dev', 'staging', 'production'];
    if (reservedWords.includes(subdomain.toLowerCase())) {
      return NextResponse.json(
        { error: 'हे सबडोमेन आरक्षित आहे आणि वापरले जाऊ शकत नाही' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'कृपया वैध ईमेल पत्ता प्रविष्ट करा' },
        { status: 400 }
      );
    }

    // Validate phone number (Indian mobile)
    const cleanPhone = phone.replace(/\D/g, '');
    const indianMobileRegex = /^[6-9]\d{9}$/;
    const withCountryCode = cleanPhone.startsWith('91') && indianMobileRegex.test(cleanPhone.slice(2));
    if (!indianMobileRegex.test(cleanPhone) && !withCountryCode) {
      return NextResponse.json(
        { error: 'कृपया वैध भारतीय मोबाइल नंबर प्रविष्ट करा (6-9 ने सुरू होणारे 10 अंक)' },
        { status: 400 }
      );
    }

    // Check if subdomain already exists
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: { subdomain }
    });

    if (existingSubdomain) {
      return NextResponse.json(
        { error: 'हे सबडोमेन आधीच वापरात आहे. कृपया दुसरे नाव वापरा' },
        { status: 409 }
      );
    }

    // Check if email already exists in subdomain table
    const existingEmail = await prisma.subdomain.findFirst({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'हे ईमेल आधीच नोंदणीकृत आहे. कृपया दुसरा ईमेल वापरा' },
        { status: 409 }
      );
    }

    // Check if email already exists in admin users table
    const existingAdminEmail = await prisma.adminUser.findFirst({
      where: { email }
    });

    if (existingAdminEmail) {
      return NextResponse.json(
        { error: 'हे ईमेल आधीच व्यवस्थापक म्हणून नोंदणीकृत आहे. कृपया दुसरा ईमेल वापरा' },
        { status: 409 }
      );
    }

    // Check if phone already exists
    const existingPhone = await prisma.subdomain.findFirst({
      where: { phone: cleanPhone }
    });

    if (existingPhone) {
      return NextResponse.json(
        { error: 'हे फोन नंबर आधीच नोंदणीकृत आहे. कृपया दुसरा नंबर वापरा' },
        { status: 409 }
      );
    }

    // Generate admin credentials
    const adminPassword = generatePassword();
    const adminUsername = `${subdomain}_admin`;
    
    // Check if admin username already exists
    const existingAdminUsername = await prisma.adminUser.findFirst({
      where: { username: adminUsername }
    });

    if (existingAdminUsername) {
      return NextResponse.json(
        { error: 'हे व्यवस्थापक वापरकर्ता नाव आधीच वापरात आहे. कृपया दुसरा सबडोमेन वापरा' },
        { status: 409 }
      );
    }
    
    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

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
           adminPassword: hashedPassword, // Store hashed password
           status: 'active', // Immediately activated
           isActive: true
        }
      });

      // Create admin user for this subdomain
      const adminUser = await tx.adminUser.create({
        data: {
          username: adminUsername,
          email,
          password: hashedPassword, // Store hashed password
          role: 'admin',
          subdomainId: newSubdomain.id,
          isActive: true
        }
      });

      return { newSubdomain, adminUser };
    });

    try {
      await applyDefaultGovernanceTemplateToSubdomain(prisma, {
        id: result.newSubdomain.id,
        subdomain: result.newSubdomain.subdomain,
        phone: result.newSubdomain.phone,
        email: result.newSubdomain.email,
        address: result.newSubdomain.address,
      });
    } catch (seedErr) {
      console.error('Default governance template for new subdomain failed:', seedErr);
    }

    // Send email with credentials
    let emailSent = false;
    try {
      const emailResult = await sendSubdomainEmail({
        to: email,
        subdomain,
        villageName,
        adminUsername,
        adminPassword,
        contactPerson
      });
      emailSent = emailResult.success;
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'सबडोमेन यशस्वीरित्या तयार झाले',
      subdomain: result.newSubdomain.subdomain,
      adminUrl: `https://${subdomain}.mahagp.in/admin`,
      credentials: {
        username: adminUsername,
        password: adminPassword
      },
      emailSent: emailSent
    });

  } catch (error) {
    console.error('Subdomain registration error:', error);
    return NextResponse.json(
      { error: 'आंतरिक सर्व्हर त्रुटी' },
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
