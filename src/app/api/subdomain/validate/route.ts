import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { error: 'सबडोमेन आवश्यक आहे' },
        { status: 400 }
      );
    }

    // Check if subdomain exists and is active
    const subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      select: {
        id: true,
        subdomain: true,
        isActive: true,
        status: true,
        villageName: true
      }
    });

    if (!subdomainData) {
      return NextResponse.json({
        valid: false,
        message: 'सबडोमेन सापडले नाही'
      });
    }

    if (!subdomainData.isActive || subdomainData.status !== 'active') {
      return NextResponse.json({
        valid: false,
        message: 'सबडोमेन सक्रिय नाही'
      });
    }

    return NextResponse.json({
      valid: true,
      message: 'सबडोमेन वैध आहे',
      subdomain: subdomainData
    });

  } catch (error) {
    console.error('Subdomain validation error:', error);
    return NextResponse.json(
      { error: 'आंतरिक सर्व्हर त्रुटी' },
      { status: 500 }
    );
  }
}
