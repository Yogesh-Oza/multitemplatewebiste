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

    const metric = await prisma.progressMetric.findFirst({
      where: { id, subdomainId }
    });

    if (!metric) {
      return NextResponse.json({ 
        message: 'Metric not found or access denied' 
      }, { status: 404 });
    }

    await prisma.progressMetric.delete({
      where: { id }
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'ProgressMetric', id, `Deleted progress metric: ${metric.label}`);

    return NextResponse.json({ message: 'Metric deleted successfully' });
  } catch (error) {
    console.error('Error deleting progress metric:', error);
    return NextResponse.json(
      { error: 'Failed to delete progress metric' },
      { status: 500 }
    );
  }
}

