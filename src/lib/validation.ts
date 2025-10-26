// Validation utility with Marathi and English messages

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
}

export interface ValidationError {
  field: string;
  message: string;
  messageEn: string;
  code: string;
}

export interface ValidationMessages {
  [key: string]: {
    marathi: string;
    english: string;
  };
}

export const validationMessages: ValidationMessages = {
  required: {
    marathi: 'हे फील्ड आवश्यक आहे',
    english: 'This field is required'
  },
  minLength: {
    marathi: 'किमान {min} अक्षरे आवश्यक आहेत',
    english: 'Minimum {min} characters required'
  },
  maxLength: {
    marathi: 'जास्तीत जास्त {max} अक्षरे परवानगी आहे',
    english: 'Maximum {max} characters allowed'
  },
  minValue: {
    marathi: 'किमान मूल्य {min} असावे',
    english: 'Minimum value should be {min}'
  },
  maxValue: {
    marathi: 'जास्तीत जास्त मूल्य {max} असावे',
    english: 'Maximum value should be {max}'
  },
  invalidEmail: {
    marathi: 'वैध ईमेल पत्ता प्रविष्ट करा',
    english: 'Please enter a valid email address'
  },
  invalidPhone: {
    marathi: 'वैध फोन नंबर प्रविष्ट करा',
    english: 'Please enter a valid phone number'
  },
  invalidPercentage: {
    marathi: 'टक्केवारी 0 ते 100 दरम्यान असावी',
    english: 'Percentage should be between 0 and 100'
  },
  invalidMarks: {
    marathi: 'गुण शून्यापेक्षा जास्त असावे',
    english: 'Marks should be greater than zero'
  },
  invalidTarget: {
    marathi: 'लक्ष्य शून्यापेक्षा जास्त असावे',
    english: 'Target should be greater than zero'
  },
  invalidAchieved: {
    marathi: 'साध्य मूल्य शून्यापेक्षा जास्त असावे',
    english: 'Achieved value should be greater than zero'
  },
  achievedExceedsTarget: {
    marathi: 'साध्य मूल्य लक्ष्यापेक्षा जास्त असू शकत नाही',
    english: 'Achieved value cannot exceed target'
  },
  invalidPopulation: {
    marathi: 'लोकसंख्या शून्यापेक्षा जास्त असावी',
    english: 'Population should be greater than zero'
  },
  invalidFamilies: {
    marathi: 'कुटुंबांची संख्या शून्यापेक्षा जास्त असावी',
    english: 'Number of families should be greater than zero'
  },
  invalidYear: {
    marathi: 'वैध वर्ष प्रविष्ट करा',
    english: 'Please enter a valid year'
  },
  invalidDate: {
    marathi: 'वैध तारीख प्रविष्ट करा',
    english: 'Please enter a valid date'
  },
  invalidUrl: {
    marathi: 'वैध URL प्रविष्ट करा',
    english: 'Please enter a valid URL'
  },
  invalidNumber: {
    marathi: 'वैध संख्या प्रविष्ट करा',
    english: 'Please enter a valid number'
  },
  invalidDecimal: {
    marathi: 'वैध दशांश संख्या प्रविष्ट करा',
    english: 'Please enter a valid decimal number'
  }
};

export class FormValidator {
  private errors: ValidationError[] = [];
  private language: 'marathi' | 'english' = 'marathi';

  constructor(language: 'marathi' | 'english' = 'marathi') {
    this.language = language;
  }

  validate(field: string, value: any, rules: ValidationRule): this {
    // Required validation
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      this.addError(field, 'required');
      return this;
    }

