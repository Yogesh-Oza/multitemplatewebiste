import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.json(
        { error: 'Tracking code is required' },
        { status: 400 }
      );
    }

    const complaint = await prisma.complaint.findFirst({
      where: { 
        trackingCode: code,
        subdomainId 
      }
    });

    if (!complaint) {
      return NextResponse.json({ 
        message: 'Complaint not found with this tracking code' 
      }, { status: 404 });
    }

    // Return only public information
    const publicComplaint = {
      id: complaint.id,
      subject: complaint.subject,
      status: complaint.status,
      priority: complaint.priority,
      trackingCode: complaint.trackingCode,
      history: complaint.history,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt
    };

    return NextResponse.json(publicComplaint);
  } catch (error) {
    console.error('Error tracking complaint:', error);
    return NextResponse.json(
      { error: 'Failed to track complaint' },
      { status: 500 }
    );
  }
}
