import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const footerContent = await prisma.footerContent.findFirst({
      where: { subdomainId },
    });

    return NextResponse.json(footerContent);
  } catch (error) {
    console.error('Error fetching footer content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch footer content' },
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
    const { description, socialMedia, officeName, address, phone, email, website,
      footerSatyamevJayateLogoUrl, footerDigitalIndiaLogoUrl, footerGovDeptText, footerOwnershipText } = body;

    // Check if footer content already exists for this subdomain
    const existingContent = await prisma.footerContent.findFirst({
      where: { subdomainId },
    });

    let footerContent;
    if (existingContent) {
      // Update existing content
      footerContent = await prisma.footerContent.update({
        where: { id: existingContent.id },
        data: {
          description,
          socialMedia,
          officeName,
          address,
          phone,
          email,
          website,
          footerSatyamevJayateLogoUrl: footerSatyamevJayateLogoUrl ?? undefined,
          footerDigitalIndiaLogoUrl: footerDigitalIndiaLogoUrl ?? undefined,
          footerGovDeptText: footerGovDeptText ?? undefined,
          footerOwnershipText: footerOwnershipText ?? undefined,
        },
      });
    } else {
      // Create new content
      footerContent = await prisma.footerContent.create({
        data: {
          description,
          socialMedia,
          officeName,
          address,
          phone,
          email,
          website,
          footerSatyamevJayateLogoUrl: footerSatyamevJayateLogoUrl ?? undefined,
          footerDigitalIndiaLogoUrl: footerDigitalIndiaLogoUrl ?? undefined,
          footerGovDeptText: footerGovDeptText ?? undefined,
          footerOwnershipText: footerOwnershipText ?? undefined,
          subdomainId,
        },
      });
    }

    // Log activity
    await logCrudActivity(request, existingContent ? 'UPDATE' : 'CREATE', 'FooterContent', footerContent.id, `Updated footer content`);

    return NextResponse.json(footerContent);
  } catch (error) {
    console.error('Error saving footer content:', error);
    return NextResponse.json(
      { error: 'Failed to save footer content' },
      { status: 500 }
    );
  }
}
