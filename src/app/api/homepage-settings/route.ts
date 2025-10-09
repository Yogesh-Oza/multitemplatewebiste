import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    // Get or create homepage settings for this subdomain
    let settings = await prisma.homepageSettings.findFirst({
      where: { subdomainId }
    });

    // If no settings exist, create default ones
    if (!settings) {
      settings = await prisma.homepageSettings.create({
        data: {
          mainHeading: "आमच्या गावात स्वागत आहे",
          mainHeadingEn: "Welcome to Our Village",
          subtitle: "एकत्रित विकास, सामाजिक न्याय आणि सुशासनाच्या मार्गावर प्रगतीशील गाव",
          subtitleEn: "A progressive village on the path of integrated development, social justice and good governance",
          isActive: true,
          subdomainId,
        }
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage settings' },
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
    const { mainHeading, subtitle, isActive } = body;

    // Check if settings already exist
    const existingSettings = await prisma.homepageSettings.findFirst({
      where: { subdomainId }
    });

    let settings;
    if (existingSettings) {
      // Update existing settings
      settings = await prisma.homepageSettings.update({
        where: { id: existingSettings.id },
        data: {
          mainHeading,
          mainHeadingEn: "Welcome to Our Village", // Keep default English
          subtitle,
          subtitleEn: "A progressive village on the path of integrated development, social justice and good governance", // Keep default English
          isActive: isActive !== undefined ? isActive : true,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.homepageSettings.create({
        data: {
          mainHeading,
          mainHeadingEn: "Welcome to Our Village", // Keep default English
          subtitle,
          subtitleEn: "A progressive village on the path of integrated development, social justice and good governance", // Keep default English
          isActive: isActive !== undefined ? isActive : true,
          subdomainId,
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving homepage settings:', error);
    return NextResponse.json(
      { error: 'Failed to save homepage settings' },
      { status: 500 }
    );
  }
}
