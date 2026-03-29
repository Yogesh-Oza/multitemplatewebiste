import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const profile = await prisma.rtiOfficeProfile.findUnique({
      where: { subdomainId },
    });
    return NextResponse.json(profile);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to load RTI profile' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    if (!isValid || !subdomainId) {
      return NextResponse.json({ message: 'Invalid or inactive subdomain' }, { status: 404 });
    }

    const body = await request.json();
    const row = await prisma.rtiOfficeProfile.upsert({
      where: { subdomainId },
      create: {
        subdomainId,
        pioName: body.pioName ?? '',
        pioNameEn: body.pioNameEn ?? '',
        pioDesignation: body.pioDesignation ?? '',
        pioDesignationEn: body.pioDesignationEn ?? '',
        apioName: body.apioName ?? '',
        apioNameEn: body.apioNameEn ?? '',
        feesMr: body.feesMr ?? '',
        feesEn: body.feesEn ?? '',
        hoursMr: body.hoursMr ?? '',
        hoursEn: body.hoursEn ?? '',
        contactPhone: body.contactPhone ?? '',
        contactEmail: body.contactEmail ?? '',
        addressMr: body.addressMr ?? '',
        addressEn: body.addressEn ?? '',
        firstAppealMr: body.firstAppealMr ?? '',
        firstAppealEn: body.firstAppealEn ?? '',
      },
      update: {
        ...(body.pioName !== undefined && { pioName: body.pioName }),
        ...(body.pioNameEn !== undefined && { pioNameEn: body.pioNameEn }),
        ...(body.pioDesignation !== undefined && { pioDesignation: body.pioDesignation }),
        ...(body.pioDesignationEn !== undefined && { pioDesignationEn: body.pioDesignationEn }),
        ...(body.apioName !== undefined && { apioName: body.apioName }),
        ...(body.apioNameEn !== undefined && { apioNameEn: body.apioNameEn }),
        ...(body.feesMr !== undefined && { feesMr: body.feesMr }),
        ...(body.feesEn !== undefined && { feesEn: body.feesEn }),
        ...(body.hoursMr !== undefined && { hoursMr: body.hoursMr }),
        ...(body.hoursEn !== undefined && { hoursEn: body.hoursEn }),
        ...(body.contactPhone !== undefined && { contactPhone: body.contactPhone }),
        ...(body.contactEmail !== undefined && { contactEmail: body.contactEmail }),
        ...(body.addressMr !== undefined && { addressMr: body.addressMr }),
        ...(body.addressEn !== undefined && { addressEn: body.addressEn }),
        ...(body.firstAppealMr !== undefined && { firstAppealMr: body.firstAppealMr }),
        ...(body.firstAppealEn !== undefined && { firstAppealEn: body.firstAppealEn }),
      },
    });

    await logCrudActivity(request, 'UPDATE', 'RtiOfficeProfile', row.id, 'Updated RTI office profile');
    return NextResponse.json(row);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to save RTI profile' }, { status: 500 });
  }
}
