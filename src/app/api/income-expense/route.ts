import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';

export async function GET(request: NextRequest) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const transactions = await prisma.incomeExpense.findMany({
      where: { subdomainId },
      orderBy: { date: 'desc' }
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error('Error fetching income-expense transactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch income-expense transactions' },
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
    const { type, title, titleEn, description, descriptionEn, amount, category, date, receiptUrl, isActive } = body;

    const transaction = await prisma.incomeExpense.create({
      data: {
        type,
        title,
        titleEn,
        description,
        descriptionEn,
        amount: parseFloat(amount),
        category,
        date: new Date(date),
        receiptUrl,
        isActive: isActive !== undefined ? isActive : true,
        subdomainId,
      },
    });

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error creating income-expense transaction:', error);
    return NextResponse.json(
      { error: 'Failed to create income-expense transaction' },
      { status: 500 }
    );
  }
}
