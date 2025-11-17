import ExcelJS from 'exceljs';

export interface ActivityLog {
  id: string;
  action: string;
  model: string;
  modelId: string;
  userName: string;
  userEmail: string;
  subdomainName: string | null;
  villageName: string | null;
  districtName: string | null;
  subDistrictName: string | null;
  description: string;
  createdAt: Date | string;
}

export async function generateActivityLogsExcel(logs: ActivityLog[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  
  // Set workbook properties
  workbook.creator = 'Mahagp.in Activity Logs System';
  workbook.lastModifiedBy = 'Super Admin';
  workbook.created = new Date();
  workbook.modified = new Date();

  // Create Activity Logs Sheet
  const worksheet = workbook.addWorksheet('Activity Logs');

  // Define columns
  worksheet.columns = [
    { header: 'Date/Time', key: 'dateTime', width: 20 },
    { header: 'Action', key: 'action', width: 12 },
    { header: 'Model', key: 'model', width: 20 },
    { header: 'Description', key: 'description', width: 50 },
    { header: 'User Name', key: 'userName', width: 25 },
    { header: 'User Email', key: 'userEmail', width: 30 },
    { header: 'Village Name', key: 'villageName', width: 25 },
    { header: 'District', key: 'districtName', width: 20 },
    { header: 'Sub-District', key: 'subDistrictName', width: 20 },
    { header: 'Subdomain', key: 'subdomainName', width: 20 },
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }, // Blue background
  };
  headerRow.alignment = { vertical: 'middle', horizontal: 'center' };
  headerRow.height = 25;

  // Add data rows
  logs.forEach((log) => {
    const dateTime = log.createdAt instanceof Date 
      ? log.createdAt 
      : new Date(log.createdAt);
    
    const row = worksheet.addRow({
      dateTime: dateTime.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      action: log.action,
      model: log.model,
      description: log.description,
      userName: log.userName,
      userEmail: log.userEmail,
      villageName: log.villageName || '-',
      districtName: log.districtName || '-',
      subDistrictName: log.subDistrictName || '-',
      subdomainName: log.subdomainName || '-',
    });

    // Style action column based on action type
    const actionCell = row.getCell('action');
    if (log.action === 'CREATE') {
      actionCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE8F5E9' }, // Light green
      };
      actionCell.font = { color: { argb: 'FF2E7D32' }, bold: true };
    } else if (log.action === 'UPDATE') {
      actionCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF3E5F5' }, // Light purple
      };
      actionCell.font = { color: { argb: 'FF7B1FA2' }, bold: true };
    } else if (log.action === 'DELETE') {
      actionCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFEFEBE9' }, // Light red
      };
      actionCell.font = { color: { argb: 'FFC62828' }, bold: true };
    }

    // Set row height
    row.height = 20;

    // Align cells
    row.alignment = { vertical: 'middle', horizontal: 'left' };
    row.getCell('dateTime').alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell('action').alignment = { vertical: 'middle', horizontal: 'center' };
  });

  // Freeze header row
  worksheet.views = [
    { state: 'frozen', ySplit: 1 }
  ];

  // Add filters to header row
  worksheet.autoFilter = {
    from: 'A1',
    to: `J1`,
  };

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

