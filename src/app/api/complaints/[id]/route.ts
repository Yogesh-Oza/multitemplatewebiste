import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const complaint = await prisma.complaint.findFirst({
      where: { 
        id, 
        subdomainId 
      }
    });

    if (!complaint) {
      return NextResponse.json({ 
        message: 'Complaint not found' 
      }, { status: 404 });
    }

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error fetching complaint:', error);
    return NextResponse.json(
      { error: 'Failed to fetch complaint' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { 
      status, 
      priority, 
      escalatedTo, 
      note 
    } = body;

    // Verify the complaint belongs to this subdomain
    const existingComplaint = await prisma.complaint.findFirst({
      where: { id, subdomainId }
    });

    if (!existingComplaint) {
      return NextResponse.json({ 
        message: 'Complaint not found or access denied' 
      }, { status: 404 });
    }

    // Update history
    const currentHistory = existingComplaint.history as any[];
    const newHistoryEntry = {
      status: status || existingComplaint.status,
      date: new Date().toISOString(),
      note: note || 'Status updated'
    };

    const updatedHistory = [...currentHistory, newHistoryEntry];

    const complaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: status || existingComplaint.status,
        priority: priority || existingComplaint.priority,
        escalatedTo: escalatedTo || existingComplaint.escalatedTo,
        history: updatedHistory,
      },
    });

    return NextResponse.json(complaint);
  } catch (error) {
    console.error('Error updating complaint:', error);
    return NextResponse.json(
      { error: 'Failed to update complaint' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    // Verify the complaint belongs to this subdomain
    const existingComplaint = await prisma.complaint.findFirst({
      where: { id, subdomainId }
    });

    if (!existingComplaint) {
      return NextResponse.json({ 
        message: 'Complaint not found or access denied' 
      }, { status: 404 });
    }

    await prisma.complaint.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Error deleting complaint:', error);
    return NextResponse.json(
      { error: 'Failed to delete complaint' },
      { status: 500 }
    );
  }
}
