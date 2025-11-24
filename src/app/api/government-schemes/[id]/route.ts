import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { 
      title, titleEn, description, descriptionEn, category, 
      eligibility, eligibilityEn, benefits, benefitsEn, 
      documents, documentsEn, applicationProcess, applicationProcessEn, 
      contactInfo, contactInfoEn, website, imageUrl, startDate, endDate, isActive,
      contactOfficeName, contactOfficeNameEn, contactAddress, contactAddressEn,
      contactPhone, contactOfficeHours, contactOfficeHoursEn
    } = body;

    // Verify the scheme belongs to this subdomain
    const existingScheme = await prisma.governmentScheme.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingScheme) {
      return NextResponse.json({ 
        message: 'Government scheme not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const scheme = await prisma.governmentScheme.update({
      where: { id },
      data: {
        title,
        titleEn,
        description,
        descriptionEn,
        category,
        eligibility,
        eligibilityEn,
        benefits,
        benefitsEn,
        documents,
        documentsEn,
        applicationProcess,
        applicationProcessEn,
        contactInfo,
        contactInfoEn: contactInfoEn || '',
        website,
        imageUrl,
        startDate,
        endDate,
        isActive,
        contactOfficeName: contactOfficeName !== undefined ? (contactOfficeName || null) : existingScheme.contactOfficeName,
        contactOfficeNameEn: contactOfficeNameEn !== undefined ? (contactOfficeNameEn || null) : existingScheme.contactOfficeNameEn,
        contactAddress: contactAddress !== undefined ? (contactAddress || null) : existingScheme.contactAddress,
        contactAddressEn: contactAddressEn !== undefined ? (contactAddressEn || null) : existingScheme.contactAddressEn,
        contactPhone: contactPhone !== undefined ? (contactPhone || null) : existingScheme.contactPhone,
        contactOfficeHours: contactOfficeHours !== undefined ? (contactOfficeHours || null) : existingScheme.contactOfficeHours,
        contactOfficeHoursEn: contactOfficeHoursEn !== undefined ? (contactOfficeHoursEn || null) : existingScheme.contactOfficeHoursEn,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'GovernmentScheme', scheme.id, `Updated government scheme: ${title}`);

    return NextResponse.json(scheme);
  } catch (error) {
    console.error('Error updating government scheme:', error);
    return NextResponse.json(
      { error: 'Failed to update government scheme' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;

    // Verify the scheme belongs to this subdomain
    const existingScheme = await prisma.governmentScheme.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingScheme) {
      return NextResponse.json({ 
        message: 'Government scheme not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.governmentScheme.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'GovernmentScheme', id, `Deleted government scheme: ${existingScheme.title}`);

    return NextResponse.json({ message: 'Government scheme deleted successfully' });
  } catch (error) {
    console.error('Error deleting government scheme:', error);
    return NextResponse.json(
      { error: 'Failed to delete government scheme' },
      { status: 500 }
    );
  }
}
