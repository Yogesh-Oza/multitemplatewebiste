import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;

    const message = await prisma.dailyMessage.findFirst({
      where: { id, subdomainId }
    });

    if (!message) {
      return NextResponse.json({ 
        message: 'Daily message not found or access denied' 
      }, { status: 404 });
    }

    await prisma.dailyMessage.delete({
      where: { id }
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'DailyMessage', id, `Deleted daily message by ${message.authorTitle}`);

    return NextResponse.json({ message: 'Daily message deleted successfully' });
  } catch (error) {
    console.error('Error deleting daily message:', error);
    return NextResponse.json(
      { error: 'Failed to delete daily message' },
      { status: 500 }
    );
  }
}

