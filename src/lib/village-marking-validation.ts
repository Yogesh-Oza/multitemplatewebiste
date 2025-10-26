/**
 * Validation Library for Village Marking System
 * Handles field validation with Marathi and English error messages
 */

export interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
  messageEn?: string;
  custom?: (value: any) => boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  errorsEn: string[];
}

export interface FieldValidation {
  fieldName: string;
  fieldType: string;
  value: any;
  rules: ValidationRule;
}

/**
 * Validate a single field
 */
export function validateField(field: FieldValidation): ValidationResult {
  const errors: string[] = [];
  const errorsEn: string[] = [];
  
  const { fieldName, fieldType, value, rules } = field;
  
  // Required validation
  if (rules.required && (value === null || value === undefined || value === '')) {
    errors.push(`${fieldName} आवश्यक आहे`);
    errorsEn.push(`${fieldName} is required`);
  }
  
  // Skip other validations if value is empty and not required
  if (!rules.required && (value === null || value === undefined || value === '')) {
    return { isValid: true, errors: [], errorsEn: [] };
  }
  
  // Type-specific validations
  switch (fieldType) {
    case 'udisht':
      validateUdisht(value, rules, errors, errorsEn, fieldName);
      break;
    case 'sadhya':
      validateSadhya(value, rules, errors, errorsEn, fieldName);
      break;
    case 'percentage':
      validatePercentage(value, rules, errors, errorsEn, fieldName);
      break;
    case 'marks':
      validateMarks(value, rules, errors, errorsEn, fieldName);
      break;
    case 'number':
      validateNumber(value, rules, errors, errorsEn, fieldName);
      break;
    case 'text':
      validateText(value, rules, errors, errorsEn, fieldName);
      break;
    case 'date':
      validateDate(value, rules, errors, errorsEn, fieldName);
      break;
    case 'email':
      validateEmail(value, rules, errors, errorsEn, fieldName);
      break;
    case 'phone':
      validatePhone(value, rules, errors, errorsEn, fieldName);
      break;
  }
  
  // Custom validation
  if (rules.custom && !rules.custom(value)) {
    const message = rules.message || `${fieldName} अवैध आहे`;
    const messageEn = rules.messageEn || `${fieldName} is invalid`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    errorsEn
  };
}

/**
 * Validate multiple fields
 */
export function validateFields(fields: FieldValidation[]): ValidationResult {
  const allErrors: string[] = [];
  const allErrorsEn: string[] = [];
  
  for (const field of fields) {
    const result = validateField(field);
    allErrors.push(...result.errors);
    allErrorsEn.push(...result.errorsEn);
  }
  
  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    errorsEn: allErrorsEn
  };
}

/**
 * Validate उदिष्ट (Target) field
 */
