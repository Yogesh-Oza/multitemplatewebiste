import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSubdomainId, validateSubdomain } from '@/lib/subdomain';
import { logCrudActivity } from '@/lib/activity-log-helper';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;
    const body = await request.json();
    const { type, title, titleEn, description, descriptionEn, amount, category, date, receiptUrl, isActive } = body;

    // Verify the transaction belongs to this subdomain
    const existingTransaction = await prisma.incomeExpense.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingTransaction) {
      return NextResponse.json({ 
        message: 'Transaction not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    const transaction = await prisma.incomeExpense.update({
      where: { id },
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
        isActive,
      },
    });

    // Log activity
    await logCrudActivity(request, 'UPDATE', 'IncomeExpense', transaction.id, `Updated ${type} transaction: ${title} (₹${amount})`);

    return NextResponse.json(transaction);
  } catch (error) {
    console.error('Error updating income-expense transaction:', error);
    return NextResponse.json(
      { error: 'Failed to update income-expense transaction' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { isValid, subdomainId } = await validateSubdomain(request);
    
    if (!isValid) {
      return NextResponse.json({ 
        message: 'Invalid or inactive subdomain' 
      }, { status: 404 });
    }

    const { id } = await params;

    // Verify the transaction belongs to this subdomain
    const existingTransaction = await prisma.incomeExpense.findFirst({
      where: { 
        id,
        subdomainId 
      }
    });

    if (!existingTransaction) {
      return NextResponse.json({ 
        message: 'Transaction not found or does not belong to this subdomain' 
      }, { status: 404 });
    }

    await prisma.incomeExpense.delete({
      where: { id },
    });

    // Log activity
    await logCrudActivity(request, 'DELETE', 'IncomeExpense', id, `Deleted ${existingTransaction.type} transaction: ${existingTransaction.title} (₹${existingTransaction.amount})`);

    return NextResponse.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting income-expense transaction:', error);
    return NextResponse.json(
      { error: 'Failed to delete income-expense transaction' },
      { status: 500 }
    );
  }
}
