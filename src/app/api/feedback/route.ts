import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomainAccess } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const feedback = await prisma.feedback.findMany({
      where: { subdomainId: subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(feedback);
  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch feedback' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, subject, message, category } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject,
        message,
        category: category || 'general',
        status: 'pending',
        isPublic: false,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(feedback, { status: 201 });
  } catch (error) {
    console.error('Feedback POST error:', error);
    return NextResponse.json({ error: 'Failed to create feedback' }, { status: 500 });
  }
}
