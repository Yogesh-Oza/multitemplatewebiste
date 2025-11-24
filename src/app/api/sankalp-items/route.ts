import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeInactive = searchParams.get('includeInactive') === 'true';
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');

    const whereClause: any = {
      subdomainId,
    };

    if (!includeInactive) {
      whereClause.isActive = true;
    }

    if (status) {
      whereClause.status = status;
    }

    if (priority) {
      whereClause.priority = priority;
    }

    const items = await prisma.sankalpItem.findMany({
      where: whereClause,
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching Sankalp items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Sankalp items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      titleEn,
      description,
      descriptionEn,
      currentValue,
      targetValue,
      unit,
      icon,
      color,
      status = 'in-progress',
      priority = 'medium',
      order = 0,
      isActive = true,
    } = body;

    const sankalpItem = await prisma.sankalpItem.create({
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        currentValue,
        targetValue,
        unit,
        icon,
        color,
        status,
        priority,
        order,
        isActive,
        subdomainId,
      },
    });

    await logCrudActivity(
      request,
      'CREATE',
      'SankalpItem',
      sankalpItem.id,
      `Created Sankalp item: ${title}`
    );

    return NextResponse.json(sankalpItem);
  } catch (error) {
    console.error('Error creating Sankalp item:', error);
    return NextResponse.json(
      { error: 'Failed to create Sankalp item' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      id,
      title,
      titleEn,
      description,
      descriptionEn,
      currentValue,
      targetValue,
      unit,
      icon,
      color,
      status,
      priority,
      order,
      isActive,
    } = body;

    const existingItem = await prisma.sankalpItem.findFirst({
      where: { id, subdomainId },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Sankalp item not found or access denied' },
        { status: 404 }
      );
    }

    const sankalpItem = await prisma.sankalpItem.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        currentValue,
        targetValue,
        unit,
        icon,
        color,
        status: status ?? existingItem.status,
        priority: priority ?? existingItem.priority,
        order: order ?? existingItem.order,
        isActive: isActive ?? existingItem.isActive,
      },
    });

    await logCrudActivity(
      request,
      'UPDATE',
      'SankalpItem',
      sankalpItem.id,
      `Updated Sankalp item: ${title ?? sankalpItem.title}`
    );

    return NextResponse.json(sankalpItem);
  } catch (error) {
    console.error('Error updating Sankalp item:', error);
    return NextResponse.json(
      { error: 'Failed to update Sankalp item' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);

    if (!isValid) {
      return NextResponse.json(
        { message: 'Invalid or inactive subdomain' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'ID is required' },
        { status: 400 }
      );
    }

    const existingItem = await prisma.sankalpItem.findFirst({
      where: { id, subdomainId },
    });

    if (!existingItem) {
      return NextResponse.json(
        { message: 'Sankalp item not found or access denied' },
        { status: 404 }
      );
    }

    await prisma.sankalpItem.delete({
      where: { id },
    });

    await logCrudActivity(
      request,
      'DELETE',
      'SankalpItem',
      id,
      `Deleted Sankalp item: ${existingItem.title}`
    );

    return NextResponse.json({ message: 'Sankalp item deleted successfully' });
  } catch (error) {
    console.error('Error deleting Sankalp item:', error);
    return NextResponse.json(
      { error: 'Failed to delete Sankalp item' },
      { status: 500 }
    );
  }
}

