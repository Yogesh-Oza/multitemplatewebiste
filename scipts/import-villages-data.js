const { PrismaClient } = require('@prisma/client');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Create a log function that writes to both console and file
const logFile = path.join(__dirname, 'import-log.txt');
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  console.log(message);
  fs.appendFileSync(logFile, logMessage, 'utf8');
}

async function importVillagesData() {
  // Clear previous log
  if (fs.existsSync(logFile)) {
    fs.unlinkSync(logFile);
  }
  
  try {
    log('Starting village data import...\n');
    
    // Test database connection
    log('Testing database connection...');
    await prisma.$connect();
    log('✓ Database connected successfully\n');

    // Read Excel file
    log('Reading Excel file...');
    const workbook = new ExcelJS.Workbook();
    const filePath = path.join(__dirname, 'villages_data.xlsx');
    log(`File path: ${filePath}`);
    
    if (!fs.existsSync(filePath)) {
      throw new Error(`Excel file not found at: ${filePath}`);
    }
    
    await workbook.xlsx.readFile(filePath);
    log('✓ Excel file read successfully\n');

    const worksheet = workbook.getWorksheet(1); // Get first worksheet

    if (!worksheet) {
      throw new Error('No worksheet found in Excel file');
    }

    // Get headers
    const headerRow = worksheet.getRow(1);
    const headers = {};
    headerRow.eachCell((cell, colNumber) => {
      headers[cell.value] = colNumber;
    });

    // Validate headers
    const requiredHeaders = [
      'District Name (In English) जिल्हा',
      'Sub-District Name (In English) तालुका',
      'Village Name (In English) गावाचे नाव (इंग्लिश)',
      'Village Name (In Local) गावाचे नाव (मराठी)'
    ];

    for (const header of requiredHeaders) {
      if (!headers[header]) {
        throw new Error(`Missing required header: ${header}`);
      }
    }

    log('Headers validated successfully\n');

    // Data structures to store unique entries
    const districtsMap = new Map(); // districtName -> { name, nameMarathi }
    const subDistrictsMap = new Map(); // `${districtName}|${subDistrictName}` -> { name, nameMarathi, districtName }
    const villagesMap = new Map(); // `${districtName}|${subDistrictName}|${villageName}` -> { name, nameMarathi, districtName, subDistrictName }

    // Read all rows
    let rowCount = 0;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const districtName = row.getCell(headers['District Name (In English) जिल्हा']).value?.toString().trim();
      const subDistrictName = row.getCell(headers['Sub-District Name (In English) तालुका']).value?.toString().trim();
      const villageNameEn = row.getCell(headers['Village Name (In English) गावाचे नाव (इंग्लिश)']).value?.toString().trim();
      const villageNameLocal = row.getCell(headers['Village Name (In Local) गावाचे नाव (मराठी)']).value?.toString().trim();

      // Skip empty rows
      if (!districtName || !subDistrictName || !villageNameEn) {
        return;
      }

      // Store district
      if (!districtsMap.has(districtName)) {
        districtsMap.set(districtName, {
          name: districtName,
          nameMarathi: districtName // Using English name as Marathi if not provided separately
        });
      }

      // Store sub-district
      const subDistrictKey = `${districtName}|${subDistrictName}`;
      if (!subDistrictsMap.has(subDistrictKey)) {
        subDistrictsMap.set(subDistrictKey, {
          name: subDistrictName,
          nameMarathi: subDistrictName, // Using English name as Marathi if not provided separately
          districtName: districtName
        });
      }

      // Store village
      const villageKey = `${districtName}|${subDistrictName}|${villageNameEn}`;
      if (!villagesMap.has(villageKey)) {
        villagesMap.set(villageKey, {
          name: villageNameEn,
          nameMarathi: villageNameLocal || villageNameEn,
          districtName: districtName,
          subDistrictName: subDistrictName
        });
      }

      rowCount++;
    });

    log(`Processed ${rowCount} rows from Excel file`);
    log(`Found ${districtsMap.size} unique districts`);
    log(`Found ${subDistrictsMap.size} unique sub-districts`);
    log(`Found ${villagesMap.size} unique villages\n`);

    // Fetch all existing records in bulk
    log('Fetching existing records from database...');
    const existingDistricts = await prisma.district.findMany();
    const existingSubDistricts = await prisma.subDistrict.findMany();
    const existingVillages = await prisma.village.findMany();
    
    // Create lookup maps for existing records
    const existingDistrictMap = new Map(existingDistricts.map(d => [d.name, d]));
    const existingSubDistrictMap = new Map(existingSubDistricts.map(sd => [sd.name, sd]));
    const existingVillageMap = new Map(
      existingVillages.map(v => [`${v.name}|${v.subDistrictId}`, v])
    );
    
    log(`Found ${existingDistricts.length} existing districts`);
    log(`Found ${existingSubDistricts.length} existing sub-districts`);
    log(`Found ${existingVillages.length} existing villages\n`);

    // Import Districts - Batch operations
    log('Importing districts...');
    const districtIdMap = new Map(); // districtName -> districtId
    const districtsToCreate = [];
    const districtsToUpdate = [];

    for (const [districtName, districtData] of districtsMap) {
      const existing = existingDistrictMap.get(districtName);
      if (existing) {
        // Check if update is needed
        if (existing.nameMarathi !== districtData.nameMarathi) {
          districtsToUpdate.push({
            where: { id: existing.id },
            data: { nameMarathi: districtData.nameMarathi }
          });
        }
        districtIdMap.set(districtName, existing.id);
      } else {
        districtsToCreate.push({
          name: districtData.name,
          nameMarathi: districtData.nameMarathi
        });
      }
    }

    // Batch create new districts
    if (districtsToCreate.length > 0) {
      const createdDistricts = await prisma.district.createMany({
        data: districtsToCreate
      });
      log(`  ✓ Created ${createdDistricts.count} new districts`);
      
      // Fetch created districts to get their IDs
      const districtNames = districtsToCreate.map(d => d.name);
      const newlyCreated = await prisma.district.findMany({
        where: { name: { in: districtNames } }
      });
      newlyCreated.forEach(d => districtIdMap.set(d.name, d.id));
    }

    // Batch update existing districts
    if (districtsToUpdate.length > 0) {
      for (const update of districtsToUpdate) {
        await prisma.district.update(update);
      }
      log(`  ↻ Updated ${districtsToUpdate.length} existing districts`);
    }

    log(`\nTotal districts: ${districtIdMap.size}\n`);

    // Import Sub-Districts - Batch operations
    log('Importing sub-districts...');
    const subDistrictIdMap = new Map(); // `${districtName}|${subDistrictName}` -> subDistrictId
    const subDistrictsToCreate = [];
    const subDistrictsToUpdate = [];

    for (const [key, subDistrictData] of subDistrictsMap) {
      const districtId = districtIdMap.get(subDistrictData.districtName);
      if (!districtId) {
        log(`  ✗ District not found for sub-district ${subDistrictData.name}`);
        continue;
      }

      const existing = existingSubDistrictMap.get(subDistrictData.name);
      if (existing) {
        // Check if update is needed
        if (existing.nameMarathi !== subDistrictData.nameMarathi || existing.districtId !== districtId) {
          subDistrictsToUpdate.push({
            where: { id: existing.id },
            data: {
              nameMarathi: subDistrictData.nameMarathi,
              districtId: districtId
            }
          });
        }
        subDistrictIdMap.set(key, existing.id);
      } else {
        subDistrictsToCreate.push({
          name: subDistrictData.name,
          nameMarathi: subDistrictData.nameMarathi,
          districtId: districtId
        });
      }
    }

    // Batch create new sub-districts
    if (subDistrictsToCreate.length > 0) {
      const createdSubDistricts = await prisma.subDistrict.createMany({
        data: subDistrictsToCreate
      });
      log(`  ✓ Created ${createdSubDistricts.count} new sub-districts`);
      
      // Fetch created sub-districts to get their IDs and map them back
      const subDistrictNames = subDistrictsToCreate.map(sd => sd.name);
      const newlyCreated = await prisma.subDistrict.findMany({
        where: { name: { in: subDistrictNames } }
      });
      
      // Map them back using the subDistrictsMap
      for (const [key, subDistrictData] of subDistrictsMap) {
        const found = newlyCreated.find(sd => 
          sd.name === subDistrictData.name && 
          sd.districtId === districtIdMap.get(subDistrictData.districtName)
        );
        if (found && !subDistrictIdMap.has(key)) {
          subDistrictIdMap.set(key, found.id);
        }
      }
    }

    // Batch update existing sub-districts
    if (subDistrictsToUpdate.length > 0) {
      for (const update of subDistrictsToUpdate) {
        await prisma.subDistrict.update(update);
      }
      log(`  ↻ Updated ${subDistrictsToUpdate.length} existing sub-districts`);
    }

    log(`\nTotal sub-districts: ${subDistrictIdMap.size}\n`);

    // Import Villages - Batch operations
    log('Importing villages...');
    const villagesToCreate = [];
    const villagesToUpdate = [];
    let villagesSkipped = 0;

    for (const [key, villageData] of villagesMap) {
      const subDistrictKey = `${villageData.districtName}|${villageData.subDistrictName}`;
      const subDistrictId = subDistrictIdMap.get(subDistrictKey);
      
      if (!subDistrictId) {
        log(`  ✗ Sub-district not found for village ${villageData.name}`);
        villagesSkipped++;
        continue;
      }

      const villageLookupKey = `${villageData.name}|${subDistrictId}`;
      const existing = existingVillageMap.get(villageLookupKey);
      
      if (existing) {
        // Check if update is needed
        if (existing.nameMarathi !== villageData.nameMarathi) {
          villagesToUpdate.push({
            where: { id: existing.id },
            data: { nameMarathi: villageData.nameMarathi }
          });
        }
      } else {
        villagesToCreate.push({
          name: villageData.name,
          nameMarathi: villageData.nameMarathi,
          subDistrictId: subDistrictId
        });
      }
    }

    // Batch create new villages
    if (villagesToCreate.length > 0) {
      const createdVillages = await prisma.village.createMany({
        data: villagesToCreate
      });
      log(`  ✓ Created ${createdVillages.count} new villages`);
    }

    // Batch update existing villages
    if (villagesToUpdate.length > 0) {
      for (const update of villagesToUpdate) {
        await prisma.village.update(update);
      }
      log(`  ↻ Updated ${villagesToUpdate.length} existing villages`);
    }

    const villagesImported = villagesToCreate.length + villagesToUpdate.length;
    log(`\nTotal villages processed: ${villagesImported}`);
    if (villagesSkipped > 0) {
      log(`Skipped ${villagesSkipped} villages due to errors\n`);
    }

    // Summary
    log('\n=== Import Summary ===');
    log(`Districts: ${districtIdMap.size} (${districtsToCreate.length} created, ${districtsToUpdate.length} updated)`);
    log(`Sub-Districts: ${subDistrictIdMap.size} (${subDistrictsToCreate.length} created, ${subDistrictsToUpdate.length} updated)`);
    log(`Villages: ${villagesImported} (${villagesToCreate.length} created, ${villagesToUpdate.length} updated)`);
    if (villagesSkipped > 0) {
      log(`Skipped: ${villagesSkipped} villages`);
    }
    
    // Verification
    log('\n=== Verification ===');
    const finalDistrictCount = await prisma.district.count();
    const finalSubDistrictCount = await prisma.subDistrict.count();
    const finalVillageCount = await prisma.village.count();
    log(`Total Districts in DB: ${finalDistrictCount}`);
    log(`Total Sub-Districts in DB: ${finalSubDistrictCount}`);
    log(`Total Villages in DB: ${finalVillageCount}`);
    
    // Sample verification - check a few records
    log('\n=== Sample Records ===');
    const sampleDistrict = await prisma.district.findFirst({
      include: {
        subDistricts: {
          include: {
            villages: {
              take: 2
            }
          },
          take: 1
        }
      }
    });
    
    if (sampleDistrict) {
      log(`Sample District: ${sampleDistrict.name}`);
      if (sampleDistrict.subDistricts.length > 0) {
        const subDist = sampleDistrict.subDistricts[0];
        log(`  └─ Sub-District: ${subDist.name}`);
        if (subDist.villages.length > 0) {
          subDist.villages.forEach(v => {
            log(`      └─ Village: ${v.name} (${v.nameMarathi})`);
          });
        }
      }
    }
    
    log('\nImport completed successfully! ✅');

  } catch (error) {
    log('\n❌ Error during import:');
    log(`Error message: ${error.message}`);
    if (error.stack) {
      log(`Error stack: ${error.stack}`);
    }
    throw error;
  } finally {
    await prisma.$disconnect();
    log('\nDatabase connection closed.');
  }
}

// Run the import
try {
  console.log('=== Script Starting ===');
  log('Script starting...');
  importVillagesData()
  .then(() => {
    console.log('=== Script Completed Successfully ===');
    log('Script completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('=== Fatal Error ===');
    console.error('Error:', error.message || error);
    log(`\nFatal error: ${error.message || error}`);
    if (error.stack) {
      console.error('Stack:', error.stack);
      log(`Stack trace: ${error.stack}`);
    }
    process.exit(1);
  });
} catch (err) {
  console.error('Top-level error:', err);
  process.exit(1);
}
