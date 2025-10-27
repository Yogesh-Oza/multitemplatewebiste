import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomainAccess } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const grievances = await prisma.grievance.findMany({
      where: { subdomainId: subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(grievances);
  } catch (error) {
    console.error('Grievances GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch grievances' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { name, contact, category, description } = body;

    if (!name || !contact || !category || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate ticket ID
    const ticketId = `GR-${Date.now()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;

    const grievance = await prisma.grievance.create({
      data: {
        ticketId,
        name,
        contact,
        category,
        description,
        status: 'pending',
        priority: 'medium',
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(grievance, { status: 201 });
  } catch (error) {
    console.error('Grievance POST error:', error);
    return NextResponse.json({ error: 'Failed to create grievance' }, { status: 500 });
  }
}
