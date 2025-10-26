import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// POST: Calculate field values
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { fieldId, udisht, sadhya, fieldValues = {} } = body;

    // Get field configuration
    const field = await prisma.villageMarkingField.findUnique({
      where: { id: fieldId },
      include: {
        section: {
          select: {
            maxMarks: true
          }
        }
      }
    });

    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      );
    }

    const results: any = {};

    // Calculate percentage if both udisht and sadhya are provided
    if (udisht !== null && udisht !== undefined && sadhya !== null && sadhya !== undefined) {
      const udishtNum = parseFloat(udisht);
      const sadhyaNum = parseFloat(sadhya);
      
      if (udishtNum > 0) {
        results.percentage = (sadhyaNum / udishtNum) * 100;
      } else {
        results.percentage = 0;
      }

      // Calculate marks based on percentage
      if (field.fieldType === 'marks' && field.formula) {
        results.marks = evaluateFormula(field.formula, {
          percentage: results.percentage,
          udisht: udishtNum,
          sadhya: sadhyaNum,
          ...fieldValues
        });
      } else {
        // Default marks calculation based on percentage
        results.marks = calculateMarksFromPercentage(results.percentage, field.section.maxMarks);
      }
    }

    // Calculate other field types
    if (field.fieldType === 'calculated' && field.formula) {
      results.calculatedValue = evaluateFormula(field.formula, {
        udisht: parseFloat(udisht) || 0,
        sadhya: parseFloat(sadhya) || 0,
        percentage: results.percentage || 0,
        marks: results.marks || 0,
        ...fieldValues
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Error calculating field values:', error);
    return NextResponse.json(
      { error: 'Failed to calculate field values' },
      { status: 500 }
    );
  }
}

// Helper function to evaluate formulas
function evaluateFormula(formula: string, variables: any): number {
  try {
    // Replace variable names with their values
    let expression = formula;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      expression = expression.replace(regex, String(value));
    }

    // Handle IF statements
    expression = expression.replace(/IF\s*\(\s*([^,]+)\s*,\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, condition, trueValue, falseValue) => {
      const conditionResult = evaluateCondition(condition, variables);
      return conditionResult ? trueValue : falseValue;
    });

    // Handle ROUND function
    expression = expression.replace(/ROUND\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, value, decimals) => {
      const numValue = parseFloat(evaluateExpression(value, variables));
      const numDecimals = parseInt(evaluateExpression(decimals, variables));
      return Math.round(numValue * Math.pow(10, numDecimals)) / Math.pow(10, numDecimals);
    });

    // Handle MIN function
    expression = expression.replace(/MIN\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, a, b) => {
      const valA = parseFloat(evaluateExpression(a, variables));
      const valB = parseFloat(evaluateExpression(b, variables));
      return Math.min(valA, valB);
    });

    // Handle MAX function
    expression = expression.replace(/MAX\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g, (match, a, b) => {
      const valA = parseFloat(evaluateExpression(a, variables));
      const valB = parseFloat(evaluateExpression(b, variables));
      return Math.max(valA, valB);
    });

    return parseFloat(evaluateExpression(expression, variables));
  } catch (error) {
    console.error('Error evaluating formula:', error);
    return 0;
  }
}

function evaluateCondition(condition: string, variables: any): boolean {
  const operators = ['>=', '<=', '>', '<', '==', '!=', '&&', '||'];
  
  for (const op of operators) {
    if (condition.includes(op)) {
      const [left, right] = condition.split(op).map(s => s.trim());
      const leftVal = parseFloat(evaluateExpression(left, variables));
      const rightVal = parseFloat(evaluateExpression(right, variables));
      
      switch (op) {
        case '>=': return leftVal >= rightVal;
        case '<=': return leftVal <= rightVal;
        case '>': return leftVal > rightVal;
        case '<': return leftVal < rightVal;
        case '==': return leftVal === rightVal;
        case '!=': return leftVal !== rightVal;
        case '&&': return leftVal && rightVal;
        case '||': return leftVal || rightVal;
        default: return false;
      }
    }
  }
  
  return false;
}

function evaluateExpression(expression: string, variables: any): string {
  // Simple expression evaluator for basic arithmetic
  try {
    // Replace variables with values
    let result = expression;
    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      result = result.replace(regex, String(value));
    }
    
    // Evaluate basic arithmetic
    return String(Function('"use strict"; return (' + result + ')')());
  } catch (error) {
    return '0';
  }
}

function calculateMarksFromPercentage(percentage: number, maxMarks: number): number {
  if (percentage >= 90) return maxMarks;
  if (percentage >= 75) return maxMarks * 0.8;
  if (percentage >= 60) return maxMarks * 0.6;
  if (percentage >= 50) return maxMarks * 0.4;
  return maxMarks * 0.2;
}
