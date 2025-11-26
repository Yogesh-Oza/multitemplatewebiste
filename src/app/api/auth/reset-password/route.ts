import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: 'टोकन आणि नवीन पासवर्ड आवश्यक आहे' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'पासवर्ड किमान 6 वर्णांचा असावा' },
        { status: 400 }
      );
    }

    // Find user with valid token
    const adminUser = await prisma.adminUser.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetTokenExpiry: {
          gt: new Date(), // Token not expired
        },
        isActive: true,
      },
    });

    if (!adminUser) {
      return NextResponse.json(
        { error: 'अवैध किंवा कालबाह्य झालेला टोकन' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update password and clear reset token
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: 'पासवर्ड यशस्वीरित्या रीसेट केला गेला',
    });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json(
      { error: 'काहीतरी चुकीचे झाले. कृपया पुन्हा प्रयत्न करा.' },
      { status: 500 }
    );
  }
}

