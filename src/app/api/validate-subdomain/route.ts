import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get('subdomain');

    if (!subdomain) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Subdomain parameter required' 
      });
    }

    const subdomainData = await prisma.subdomain.findUnique({
      where: { subdomain },
      select: { isActive: true, villageName: true }
    });

    if (!subdomainData || !subdomainData.isActive) {
      return NextResponse.json({ 
        valid: false, 
        message: 'Subdomain not found or inactive' 
      });
    }

    return NextResponse.json({ 
      valid: true, 
      villageName: subdomainData.villageName 
    });

  } catch (error) {
    console.error('Error validating subdomain:', error);
    return NextResponse.json({ 
      valid: false, 
      message: 'Error validating subdomain' 
    });
  }
}
