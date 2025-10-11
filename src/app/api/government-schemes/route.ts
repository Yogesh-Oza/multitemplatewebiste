import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const schemes = await prisma.governmentScheme.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(schemes);
  } catch (error) {
    console.error('Error fetching government schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch government schemes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { 
      title, titleEn, description, descriptionEn, category, 
      eligibility, eligibilityEn, benefits, benefitsEn, 
      documents, documentsEn, applicationProcess, applicationProcessEn, 
      contactInfo, contactInfoEn, website, imageUrl, startDate, endDate, isActive 
    } = body;

    const schemeData = {
      title,
      titleEn,
      description,
      descriptionEn,
      category,
      eligibility,
      eligibilityEn,
      benefits,
      benefitsEn,
      documents: documents || '',
      documentsEn: documentsEn || '',
      applicationProcess,
      applicationProcessEn,
      contactInfo,
      contactInfoEn: contactInfoEn || '',
      website,
      imageUrl: imageUrl || '',
      startDate: startDate || '',
      endDate: endDate || '',
      isActive: isActive !== undefined ? isActive : true,
      subdomainId,
    };

    const scheme = await prisma.governmentScheme.create({
      data: schemeData,
    });

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Error creating government scheme:', error);
    return NextResponse.json(
      { error: 'Failed to create government scheme' },
      { status: 500 }
    );
  }
}
