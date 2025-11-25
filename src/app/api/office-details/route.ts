import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

// Demo data for office details
const getDemoOfficeDetails = () => ({
  id: 'demo',
  address: 'ग्रामपंचायत कार्यालय, गाव, तालुका, जिल्हा, महाराष्ट्र, भारत - ४११००१',
  addressEn: 'Gram Panchayat Office, Village, Taluka, District, Maharashtra, India - 411001',
  phone: '+91 12345 67890',
  email: 'info@grampanchayat.com',
  workingHours: 'सोमवार ते शनिवार: सकाळी ९:०० ते संध्याकाळी ६:००',
  workingHoursEn: 'Monday to Saturday: 9:00 AM to 6:00 PM',
  importantNotice: 'ग्रामपंचायत कार्यालयात येण्यापूर्वी कृपया संपर्क करा. आपत्कालीन प्रसंगी २४ तास संपर्क सुविधा उपलब्ध आहे. सर्व कागदपत्रे आणि आवश्यक दस्तऐवज घेऊन येण्याची कृपा करा.',
  importantNoticeEn: 'Please contact before visiting the Gram Panchayat office. 24-hour contact facility is available for emergencies. Please bring all documents and necessary paperwork.',
  isActive: true,
  subdomainId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDemo: true
});

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json(getDemoOfficeDetails());
    }

    const officeDetails = await prisma.officeDetails.findFirst({
      where: { 
        subdomainId,
        isActive: true 
      },
      orderBy: { createdAt: 'desc' }
    });

    if (!officeDetails) {
      return NextResponse.json(getDemoOfficeDetails());
    }

    return NextResponse.json({
      ...officeDetails,
      isDemo: false
    });
  } catch (error) {
    console.error('Error fetching office details:', error);
    return NextResponse.json(getDemoOfficeDetails());
  }
}

export async function POST(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { address, addressEn, phone, email, workingHours, workingHoursEn, importantNotice, importantNoticeEn, isActive } = body;

    // Check if office details already exist for this subdomain
    const existing = await prisma.officeDetails.findFirst({
      where: { subdomainId }
    });

    let officeDetails;

    if (existing) {
      // Update existing
      officeDetails = await prisma.officeDetails.update({
        where: { id: existing.id },
        data: {
          address,
          addressEn,
          phone,
          email,
          workingHours,
          workingHoursEn,
          importantNotice: importantNotice || null,
          importantNoticeEn: importantNoticeEn || null,
          isActive: isActive !== undefined ? isActive : existing.isActive,
        },
      });

      await logCrudActivity(request, 'UPDATE', 'OfficeDetails', officeDetails.id, 'Updated office details');
    } else {
      // Create new
      officeDetails = await prisma.officeDetails.create({
        data: {
          address,
          addressEn,
          phone,
          email,
          workingHours,
          workingHoursEn,
          importantNotice: importantNotice || null,
          importantNoticeEn: importantNoticeEn || null,
          isActive: isActive !== undefined ? isActive : true,
          subdomainId,
        },
      });

      await logCrudActivity(request, 'CREATE', 'OfficeDetails', officeDetails.id, 'Created office details');
    }

    return NextResponse.json(officeDetails);
  } catch (error) {
    console.error('Error saving office details:', error);
    return NextResponse.json(
      { error: 'Failed to save office details' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid || !subdomainId) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, address, addressEn, phone, email, workingHours, workingHoursEn, importantNotice, importantNoticeEn, isActive } = body;

    // Verify the office details belongs to this subdomain
    const existing = await prisma.officeDetails.findFirst({
      where: { id, subdomainId }
    });

    if (!existing) {
      return NextResponse.json({ 
        message: 'Office details not found or access denied' 
      }, { status: 404 });
    }

    const officeDetails = await prisma.officeDetails.update({
      where: { id },
      data: {
        address,
        addressEn,
        phone,
        email,
        workingHours,
        workingHoursEn,
        importantNotice: importantNotice !== undefined ? importantNotice : existing.importantNotice,
        importantNoticeEn: importantNoticeEn !== undefined ? importantNoticeEn : existing.importantNoticeEn,
        isActive: isActive !== undefined ? isActive : existing.isActive,
      },
    });

    await logCrudActivity(request, 'UPDATE', 'OfficeDetails', officeDetails.id, 'Updated office details');

    return NextResponse.json(officeDetails);
  } catch (error) {
    console.error('Error updating office details:', error);
    return NextResponse.json(
      { error: 'Failed to update office details' },
      { status: 500 }
    );
  }
}
