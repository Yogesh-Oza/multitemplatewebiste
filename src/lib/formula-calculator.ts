/**
 * Formula Calculator for Village Marking System
 * Handles parsing and evaluation of custom formulas with validation
 */

export interface FormulaVariables {
  [key: string]: number;
}

export interface FormulaResult {
  value: number;
  isValid: boolean;
  error?: string;
}

/**
 * Evaluate a formula string with given variables
 */
export function evaluateFormula(formula: string, variables: FormulaVariables): FormulaResult {
  try {
    if (!formula || !formula.trim()) {
      return { value: 0, isValid: false, error: 'Empty formula' };
    }

    // Replace variable names with their values
    let expression = formula.trim();
    const usedVariables: string[] = [];

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`\\b${key}\\b`, 'g');
      if (expression.includes(key)) {
        expression = expression.replace(regex, String(value));
        usedVariables.push(key);
      }
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

    // Handle SUM function
    expression = expression.replace(/SUM\s*\(\s*([^)]+)\s*\)/g, (match, args) => {
      const values = args.split(',').map(arg => parseFloat(evaluateExpression(arg.trim(), variables)));
      return values.reduce((sum, val) => sum + val, 0);
    });

    // Handle AVG function
    expression = expression.replace(/AVG\s*\(\s*([^)]+)\s*\)/g, (match, args) => {
      const values = args.split(',').map(arg => parseFloat(evaluateExpression(arg.trim(), variables)));
      return values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    const result = parseFloat(evaluateExpression(expression, variables));
    
    return {
      value: isNaN(result) ? 0 : result,
      isValid: !isNaN(result),
      error: isNaN(result) ? 'Invalid calculation result' : undefined
    };
  } catch (error) {
    return {
      value: 0,
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validate a formula string
 */
export function validateFormula(formula: string, availableFields: string[]): { isValid: boolean; error?: string } {
  try {
    if (!formula || !formula.trim()) {
      return { isValid: false, error: 'Formula cannot be empty' };
    }

    const expression = formula.trim();
    
    // Check for balanced parentheses
    let parenCount = 0;
    for (const char of expression) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) {
        return { isValid: false, error: 'Unbalanced parentheses' };
      }
    }
    if (parenCount !== 0) {
      return { isValid: false, error: 'Unbalanced parentheses' };
    }

    // Check for valid field references
    const fieldRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
    const matches = expression.match(fieldRegex) || [];
    const fieldNames = matches.filter(match => 
      !['IF', 'ROUND', 'MIN', 'MAX', 'SUM', 'AVG', 'true', 'false'].includes(match.toUpperCase())
    );

    for (const fieldName of fieldNames) {
      if (!availableFields.includes(fieldName)) {
        return { isValid: false, error: `Unknown field: ${fieldName}` };
      }
    }

    // Check for valid operators
    const validOperators = ['+', '-', '*', '/', '>', '<', '>=', '<=', '==', '!=', '&&', '||'];
    const operatorRegex = /[+\-*/><=!&|]/g;
    const operators = expression.match(operatorRegex) || [];
    
    for (const op of operators) {
      if (!validOperators.some(validOp => validOp.includes(op))) {
        return { isValid: false, error: `Invalid operator: ${op}` };
      }
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Unknown validation error'
    };
  }
}

/**
 * Get formula suggestions based on field types
 */
export function getFormulaSuggestions(fieldType: string, availableFields: string[]): string[] {
  const suggestions: string[] = [];

  switch (fieldType) {
    case 'percentage':
      if (availableFields.includes('sadhya') && availableFields.includes('udisht')) {
        suggestions.push('(sadhya/udisht)*100');
        suggestions.push('IF(udisht > 0, (sadhya/udisht)*100, 0)');
      }
      break;

    case 'marks':
      if (availableFields.includes('percentage')) {
        suggestions.push('IF(percentage >= 90, 10, IF(percentage >= 75, 8, IF(percentage >= 60, 6, IF(percentage >= 50, 4, 2))))');
        suggestions.push('IF(percentage >= 80, maxMarks, IF(percentage >= 60, maxMarks*0.8, IF(percentage >= 40, maxMarks*0.6, maxMarks*0.4)))');
      }
      break;

    case 'calculated':
      suggestions.push('udisht + sadhya');
      suggestions.push('udisht - sadhya');
      suggestions.push('(udisht + sadhya) / 2');
      suggestions.push('IF(sadhya > udisht, udisht, sadhya)');
      suggestions.push('MIN(udisht, sadhya)');
      suggestions.push('MAX(udisht, sadhya)');
      break;

    default:
      suggestions.push('udisht + sadhya');
      suggestions.push('udisht - sadhya');
      suggestions.push('udisht * sadhya');
      suggestions.push('udisht / sadhya');
      break;
  }

  return suggestions;
}

/**
 * Parse formula and extract field dependencies
 */
export function extractFieldDependencies(formula: string): string[] {
  const fieldRegex = /\b[a-zA-Z_][a-zA-Z0-9_]*\b/g;
  const matches = formula.match(fieldRegex) || [];
  
  return matches.filter(match => 
    !['IF', 'ROUND', 'MIN', 'MAX', 'SUM', 'AVG', 'true', 'false'].includes(match.toUpperCase())
  );
}

/**
 * Helper function to evaluate conditions
 */
function evaluateCondition(condition: string, variables: FormulaVariables): boolean {
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
        case '==': return Math.abs(leftVal - rightVal) < 0.0001; // Float comparison
        case '!=': return Math.abs(leftVal - rightVal) >= 0.0001;
        case '&&': return leftVal && rightVal;
        case '||': return leftVal || rightVal;
        default: return false;
      }
    }
  }
  
  return false;
}

/**
 * Helper function to evaluate expressions
 */
function evaluateExpression(expression: string, variables: FormulaVariables): string {
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

/**
 * Calculate marks from percentage with custom grading scale
 */
export function calculateMarksFromPercentage(
  percentage: number, 
  maxMarks: number, 
  gradingScale?: { [key: string]: number }
): number {
  const defaultScale = {
    'A+': 0.9,  // 90% and above
    'A': 0.8,   // 80-89%
    'B+': 0.7,  // 70-79%
    'B': 0.6,   // 60-69%
    'C': 0.5,   // 50-59%
    'D': 0.0    // Below 50%
  };

  const scale = gradingScale || defaultScale;

  if (percentage >= (scale['A+'] || 0.9) * 100) return maxMarks;
  if (percentage >= (scale['A'] || 0.8) * 100) return maxMarks * 0.9;
  if (percentage >= (scale['B+'] || 0.7) * 100) return maxMarks * 0.8;
  if (percentage >= (scale['B'] || 0.6) * 100) return maxMarks * 0.7;
  if (percentage >= (scale['C'] || 0.5) * 100) return maxMarks * 0.6;
  return maxMarks * 0.3; // Below 50%
}

/**
 * Format formula for display
 */
export function formatFormula(formula: string): string {
  return formula
    .replace(/\*/g, ' × ')
    .replace(/\//g, ' ÷ ')
    .replace(/\+/g, ' + ')
    .replace(/-/g, ' - ')
    .replace(/>=/g, ' ≥ ')
    .replace(/<=/g, ' ≤ ')
    .replace(/==/g, ' = ')
    .replace(/!=/g, ' ≠ ')
    .replace(/&&/g, ' AND ')
    .replace(/\|\|/g, ' OR ');
}
