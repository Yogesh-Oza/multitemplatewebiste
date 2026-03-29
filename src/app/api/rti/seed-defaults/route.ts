import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { DEFAULT_RTI_CLAUSES } from '@/lib/rti-default-clauses';

/**
 * Idempotent: creates missing mandatory disclosure rows from default clause keys (Phase 0 scaffolding).
 */
export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    let created = 0;
    for (const c of DEFAULT_RTI_CLAUSES) {
      const exists = await prisma.rtiMandatoryDisclosureItem.findFirst({
        where: { subdomainId, clauseKey: c.clauseKey },
      });
      if (exists) continue;
      await prisma.rtiMandatoryDisclosureItem.create({
        data: {
          subdomainId,
          clauseKey: c.clauseKey,
          titleMr: c.titleMr,
          titleEn: c.titleEn,
          contentMr: '',
          contentEn: '',
          isMandatory: c.isMandatory,
          order: created,
        },
      });
      created += 1;
    }

    return NextResponse.json({ created, message: created ? `Seeded ${created} clauses` : 'All clauses already present' });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
