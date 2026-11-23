import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  GR_SECTIONS,
  computeRefreshStatus,
  getSectionById,
  getSubsection,
} from '@/lib/gr-sections';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const sectionId = searchParams.get('sectionId');

    const trackers = await prisma.sectionUpdateTracker.findMany({
      where: {
        subdomainId,
        ...(sectionId ? { sectionId } : {}),
      },
    });

    const trackerMap = new Map(
      trackers.map((t) => [`${t.sectionId}:${t.subSectionId}`, t])
    );

    const sections = (sectionId ? GR_SECTIONS.filter((s) => s.id === sectionId) : GR_SECTIONS).map(
      (section) => {
        const subsections = section.subsections.map((sub) => {
          const tracker = trackerMap.get(`${section.id}:${sub.id}`);
          const refreshDays = tracker?.refreshDays ?? sub.defaultRefreshDays;
          const computed = computeRefreshStatus(tracker?.lastUpdatedAt, refreshDays);
          return {
            id: sub.id,
            titleMr: sub.titleMr,
            titleEn: sub.titleEn,
            helpMr: sub.helpMr,
            infoOnly: !!sub.infoOnly,
            refreshDays,
            lastUpdatedAt: tracker?.lastUpdatedAt ?? null,
            lastUpdatedBy: tracker?.lastUpdatedBy ?? null,
            ...computed,
          };
        });

        const statuses = subsections.map((s) => s.status);
        let worst: 'ok' | 'warning' | 'overdue' | 'never' = 'ok';
        if (statuses.includes('overdue') || statuses.includes('never')) worst = 'overdue';
        else if (statuses.includes('warning')) worst = 'warning';

        const filled = subsections.filter((s) => s.status === 'ok' || s.status === 'warning').length;

        return {
          id: section.id,
          number: section.number,
          titleMr: section.titleMr,
          titleEn: section.titleEn,
          icon: section.icon,
          comingSoon: !!section.comingSoon,
          filled,
          total: subsections.length,
          worstStatus: section.comingSoon ? 'never' : worst,
          subsections,
        };
      }
    );

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching GR section trackers:', error);
    return NextResponse.json({ error: 'Failed to fetch trackers' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const { sectionId, subSectionId, refreshDays, markReviewed, lastUpdatedBy } = body;

    if (!sectionId || !subSectionId) {
      return NextResponse.json({ error: 'sectionId and subSectionId required' }, { status: 400 });
    }

    const match = getSubsection(sectionId, subSectionId);
    if (!match) {
      return NextResponse.json({ error: 'Unknown section or subsection' }, { status: 404 });
    }

    const existing = await prisma.sectionUpdateTracker.findUnique({
      where: {
        subdomainId_sectionId_subSectionId: {
          subdomainId,
          sectionId,
          subSectionId,
        },
      },
    });

    const data: {
      refreshDays?: number;
      lastUpdatedAt?: Date;
      lastUpdatedBy?: string;
    } = {};

    if (typeof refreshDays === 'number' && refreshDays >= 1) {
      data.refreshDays = Math.floor(refreshDays);
    }

    if (markReviewed) {
      data.lastUpdatedAt = new Date();
      if (lastUpdatedBy) data.lastUpdatedBy = String(lastUpdatedBy);
    }

    const tracker = existing
      ? await prisma.sectionUpdateTracker.update({
          where: { id: existing.id },
          data,
        })
      : await prisma.sectionUpdateTracker.create({
          data: {
            subdomainId,
            sectionId,
            subSectionId,
            refreshDays:
              typeof refreshDays === 'number' && refreshDays >= 1
                ? Math.floor(refreshDays)
                : match.subsection.defaultRefreshDays,
            lastUpdatedAt: markReviewed ? new Date() : undefined,
            lastUpdatedBy: markReviewed && lastUpdatedBy ? String(lastUpdatedBy) : undefined,
          },
        });

    if (markReviewed) {
      await logCrudActivity(
        request,
        'UPDATE',
        'SectionUpdateTracker',
        tracker.id,
        `माहिती तपासली: ${match.section.titleMr} > ${match.subsection.titleMr}`
      );
    } else if (typeof refreshDays === 'number') {
      await logCrudActivity(
        request,
        'UPDATE',
        'SectionUpdateTracker',
        tracker.id,
        `अद्ययावत कालावधी बदलला (${refreshDays} दिवस): ${match.subsection.titleMr}`
      );
    }

    const section = getSectionById(sectionId);
    const computed = computeRefreshStatus(
      tracker.lastUpdatedAt,
      tracker.refreshDays ?? match.subsection.defaultRefreshDays
    );

    return NextResponse.json({
      tracker,
      sectionTitle: section?.titleMr,
      subTitle: match.subsection.titleMr,
      ...computed,
    });
  } catch (error) {
    console.error('Error updating GR section tracker:', error);
    return NextResponse.json({ error: 'Failed to update tracker' }, { status: 500 });
  }
}
