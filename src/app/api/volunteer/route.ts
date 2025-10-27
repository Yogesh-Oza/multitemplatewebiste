import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomainAccess } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const volunteers = await prisma.volunteer.findMany({
      where: { subdomainId: subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(volunteers);
  } catch (error) {
    console.error('Volunteers GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch volunteers' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, phone, skills, interests, availability, experience } = body;

    if (!name || !email || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const volunteer = await prisma.volunteer.create({
      data: {
        name,
        email,
        phone,
        skills: skills || [],
        interests: interests || [],
        availability: availability || '',
        experience: experience || '',
        status: 'pending',
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(volunteer, { status: 201 });
  } catch (error) {
    console.error('Volunteer POST error:', error);
    return NextResponse.json({ error: 'Failed to create volunteer registration' }, { status: 500 });
  }
}
