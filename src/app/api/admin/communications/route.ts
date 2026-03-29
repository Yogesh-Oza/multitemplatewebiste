import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { parseCommunicationKind } from '@/lib/services/communications';

/** Admin list: no publish/expire window filter */
export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }
    const { searchParams } = new URL(request.url);
    const kind = parseCommunicationKind(searchParams.get('kind'));
    const where = {
      subdomainId,
      ...(kind ? { kind } : {}),
    };
    const items = await prisma.communicationPost.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 300,
    });
    return NextResponse.json(items);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load' }, { status: 500 });
  }
}
