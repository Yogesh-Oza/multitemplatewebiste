import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

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

    // Verify the leader belongs to this subdomain
    const existingLeader = await prisma.leader.findFirst({
      where: { id, subdomainId }
    });

    if (!existingLeader) {
      return NextResponse.json({ 
        message: 'Leader not found or access denied' 
      }, { status: 404 });
    }

    await prisma.leader.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'Leader', id, `Deleted leader: ${existingLeader.name} (${existingLeader.role})`);

    return NextResponse.json({ message: 'Leader deleted successfully' });
  } catch (error) {
    console.error('Error deleting leader:', error);
    return NextResponse.json(
      { error: 'Failed to delete leader' },
      { status: 500 }
    );
  }
}

