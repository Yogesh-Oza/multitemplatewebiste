import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';
import {
  adoptedTreesDemoData,
  AdoptedTreeData
} from '@/lib/demo-environment-sustainability';

const demoResponse = () => ({
  trees: adoptedTreesDemoData,
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid || !subdomainId) {
      return NextResponse.json(demoResponse());
    }

    const trees = await prisma.adoptedTree.findMany({
      where: { subdomainId, isActive: true },
      orderBy: { order: 'asc' }
    });

    if (trees.length === 0) {
      return NextResponse.json(demoResponse());
    }

    return NextResponse.json({
      trees,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching adopted trees:', error);
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
    const payload = body as AdoptedTreeData;

    const tree = await prisma.adoptedTree.create({
      data: {
        ...payload,
        subdomainId
      }
    });

    await logCrudActivity(
      request,
      'CREATE',
      'AdoptedTree',
      tree.id,
      `Created adopted tree ${tree.treeName}`
    );

    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error creating adopted tree:', error);
    return NextResponse.json(
      { error: 'Failed to create adopted tree' },
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
    const payload = body as AdoptedTreeData & { id: string };

    if (!payload?.id) {
      return NextResponse.json({ message: 'Tree id is required' }, { status: 400 });
    }

    const existing = await prisma.adoptedTree.findFirst({
      where: { id: payload.id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Tree not found' }, { status: 404 });
    }

    const tree = await prisma.adoptedTree.update({
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
      'AdoptedTree',
      tree.id,
      `Updated adopted tree ${tree.treeName}`
    );

    return NextResponse.json(tree);
  } catch (error) {
    console.error('Error updating adopted tree:', error);
    return NextResponse.json(
      { error: 'Failed to update adopted tree' },
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
      return NextResponse.json({ message: 'Tree id is required' }, { status: 400 });
    }

    const existing = await prisma.adoptedTree.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ message: 'Tree not found' }, { status: 404 });
    }

    await prisma.adoptedTree.delete({ where: { id } });

    await logCrudActivity(
      request,
      'DELETE',
      'AdoptedTree',
      id,
      `Deleted adopted tree ${existing.treeName}`
    );

    return NextResponse.json({ message: 'Tree deleted successfully' });
  } catch (error) {
    console.error('Error deleting adopted tree:', error);
    return NextResponse.json(
      { error: 'Failed to delete adopted tree' },
      { status: 500 }
    );
  }
}

