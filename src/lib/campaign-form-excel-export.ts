import ExcelJS from 'exceljs';

export interface CampaignFormExcelData {
  basicInfo: {
    grampanchayatName: string;
    taluka: string;
    population: number;
    families: number;
    gpoName: string;
    sarpanchName: string;
    populationCategory: string;
  };
  campaignInfo: {
    name: string;
    nameEn: string;
    year: string;
    campaignName: string;
  };
  summary: {
    grandTotal: number;
    maxPossibleTotal: number;
    percentage: number;
    submittedAt: string;
    status: string;
  };
  sectionResults: Array<{
    sectionId: number;
    title: string;
    titleEn: string;
    achievedMarks: number;
    maxMarks: number;
    percentage: number;
    items: Array<{
      itemId: string;
      fieldName: string;
      fieldNameEn: string;
      target: number;
      achieved: number;
      percentage: number;
      marks: number;
      isSubItem: boolean;
      parentItemId?: string;
    }>;
  }>;
  innovations?: Array<{
    description: string;
    marks: number;
  }>;
}

export async function generateCampaignFormExcel(data: CampaignFormExcelData): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = 'Mahagp.in Campaign Form System';
  workbook.lastModifiedBy = 'Village Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create Summary Sheet
  await createSummarySheet(workbook, data);
  
  // Create Section-wise Details Sheet
  await createSectionDetailsSheet(workbook, data);
  
  // Create Item-wise Details Sheet
  await createItemDetailsSheet(workbook, data);
  
  // Create Innovations Sheet (if applicable)
  if (data.innovations && data.innovations.length > 0) {
    await createInnovationsSheet(workbook, data);
  }

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

