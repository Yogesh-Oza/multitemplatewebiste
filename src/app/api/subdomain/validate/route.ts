import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json(
        { valid: false, error: 'Subdomain parameter is required' },
        { status: 400 }
      );
    }

    // Check if subdomain exists
    const existingSubdomain = await prisma.subdomain.findUnique({
      where: { subdomain },
      select: {
        id: true,
        subdomain: true,
        villageName: true,
        villageNameEn: true,
        isActive: true
      }
    });

    if (!existingSubdomain) {
      return NextResponse.json({
        valid: false,
        error: 'Subdomain not found'
      });
    }

    if (!existingSubdomain.isActive) {
      return NextResponse.json({
        valid: false,
        error: 'Subdomain is inactive'
      });
    }

    return NextResponse.json({
      valid: true,
      subdomain: existingSubdomain
    });

  } catch (error) {
    console.error('Subdomain validation error:', error);
    return NextResponse.json(
      { valid: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}