import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  youthSuccessStoriesDemoData,
  YouthSuccessStoryData
} from '@/lib/demo-education-youth';

const demoResponse = () => ({
  stories: youthSuccessStoriesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const stories = await prisma.youthSuccessStory.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (stories.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      stories,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching youth success stories:', error);
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
    const payload = body as YouthSuccessStoryData;

    const story = await prisma.youthSuccessStory.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'YouthSuccessStory',
      story.id,
      `Created youth success story ${story.name}`
    );

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error creating youth success story:', error);
    return NextResponse.json(
      { error: 'Failed to create youth success story' },
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
    const payload = body as YouthSuccessStoryData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Story id is required' }, { status: 400 });
    }

    const existing = await prisma.youthSuccessStory.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    const story = await prisma.youthSuccessStory.update({
      where: { id: payload.id },
      data: {
        ...payload,
        isActive: payload.isActive ?? existing.isActive,
        order: payload.order ?? existing.order
      }
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'YouthSuccessStory',
      story.id,
      `Updated youth success story ${story.name}`
    );

    return NextResponse.json(story);
  } catch (error) {
    console.error('Error updating youth success story:', error);
    return NextResponse.json(
      { error: 'Failed to update youth success story' },
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

    const existing = await prisma.youthSuccessStory.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Story not found' }, { status: 404 });
    }

    await prisma.youthSuccessStory.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'YouthSuccessStory',
      id,
      `Deleted youth success story ${existing.name}`
    );

    return NextResponse.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Error deleting youth success story:', error);
    return NextResponse.json(
      { error: 'Failed to delete youth success story' },
      { status: 500 }
    );
  }
}

