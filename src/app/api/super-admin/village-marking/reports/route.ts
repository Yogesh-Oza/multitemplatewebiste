import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET: Village-wise comparison data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || (session.user as any)?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get('type') || 'village-comparison';
    const district = searchParams.get('district');
    const subDistrict = searchParams.get('subDistrict');
    const status = searchParams.get('status');

    const where: any = {};
    if (district) {
      where.subdomain = {
        districtName: district
      };
    }
    if (subDistrict) {
      where.subdomain = {
        ...where.subdomain,
        subDistrictName: subDistrict
      };
    }
    if (status) {
      where.status = status;
    }

    switch (reportType) {
      case 'village-comparison':
        return await getVillageComparison(where);
      case 'section-analysis':
        return await getSectionAnalysis(where);
      case 'ranking':
        return await getRankingReport(where);
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}

async function getVillageComparison(where: any) {
  const submissions = await prisma.villageMarkingSubmission.findMany({
    where: {
      ...where,
      status: 'submitted'
    },
    include: {
      subdomain: {
        select: {
          subdomain: true,
          villageName: true,
          villageNameEn: true,
          districtName: true,
          subDistrictName: true
        }
      },
      section: {
        select: {
          title: true,
          titleEn: true,
          maxMarks: true
        }
      }
    },
    orderBy: { totalMarks: 'desc' }
  });

  // Group by village
  const villageData = submissions.reduce((acc: any, submission) => {
    const villageKey = submission.subdomain.subdomain;
    if (!acc[villageKey]) {
      acc[villageKey] = {
        village: submission.subdomain,
        totalMarks: 0,
        totalMaxMarks: 0,
        sections: [],
        submissions: []
      };
    }
    
    acc[villageKey].totalMarks += submission.totalMarks;
    acc[villageKey].totalMaxMarks += submission.totalMaxMarks;
    acc[villageKey].sections.push({
      section: submission.section,
      marks: submission.totalMarks,
      maxMarks: submission.totalMaxMarks
    });
    acc[villageKey].submissions.push(submission);
    
    return acc;
  }, {});

  // Calculate percentages and rankings
  const villages = Object.values(villageData).map((village: any) => ({
    ...village,
    percentage: village.totalMaxMarks > 0 ? (village.totalMarks / village.totalMaxMarks) * 100 : 0,
    rank: 0 // Will be calculated after sorting
  }));

  // Sort by percentage and assign ranks
  villages.sort((a: any, b: any) => b.percentage - a.percentage);
  villages.forEach((village: any, index: number) => {
    village.rank = index + 1;
  });

  return NextResponse.json({
    villages,
    summary: {
      totalVillages: villages.length,
      averagePercentage: villages.reduce((sum: number, v: any) => sum + v.percentage, 0) / villages.length,
      topPerformer: villages[0],
      bottomPerformer: villages[villages.length - 1]
    }
  });
}

async function getSectionAnalysis(where: any) {
  const submissions = await prisma.villageMarkingSubmission.findMany({
    where: {
      ...where,
      status: 'submitted'
    },
    include: {
      section: {
        select: {
          title: true,
          titleEn: true,
          maxMarks: true
        }
      }
    }
  });

  // Group by section
  const sectionData = submissions.reduce((acc: any, submission) => {
    const sectionKey = submission.sectionId;
    if (!sectionKey) return acc;
    if (!acc[sectionKey]) {
      acc[sectionKey] = {
        section: submission.section,
        totalMarks: 0,
        totalMaxMarks: 0,
        villageCount: 0,
        villages: []
      };
    }
    
    acc[sectionKey].totalMarks += submission.totalMarks;
    acc[sectionKey].totalMaxMarks += submission.totalMaxMarks;
    acc[sectionKey].villageCount += 1;
    acc[sectionKey].villages.push({
      marks: submission.totalMarks,
      maxMarks: submission.totalMaxMarks
    });
    
    return acc;
  }, {});

  // Calculate section performance
  const sections = Object.values(sectionData).map((section: any) => ({
    ...section,
    averagePercentage: section.totalMaxMarks > 0 ? (section.totalMarks / section.totalMaxMarks) * 100 : 0,
    performance: section.totalMaxMarks > 0 ? 
      (section.totalMarks / section.totalMaxMarks) >= 0.8 ? 'excellent' :
      (section.totalMarks / section.totalMaxMarks) >= 0.6 ? 'good' :
      (section.totalMarks / section.totalMaxMarks) >= 0.4 ? 'average' : 'poor' : 'no-data'
  }));

  // Sort by performance
  sections.sort((a: any, b: any) => b.averagePercentage - a.averagePercentage);

  return NextResponse.json({
    sections,
    summary: {
      totalSections: sections.length,
      averagePerformance: sections.reduce((sum: number, s: any) => sum + s.averagePercentage, 0) / sections.length,
      topSection: sections[0],
      bottomSection: sections[sections.length - 1]
    }
  });
}

async function getRankingReport(where: any) {
  const submissions = await prisma.villageMarkingSubmission.findMany({
    where: {
      ...where,
      status: 'submitted'
    },
    include: {
      subdomain: {
        select: {
          subdomain: true,
          villageName: true,
          villageNameEn: true,
          districtName: true,
          subDistrictName: true
        }
      }
    },
    orderBy: { totalMarks: 'desc' }
  });

  // Calculate rankings
  const rankings = submissions.map((submission, index) => ({
    rank: index + 1,
    village: submission.subdomain,
    totalMarks: submission.totalMarks,
    totalMaxMarks: submission.totalMaxMarks,
    percentage: submission.totalMaxMarks > 0 ? (submission.totalMarks / submission.totalMaxMarks) * 100 : 0,
    grade: submission.totalMaxMarks > 0 ? 
      (submission.totalMarks / submission.totalMaxMarks) >= 0.9 ? 'A+' :
      (submission.totalMarks / submission.totalMaxMarks) >= 0.8 ? 'A' :
      (submission.totalMarks / submission.totalMaxMarks) >= 0.7 ? 'B+' :
      (submission.totalMarks / submission.totalMaxMarks) >= 0.6 ? 'B' :
      (submission.totalMarks / submission.totalMaxMarks) >= 0.5 ? 'C' : 'D' : 'F'
  }));

  return NextResponse.json({
    rankings,
    summary: {
      totalVillages: rankings.length,
      gradeDistribution: rankings.reduce((acc: any, r: any) => {
        acc[r.grade] = (acc[r.grade] || 0) + 1;
        return acc;
      }, {}),
      topPerformers: rankings.slice(0, 10),
      bottomPerformers: rankings.slice(-10).reverse()
    }
  });
}
