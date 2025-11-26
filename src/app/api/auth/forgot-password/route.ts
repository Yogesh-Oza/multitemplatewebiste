import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'ईमेल किंवा वापरकर्ता नाव आवश्यक आहे' },
        { status: 400 }
      );
    }

    // Find user by email or username
    const adminUser = await prisma.adminUser.findFirst({
      where: {
        OR: [
          { email: email },
          { username: email },
        ],
        isActive: true,
      },
      include: {
        subdomain: true,
      },
    });

    // Always return success to prevent email enumeration
    if (!adminUser) {
      return NextResponse.json({
        message: 'जर हा ईमेल अस्तित्वात असेल, तर पासवर्ड रीसेट लिंक पाठवला जाईल',
      });
    }

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date();
    resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1); // 1 hour expiry

    // Store token in database
    await prisma.adminUser.update({
      where: { id: adminUser.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetTokenExpiry: resetTokenExpiry,
      },
    });

    // Send reset email
    try {
      const emailResult = await sendPasswordResetEmail({
        to: adminUser.email,
        username: adminUser.username,
        resetToken,
        subdomain: adminUser.subdomain?.subdomain,
      });

      if (!emailResult.success) {
        console.error('❌ Password reset email failed to send:', {
          email: adminUser.email,
          username: adminUser.username,
          error: emailResult.error,
          timestamp: new Date().toISOString(),
        });
        // Log detailed error for debugging
        console.error('Email sending error details:', {
          hasGmailConfig: !!(process.env.GMAIL_USER && process.env.GMAIL_PASS),
          errorMessage: emailResult.error,
        });
      } else {
        console.log('✅ Password reset email sent successfully:', {
          email: adminUser.email,
          messageId: emailResult.messageId,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (emailError: any) {
      console.error('❌ Exception while sending password reset email:', {
        email: adminUser.email,
        username: adminUser.username,
        error: emailError?.message || 'Unknown error',
        stack: emailError?.stack,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      message: 'जर हा ईमेल अस्तित्वात असेल, तर पासवर्ड रीसेट लिंक पाठवला जाईल',
    });
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { error: 'काहीतरी चुकीचे झाले. कृपया पुन्हा प्रयत्न करा.' },
      { status: 500 }
    );
  }
}

