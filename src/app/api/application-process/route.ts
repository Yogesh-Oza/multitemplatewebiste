import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  applicationProcessDemoConfig,
  ApplicationProcessConfigData
} from '@/lib/demo-schemes-beneficiary';

const demoResponse = () => ({
  ...applicationProcessDemoConfig,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const config = await prisma.applicationProcessConfig.findFirst({
      where: { subdomainId, isActive: true }
    });

    if (!config) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      ...config,
      steps: Array.isArray(config.steps) ? config.steps : [],
      requiredDocuments: Array.isArray(config.requiredDocuments) ? config.requiredDocuments : [],
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching application process config:', error);
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
    const payload = body as ApplicationProcessConfigData;

    const existing = await prisma.applicationProcessConfig.findFirst({
      where: { subdomainId }
    });

    let config;

    if (existing) {
      config = await prisma.applicationProcessConfig.update({
        where: { id: existing.id },
        data: {
          steps: (payload.steps || []) as any,
          requiredDocuments: (payload.requiredDocuments || []) as any,
          applicationFormUrl: payload.applicationFormUrl || null,
          sampleFormUrl: payload.sampleFormUrl || null,
          isActive: payload.isActive ?? existing.isActive
        }
      });

      await logCrudActivity(
        request,
        'UPDATE',
        'ApplicationProcessConfig',
        config.id,
        `Updated application process config for subdomain ${subdomainId}`
      );
    } else {
      config = await prisma.applicationProcessConfig.create({
        data: {
          steps: (payload.steps || []) as any,
          requiredDocuments: (payload.requiredDocuments || []) as any,
          applicationFormUrl: payload.applicationFormUrl || null,
          sampleFormUrl: payload.sampleFormUrl || null,
          isActive: payload.isActive ?? true,
          subdomainId
        }
      });

      await logCrudActivity(
        request,
        'CREATE',
        'ApplicationProcessConfig',
        config.id,
        `Created application process config for subdomain ${subdomainId}`
      );
    }

    return NextResponse.json(config);
  } catch (error) {
    console.error('Error saving application process config:', error);
    return NextResponse.json(
      { error: 'Failed to save application process config' },
      { status: 500 }
    );
  }
}