function validateUdisht(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} वैध संख्या असावी`);
    errorsEn.push(`${fieldName} must be a valid number`);
    return;
  }
  
  if (numValue <= 0) {
    errors.push(`${fieldName} 0 पेक्षा जास्त असावे`);
    errorsEn.push(`${fieldName} must be greater than 0`);
  }
  
  if (rules.min !== undefined && numValue < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && numValue > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate साध्य (Achievement) field
 */
function validateSadhya(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} वैध संख्या असावी`);
    errorsEn.push(`${fieldName} must be a valid number`);
    return;
  }
  
  if (numValue < 0) {
    errors.push(`${fieldName} 0 पेक्षा कमी असू शकत नाही`);
    errorsEn.push(`${fieldName} cannot be negative`);
  }
  
  if (rules.min !== undefined && numValue < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && numValue > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate percentage field
 */
function validatePercentage(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} वैध टक्केवारी असावी`);
    errorsEn.push(`${fieldName} must be a valid percentage`);
    return;
  }
  
  if (numValue < 0 || numValue > 100) {
    errors.push(`${fieldName} 0 आणि 100 दरम्यान असावी`);
    errorsEn.push(`${fieldName} must be between 0 and 100`);
  }
  
  if (rules.min !== undefined && numValue < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min}% असावी`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min}%`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && numValue > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max}% असावी`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max}%`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate marks field
 */
function validateMarks(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} वैध गुण असावे`);
    errorsEn.push(`${fieldName} must be valid marks`);
    return;
  }
  
  if (numValue < 0) {
    errors.push(`${fieldName} 0 पेक्षा कमी असू शकत नाही`);
    errorsEn.push(`${fieldName} cannot be negative`);
  }
  
  if (rules.min !== undefined && numValue < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && numValue > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate number field
 */
function validateNumber(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const numValue = parseFloat(value);
  
  if (isNaN(numValue)) {
    errors.push(`${fieldName} वैध संख्या असावी`);
    errorsEn.push(`${fieldName} must be a valid number`);
    return;
  }
  
  if (rules.min !== undefined && numValue < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && numValue > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max} असावे`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max}`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate text field
 */
function validateText(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  if (typeof value !== 'string') {
    errors.push(`${fieldName} मजकूर असावा`);
    errorsEn.push(`${fieldName} must be text`);
    return;
  }
  
  if (rules.min !== undefined && value.length < rules.min) {
    const message = rules.message || `${fieldName} किमान ${rules.min} अक्षरे असावीत`;
    const messageEn = rules.messageEn || `${fieldName} must be at least ${rules.min} characters`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.max !== undefined && value.length > rules.max) {
    const message = rules.message || `${fieldName} कमाल ${rules.max} अक्षरे असावीत`;
    const messageEn = rules.messageEn || `${fieldName} must be at most ${rules.max} characters`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
  
  if (rules.pattern && !new RegExp(rules.pattern).test(value)) {
    const message = rules.message || `${fieldName} योग्य स्वरूपात असावा`;
    const messageEn = rules.messageEn || `${fieldName} must be in correct format`;
    errors.push(message);
    errorsEn.push(messageEn);
  }
}

/**
 * Validate date field
 */
function validateDate(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const dateValue = new Date(value);
  
  if (isNaN(dateValue.getTime())) {
    errors.push(`${fieldName} वैध तारीख असावी`);
    errorsEn.push(`${fieldName} must be a valid date`);
    return;
  }
  
  const now = new Date();
  
  if (rules.min !== undefined) {
    const minDate = new Date(rules.min);
    if (dateValue < minDate) {
      const message = rules.message || `${fieldName} ${minDate.toLocaleDateString('en-IN')} नंतर असावी`;
      const messageEn = rules.messageEn || `${fieldName} must be after ${minDate.toLocaleDateString('en-IN')}`;
      errors.push(message);
      errorsEn.push(messageEn);
    }
  }
  
  if (rules.max !== undefined) {
    const maxDate = new Date(rules.max);
    if (dateValue > maxDate) {
      const message = rules.message || `${fieldName} ${maxDate.toLocaleDateString('en-IN')} आधी असावी`;
      const messageEn = rules.messageEn || `${fieldName} must be before ${maxDate.toLocaleDateString('en-IN')}`;
      errors.push(message);
      errorsEn.push(messageEn);
    }
  }
}

/**
 * Validate email field
 */
function validateEmail(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(value)) {
    errors.push(`${fieldName} वैध ईमेल पत्ता असावा`);
    errorsEn.push(`${fieldName} must be a valid email address`);
  }
}

/**
 * Validate phone field
 */
function validatePhone(value: any, rules: ValidationRule, errors: string[], errorsEn: string[], fieldName: string) {
  const phoneRegex = /^[6-9]\d{9}$/;
  
  if (!phoneRegex.test(value.replace(/\D/g, ''))) {
    errors.push(`${fieldName} वैध फोन नंबर असावा`);
    errorsEn.push(`${fieldName} must be a valid phone number`);
  }
}

/**
 * Get default validation rules for field types
 */
export function getDefaultValidationRules(fieldType: string): ValidationRule {
  switch (fieldType) {
    case 'udisht':
      return {
        required: true,
        min: 0.01,
        message: 'उदिष्ट मूल्य 0 पेक्षा जास्त असावे',
        messageEn: 'Target value must be greater than 0'
      };
    case 'sadhya':
      return {
        required: true,
        min: 0,
        message: 'साध्य मूल्य 0 पेक्षा जास्त किंवा समान असावे',
        messageEn: 'Achievement value must be greater than or equal to 0'
      };
    case 'percentage':
      return {
        min: 0,
        max: 100,
        message: 'टक्केवारी 0 आणि 100 दरम्यान असावी',
        messageEn: 'Percentage must be between 0 and 100'
      };
    case 'marks':
      return {
        min: 0,
        message: 'गुण 0 पेक्षा कमी असू शकत नाही',
        messageEn: 'Marks cannot be negative'
      };
    case 'text':
      return {
        min: 1,
        max: 1000,
        message: 'मजकूर 1 ते 1000 अक्षरे असावा',
        messageEn: 'Text must be between 1 and 1000 characters'
      };
    case 'email':
      return {
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        message: 'वैध ईमेल पत्ता असावा',
        messageEn: 'Must be a valid email address'
      };
    case 'phone':
      return {
        pattern: '^[6-9]\\d{9}$',
        message: 'वैध फोन नंबर असावा',
        messageEn: 'Must be a valid phone number'
      };
    default:
      return {};
  }
}

/**
 * Validate submission completeness
 */
export function validateSubmissionCompleteness(fields: FieldValidation[]): ValidationResult {
  const requiredFields = fields.filter(field => field.rules.required);
  const errors: string[] = [];
  const errorsEn: string[] = [];
  
  for (const field of requiredFields) {
    if (field.value === null || field.value === undefined || field.value === '') {
      errors.push(`${field.fieldName} आवश्यक आहे`);
      errorsEn.push(`${field.fieldName} is required`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    errorsEn
  };
}
