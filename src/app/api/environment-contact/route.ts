import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  environmentContactInfoDemoData,
  EnvironmentContactInfoData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  contacts: environmentContactInfoDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const contacts = await prisma.environmentContactInfo.findMany({
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
    console.error('Error fetching environment contact info:', error);
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
    const payload = body as EnvironmentContactInfoData;

    // Check if contact info for this section already exists
    const existing = await prisma.environmentContactInfo.findFirst({
      where: { subdomainId, section: payload.section }
    });

    let contact;

    if (existing) {
      contact = await prisma.environmentContactInfo.update({
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
        'EnvironmentContactInfo',
        contact.id,
        `Updated environment contact info for section ${payload.section}`
      );
    } else {
      contact = await prisma.environmentContactInfo.create({
        data: {
          ...payload,
          subdomainId
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'EnvironmentContactInfo',
        contact.id,
        `Created environment contact info for section ${payload.section}`
      );
    }

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Error saving environment contact info:', error);
    return NextResponse.json(
      { error: 'Failed to save environment contact info' },
      { status: 500 }
    );
  }
}

