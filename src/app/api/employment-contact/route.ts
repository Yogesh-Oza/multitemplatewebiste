import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  employmentContactInfoDemoData,
  EmploymentContactInfoData
} from '@/lib/demo-employment-skill';

const demoResponse = () => ({
  contacts: employmentContactInfoDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const contacts = await prisma.employmentContactInfo.findMany({
      where: { subdomainId, isActive: true }
    });

    if (contacts.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      contacts,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching employment contact info:', error);
    return NextResponse.json(demoResponse(), { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const payload = body as EmploymentContactInfoData;

    // Check if contact info for this section already exists
    const existing = await prisma.employmentContactInfo.findFirst({
      where: { subdomainId, section: payload.section }
    });

    let contact;

    if (existing) {
      contact = await prisma.employmentContactInfo.update({
        where: { id: existing.id },
        data: {
          ...payload,
          subdomainId,
          isActive: payload.isActive ?? existing.isActive
        }
      });

      await logCrudActivity(
        request,
        'UPDATE',
        'EmploymentContactInfo',
        contact.id,
        `Updated employment contact info for section ${payload.section}`
      );
    } else {
      contact = await prisma.employmentContactInfo.create({
        data: {
          ...payload,
          subdomainId
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'EmploymentContactInfo',
        contact.id,
        `Created employment contact info for section ${payload.section}`
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving employment contact info:', error);
    return NextResponse.json(
      { error: 'Failed to save employment contact info' },
      { status: 500 }
    );
  }
}

