import type { PrismaClient, Subdomain } from '@prisma/client';
import {
  CommunicationKind,
  CommunicationPriority,
  RtiComplianceStatus,
} from '@prisma/client';

export type SubdomainSeedShape = Pick<
  Subdomain,
  'id' | 'subdomain' | 'phone' | 'email' | 'address'
>;

const RTI_DEFAULTS = [
  {
    clauseKey: 'org_structure',
    titleMr: 'संघटनात्मक रचना',
    titleEn: 'Organisational structure',
    isMandatory: true,
  },
  {
    clauseKey: 'budget_summary',
    titleMr: 'अर्थसंकल्प सारांश',
    titleEn: 'Budget summary',
    isMandatory: true,
  },
  {
    clauseKey: 'gram_sabha_minutes',
    titleMr: 'ग्राम सभा इतिवृत्त',
    titleEn: 'Gram Sabha minutes',
    isMandatory: true,
  },
  {
    clauseKey: 'works_programme',
    titleMr: 'कामांचे कार्यक्रम',
    titleEn: 'Works programme',
    isMandatory: true,
  },
  {
    clauseKey: 'property_tax',
    titleMr: 'मालमत्ता कर',
    titleEn: 'Property tax',
    isMandatory: true,
  },
  {
    clauseKey: 'rti_applications',
    titleMr: 'RTI अर्ज',
    titleEn: 'RTI applications',
    isMandatory: true,
  },
  {
    clauseKey: 'schemes_beneficiaries',
    titleMr: 'योजना व लाभार्थी',
    titleEn: 'Schemes and beneficiaries',
    isMandatory: true,
  },
  {
    clauseKey: 'contracts',
    titleMr: 'करार / निविदा',
    titleEn: 'Contracts',
    isMandatory: true,
  },
  {
    clauseKey: 'audit_reports',
    titleMr: 'लेखापरीक्षण',
    titleEn: 'Audit reports',
    isMandatory: true,
  },
  {
    clauseKey: 'citizen_charter',
    titleMr: 'नागरिक चार्टर',
    titleEn: 'Citizen charter',
    isMandatory: false,
  },
];

export async function seedGovernanceForSubdomain(
  prisma: PrismaClient,
  s: SubdomainSeedShape
): Promise<void> {
  let ord = 0;
  for (const c of RTI_DEFAULTS) {
    await prisma.rtiMandatoryDisclosureItem.upsert({
      where: {
        subdomainId_clauseKey: { subdomainId: s.id, clauseKey: c.clauseKey },
      },
      create: {
        subdomainId: s.id,
        clauseKey: c.clauseKey,
        titleMr: c.titleMr,
        titleEn: c.titleEn,
        isMandatory: c.isMandatory,
        order: ord++,
      },
      update: {
        titleMr: c.titleMr,
        titleEn: c.titleEn,
        isMandatory: c.isMandatory,
      },
    });
  }

  const svcCount = await prisma.citizenService.count({ where: { subdomainId: s.id } });
  if (svcCount === 0) {
    await prisma.citizenService.createMany({
      data: [
        {
          subdomainId: s.id,
          titleMr: 'जन्म प्रमाणपत्र',
          titleEn: 'Birth Certificate',
          descriptionMr: 'जन्म प्रमाणपत्रासाठी अर्ज.',
          descriptionEn: 'Apply for birth certificate.',
          category: 'birth',
          processingTimeMr: '७ दिवस',
          processingTimeEn: '7 days',
          fees: 50,
          requiredDocuments: ['जन्म नोंदणी पत्र', 'पहचान पत्र'],
          iconName: 'User',
          colorClass: 'bg-blue-500',
        },
        {
          subdomainId: s.id,
          titleMr: 'मृत्यू प्रमाणपत्र',
          titleEn: 'Death Certificate',
          descriptionMr: 'मृत्यू प्रमाणपत्रासाठी अर्ज.',
          descriptionEn: 'Apply for death certificate.',
          category: 'death',
          processingTimeMr: '५ दिवस',
          processingTimeEn: '5 days',
          fees: 50,
          requiredDocuments: ['मृत्यू नोंदणी पत्र'],
          iconName: 'Heart',
          colorClass: 'bg-red-500',
        },
      ],
    });
  }
}

