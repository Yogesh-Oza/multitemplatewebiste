import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { getSubsection } from '@/lib/gr-sections';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');
    const subSectionId = searchParams.get('subSectionId');
    const limit = Math.min(Number(searchParams.get('limit') || 10), 50);

    if (!sectionId || !subSectionId) {
      return NextResponse.json({ error: 'sectionId and subSectionId required' }, { status: 400 });
    }

    const match = getSubsection(sectionId, subSectionId);
    if (!match) {
      return NextResponse.json({ error: 'Unknown section or subsection' }, { status: 404 });
    }

    const models = [
      ...match.subsection.models,
      'SectionUpdateTracker',
      'SectionContent',
    ];

    const logs = await prisma.activityLog.findMany({
      where: {
        subdomainId,
        model: { in: models },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Prefer logs that mention this subsection in description when models overlap
    const filtered = logs.filter((log) => {
      if (match.subsection.models.includes(log.model)) return true;
      if (log.model === 'SectionContent' || log.model === 'SectionUpdateTracker') {
        return (
          log.description.includes(match.subsection.titleMr) ||
          log.description.includes(subSectionId) ||
          log.description.includes(sectionId)
        );
      }
      return false;
    });

    return NextResponse.json({
      activities: filtered.slice(0, limit),
    });
  } catch (error) {
    console.error('Error fetching GR section activity:', error);
    return NextResponse.json({ error: 'Failed to fetch activity' }, { status: 500 });
  }
}
