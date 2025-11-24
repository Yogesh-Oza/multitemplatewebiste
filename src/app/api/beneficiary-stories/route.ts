import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  beneficiaryStoriesDemoData,
  BeneficiaryStoryData
} from '@/lib/demo-schemes-beneficiary';

const demoResponse = () => ({
  stories: beneficiaryStoriesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const stories = await prisma.beneficiaryStory.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (stories.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      stories: stories.map(s => ({
        ...s,
        benefits: Array.isArray(s.benefits) ? s.benefits : []
      })),
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching beneficiary stories:', error);
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
    const payload = body as BeneficiaryStoryData;

    const story = await prisma.beneficiaryStory.create({
      data: {
        ...payload,
        subdomainId,
        benefits: payload.benefits || []
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'BeneficiaryStory',
      story.id,
      `Created beneficiary story ${story.name}`
    );

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating beneficiary story:', error);
    return NextResponse.json(
      { error: 'Failed to create beneficiary story' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const payload = body as BeneficiaryStoryData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Story id is required' }, { status: 400 });
    }

    const existing = await prisma.beneficiaryStory.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    const story = await prisma.beneficiaryStory.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order,
        benefits: payload.benefits || existing.benefits
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'BeneficiaryStory',
      story.id,
      `Updated beneficiary story ${story.name}`
    );

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error updating beneficiary story:', error);
    return NextResponse.json(
      { error: 'Failed to update beneficiary story' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ message: 'Story id is required' }, { status: 400 });
    }

    const existing = await prisma.beneficiaryStory.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    await prisma.beneficiaryStory.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'BeneficiaryStory',
      id,
      `Deleted beneficiary story ${existing.name}`
    );

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting beneficiary story:', error);
    return NextResponse.json(
      { error: 'Failed to delete beneficiary story' },
      { status: 500 }
    );
  }
}

