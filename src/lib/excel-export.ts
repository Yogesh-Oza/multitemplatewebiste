/**
 * Excel Export Library for Village Marking System
 * Handles Excel generation with government format styling
 */

import ExcelJS from 'exceljs';

export interface VillageMarkingData {
  submission: {
    id: string;
    totalMarks: number;
    totalMaxMarks: number;
    submittedAt: Date | null;
    subdomain: {
      subdomain: string;
      villageName: string;
      villageNameEn: string;
      districtName: string | null;
      subDistrictName: string | null;
    };
    section: {
      title: string;
      titleEn: string;
      maxMarks: number;
    } | null;
    fieldValues: Array<{
      field: {
        fieldName: string;
        fieldNameEn: string;
        fieldType: string;
        order: number;
      };
      udisht: number | null;
      sadhya: number | null;
      percentage: number | null;
      marks: number | null;
      textValue: string | null;
      numberValue: number | null;
      dateValue: Date | null;
      fileUrl: string | null;
      checkboxValue: boolean | null;
      calculatedValue: number | null;
    }>;
  };
}

export interface ExportOptions {
  format: 'detailed' | 'summary';
  includeCharts?: boolean;
  language?: 'marathi' | 'english' | 'both';
}

/**
 * Generate Excel file for village marking data
 */
export async function generateVillageMarkingExcel(
  data: VillageMarkingData,
  options: ExportOptions = { format: 'detailed', language: 'both' }
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = 'Maharashtra Government';
  workbook.lastModifiedBy = 'Village Marking System';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create main worksheet
  const worksheet = workbook.addWorksheet('Village Marking Report');
  
  // Set up styles
  const styles = createStyles();
  
  // Add header
  await addHeader(worksheet, data, styles, options);
  
  // Add village information
  await addVillageInfo(worksheet, data, styles, options);
  
  // Add section data
  if (options.format === 'detailed') {
    await addDetailedSectionData(worksheet, data, styles, options);
  } else {
    await addSummaryData(worksheet, data, styles, options);
  }
  
  // Add footer
  await addFooter(worksheet, data, styles, options);
  
  // Set column widths
  setColumnWidths(worksheet);
  
  // Generate buffer
  return await workbook.xlsx.writeBuffer() as unknown as Buffer;
}

/**
 * Create Excel styles
 */
function createStyles() {
  return {
    header: {
      font: { bold: true, size: 16, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      }
    },
    subHeader: {
      font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2F5597' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      }
    },
    sectionHeader: {
      font: { bold: true, size: 12, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      }
    },
    fieldHeader: {
      font: { bold: true, size: 11, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      }
    },
    cell: {
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      },
      alignment: { vertical: 'middle' }
    },
    numberCell: {
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '0.00'
    },
    totalCell: {
      font: { bold: true },
      border: {
        top: { style: 'thin', color: { argb: 'FF000000' } },
        left: { style: 'thin', color: { argb: 'FF000000' } },
        bottom: { style: 'thin', color: { argb: 'FF000000' } },
        right: { style: 'thin', color: { argb: 'FF000000' } }
      },
      alignment: { horizontal: 'right', vertical: 'middle' },
      numFmt: '0.00'
    }
  };
}

/**
 * Add header to worksheet
 */
async function addHeader(worksheet: ExcelJS.Worksheet, data: VillageMarkingData, styles: any, options: ExportOptions) {
  const { submission } = data;
  
  // Main title
  worksheet.mergeCells('A1:F1');
  worksheet.getCell('A1').value = 'महाराष्ट्र शासन - ग्रामपंचायत गुणांक अहवाल';
  worksheet.getCell('A1').style = styles.header;
  
  // English title
  worksheet.mergeCells('A2:F2');
  worksheet.getCell('A2').value = 'Maharashtra Government - Village Marking Report';
  worksheet.getCell('A2').style = { ...styles.header, font: { ...styles.header.font, size: 14 } };
  
  // Government branding
  worksheet.mergeCells('A3:F3');
  worksheet.getCell('A3').value = 'शासन महाराष्ट्र • ग्रामीण विकास विभाग';
  worksheet.getCell('A3').style = { ...styles.subHeader, font: { ...styles.subHeader.font, size: 12 } };
}

/**
 * Add village information
 */
