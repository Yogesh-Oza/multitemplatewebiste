import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomainAccess } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const active = searchParams.get('active');

    const where: any = { subdomainId: subdomainId };
    
    if (type) where.type = type;
    if (active === 'true') where.isActive = true;

    const schemes = await prisma.scheme.findMany({
      where,
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(schemes);
  } catch (error) {
    console.error('Schemes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch schemes' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomainAccess(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ error: 'Invalid subdomain' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      nameEn, 
      type, 
      eligibility, 
      eligibilityEn, 
      documents, 
      beneficiaries, 
      coverage, 
      benefits, 
      benefitsEn, 
      applicationProcess, 
      applicationProcessEn, 
      contactInfo, 
      contactInfoEn, 
      website, 
      imageUrl, 
      startDate, 
      endDate 
    } = body;

    if (!name || !nameEn || !type || !eligibility || !eligibilityEn) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const scheme = await prisma.scheme.create({
      data: {
        name,
        nameEn,
        type,
        eligibility,
        eligibilityEn,
        documents: documents || {},
        beneficiaries: beneficiaries || null,
        coverage: coverage || {},
        benefits: benefits || '',
        benefitsEn: benefitsEn || '',
        applicationProcess: applicationProcess || '',
        applicationProcessEn: applicationProcessEn || '',
        contactInfo: contactInfo || '',
        contactInfoEn: contactInfoEn || '',
        website: website || null,
        imageUrl: imageUrl || null,
        startDate: startDate || null,
        endDate: endDate || null,
        isActive: true,
        order: 0,
        subdomainId: subdomainId
      }
    });

    return NextResponse.json(scheme, { status: 201 });
  } catch (error) {
    console.error('Scheme POST error:', error);
    return NextResponse.json({ error: 'Failed to create scheme' }, { status: 500 });
  }
}
