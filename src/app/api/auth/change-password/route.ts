import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'प्रवेश नाकारला. कृपया लॉगिन करा.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'वर्तमान पासवर्ड आणि नवीन पासवर्ड आवश्यक आहे' },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'नवीन पासवर्ड किमान 6 वर्णांचा असावा' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = (session.user as any).id || (session.user as any).email;

    // Find user by email or ID
    const adminUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: session.user.email || '' },
          { id: userId },
        ],
        isActive: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'वापरकर्ता सापडला नाही' },
        { status: 404 }
      );
    }

    // Verify current password
    const passwordMatches = await bcrypt.compare(
      currentPassword,
      adminUser.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: 'वर्तमान पासवर्ड चुकीचा आहे' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json({
      message: 'पासवर्ड यशस्वीरित्या बदलला गेला',
    });
  } catch (error) {
    console.error('Error in change password:', error);
    return NextResponse.json(
      { error: 'काहीतरी चुकीचे झाले. कृपया पुन्हा प्रयत्न करा.' },
      { status: 500 }
    );
  }
}

