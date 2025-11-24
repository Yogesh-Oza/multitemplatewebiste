import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const facilities = await prisma.facility.findMany({
      where: { subdomainId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(facilities);
  } catch (error) {
    console.error('Error fetching facilities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch facilities' },
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
      name, nameEn, description, descriptionEn, category, location, contactInfo, workingHours, 
      isActive, imageUrl, type, status, statusEn, latitude, longitude, services, capacity, lastMaintenance 
    } = body;

    const facility = await prisma.facility.create({
      data: {
        name,
        nameEn,
        description,
        descriptionEn,
        category,
        location: location || null,
        contactInfo: contactInfo || null,
        workingHours: workingHours || null,
        isActive: isActive !== undefined ? isActive : true,
        imageUrl: imageUrl || null,
        type: type || null,
        status: status || null,
        statusEn: statusEn || null,
        latitude: latitude !== undefined ? latitude : null,
        longitude: longitude !== undefined ? longitude : null,
        services: services ? (Array.isArray(services) ? services : []) : null,
        capacity: capacity || null,
        lastMaintenance: lastMaintenance || null,
        subdomainId,
      },
    });

    // Log activity
    await logCrudActivity(request, 'CREATE', 'Facility', facility.id, `Created facility: ${name}`);

    return NextResponse.json(facility);
  } catch (error) {
    console.error('Error creating facility:', error);
    return NextResponse.json(
      { error: 'Failed to create facility' },
      { status: 500 }
    );
  }
}
