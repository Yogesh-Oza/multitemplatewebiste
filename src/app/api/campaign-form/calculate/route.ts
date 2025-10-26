import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/campaign-form/calculate - Calculate marks for form items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemValues, populationCategory = 'below2000' } = body;

    if (!itemValues || !Array.isArray(itemValues)) {
      return NextResponse.json(
        { error: 'ItemValues array is required' },
        { status: 400 }
      );
    }

    const calculatedValues = [];

    for (const itemValue of itemValues) {
      const { itemId, target, achieved, innovations } = itemValue;

      // Get item details
      const item = await prisma.formItem.findUnique({
        where: { id: itemId },
        select: {
          id: true,
          itemId: true,
          itemType: true,
          maxMarks: true,
          targets: true
        }
      });

      if (!item) {
        continue;
      }

      let calculatedPercentage = 0;
      let calculatedMarks = 0;

      // Handle different item types
      if (item.itemType === 'innovation') {
        // Innovation items: each innovation = 1 mark, max 5
        const innovationCount = Array.isArray(innovations) ? innovations.length : 0;
        calculatedMarks = Math.min(innovationCount, 5);
        calculatedPercentage = (calculatedMarks / item.maxMarks) * 100;
      } else {
        // Simple items: calculate based on target/achieved
        if (target && target > 0) {
          calculatedPercentage = Math.min((achieved / target) * 100, 100);
          calculatedMarks = (calculatedPercentage / 100) * item.maxMarks;
        }
      }

      calculatedValues.push({
        itemId,
        target,
        achieved,
        percentage: Math.round(calculatedPercentage * 100) / 100,
        marks: Math.round(calculatedMarks * 100) / 100,
        innovations
      });
    }

    // Calculate section totals
    const sectionTotals = {};
    let grandTotal = 0;
    let maxPossibleTotal = 0;

    for (const value of calculatedValues) {
      const item = await prisma.formItem.findUnique({
        where: { id: value.itemId },
        select: {
          sectionId: true,
          maxMarks: true,
          itemType: true,
          parentItemId: true
        }
      });

      if (item) {
        const sectionId = item.sectionId;
        
        if (!sectionTotals[sectionId]) {
          sectionTotals[sectionId] = { total: 0, maxTotal: 0 };
        }

        sectionTotals[sectionId].total += value.marks;
        sectionTotals[sectionId].maxTotal += item.maxMarks;
        grandTotal += value.marks;
        maxPossibleTotal += item.maxMarks;
      }
    }

    return NextResponse.json({
      calculatedValues,
      sectionTotals,
      summary: {
        grandTotal: Math.round(grandTotal * 100) / 100,
        maxPossibleTotal: Math.round(maxPossibleTotal * 100) / 100,
        overallPercentage: maxPossibleTotal > 0 ? 
          Math.round((grandTotal / maxPossibleTotal) * 100 * 100) / 100 : 0
      }
    });
  } catch (error) {
    console.error('Error calculating marks:', error);
    return NextResponse.json(
      { error: 'Failed to calculate marks' },
      { status: 500 }
    );
  }
}