/** Demo data for new/updated public pages — idempotent (skips when content already exists). */
export async function seedGovernanceDemoForSubdomain(
  prisma: PrismaClient,
  s: SubdomainSeedShape
): Promise<void> {
  const y = new Date().getFullYear();
  const iso = new Date().toISOString().slice(0, 10);
  const sid = s.id;

  const commCount = await prisma.communicationPost.count({ where: { subdomainId: sid } });
  if (commCount === 0) {
    await prisma.communicationPost.createMany({
      data: [
        {
          subdomainId: sid,
          kind: CommunicationKind.announcement,
          category: 'सामान्य',
          priority: CommunicationPriority.high,
          title: 'ग्रामपंचायत सामान्य सभा — महत्वाची सूचना',
          titleEn: 'Gram Panchayat general meeting — important notice',
          content:
            'सर्व ग्रामस्थांना कळविण्यात येते की पुढील ग्रामसभा दिनांक निश्चित झाल्यावर सूचित केली जाईल. उपस्थिती अनिवार्य आहे.',
          contentEn:
            'Villagers are informed that the next Gram Sabha will be notified once the date is fixed.',
          legacyDate: iso,
          status: 'active',
          image: '/images/placeholder.png',
          publishAt: new Date(),
          isActive: true,
          order: 0,
        },
        {
          subdomainId: sid,
          kind: CommunicationKind.announcement,
          category: 'आरोग्य',
          priority: CommunicationPriority.medium,
          title: 'आरोग्य शिबिर — नोंदणी सुरू',
          titleEn: 'Health camp — registration open',
          content:
            'ग्रामपंचायत आणि प्राथमिक आरोग्य केंद्राच्या संयुक्त विद्यमाने आरोग्य तपासणी शिबिर आयोजित करण्यात आले आहे. नोंदणी ग्रामसेवक कार्यालयात करा.',
          contentEn:
            'A health screening camp is organised jointly by the GP and PHC. Register at the Gramsevak office.',
          legacyDate: iso,
          status: 'active',
          image: '/images/placeholder.png',
          publishAt: new Date(),
          isActive: true,
          order: 1,
        },
        {
          subdomainId: sid,
          kind: CommunicationKind.notice,
          category: 'कर',
          priority: CommunicationPriority.high,
          title: 'मालमत्ता कर भरण्याची अंतिम मुदत',
          titleEn: 'Last date for property tax payment',
          content:
            'सन २०२५-२६ चा मालमत्ता कर भरण्याची शेवटची तारीख जाहीर करण्यात आली आहे. विलंब शुल्क टाळण्यासाठी वेळेवर भरा.',
          contentEn:
            'Final date for 2025–26 property tax is announced. Pay on time to avoid penalty.',
          legacyDate: iso,
          status: 'active',
          publishAt: new Date(),
          isActive: true,
          order: 0,
        },
        {
          subdomainId: sid,
          kind: CommunicationKind.notice,
          category: 'शिक्षण',
          priority: CommunicationPriority.low,
          title: 'शिष्यवृत्ती अर्ज — माहिती',
          titleEn: 'Scholarship applications — information',
          content:
            'राज्य शासनाच्या शिष्यवृत्ती योजनेंतर्गत अर्ज सादर करण्यासाठी आवश्यक कागदपत्रांची यादी कार्यालयात उपलब्ध आहे.',
          contentEn:
            'Required documents list for state scholarship schemes is available at the office.',
          legacyDate: iso,
          publishAt: new Date(),
          isActive: true,
          order: 1,
        },
        {
          subdomainId: sid,
          kind: CommunicationKind.circular,
          category: 'शासन',
          priority: CommunicationPriority.medium,
          title: 'जलजीवन मिशन अंतर्गत कामे — सूचना',
          titleEn: 'JJM works — circular',
          content:
            'गावातील नळ जोडणी व पाईपलाईन देखभालीसंदर्भात शासनाच्या मार्गदर्शक सूचनांचे पालन करणे बंधनकारक आहे.',
          contentEn:
            'Compliance with government guidelines for tap connections and pipeline maintenance is mandatory.',
          circularType: 'circular',
          department: 'ग्रामविकास विभाग',
          departmentEn: 'Rural Development',
          referenceNumber: `GP/${s.subdomain.toUpperCase()}/2025/101`,
          legacyDate: iso,
          issuedBy: 'ग्रामसेवक',
          issuedByEn: 'Gram Sevak',
          lastUpdated: new Date().toISOString(),
          attachments: [],
          publishAt: new Date(),
          isActive: true,
          order: 0,
        },
        {
          subdomainId: sid,
          kind: CommunicationKind.circular,
          category: 'प्रशासन',
          priority: CommunicationPriority.low,
          title: 'कार्यालयीन वेळ व सार्वजनिक सुट्ट्या',
          titleEn: 'Office hours and public holidays',
          content:
            'कार्यालयीन वेळ: सोमवार ते शुक्रवार १० ते ५. सार्वजनिक सुट्ट्यांदरम्यान कार्यालय बंद राहील.',
          contentEn: 'Office hours Mon–Fri 10–5. Closed on public holidays.',
          circularType: 'order',
          department: 'ग्रामपंचायत',
          departmentEn: 'Gram Panchayat',
          referenceNumber: `GP/${s.subdomain.toUpperCase()}/2025/102`,
          legacyDate: iso,
          issuedBy: 'सरपंच कार्यालय',
          issuedByEn: 'Sarpanch office',
          lastUpdated: new Date().toISOString(),
          attachments: [],
          publishAt: new Date(),
          isActive: true,
          order: 1,
        },
      ],
    });
    console.log(`Demo: communication posts for ${s.subdomain}`);
  }

  const demoStats = [
    { year: y - 2, population: 1840, voters: 1120, wards: 5, schools: 3, anganwadis: 4 },
    { year: y - 1, population: 1895, voters: 1165, wards: 5, schools: 3, anganwadis: 4 },
    { year: y, population: 1958, voters: 1202, wards: 5, schools: 4, anganwadis: 5 },
  ];
  for (const row of demoStats) {
    const exists = await prisma.villageStatistics.findUnique({
      where: { subdomainId_year: { subdomainId: sid, year: row.year } },
    });
    if (!exists) {
      await prisma.villageStatistics.create({
        data: {
          subdomainId: sid,
          year: row.year,
          population: row.population,
          voters: row.voters,
          wards: row.wards,
          schools: row.schools,
          anganwadis: row.anganwadis,
          sourceMr: 'डेमो: जनगणना/मतदार यादी आधार',
          sourceEn: 'Demo: census/electoral roll based',
        },
      });
    }
  }

  const gsCount = await prisma.gramSabhaMeeting.count({ where: { subdomainId: sid } });
  if (gsCount === 0) {
    const d1 = new Date(y, 2, 15);
    const d2 = new Date(y - 1, 8, 10);
    await prisma.gramSabhaMeeting.createMany({
      data: [
        {
          subdomainId: sid,
          date: d1,
          agenda:
            '१) ग्रामपंचायत अर्थसंकल्प मांडणी २) जलजीवन मिशन प्रगती ३) स्वच्छता अभियान. सर्व सदस्यांनी उपस्थित राहावे.',
          agendaEn: 'Budget presentation, JJM progress, cleanliness drive.',
          attendanceCount: 142,
          quorumMet: true,
          resolutions: [
            { text: 'अर्थसंकल्प मंजूर.', textEn: 'Budget approved.', resolutionNumber: '१' },
            {
              text: 'पाणीपुरवठा दुरुस्तीसाठी ठेकेदार नियुक्त.',
              textEn: 'Contractor for water repairs appointed.',
              resolutionNumber: '२',
            },
          ],
          documents: [
            {
              name: 'इतिवृत्त PDF',
              nameEn: 'Minutes PDF',
              url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
              type: 'pdf',
            },
          ],
          isActive: true,
          order: 0,
        },
        {
          subdomainId: sid,
          date: d2,
          agenda: 'मागील सभेच्या ठरावांची अंमलबजावणी व नवीन कामांची मंजुरी.',
          agendaEn: 'Follow-up on previous resolutions and new works.',
          attendanceCount: 128,
          quorumMet: true,
          resolutions: [
            { text: 'रस्ता दुरुस्ती कामे मंजूर.', textEn: 'Road repair works approved.' },
          ],
          documents: [],
          isActive: true,
          order: 1,
        },
      ],
    });
    console.log(`Demo: Gram Sabha meetings for ${s.subdomain}`);
  }

  const rtiProf = await prisma.rtiOfficeProfile.findUnique({ where: { subdomainId: sid } });
  if (!rtiProf) {
    await prisma.rtiOfficeProfile.create({
      data: {
        subdomainId: sid,
        pioName: 'श्री. ग्रामसेवक',
        pioNameEn: 'Gram Sevak',
        pioDesignation: 'माहिती अधिकारी (PIO)',
        pioDesignationEn: 'Public Information Officer',
        apioName: 'श्री. लेखाधिकारी',
        apioNameEn: 'Account Officer',
        feesMr: 'माहितीसाठी ₹१० + प्रति पान ₹२ (प्रमाणित प्रत)',
        feesEn: 'Rs.10 application + Rs.2 per page (certified copy)',
        hoursMr: 'सोम–शुक्र १०:०० ते १७:००',
        hoursEn: 'Mon–Fri 10:00–17:00',
        contactPhone: s.phone || '+91 00000 00000',
        contactEmail: s.email || 'rti@example.com',
        addressMr: s.address || 'ग्रामपंचायत कार्यालय',
        addressEn: 'Gram Panchayat office',
        firstAppealMr: 'प्रथम अपील: तहसिलदार / उपजिल्हाधिकारी कार्यालय.',
        firstAppealEn: 'First appeal: Tehsildar / Sub-Divisional Officer office.',
      },
    });
    console.log(`Demo: RTI profile for ${s.subdomain}`);
  }

  const rtiFormSamples = [
    {
      kind: 'certificate_application',
      labelMr: 'दाखला मिळणेकरिता अर्ज',
      labelEn: 'Application for obtaining certificate / extract',
      url: '/pdfs/Arj2.pdf',
      order: 0,
    },
    {
      kind: 'first_appeal_sample',
      labelMr: 'प्रथम अपील प्राधिकाऱ्याकडे करावयाच्या पहिल्या आपीलाचा नमुना',
      labelEn: 'Sample first appeal to first appellate authority',
      url: '/pdfs/PrathamApil.pdf',
      order: 1,
    },
    {
      kind: 'second_appeal_sample',
      labelMr: 'द्वितीय अपील प्राधिकाऱ्याकडे करावयाच्या दुसऱ्या आपीलाचा नमुना',
      labelEn: 'Sample second appeal to second appellate authority',
      url: '/pdfs/2ndApil.pdf',
      order: 2,
    },
    {
      kind: 'commission_appeal_sample',
      labelMr: 'महाराष्ट्र राज्य लोकसेवा हक्क आयोगाकडे अपील करण्याचा नमुना',
      labelEn: 'Sample appeal to Maharashtra State Commission for Right to Public Services',
      url: '/pdfs/AayogApil.pdf',
      order: 3,
    },
  ];
  for (const rf of rtiFormSamples) {
    const exists = await prisma.rtiFormLink.findFirst({
      where: { subdomainId: sid, labelMr: rf.labelMr },
    });
    if (!exists) {
      await prisma.rtiFormLink.create({
        data: { subdomainId: sid, ...rf },
      });
    }
  }

  const extraServices = [
    {
      titleMr: 'RTS प्रमाणपत्र',
      titleEn: 'RTS certificate',
      descriptionMr: 'राइट टू सर्विस अंतर्गत अर्ज.',
      descriptionEn: 'Application under Right to Service.',
      category: 'rts',
      processingTimeMr: '३ दिवस',
      processingTimeEn: '3 days',
      fees: 25,
      requiredDocuments: ['अर्ज', 'पहचान'],
      iconName: 'Shield',
      colorClass: 'bg-green-500',
    },
    {
      titleMr: 'उत्पन्न प्रमाणपत्र',
      titleEn: 'Income certificate',
      descriptionMr: 'योजना व शिष्यवृत्तीसाठी उत्पन्न दाखला.',
      descriptionEn: 'Income proof for schemes and scholarships.',
      category: 'other',
      processingTimeMr: '१० दिवस',
      processingTimeEn: '10 days',
      fees: 100,
      requiredDocuments: ['अर्ज', 'पहचान', 'पत्ता'],
      iconName: 'FileText',
      colorClass: 'bg-purple-500',
    },
    {
      titleMr: 'जात प्रमाणपत्र',
      titleEn: 'Caste certificate',
      descriptionMr: 'आरक्षण व शासकीय योजना साठी.',
      descriptionEn: 'For reservation and government schemes.',
      category: 'other',
      processingTimeMr: '१५ दिवस',
      processingTimeEn: '15 days',
      fees: 100,
      requiredDocuments: ['अर्ज', 'पहचान'],
      iconName: 'Building',
      colorClass: 'bg-orange-500',
    },
  ];
  const totalSvc = await prisma.citizenService.count({ where: { subdomainId: sid } });
  if (totalSvc < 5) {
    for (const es of extraServices) {
      const dup = await prisma.citizenService.findFirst({
        where: { subdomainId: sid, titleMr: es.titleMr },
      });
      if (!dup) {
        await prisma.citizenService.create({ data: { ...es, subdomainId: sid } });
      }
    }
  }

  const dlCount = await prisma.downloadableFile.count({ where: { subdomainId: sid } });
  if (dlCount === 0) {
    await prisma.downloadableFile.createMany({
      data: [
        {
          subdomainId: sid,
          name: 'मतदार यादी नमुना अर्ज',
          nameEn: 'Voter list sample form',
          description: 'मतदार यादी दुरुस्तीसाठी नमुना अर्ज.',
          descriptionEn: 'Sample form for voter list correction.',
          category: 'form',
          type: 'PDF',
          size: '120 KB',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          lastUpdated: iso,
          tags: ['मतदार', 'अर्ज'],
          order: 0,
        },
        {
          subdomainId: sid,
          name: 'ग्रामपंचायत अर्थसंकल्प सारांश',
          nameEn: 'GP budget summary',
          description: 'चालू वर्षाचा अर्थसंकल्प सारांश PDF.',
          descriptionEn: 'Current year budget summary PDF.',
          category: 'pdf',
          type: 'PDF',
          size: '250 KB',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          lastUpdated: iso,
          tags: ['अर्थसंकल्प'],
          order: 1,
        },
        {
          subdomainId: sid,
          name: 'नागरिक चार्टर',
          nameEn: 'Citizen charter',
          description: 'सेवा व वेळ मर्यादा.',
          descriptionEn: 'Services and time limits.',
          category: 'document',
          type: 'PDF',
          size: '180 KB',
          url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
          lastUpdated: iso,
          tags: ['चार्टर'],
          order: 2,
        },
      ],
    });
    console.log(`Demo: downloadable files for ${s.subdomain}`);
  }

  let projects = await prisma.project.findMany({
    where: { subdomainId: sid },
    take: 5,
    orderBy: { order: 'asc' },
  });
  if (projects.length === 0) {
    await prisma.project.createMany({
      data: [
        {
          subdomainId: sid,
          title: 'सिमेंट काँक्रीट रस्ता',
          titleEn: 'Cement concrete road',
          description: 'वॉर्ड १ ते ३ दरम्यान सिमेंट रस्ता.',
          descriptionEn: 'CC road from ward 1 to 3.',
          startDate: new Date(y - 1, 3, 1),
          endDate: new Date(y, 5, 30),
          status: 'ongoing',
          budget: 2500000,
          physicalProgress: 62,
          financialProgress: 55,
          amountSpent: 1375000,
          delayReason: 'पावसाळ्यामुळे कामे मंदावली.',
          delayReasonEn: 'Work slowed due to monsoon.',
          photosBefore: [],
          photosAfter: [],
          impactMetrics: [{ label: 'लाभार्थी कुटुंबे', value: 120 }],
          category: 'पायाभूत',
          categoryEn: 'Infrastructure',
          isActive: true,
          order: 0,
        },
        {
          subdomainId: sid,
          title: 'सोलर स्ट्रीट लाइट',
          titleEn: 'Solar street lights',
          description: 'गावात ४० सोलर दिवे बसविणे.',
          descriptionEn: 'Installation of 40 solar street lights.',
          startDate: new Date(y, 0, 15),
          endDate: new Date(y, 2, 28),
          status: 'ongoing',
          budget: 800000,
          physicalProgress: 40,
          financialProgress: 45,
          amountSpent: 360000,
          photosBefore: [],
          photosAfter: [],
          impactMetrics: [{ label: 'दिवे', value: 40 }],
          category: 'ऊर्जा',
          categoryEn: 'Energy',
          isActive: true,
          order: 1,
        },
      ],
    });
    projects = await prisma.project.findMany({ where: { subdomainId: sid }, take: 5 });
    console.log(`Demo: projects for ${s.subdomain}`);
  } else {
    let i = 0;
    for (const p of projects) {
      if (p.physicalProgress == null && i < 2) {
        const budgetNum =
          typeof p.budget === 'object' && p.budget !== null && 'toNumber' in p.budget
            ? (p.budget as { toNumber: () => number }).toNumber()
            : Number(p.budget);
        await prisma.project.update({
          where: { id: p.id },
          data: {
            physicalProgress: i === 0 ? 55 : 35,
            financialProgress: i === 0 ? 50 : 40,
            amountSpent: i === 0 ? budgetNum * 0.5 || 500000 : budgetNum * 0.35 || 200000,
            delayReason: i === 0 ? 'साहित्य पुरवठा विलंब' : null,
            delayReasonEn: i === 0 ? 'Material supply delay' : null,
          },
        });
      }
      i++;
    }
  }

  const schemeCount = await prisma.governmentScheme.count({ where: { subdomainId: sid } });
  if (schemeCount === 0) {
    await prisma.governmentScheme.create({
      data: {
        subdomainId: sid,
        title: 'डेमो: आवास योजना',
        titleEn: 'Demo: housing scheme',
        description: 'ग्रामीण भागात घरे.',
        descriptionEn: 'Rural housing support.',
        category: 'सामाजिक',
        eligibility: 'BPL',
        eligibilityEn: 'BPL families',
        benefits: 'आर्थिक मदत',
        benefitsEn: 'Financial assistance',
        documents: 'अर्ज, पहचान',
        documentsEn: 'Application, ID',
        applicationProcess: 'कार्यालयात अर्ज',
        applicationProcessEn: 'Apply at office',
        contactInfo: s.phone || '',
        contactInfoEn: s.phone || '',
        isActive: true,
      },
    });
  }

  const emptyRti = await prisma.rtiMandatoryDisclosureItem.findMany({
    where: { subdomainId: sid, contentMr: '' },
    take: 4,
  });
  const samples = [
    'डेमो मजकूर: हा विभाग ग्रामपंचायत कार्यालयात उपलब्ध कागदपत्रांचा सारांश देतो. अधिक तपशीलासाठी कार्यालयाशी संपर्क साधा.',
    'डेमो: अर्थसंकल्प तपशील जमा-खर्च पृष्ठावर प्रकाशित आहेत.',
    'डेमो: ग्राम सभा इतिवृत्त खालील ग्राम सभा विभागात उपलब्ध.',
    'डेमो: कर आकारणी तपशील मालमत्ता कर विभागाकडे उपलब्ध.',
  ];
  for (let j = 0; j < emptyRti.length && j < samples.length; j++) {
    await prisma.rtiMandatoryDisclosureItem.update({
      where: { id: emptyRti[j].id },
      data: {
        contentMr: samples[j],
        contentEn: `Demo summary for ${emptyRti[j].clauseKey}.`,
        complianceStatus: j === 0 ? RtiComplianceStatus.completed : RtiComplianceStatus.pending,
        lastVerifiedAt: j === 0 ? new Date() : null,
      },
    });
  }
}

export async function applyDefaultGovernanceTemplateToSubdomain(
  prisma: PrismaClient,
  s: SubdomainSeedShape,
  options?: { includeDemo?: boolean }
): Promise<void> {
  await seedGovernanceForSubdomain(prisma, s);
  if (options?.includeDemo !== false) {
    await seedGovernanceDemoForSubdomain(prisma, s);
  }
}
