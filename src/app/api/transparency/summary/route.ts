import { NextRequest, NextResponse } from 'next/server';
import { validateSubdomain } from '@/lib/subdomain';
import { buildTransparencySummary } from '@/lib/services/transparency-summary';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const summary = await buildTransparencySummary(subdomainId);
    return NextResponse.json(summary);
  } catch (error) {
    console.error('transparency summary:', error);
    return NextResponse.json({ error: 'Failed to load summary' }, { status: 500 });
  }
}
