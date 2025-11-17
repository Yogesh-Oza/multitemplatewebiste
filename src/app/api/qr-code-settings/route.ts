import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

// Default QR code settings
const defaultSettings = {
  propertyTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Property Tax',
  waterTaxQrData: 'upi://pay?pa=gp-pay@upi&pn=GramPanchayat&am=0&cu=INR&tn=Water Tax',
  propertyTaxInstruction: '(घरपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot व UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
  waterTaxInstruction: '(पाणीपट्टि QR code वरुन रक्कम भरलेनंतर त्याचा screen shot, UTR number, दिनांक ग्रामपंचायतीकडे पाठवावा.)',
  isActive: true,
};

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    let settings = await prisma.qRCodeSettings.findFirst({
      where: { subdomainId }
    });

    // If no settings exist, create default ones
    if (!settings && subdomainId) {
      try {
        settings = await prisma.qRCodeSettings.create({
          data: {
            ...defaultSettings,
            subdomainId: subdomainId,
          },
        });
      } catch (error) {
        console.error('Error creating default QR settings:', error);
        return NextResponse.json(defaultSettings);
      }
    }

    return NextResponse.json(settings || defaultSettings);
  } catch (error) {
    console.error('Error fetching QR code settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch QR code settings' },
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
    const { propertyTaxQrData, waterTaxQrData, propertyTaxInstruction, waterTaxInstruction, isActive } = body;

    // Check if settings already exist
    const existingSettings = await prisma.qRCodeSettings.findFirst({
      where: { subdomainId }
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.qRCodeSettings.update({
        where: { id: existingSettings.id },
        data: {
          propertyTaxQrData,
          waterTaxQrData,
          propertyTaxInstruction,
          waterTaxInstruction,
          isActive: isActive !== undefined ? isActive : existingSettings.isActive,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.qRCodeSettings.create({
        data: {
          propertyTaxQrData,
          waterTaxQrData,
          propertyTaxInstruction,
          waterTaxInstruction,
          isActive: isActive !== undefined ? isActive : true,
          subdomainId,
        },
      });
    }

    // Log activity
    await logCrudActivity(request, existingSettings ? 'UPDATE' : 'CREATE', 'QRCodeSettings', settings.id, `Updated QR code settings`);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving QR code settings:', error);
    return NextResponse.json(
      { error: 'Failed to save QR code settings' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { id, propertyTaxQrData, waterTaxQrData, propertyTaxInstruction, waterTaxInstruction, isActive } = body;

    const existingSettings = await prisma.qRCodeSettings.findFirst({
      where: { id, subdomainId }
    });

    if (!existingSettings) {
      return NextResponse.json({ 
        message: 'QR code settings not found or access denied' 
      }, { status: 404 });
    }

    const settings = await prisma.qRCodeSettings.update({
      where: { id },
      data: {
        propertyTaxQrData,
        waterTaxQrData,
        propertyTaxInstruction,
        waterTaxInstruction,
        isActive: isActive !== undefined ? isActive : existingSettings.isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'QRCodeSettings', settings.id, `Updated QR code settings`);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating QR code settings:', error);
    return NextResponse.json(
      { error: 'Failed to update QR code settings' },
      { status: 500 }
    );
  }
}

