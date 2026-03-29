import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const yearsParam = searchParams.get('years');
    const yearParam = searchParams.get('year');

    let years: number[] | undefined;
    if (yearsParam) {
      years = yearsParam
        .split(',')
        .map((y) => parseInt(y.trim(), 10))
        .filter((n) => !Number.isNaN(n));
    } else if (yearParam) {
      const y = parseInt(yearParam, 10);
      if (!Number.isNaN(y)) years = [y];
    }

    const list = await prisma.villageStatistics.findMany({
      where: {
        subdomainId,
        ...(years && years.length ? { year: { in: years } } : {}),
      },
      orderBy: { year: 'desc' },
    });

    return NextResponse.json(list);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load statistics' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const year = Number(body.year);
    if (Number.isNaN(year)) {
      return NextResponse.json({ error: 'year is required' }, { status: 400 });
    }

    const row = await prisma.villageStatistics.upsert({
      where: {
        subdomainId_year: { subdomainId, year },
      },
      create: {
        subdomainId,
        year,
        population: Number(body.population) || 0,
        voters: Number(body.voters) || 0,
        wards: Number(body.wards) || 0,
        schools: body.schools != null ? Number(body.schools) : null,
        anganwadis: body.anganwadis != null ? Number(body.anganwadis) : null,
        sourceMr: body.sourceMr ?? null,
        sourceEn: body.sourceEn ?? null,
      },
      update: {
        population: Number(body.population) || 0,
        voters: Number(body.voters) || 0,
        wards: Number(body.wards) || 0,
        schools: body.schools != null ? Number(body.schools) : null,
        anganwadis: body.anganwadis != null ? Number(body.anganwadis) : null,
        sourceMr: body.sourceMr ?? null,
        sourceEn: body.sourceEn ?? null,
      },
    });

    await logCrudActivity(request, 'UPDATE', 'VillageStatistics', row.id, `Village stats ${year}`);
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save statistics' }, { status: 500 });
  }
}