async function createSummarySheet(workbook: ExcelJS.Workbook, data: CampaignFormExcelData) {
  const worksheet = workbook.addWorksheet('Summary', {
    properties: { tabColor: { argb: 'FF3B82F6' } }
  });

  // Set column widths
  worksheet.columns = [
    { width: 25 },
    { width: 40 }
  ];

  // Title
  worksheet.mergeCells('A1:B1');
  const titleCell = worksheet.getCell('A1');
  titleCell.value = `${data.campaignInfo.name} - Results Summary`;
  titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
  titleCell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF1E40AF' }
  };
  titleCell.alignment = { horizontal: 'center', vertical: 'middle' };

  // Village Information Section
  let currentRow = 3;
  
  // Section header
  worksheet.getCell(`A${currentRow}`).value = 'Village Information';
  worksheet.getCell(`A${currentRow}`).font = { size: 14, bold: true, color: { argb: 'FF1E40AF' } };
  worksheet.getCell(`A${currentRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF3F4F6' }
  };
  currentRow++;

  // Village details
  const villageDetails = [
    ['Gram Panchayat Name', data.basicInfo.grampanchayatName],
    ['Taluka', data.basicInfo.taluka],
    ['Population', data.basicInfo.population.toLocaleString()],
    ['Number of Families', data.basicInfo.families.toLocaleString()],
    ['GPO Name', data.basicInfo.gpoName],
    ['Sarpanch Name', data.basicInfo.sarpanchName],
    ['Population Category', data.basicInfo.populationCategory]
  ];

  villageDetails.forEach(([label, value]) => {
    worksheet.getCell(`A${currentRow}`).value = label;
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = value;
    currentRow++;
  });

  currentRow++; // Empty row

  // Performance Summary Section
  worksheet.getCell(`A${currentRow}`).value = 'Performance Summary';
  worksheet.getCell(`A${currentRow}`).font = { size: 14, bold: true, color: { argb: 'FF1E40AF' } };
  worksheet.getCell(`A${currentRow}`).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFF3F4F6' }
  };
  currentRow++;

  const performanceDetails = [
    ['Total Marks Achieved', data.summary.grandTotal.toFixed(1)],
    ['Maximum Possible Marks', data.summary.maxPossibleTotal.toFixed(1)],
    ['Overall Percentage', `${data.summary.percentage}%`],
    ['Submission Status', data.summary.status],
    ['Submitted On', new Date(data.summary.submittedAt).toLocaleDateString('en-IN')]
  ];

  performanceDetails.forEach(([label, value]) => {
    worksheet.getCell(`A${currentRow}`).value = label;
    worksheet.getCell(`A${currentRow}`).font = { bold: true };
    worksheet.getCell(`B${currentRow}`).value = value;
    
    // Color code the percentage
    if (label === 'Overall Percentage') {
      const percentage = data.summary.percentage;
      if (percentage >= 80) {
        worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'FF16A34A' }, bold: true };
      } else if (percentage >= 50) {
        worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'FFD97706' }, bold: true };
      } else {
        worksheet.getCell(`B${currentRow}`).font = { color: { argb: 'FFDC2626' }, bold: true };
      }
    }
    
    currentRow++;
  });

  // Add borders to all cells
  for (let row = 1; row <= currentRow - 1; row++) {
    for (let col = 1; col <= 2; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
}

async function createSectionDetailsSheet(workbook: ExcelJS.Workbook, data: CampaignFormExcelData) {
  const worksheet = workbook.addWorksheet('Section-wise Details', {
    properties: { tabColor: { argb: 'FF10B981' } }
  });

  // Set column widths
  worksheet.columns = [
    { width: 8 },   // Section ID
    { width: 30 }, // Section Name (Marathi)
    { width: 30 }, // Section Name (English)
    { width: 12 }, // Max Marks
    { width: 12 }, // Achieved Marks
    { width: 12 }, // Percentage
    { width: 15 }  // Performance
  ];

  // Headers
  const headers = [
    'Section ID',
    'Section Name (Marathi)',
    'Section Name (English)',
    'Max Marks',
    'Achieved Marks',
    'Percentage',
    'Performance'
  ];

  const headerRow = worksheet.getRow(1);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF10B981' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Data rows
  data.sectionResults.forEach((section, index) => {
    const row = worksheet.getRow(index + 2);
    
    row.getCell(1).value = section.sectionId;
    row.getCell(2).value = section.title;
    row.getCell(3).value = section.titleEn;
    row.getCell(4).value = section.maxMarks;
    row.getCell(5).value = section.achievedMarks;
    row.getCell(6).value = `${section.percentage}%`;
    
    // Performance indicator
    let performance = '';
    let performanceColor = '';
    if (section.percentage >= 80) {
      performance = 'Excellent';
      performanceColor = 'FF16A34A';
    } else if (section.percentage >= 50) {
      performance = 'Good';
      performanceColor = 'FFD97706';
    } else {
      performance = 'Needs Improvement';
      performanceColor = 'FFDC2626';
    }
    
    row.getCell(7).value = performance;
    row.getCell(7).font = { color: { argb: performanceColor }, bold: true };
    
    // Color code percentage
    if (section.percentage >= 80) {
      row.getCell(6).font = { color: { argb: 'FF16A34A' }, bold: true };
    } else if (section.percentage >= 50) {
      row.getCell(6).font = { color: { argb: 'FFD97706' }, bold: true };
    } else {
      row.getCell(6).font = { color: { argb: 'FFDC2626' }, bold: true };
    }
  });

  // Total row
  const totalRow = worksheet.getRow(data.sectionResults.length + 2);
  totalRow.getCell(1).value = 'TOTAL';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(2).value = '';
  totalRow.getCell(3).value = '';
  totalRow.getCell(4).value = data.summary.maxPossibleTotal;
  totalRow.getCell(4).font = { bold: true };
  totalRow.getCell(5).value = data.summary.grandTotal;
  totalRow.getCell(5).font = { bold: true };
  totalRow.getCell(6).value = `${data.summary.percentage}%`;
  totalRow.getCell(6).font = { bold: true, color: { argb: 'FF1E40AF' } };
  totalRow.getCell(7).value = '';

  // Add borders
  for (let row = 1; row <= data.sectionResults.length + 2; row++) {
    for (let col = 1; col <= 7; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
}

async function createItemDetailsSheet(workbook: ExcelJS.Workbook, data: CampaignFormExcelData) {
  const worksheet = workbook.addWorksheet('Item-wise Details', {
    properties: { tabColor: { argb: 'FF8B5CF6' } }
  });

  // Set column widths
  worksheet.columns = [
    { width: 8 },   // Section ID
    { width: 10 },  // Item ID
    { width: 40 },  // Item Name (Marathi)
    { width: 40 },  // Item Name (English)
    { width: 12 },  // Target
    { width: 12 },  // Achieved
    { width: 12 },  // Percentage
    { width: 12 },  // Marks
    { width: 15 }   // Type
  ];

  // Headers
  const headers = [
    'Section',
    'Item ID',
    'Item Name (Marathi)',
    'Item Name (English)',
    'Target',
    'Achieved',
    'Percentage',
    'Marks',
    'Type'
  ];

  const headerRow = worksheet.getRow(1);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF8B5CF6' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  let currentRow = 2;

  // Add data for each section
  data.sectionResults.forEach((section) => {
    // Section header
    const sectionHeaderRow = worksheet.getRow(currentRow);
    sectionHeaderRow.getCell(1).value = `Section ${section.sectionId}`;
    sectionHeaderRow.getCell(1).font = { bold: true, color: { argb: 'FF1E40AF' } };
    sectionHeaderRow.getCell(2).value = section.title;
    sectionHeaderRow.getCell(2).font = { bold: true };
    sectionHeaderRow.getCell(3).value = section.titleEn;
    sectionHeaderRow.getCell(3).font = { bold: true };
    
    // Fill section header row
    for (let col = 1; col <= 9; col++) {
      sectionHeaderRow.getCell(col).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3F4F6' }
      };
    }
    
    currentRow++;

    // Add items for this section
    section.items.forEach((item) => {
      const row = worksheet.getRow(currentRow);
      
      row.getCell(1).value = section.sectionId;
      row.getCell(2).value = item.itemId;
      row.getCell(3).value = item.fieldName;
      row.getCell(4).value = item.fieldNameEn;
      row.getCell(5).value = item.target;
      row.getCell(6).value = item.achieved;
      row.getCell(7).value = `${item.percentage}%`;
      row.getCell(8).value = item.marks;
      row.getCell(9).value = 'Main Item';
      
      // Color code percentage
      if (item.percentage >= 80) {
        row.getCell(7).font = { color: { argb: 'FF16A34A' }, bold: true };
      } else if (item.percentage >= 50) {
        row.getCell(7).font = { color: { argb: 'FFD97706' }, bold: true };
      } else {
        row.getCell(7).font = { color: { argb: 'FFDC2626' }, bold: true };
      }
      
      currentRow++;
    });
    
    currentRow++; // Empty row between sections
  });

  // Add borders
  for (let row = 1; row <= currentRow - 1; row++) {
    for (let col = 1; col <= 9; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
}

async function createInnovationsSheet(workbook: ExcelJS.Workbook, data: CampaignFormExcelData) {
  const worksheet = workbook.addWorksheet('Innovation Items', {
    properties: { tabColor: { argb: 'FFF59E0B' } }
  });

  // Set column widths
  worksheet.columns = [
    { width: 8 },   // S.No
    { width: 60 },  // Description
    { width: 12 }   // Marks
  ];

  // Headers
  const headers = ['S.No', 'Innovation Description', 'Marks'];

  const headerRow = worksheet.getRow(1);
  headers.forEach((header, index) => {
    const cell = headerRow.getCell(index + 1);
    cell.value = header;
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFF59E0B' }
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
  });

  // Data rows
  data.innovations!.forEach((innovation, index) => {
    const row = worksheet.getRow(index + 2);
    row.getCell(1).value = index + 1;
    row.getCell(2).value = innovation.description;
    row.getCell(3).value = innovation.marks;
    row.getCell(3).font = { bold: true, color: { argb: 'FF16A34A' } };
  });

  // Total row
  const totalRow = worksheet.getRow(data.innovations!.length + 2);
  totalRow.getCell(1).value = 'TOTAL';
  totalRow.getCell(1).font = { bold: true };
  totalRow.getCell(2).value = '';
  totalRow.getCell(3).value = data.innovations!.reduce((sum, innovation) => sum + innovation.marks, 0);
  totalRow.getCell(3).font = { bold: true, color: { argb: 'FF1E40AF' } };

  // Add borders
  for (let row = 1; row <= data.innovations!.length + 2; row++) {
    for (let col = 1; col <= 3; col++) {
      const cell = worksheet.getCell(row, col);
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    }
  }
}
