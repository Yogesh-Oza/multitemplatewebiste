import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET /api/campaign-form/basic-info - Get basic info for current subdomain
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const subdomainId = searchParams.get('subdomainId');

    if (!subdomainId || subdomainId === 'null') {
      return NextResponse.json(
        { error: 'SubdomainId is required' },
        { status: 400 }
      );
    }

    // Validate that subdomainId is a valid MongoDB ObjectId
    if (subdomainId.length !== 24) {
      return NextResponse.json(
        { error: 'Invalid subdomainId format' },
        { status: 400 }
      );
    }

    // Get subdomain info
    const subdomain = await prisma.subdomain.findUnique({
      where: { id: subdomainId },
      select: {
        id: true,
        villageName: true,
        villageNameEn: true,
        districtName: true,
        subDistrictName: true,
        contactPerson: true,
        email: true,
        phone: true,
        address: true
      }
    });

    if (!subdomain) {
      return NextResponse.json(
        { error: 'Subdomain not found' },
        { status: 404 }
      );
    }

    // Check if there's existing campaign form basic info
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: { subdomainId },
      select: { basicInfo: true }
    });

    let basicInfo = {
      grampanchayatName: subdomain.villageName,
      taluka: subdomain.subDistrictName,
      population: 0,
      families: 0,
      gpoName: subdomain.contactPerson,
      sarpanchName: '',
      establishmentYear: new Date().getFullYear().toString(),
      populationCategory: 'below2000'
    };

    // If there's existing campaign form basic info, use it
    if (existingSubmission?.basicInfo) {
      basicInfo = {
        ...basicInfo,
        ...existingSubmission.basicInfo
      };
    }

    return NextResponse.json({
      subdomain,
      basicInfo,
      hasExistingData: !!existingSubmission?.basicInfo
    });
  } catch (error) {
    console.error('Error fetching basic info:', error);
    return NextResponse.json(
      { error: 'Failed to fetch basic info' },
      { status: 500 }
    );
  }
}

// POST /api/campaign-form/basic-info - Save basic info
export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Get the current user's ID from the database
    let submittedBy = '000000000000000000000000'; // Default placeholder ObjectId
    
    if (session?.user?.email) {
      const currentUser = await prisma.adminUser.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      
      if (currentUser) {
        submittedBy = currentUser.id;
      }
    }
    
    const body = await request.json();
    const {
      subdomainId,
      grampanchayatName,
      taluka,
      population,
      families,
      gpoName,
      sarpanchName,
      establishmentYear,
      populationCategory
    } = body;

    // Validate required fields
    if (!subdomainId || !grampanchayatName || !population || !families) {
      return NextResponse.json(
        { error: 'Required fields missing' },
        { status: 400 }
      );
    }

    // Determine population category based on population
    let calculatedCategory = '2000';
    if (population > 5000) {
      calculatedCategory = 'above5000';
    } else if (population > 2000) {
      calculatedCategory = 'between2000_5000';
    } else {
      calculatedCategory = 'below2000';
    }

    const basicInfo = {
      grampanchayatName,
      taluka,
      population: parseInt(population),
      families: parseInt(families),
      gpoName,
      sarpanchName,
      establishmentYear,
      populationCategory: calculatedCategory
    };

    // Get the default campaign form
    const defaultForm = await prisma.campaignForm.findFirst({
      where: { isDefault: true, isActive: true }
    });

    if (!defaultForm) {
      return NextResponse.json(
        { error: 'No default campaign form found' },
        { status: 400 }
      );
    }

    // Check if there's an existing submission for this subdomain and form
    const existingSubmission = await prisma.formSubmission.findFirst({
      where: { 
        subdomainId,
        campaignFormId: defaultForm.id
      }
    });

    if (existingSubmission) {
      // Update existing submission
      await prisma.formSubmission.update({
        where: { id: existingSubmission.id },
        data: { basicInfo }
      });
    } else {
      // Create new submission with basic info
      await prisma.formSubmission.create({
        data: {
          subdomainId,
          campaignFormId: defaultForm.id,
          basicInfo,
          summary: {},
          status: 'draft',
          submittedBy // Use the actual user email
        }
      });
    }

    return NextResponse.json({
      message: 'Basic info saved successfully',
      basicInfo
    });
  } catch (error) {
    console.error('Error saving basic info:', error);
    return NextResponse.json(
      { error: 'Failed to save basic info' },
      { status: 500 }
    );
  }
}
