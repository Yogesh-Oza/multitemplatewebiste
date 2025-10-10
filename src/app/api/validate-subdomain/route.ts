import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');
    const email = searchParams.get('email');
    const phone = searchParams.get('phone');

    if (subdomain) {
      // Check subdomain availability
      const existingSubdomain = await prisma.subdomain.findUnique({
        where: { subdomain }
      });

      if (existingSubdomain) {
        return NextResponse.json(
          { error: 'हे सबडोमेन आधीच वापरात आहे. कृपया दुसरे नाव वापरा' },
          { status: 409 }
        );
      }

      return NextResponse.json({ available: true, message: 'सबडोमेन उपलब्ध आहे' });
    }

    if (email) {
      // Check email availability
      const existingEmail = await prisma.subdomain.findFirst({
        where: { email }
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: 'हे ईमेल आधीच नोंदणीकृत आहे. कृपया दुसरा ईमेल वापरा' },
          { status: 409 }
        );
      }

      return NextResponse.json({ available: true, message: 'ईमेल उपलब्ध आहे' });
    }

    if (phone) {
      // Clean phone number
      const cleanPhone = phone.replace(/\D/g, '');
      
      // Check phone availability
      const existingPhone = await prisma.subdomain.findFirst({
        where: { phone: cleanPhone }
      });

      if (existingPhone) {
        return NextResponse.json(
          { error: 'हे फोन नंबर आधीच नोंदणीकृत आहे. कृपया दुसरा नंबर वापरा' },
          { status: 409 }
        );
      }

      return NextResponse.json({ available: true, message: 'फोन नंबर उपलब्ध आहे' });
    }

    return NextResponse.json(
      { error: 'कृपया सबडोमेन, ईमेल किंवा फोन नंबर प्रदान करा' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { error: 'आंतरिक सर्व्हर त्रुटी' },
      { status: 500 }
    );
  }
}