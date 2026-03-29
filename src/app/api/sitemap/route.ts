import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainFromRequest } from '@/lib/subdomain';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const subdomainName = getSubdomainFromRequest(request);

    if (!subdomainName) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    // Get subdomain data
    const subdomain = await prisma.subdomain.findUnique({
      where: { subdomain: subdomainName },
      select: { id: true, villageName: true, villageNameEn: true, subdomain: true }
    });

    if (!subdomain) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    // Get all content for sitemap
    const [
      announcements,
      projects,
      governmentResolutions,
      culturalHeritage,
      programs,
      facilities,
      departments,
      governmentSchemes,
      gallery
    ] = await Promise.all([
      prisma.announcement.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, title: true, createdAt: true, category: true }
      }),
      prisma.project.findMany({
        where: { subdomainId: subdomain.id },
        select: { id: true, title: true, titleEn: true, createdAt: true, status: true }
      }),
      prisma.governmentResolution.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, title: true, titleEn: true, createdAt: true, number: true }
      }),
      prisma.culturalHeritage.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, title: true, titleEn: true, createdAt: true, category: true }
      }),
      prisma.program.findMany({
        where: { subdomainId: subdomain.id },
        select: { id: true, title: true, titleEn: true, createdAt: true }
      }),
      prisma.facility.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, name: true, nameEn: true, createdAt: true, category: true }
      }),
      prisma.department.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, name: true, nameEn: true, createdAt: true }
      }),
      prisma.governmentScheme.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, title: true, titleEn: true, createdAt: true, category: true }
      }),
      prisma.gallery.findMany({
        where: { subdomainId: subdomain.id, isActive: true },
        select: { id: true, title: true, titleEn: true, createdAt: true, category: true }
      })
    ]);

    // Create sitemap structure
    const sitemap = {
      village: {
        name: subdomain.villageName,
        nameEn: subdomain.villageNameEn,
        subdomain: subdomain.subdomain
      },
      pages: {
        // Main pages
        home: { 
          title: 'मुख्यपृष्ठ', 
          titleEn: 'Home', 
          url: '/',
          description: 'ग्रामपंचायत मुख्यपृष्ठ',
          descriptionEn: 'Gram Panchayat Homepage'
        },
        about: { 
          title: 'आमच्याबद्दल', 
          titleEn: 'About Us', 
          url: '/about',
          description: 'ग्रामपंचायत माहिती',
          descriptionEn: 'About Gram Panchayat'
        },
        history: { 
          title: 'इतिहास', 
          titleEn: 'History', 
          url: '/history',
          description: 'गावाचा इतिहास',
          descriptionEn: 'Village History'
        },
        programs: { 
          title: 'कार्यक्रम', 
          titleEn: 'Programs', 
          url: '/programs',
          description: 'सामुदायिक कार्यक्रम',
          descriptionEn: 'Community Programs'
        },
        gallery: { 
          title: 'गॅलरी', 
          titleEn: 'Gallery', 
          url: '/gallery',
          description: 'फोटो गॅलरी',
          descriptionEn: 'Photo Gallery'
        },
        incomeExpense: { 
          title: 'जमा-खर्च', 
          titleEn: 'Income-Expenditure', 
          url: '/jama-kharch',
          description: 'आर्थिक माहिती',
          descriptionEn: 'Financial Information'
        },
        announcements: { 
          title: 'सूचना', 
          titleEn: 'Announcements', 
          url: '/announcements',
          description: 'घोषणा आणि सूचना',
          descriptionEn: 'Announcements and Notices'
        },
        governmentSchemes: { 
          title: 'शासकीय योजना', 
          titleEn: 'Government Schemes', 
          url: '/gov-programs',
          description: 'सरकारी योजना',
          descriptionEn: 'Government Schemes'
        },
        departments: { 
          title: 'विभाग', 
          titleEn: 'Departments', 
          url: '/departments',
          description: 'विभागीय माहिती',
          descriptionEn: 'Department Information'
        },
        facilities: { 
          title: 'सोई-सुविधा', 
          titleEn: 'Amenities', 
          url: '/amenities',
          description: 'ग्राम सुविधा',
          descriptionEn: 'Village Amenities'
        },
        contact: { 
          title: 'संपर्क', 
          titleEn: 'Contact', 
          url: '/contact',
          description: 'संपर्क माहिती',
          descriptionEn: 'Contact Information'
        },
        // New pages
        projects: { 
          title: 'प्रकल्प', 
          titleEn: 'Projects', 
          url: '/projects',
          description: 'विकास प्रकल्प',
          descriptionEn: 'Development Projects'
        },
        governmentResolutions: { 
          title: 'शासकीय ठराव', 
          titleEn: 'Government Resolutions', 
          url: '/gr',
          description: 'शासकीय ठराव आणि परिपत्रके',
          descriptionEn: 'Government Resolutions and Circulars'
        },
        feedback: { 
          title: 'फीडबॅक', 
          titleEn: 'Feedback', 
          url: '/feedback',
          description: 'नागरिक फीडबॅक',
          descriptionEn: 'Citizen Feedback'
        },
        notices: {
          title: 'नोटिस',
          titleEn: 'Notices',
          url: '/notices',
          description: 'नोटिस',
          descriptionEn: 'Notices',
        },
        circularsPage: {
          title: 'परिपत्रके',
          titleEn: 'Circulars',
          url: '/circulars',
          description: 'परिपत्रके',
          descriptionEn: 'Circulars',
        },
        downloadsPage: {
          title: 'डाउनलोड्स',
          titleEn: 'Downloads',
          url: '/downloads',
          description: 'कागदपत्रे',
          descriptionEn: 'Downloads',
        },
        villageStatistics: {
          title: 'ग्राम सांख्यिकी',
          titleEn: 'Village statistics',
          url: '/village-statistics',
          description: 'वर्षनिहाय सांख्यिकी',
          descriptionEn: 'Year-wise statistics',
        },
        gramSabha: {
          title: 'ग्राम सभा',
          titleEn: 'Gram Sabha',
          url: '/gram-sabha',
          description: 'ग्राम सभा नोंदी',
          descriptionEn: 'Gram Sabha records',
        },
        schemeTracking: {
          title: 'योजना ट्रॅकिंग',
          titleEn: 'Scheme tracking',
          url: '/scheme-tracking',
          description: 'प्रगती',
          descriptionEn: 'Progress tracking',
        },
        rti: {
          title: 'RTI',
          titleEn: 'RTI',
          url: '/rti',
          description: 'माहितीचा अधिकार',
          descriptionEn: 'Right to Information',
        },
        transparency: {
          title: 'पारदर्शकता केंद्र',
          titleEn: 'Transparency hub',
          url: '/transparency',
          description: 'सारांश डॅशबोर्ड',
          descriptionEn: 'Summary dashboard',
        },
      },
      content: {
        announcements: announcements.map(item => ({
          id: item.id,
          title: item.title,
          url: `/announcements#${item.id}`,
          category: item.category,
          createdAt: item.createdAt
        })),
        projects: projects.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/projects#${item.id}`,
          status: item.status,
          createdAt: item.createdAt
        })),
        governmentResolutions: governmentResolutions.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/gr#${item.id}`,
          number: item.number,
          createdAt: item.createdAt
        })),
        culturalHeritage: culturalHeritage.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/cultural-heritage#${item.id}`,
          category: item.category,
          createdAt: item.createdAt
        })),
        programs: programs.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/programs#${item.id}`,
          createdAt: item.createdAt
        })),
        facilities: facilities.map(item => ({
          id: item.id,
          title: item.name,
          titleEn: item.nameEn,
          url: `/amenities#${item.id}`,
          category: item.category,
          createdAt: item.createdAt
        })),
        departments: departments.map(item => ({
          id: item.id,
          title: item.name,
          titleEn: item.nameEn,
          url: `/departments#${item.id}`,
          createdAt: item.createdAt
        })),
        governmentSchemes: governmentSchemes.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/gov-programs#${item.id}`,
          category: item.category,
          createdAt: item.createdAt
        })),
        gallery: gallery.map(item => ({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn,
          url: `/gallery#${item.id}`,
          category: item.category,
          createdAt: item.createdAt
        }))
      },
      lastUpdated: new Date().toISOString(),
      totalContent: {
        announcements: announcements.length,
        projects: projects.length,
        governmentResolutions: governmentResolutions.length,
        culturalHeritage: culturalHeritage.length,
        programs: programs.length,
        facilities: facilities.length,
        departments: departments.length,
        governmentSchemes: governmentSchemes.length,
        gallery: gallery.length
      }
    };

    return NextResponse.json(sitemap);

  } catch (error) {
    console.error('Sitemap error:', error);
    return NextResponse.json({ error: 'Sitemap generation failed' }, { status: 500 });
  }
}
