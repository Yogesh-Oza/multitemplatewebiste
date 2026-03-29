/**
 * Placeholder clause keys for Maharashtra GP mandatory disclosure scaffolding.
 * Replace titles/content with official checklist text when the PDF is available.
 */
export const DEFAULT_RTI_CLAUSES: Array<{
  clauseKey: string;
  titleMr: string;
  titleEn: string;
  isMandatory: boolean;
}> = [
  { clauseKey: 'org_structure', titleMr: 'संघटनात्मक रचना', titleEn: 'Organisational structure', isMandatory: true },
  { clauseKey: 'budget_summary', titleMr: 'अर्थसंकल्प सारांश', titleEn: 'Budget summary', isMandatory: true },
  { clauseKey: 'gram_sabha_minutes', titleMr: 'ग्राम सभा इतिवृत्त', titleEn: 'Gram Sabha minutes', isMandatory: true },
  { clauseKey: 'works_programme', titleMr: 'कामांचे कार्यक्रम / भांडवली खर्च', titleEn: 'Works programme / capital expenditure', isMandatory: true },
  { clauseKey: 'property_tax', titleMr: 'मालमत्ता कर आकारणी', titleEn: 'Property tax collection', isMandatory: true },
  { clauseKey: 'rti_applications', titleMr: 'माहितीचा अर्ज व निर्णय', titleEn: 'RTI applications and decisions', isMandatory: true },
  { clauseKey: 'schemes_beneficiaries', titleMr: 'योजना व लाभार्थी', titleEn: 'Schemes and beneficiaries', isMandatory: true },
  { clauseKey: 'contracts', titleMr: 'करार / निविदा', titleEn: 'Contracts / tenders', isMandatory: true },
  { clauseKey: 'audit_reports', titleMr: 'लेखापरीक्षण अहवाल', titleEn: 'Audit reports', isMandatory: true },
  { clauseKey: 'citizen_charter', titleMr: 'नागरिक चार्टर', titleEn: 'Citizen charter', isMandatory: false },
];
