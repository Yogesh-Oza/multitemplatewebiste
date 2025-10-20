import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainFromRequest } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const subdomainName = getSubdomainFromRequest(request);

    if (!query || query.trim().length < 2) {
      return NextResponse.json({ results: [] });
    }

    if (!subdomainName) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    // Get subdomain data
    const subdomain = await prisma.subdomain.findUnique({
      where: { subdomain: subdomainName },
      select: { id: true, isActive: true }
    });

    if (!subdomain || !subdomain.isActive) {
      return NextResponse.json({ error: 'Subdomain not found' }, { status: 404 });
    }

    const searchTerm = query.trim().toLowerCase();

    // Search across multiple content types
    const [
      announcements,
      projects,
      governmentResolutions,
      culturalHeritage,
      programs,
      facilities,
      departments,
      governmentSchemes
    ] = await Promise.all([
      // Search announcements
      prisma.announcement.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { fullDescription: { contains: searchTerm, mode: 'insensitive' } }
          ],
          isActive: true
        },
        select: {
          id: true,
          title: true,
          description: true,
          fullDescription: true,
          createdAt: true,
          category: true
        },
        take: 5
      }),

      // Search projects
      prisma.project.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { titleEn: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ]
        },
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          status: true,
          category: true,
          createdAt: true
        },
        take: 5
      }),

      // Search government resolutions
      prisma.governmentResolution.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { titleEn: { contains: searchTerm, mode: 'insensitive' } },
            { number: { contains: searchTerm, mode: 'insensitive' } },
            { department: { contains: searchTerm, mode: 'insensitive' } },
            { departmentEn: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
          isActive: true
        },
        select: {
          id: true,
          title: true,
          titleEn: true,
          number: true,
          date: true,
          department: true,
          departmentEn: true,
          category: true,
          createdAt: true
        },
        take: 5
      }),

      // Search cultural heritage
      prisma.culturalHeritage.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { titleEn: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } }
          ],
          isActive: true
        },
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          category: true,
          createdAt: true
        },
        take: 5
      }),

      // Search programs
      prisma.program.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { titleEn: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          createdAt: true
        },
        take: 5
      }),

      // Search facilities
      prisma.facility.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
          isActive: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          descriptionEn: true,
          category: true,
          createdAt: true
        },
        take: 5
      }),

      // Search departments
      prisma.department.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { name: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } }
          ],
          isActive: true
        },
        select: {
          id: true,
          name: true,
          description: true,
          descriptionEn: true,
          createdAt: true
        },
        take: 5
      }),

      // Search government schemes
      prisma.governmentScheme.findMany({
        where: {
          subdomainId: subdomain.id,
          OR: [
            { title: { contains: searchTerm, mode: 'insensitive' } },
            { titleEn: { contains: searchTerm, mode: 'insensitive' } },
            { description: { contains: searchTerm, mode: 'insensitive' } },
            { descriptionEn: { contains: searchTerm, mode: 'insensitive' } },
            { category: { contains: searchTerm, mode: 'insensitive' } },
          ],
          isActive: true
        },
        select: {
          id: true,
          title: true,
          titleEn: true,
          description: true,
          descriptionEn: true,
          category: true,
          createdAt: true
        },
        take: 5
      })
    ]);

    // Format results with type information
    const results = [
      ...announcements.map(item => ({ ...item, type: 'announcement', typeLabel: 'घोषणा', typeLabelEn: 'Announcement' })),
      ...projects.map(item => ({ ...item, type: 'project', typeLabel: 'प्रकल्प', typeLabelEn: 'Project' })),
      ...governmentResolutions.map(item => ({ ...item, type: 'government-resolution', typeLabel: 'शासकीय ठराव', typeLabelEn: 'Government Resolution' })),
      ...culturalHeritage.map(item => ({ ...item, type: 'cultural-heritage', typeLabel: 'सांस्कृतिक वारसा', typeLabelEn: 'Cultural Heritage' })),
      ...programs.map(item => ({ ...item, type: 'program', typeLabel: 'कार्यक्रम', typeLabelEn: 'Program' })),
      ...facilities.map(item => ({ ...item, type: 'facility', typeLabel: 'सुविधा', typeLabelEn: 'Facility' })),
      ...departments.map(item => ({ ...item, type: 'department', typeLabel: 'विभाग', typeLabelEn: 'Department' })),
      ...governmentSchemes.map(item => ({ ...item, type: 'government-scheme', typeLabel: 'शासकीय योजना', typeLabelEn: 'Government Scheme' }))
    ];

    // Sort by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aTitle = (a as any).title || (a as any).name || '';
      const bTitle = (b as any).title || (b as any).name || '';
      
      const aExactMatch = aTitle.toLowerCase().includes(searchTerm);
      const bExactMatch = bTitle.toLowerCase().includes(searchTerm);
      
      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ 
      results: results.slice(0, 20), // Limit to 20 results
      total: results.length,
      query: searchTerm
    });

  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json({ error: 'Search failed' }, { status: 500 });
  }
}