async function addVillageInfo(worksheet: ExcelJS.Worksheet, data: VillageMarkingData, styles: any, options: ExportOptions) {
  const { submission } = data;
  let currentRow = 5;
  
  const infoData = [
    { label: 'गावाचे नाव / Village Name:', value: `${submission.subdomain.villageName} / ${submission.subdomain.villageNameEn}` },
    { label: 'जिल्हा / District:', value: submission.subdomain.districtName || 'N/A' },
    { label: 'तालुका / Sub-District:', value: submission.subdomain.subDistrictName || 'N/A' },
    { label: 'तारीख / Date:', value: submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN') },
    { label: 'एकूण गुण / Total Marks:', value: `${submission.totalMarks} / ${submission.totalMaxMarks}` },
    { label: 'टक्केवारी / Percentage:', value: submission.totalMaxMarks > 0 ? `${((submission.totalMarks / submission.totalMaxMarks) * 100).toFixed(2)}%` : '0%' }
  ];
  
  for (const info of infoData) {
    worksheet.getCell(`A${currentRow}`).value = info.label;
    worksheet.getCell(`B${currentRow}`).value = info.value;
    worksheet.getCell(`A${currentRow}`).style = styles.cell;
    worksheet.getCell(`B${currentRow}`).style = styles.cell;
    currentRow++;
  }
}

/**
 * Add detailed section data
 */
async function addDetailedSectionData(worksheet: ExcelJS.Worksheet, data: VillageMarkingData, styles: any, options: ExportOptions) {
  const { submission } = data;
  let currentRow = 12;
  
  if (submission.section) {
    // Section header
    worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
    worksheet.getCell(`A${currentRow}`).value = `विभाग: ${submission.section.title} / Section: ${submission.section.titleEn}`;
    worksheet.getCell(`A${currentRow}`).style = styles.sectionHeader;
    currentRow++;
    
    // Field headers
    const headers = [
      'फील्ड नाव / Field Name',
      'उदिष्ट / Target',
      'साध्य / Achievement',
      'टक्केवारी / Percentage',
      'गुण / Marks',
      'टिप्पणी / Remarks'
    ];
    
    for (let col = 1; col <= headers.length; col++) {
      worksheet.getCell(currentRow, col).value = headers[col - 1];
      worksheet.getCell(currentRow, col).style = styles.fieldHeader;
    }
    currentRow++;
    
    // Field data
    for (const fieldValue of submission.fieldValues) {
      const rowData = [
        `${fieldValue.field.fieldName} / ${fieldValue.field.fieldNameEn}`,
        fieldValue.udisht || '',
        fieldValue.sadhya || '',
        fieldValue.percentage ? `${fieldValue.percentage.toFixed(2)}%` : '',
        fieldValue.marks || '',
        ''
      ];
      
      for (let col = 1; col <= rowData.length; col++) {
        worksheet.getCell(currentRow, col).value = rowData[col - 1];
        if (col === 2 || col === 3 || col === 5) { // Numeric columns
          worksheet.getCell(currentRow, col).style = styles.numberCell;
        } else {
          worksheet.getCell(currentRow, col).style = styles.cell;
        }
      }
      currentRow++;
    }
    
    // Section total
    worksheet.getCell(`A${currentRow}`).value = 'एकूण / Total';
    worksheet.getCell(`B${currentRow}`).value = '';
    worksheet.getCell(`C${currentRow}`).value = '';
    worksheet.getCell(`D${currentRow}`).value = '';
    worksheet.getCell(`E${currentRow}`).value = submission.totalMarks;
    worksheet.getCell(`F${currentRow}`).value = '';
    
    for (let col = 1; col <= 6; col++) {
      worksheet.getCell(currentRow, col).style = styles.totalCell;
    }
  }
}

/**
 * Add summary data
 */
async function addSummaryData(worksheet: ExcelJS.Worksheet, data: VillageMarkingData, styles: any, options: ExportOptions) {
  const { submission } = data;
  let currentRow = 12;
  
  // Summary table
  worksheet.mergeCells(`A${currentRow}:D${currentRow}`);
  worksheet.getCell(`A${currentRow}`).value = 'सारांश / Summary';
  worksheet.getCell(`A${currentRow}`).style = styles.sectionHeader;
  currentRow++;
  
  const summaryData = [
    { label: 'एकूण गुण / Total Marks:', value: submission.totalMarks },
    { label: 'कमाल गुण / Maximum Marks:', value: submission.totalMaxMarks },
    { label: 'टक्केवारी / Percentage:', value: submission.totalMaxMarks > 0 ? ((submission.totalMarks / submission.totalMaxMarks) * 100).toFixed(2) + '%' : '0%' },
    { label: 'श्रेणी / Grade:', value: getGrade(submission.totalMarks, submission.totalMaxMarks) }
  ];
  
  for (const item of summaryData) {
    worksheet.getCell(`A${currentRow}`).value = item.label;
    worksheet.getCell(`B${currentRow}`).value = item.value;
    worksheet.getCell(`A${currentRow}`).style = styles.cell;
    worksheet.getCell(`B${currentRow}`).style = styles.cell;
    currentRow++;
  }
}

/**
 * Add footer
 */
async function addFooter(worksheet: ExcelJS.Worksheet, data: VillageMarkingData, styles: any, options: ExportOptions) {
  const lastRow = worksheet.rowCount;
  const footerRow = lastRow + 2;
  
  worksheet.mergeCells(`A${footerRow}:F${footerRow}`);
  worksheet.getCell(`A${footerRow}`).value = 'Generated by Village Marking System - Maharashtra Government';
  worksheet.getCell(`A${footerRow}`).style = { ...styles.cell, font: { italic: true, size: 10 } };
}

/**
 * Set column widths
 */
function setColumnWidths(worksheet: ExcelJS.Worksheet) {
  worksheet.getColumn('A').width = 30;
  worksheet.getColumn('B').width = 15;
  worksheet.getColumn('C').width = 15;
  worksheet.getColumn('D').width = 18;
  worksheet.getColumn('E').width = 15;
  worksheet.getColumn('F').width = 25;
}

/**
 * Get grade based on marks
 */
function getGrade(marks: number, maxMarks: number): string {
  if (maxMarks === 0) return 'N/A';
  
  const percentage = (marks / maxMarks) * 100;
  
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  return 'D';
}

/**
 * Format section data for export
 */
export function formatSectionData(section: any, values: any[]): any {
  return {
    sectionTitle: section.title,
    sectionTitleEn: section.titleEn,
    maxMarks: section.maxMarks,
    fields: values.map(value => ({
      fieldName: value.field.fieldName,
      fieldNameEn: value.field.fieldNameEn,
      fieldType: value.field.fieldType,
      udisht: value.udisht,
      sadhya: value.sadhya,
      percentage: value.percentage,
      marks: value.marks,
      textValue: value.textValue,
      numberValue: value.numberValue,
      dateValue: value.dateValue,
      fileUrl: value.fileUrl,
      checkboxValue: value.checkboxValue,
      calculatedValue: value.calculatedValue
    }))
  };
}
