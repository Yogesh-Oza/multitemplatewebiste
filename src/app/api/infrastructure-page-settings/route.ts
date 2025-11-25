import { NextRequest, NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';

import { logCrudActivity } from '@/lib/activity-log-helper';
import { DEMO_INFRASTRUCTURE_PAGE_SETTING } from '@/lib/demo-smart-village';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

const demoResponse = () => ({
  setting: DEMO_INFRASTRUCTURE_PAGE_SETTING,
  isDemo: true
});

const normalizePayload = (payload: Record<string, any>) => {
  const {
    highlightPills,
    smartDashboardMeta,
    isActive,
    ...rest
  } = payload;

  return {
    ...rest,
    highlightPills: highlightPills ?? null,
    smartDashboardMeta: smartDashboardMeta ?? null,
    isActive: typeof isActive === 'boolean' ? isActive : true
  };
};

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const setting = await prisma.infrastructurePageSetting.findFirst({
      where: { subdomainId, isActive: true },
      orderBy: { updatedAt: 'desc' }
    });

    if (!setting) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({ setting, isDemo: false });
  } catch (error) {
    console.error('Error fetching infrastructure page settings:', error);
    return NextResponse.json(demoResponse(), { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const payload = normalizePayload(await request.json());

    const existing = await prisma.infrastructurePageSetting.findFirst({
      where: { subdomainId }
    });

    let result;

    if (existing) {
      result = await prisma.infrastructurePageSetting.update({
        where: { id: existing.id },
        data: payload as Prisma.InfrastructurePageSettingUncheckedUpdateInput
      });

      await logCrudActivity(
        request,
        'UPDATE',
        'InfrastructurePageSetting',
        existing.id,
        'Updated infrastructure page settings'
      );
    } else {
      result = await prisma.infrastructurePageSetting.create({
        data: {
          ...(payload as Prisma.InfrastructurePageSettingUncheckedCreateInput),
          subdomainId
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'InfrastructurePageSetting',
        result.id,
        'Created infrastructure page settings'
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error saving infrastructure page settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const { id, ...rest } = body;

    if (!id) {
      return NextResponse.json({ message: 'Setting id is required' }, { status: 400 });
    }

    const existing = await prisma.infrastructurePageSetting.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Setting not found' }, { status: 404 });
    }

    const updated = await prisma.infrastructurePageSetting.update({
      where: { id },
      data: normalizePayload(rest) as Prisma.InfrastructurePageSettingUncheckedUpdateInput
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'InfrastructurePageSetting',
      id,
      'Updated infrastructure page settings'
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error updating infrastructure page settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}

