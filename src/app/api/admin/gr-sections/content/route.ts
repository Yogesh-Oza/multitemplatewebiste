import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
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

    if (!sectionId || !subSectionId) {
      return NextResponse.json({ error: 'sectionId and subSectionId required' }, { status: 400 });
    }

    const row = await prisma.sectionContent.findUnique({
      where: {
        subdomainId_sectionId_subSectionId: {
          subdomainId,
          sectionId,
          subSectionId,
        },
      },
    });

    return NextResponse.json({
      content: (row?.content as Record<string, unknown>) || {},
      id: row?.id ?? null,
      updatedAt: row?.updatedAt ?? null,
    });
  } catch (error) {
    console.error('Error fetching section content:', error);
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const { sectionId, subSectionId, content } = body;

    if (!sectionId || !subSectionId) {
      return NextResponse.json({ error: 'sectionId and subSectionId required' }, { status: 400 });
    }

    const match = getSubsection(sectionId, subSectionId);
    if (!match) {
      return NextResponse.json({ error: 'Unknown section or subsection' }, { status: 404 });
    }

    const existing = await prisma.sectionContent.findUnique({
      where: {
        subdomainId_sectionId_subSectionId: {
          subdomainId,
          sectionId,
          subSectionId,
        },
      },
    });

    const row = existing
      ? await prisma.sectionContent.update({
          where: { id: existing.id },
          data: { content: content ?? {} },
        })
      : await prisma.sectionContent.create({
          data: {
            subdomainId,
            sectionId,
            subSectionId,
            content: content ?? {},
          },
        });

    await logCrudActivity(
      request,
      existing ? 'UPDATE' : 'CREATE',
      'SectionContent',
      row.id,
      `${match.section.titleMr} > ${match.subsection.titleMr} माहिती ${existing ? 'अपडेट' : 'जोडली'}`
    );

    // Also bump tracker
    await prisma.sectionUpdateTracker.upsert({
      where: {
        subdomainId_sectionId_subSectionId: {
          subdomainId,
          sectionId,
          subSectionId,
        },
      },
      create: {
        subdomainId,
        sectionId,
        subSectionId,
        refreshDays: match.subsection.defaultRefreshDays,
        lastUpdatedAt: new Date(),
      },
      update: {
        lastUpdatedAt: new Date(),
      },
    });

    return NextResponse.json({
      id: row.id,
      content: row.content,
      updatedAt: row.updatedAt,
    });
  } catch (error) {
    console.error('Error saving section content:', error);
    return NextResponse.json({ error: 'Failed to save content' }, { status: 500 });
  }
}
