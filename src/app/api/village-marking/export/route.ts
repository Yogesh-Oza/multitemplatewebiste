import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import ExcelJS from 'exceljs';

// GET: Export village marking data as Excel
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const submissionId = searchParams.get('submissionId');
    const format = searchParams.get('format') || 'detailed';

    // Get submission data
    const submission = await prisma.villageMarkingSubmission.findUnique({
      where: { id: submissionId! },
      include: {
        subdomain: {
          select: {
            subdomain: true,
            villageName: true,
            villageNameEn: true,
            districtName: true,
            subDistrictName: true
          }
        },
        section: {
          select: {
            title: true,
            titleEn: true,
            maxMarks: true
          }
        },
        fieldValues: {
          include: {
            field: {
              select: {
                fieldName: true,
                fieldNameEn: true,
                fieldType: true,
                order: true
              }
            }
          },
          orderBy: {
            field: {
              order: 'asc'
            }
          }
        }
      }
    });

    if (!submission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    // Create Excel workbook
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Village Marking Report');

    // Set up styles
    const headerStyle = {
      font: { bold: true, size: 14, color: { argb: 'FFFFFFFF' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    const sectionHeaderStyle = {
      font: { bold: true, size: 12, color: { argb: 'FF000000' } },
      fill: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE7E6E6' } },
      alignment: { horizontal: 'center', vertical: 'middle' },
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      }
    };

    const cellStyle = {
      border: {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      },
      alignment: { vertical: 'middle' }
    };

    // Add header information
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'महाराष्ट्र शासन - ग्रामपंचायत गुणांक अहवाल';
    worksheet.getCell('A1').style = headerStyle;

    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = 'Maharashtra Government - Village Marking Report';
    worksheet.getCell('A2').style = { ...headerStyle, font: { ...headerStyle.font, size: 12 } };

    // Village information
    worksheet.getCell('A4').value = 'गावाचे नाव / Village Name:';
    worksheet.getCell('B4').value = `${submission.subdomain.villageName} / ${submission.subdomain.villageNameEn}`;
    worksheet.getCell('A4').style = cellStyle;
    worksheet.getCell('B4').style = cellStyle;

    worksheet.getCell('A5').value = 'जिल्हा / District:';
    worksheet.getCell('B5').value = submission.subdomain.districtName || '';
    worksheet.getCell('A5').style = cellStyle;
    worksheet.getCell('B5').style = cellStyle;

    worksheet.getCell('A6').value = 'तालुका / Sub-District:';
    worksheet.getCell('B6').value = submission.subdomain.subDistrictName || '';
    worksheet.getCell('A6').style = cellStyle;
    worksheet.getCell('B6').style = cellStyle;

    worksheet.getCell('A7').value = 'तारीख / Date:';
    worksheet.getCell('B7').value = submission.submittedAt ? new Date(submission.submittedAt).toLocaleDateString('en-IN') : new Date().toLocaleDateString('en-IN');
    worksheet.getCell('A7').style = cellStyle;
    worksheet.getCell('B7').style = cellStyle;

    worksheet.getCell('A8').value = 'एकूण गुण / Total Marks:';
    worksheet.getCell('B8').value = `${submission.totalMarks} / ${submission.totalMaxMarks}`;
    worksheet.getCell('A8').style = cellStyle;
    worksheet.getCell('B8').style = cellStyle;

    worksheet.getCell('A9').value = 'टक्केवारी / Percentage:';
    worksheet.getCell('B9').value = submission.totalMaxMarks > 0 ? `${((submission.totalMarks / submission.totalMaxMarks) * 100).toFixed(2)}%` : '0%';
    worksheet.getCell('A9').style = cellStyle;
    worksheet.getCell('B9').style = cellStyle;

    // Section details
    let currentRow = 11;
    
    if (format === 'detailed') {
      // Section header
      worksheet.mergeCells(`A${currentRow}:F${currentRow}`);
      worksheet.getCell(`A${currentRow}`).value = `विभाग: ${submission.section?.title} / Section: ${submission.section?.titleEn}`;
      worksheet.getCell(`A${currentRow}`).style = sectionHeaderStyle;
      currentRow++;

      // Field headers
      worksheet.getCell(`A${currentRow}`).value = 'फील्ड नाव / Field Name';
      worksheet.getCell(`B${currentRow}`).value = 'उदिष्ट / Target';
      worksheet.getCell(`C${currentRow}`).value = 'साध्य / Achievement';
      worksheet.getCell(`D${currentRow}`).value = 'टक्केवारी / Percentage';
      worksheet.getCell(`E${currentRow}`).value = 'गुण / Marks';
      worksheet.getCell(`F${currentRow}`).value = 'टिप्पणी / Remarks';

      for (let col = 1; col <= 6; col++) {
        worksheet.getCell(currentRow, col).style = sectionHeaderStyle;
      }
      currentRow++;

      // Field data
      for (const fieldValue of submission.fieldValues) {
        worksheet.getCell(`A${currentRow}`).value = `${fieldValue.field.fieldName} / ${fieldValue.field.fieldNameEn}`;
        worksheet.getCell(`B${currentRow}`).value = fieldValue.udisht || '';
        worksheet.getCell(`C${currentRow}`).value = fieldValue.sadhya || '';
        worksheet.getCell(`D${currentRow}`).value = fieldValue.percentage ? `${fieldValue.percentage.toFixed(2)}%` : '';
        worksheet.getCell(`E${currentRow}`).value = fieldValue.marks || '';
        worksheet.getCell(`F${currentRow}`).value = '';

        for (let col = 1; col <= 6; col++) {
          worksheet.getCell(currentRow, col).style = cellStyle;
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
        worksheet.getCell(currentRow, col).style = { ...cellStyle, font: { bold: true } };
      }
    }

    // Set column widths
    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('B').width = 12;
    worksheet.getColumn('C').width = 12;
    worksheet.getColumn('D').width = 15;
    worksheet.getColumn('E').width = 12;
    worksheet.getColumn('F').width = 20;

    // Generate Excel buffer
    const buffer = await workbook.xlsx.writeBuffer();

    // Return Excel file
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="village-marking-${submission.subdomain.subdomain}-${new Date().toISOString().split('T')[0]}.xlsx"`
      }
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return NextResponse.json(
      { error: 'Failed to export data' },
      { status: 500 }
    );
  }
}