    // Skip other validations if value is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return this;
    }

    // Min length validation
    if (rules.min && typeof value === 'string' && value.length < rules.min) {
      this.addError(field, 'minLength', { min: rules.min });
      return this;
    }

    // Max length validation
    if (rules.max && typeof value === 'string' && value.length > rules.max) {
      this.addError(field, 'maxLength', { max: rules.max });
      return this;
    }

    // Min value validation
    if (rules.min && typeof value === 'number' && value < rules.min) {
      this.addError(field, 'minValue', { min: rules.min });
      return this;
    }

    // Max value validation
    if (rules.max && typeof value === 'number' && value > rules.max) {
      this.addError(field, 'maxValue', { max: rules.max });
      return this;
    }

    // Pattern validation
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      this.addError(field, 'invalidPattern');
      return this;
    }

    // Custom validation
    if (rules.custom && !rules.custom(value)) {
      this.addError(field, 'custom');
      return this;
    }

    return this;
  }

  private addError(field: string, code: string, params?: any) {
    const message = this.getMessage(code, params);
    this.errors.push({
      field,
      message: message.marathi,
      messageEn: message.english,
      code
    });
  }

  private getMessage(code: string, params?: any): { marathi: string; english: string } {
    const template = validationMessages[code];
    if (!template) {
      return {
        marathi: 'अवैध मूल्य',
        english: 'Invalid value'
      };
    }

    let marathi = template.marathi;
    let english = template.english;

    if (params) {
      Object.keys(params).forEach(key => {
        marathi = marathi.replace(`{${key}}`, params[key]);
        english = english.replace(`{${key}}`, params[key]);
      });
    }

    return { marathi, english };
  }

  getErrors(): ValidationError[] {
    return this.errors;
  }

  hasErrors(): boolean {
    return this.errors.length > 0;
  }

  getError(field: string): ValidationError | undefined {
    return this.errors.find(error => error.field === field);
  }

  getErrorMessage(field: string): string {
    const error = this.getError(field);
    if (!error) return '';
    return this.language === 'marathi' ? error.message : error.messageEn;
  }

  clearErrors(): this {
    this.errors = [];
    return this;
  }

  // Campaign form specific validations
  validateBasicInfo(data: any): this {
    this.validate('grampanchayatName', data.grampanchayatName, { required: true, min: 2, max: 100 });
    this.validate('taluka', data.taluka, { required: true, min: 2, max: 50 });
    this.validate('population', data.population, { required: true, min: 1, max: 100000 });
    this.validate('families', data.families, { required: true, min: 1, max: 50000 });
    this.validate('gpoName', data.gpoName, { required: true, min: 2, max: 100 });
    this.validate('sarpanchName', data.sarpanchName, { required: true, min: 2, max: 100 });
    this.validate('establishmentYear', data.establishmentYear, { 
      required: true, 
      custom: (value) => {
        const year = parseInt(value);
        const currentYear = new Date().getFullYear();
        return year >= 1900 && year <= currentYear;
      }
    });
    return this;
  }

  validateItemValue(data: any): this {
    this.validate('target', data.target, { required: true, min: 0 });
    this.validate('achieved', data.achieved, { required: true, min: 0 });
    
    // Check if achieved exceeds target
    if (data.target && data.achieved && data.achieved > data.target) {
      this.addError('achieved', 'achievedExceedsTarget');
    }
    
    return this;
  }

  validatePercentage(value: number): this {
    this.validate('percentage', value, { 
      required: true, 
      min: 0, 
      max: 100,
      custom: (val) => val >= 0 && val <= 100
    });
    return this;
  }

  validateMarks(value: number, maxMarks: number): this {
    this.validate('marks', value, { 
      required: true, 
      min: 0, 
      max: maxMarks,
      custom: (val) => val >= 0 && val <= maxMarks
    });
    return this;
  }

  validateInnovation(innovation: string): this {
    this.validate('innovation', innovation, { 
      required: true, 
      min: 10, 
      max: 500 
    });
    return this;
  }

  // Utility methods for common validations
  static isEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static isUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  static isPercentage(value: number): boolean {
    return value >= 0 && value <= 100;
  }

  static isPositiveNumber(value: number): boolean {
    return value > 0;
  }

  static isNonNegativeNumber(value: number): boolean {
    return value >= 0;
  }
}

// Export commonly used validation rules
export const commonValidationRules = {
  required: { required: true },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[+]?[\d\s\-\(\)]{10,}$/ },
  url: { pattern: /^https?:\/\/.+/ },
  percentage: { min: 0, max: 100 },
  positiveNumber: { min: 0.01 },
  nonNegativeNumber: { min: 0 }
};

// Export validation functions for direct use
export const validateForm = (data: any, rules: Record<string, ValidationRule>, language: 'marathi' | 'english' = 'marathi'): ValidationError[] => {
  const validator = new FormValidator(language);
  
  Object.keys(rules).forEach(field => {
    validator.validate(field, data[field], rules[field]);
  });
  
  return validator.getErrors();
};

export const getValidationMessage = (field: string, errors: ValidationError[], language: 'marathi' | 'english' = 'marathi'): string => {
  const error = errors.find(e => e.field === field);
  if (!error) return '';
  return language === 'marathi' ? error.message : error.messageEn;
};
