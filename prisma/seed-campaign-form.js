const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedCampaignForm() {
  try {
    console.log('🌱 Seeding campaign form...');

    // Create the main campaign form
    const campaignForm = await prisma.campaignForm.create({
      data: {
        name: 'समृद्ध पंचायत राज अभियान',
        nameEn: 'Prosperous Panchayat Raj Campaign',
        description: 'अभियान अंतर्गत मोहीम कालावधीतील ग्रामपंचायतीसाठी प्रश्नावली',
        descriptionEn: 'Questionnaire for Gram Panchayats during the campaign period under the campaign',
        formMetadata: {
          campaignName: 'समृद्ध पंचायत राज अभियान',
          year: '2025-2026',
          formType: 'अभियान अंतर्गत मोहीम कालावधीतील ग्रामपंचायतीसाठी प्रश्नावली'
        },
        maxPossibleTotal: 100,
        isActive: true,
        isDefault: true
      }
    });

    console.log('✅ Campaign form created:', campaignForm.id);

    // Create sections based on the JSON structure
    const sections = [
      {
        sectionId: 1,
        title: 'सुशासनयुक्त पंचायत (Good Governance)',
        titleEn: 'Good Governance Panchayat',
        description: 'Governance and administration related items',
        maxMarks: 16,
        items: [
          {
            itemId: '1.1',
            fieldName: 'लोकाभिमुख प्रशासन-ग्रामपंचायत मार्फत दिल्या जाणाऱ्या सर्व सेवा ऑनलाईन पद्धतीने नागरिकांना सुलभ रित्या देणे',
            fieldNameEn: 'Citizen-friendly administration - providing all services through online methods',
            actionType: 'दि.01 एप्रिल ते मोहीम कालावधी पर्यंत आलेले अर्ज व निर्गत अर्ज तसेच ऑनलाईन अहवाल तपासून त्या प्रमाणे गुण देणे',
            targets: { below2000: '100%', between2000_5000: '100%', above5000: '100%' },
            maxMarks: 1
          },
          {
            itemId: '1.2',
            fieldName: 'नागरी सेवा सुविधा केंद्र दर्जा - ग्रामपंचायत कडील आपले सरकार सेवा केंद्र सक्षम करून त्यास नागरी सेवा सुविधा केंद्र दर्जा (सीएससी) मिळविणे',
            fieldNameEn: 'CSC Status - Enable Aaple Sarkar service center and get CSC status',
            actionType: 'ग्रामपंचायत कडील आपले सरकार सेवा केंद्र सक्षम करून नागरी सेवा सुविधा केंद्र दर्जा (सीएससी) मिळविणे',
            targets: { below2000: '100%', between2000_5000: '100%', above5000: '100%' },
            maxMarks: 1.5
          },
          {
            itemId: '1.3',
            fieldName: 'तक्रार निवारण -ग्रामपंचायत कडील प्राप्त झालेले सर्व सार्वजनिक स्वरूपाच्या तक्रारीचे विहित मुदतीत निवारण करणे',
            fieldNameEn: 'Grievance Redressal - Resolve all public complaints within stipulated time',
            itemType: 'sub-items',
            maxMarks: 1,
            subItems: [
              {
                itemId: '1.3a',
                fieldName: 'तक्रार पेटी सुविधा',
                fieldNameEn: 'Complaint Box Facility',
                maxMarks: 0.5
              },
              {
                itemId: '1.3b',
                fieldName: 'तक्रार निवारण',
                fieldNameEn: 'Grievance Redressal',
                maxMarks: 0.5
              }
            ]
          }
        ]
      },
      {
        sectionId: 2,
        title: 'सक्षम पंचायत (स्वनिधी व लोकवर्गणी)',
        titleEn: 'Capable Panchayat (Self-funds and Public Contribution)',
        description: 'Financial management and revenue generation',
        maxMarks: 10,
        items: [
          {
            itemId: '2.1',
            fieldName: 'कर व पाणी पट्टी वसूली',
            fieldNameEn: 'Tax and Water Tax Collection',
            itemType: 'sub-items',
            maxMarks: 7,
            subItems: [
              {
                itemId: '2.1a',
                fieldName: 'QR Code/Online वापर',
                fieldNameEn: 'QR Code/Online Usage',
                maxMarks: 1
              },
              {
                itemId: '2.1b',
                fieldName: 'घरपट्टी थकबाकी वसूली',
                fieldNameEn: 'House Tax Arrears Collection',
                targets: { below2000: '90%', between2000_5000: '80%', above5000: '70%' },
                maxMarks: 2
              }
            ]
          }
        ]
      },
      {
        sectionId: 3,
        title: 'जल समृद्ध, स्वच्छ व हरित गाव (Climate Action)',
        titleEn: 'Water-rich, Clean and Green Village (Climate Action)',
        description: 'Water management, cleanliness and environmental initiatives',
        maxMarks: 19,
        items: [
          {
            itemId: '3.1',
            fieldName: 'पाण्याचा ताळेबंद (Water Budget)',
            fieldNameEn: 'Water Budget',
            targets: { below2000: '100%', between2000_5000: '100%', above5000: '100%' },
            maxMarks: 1
          }
        ]
      },
      {
        sectionId: 4,
        title: 'मनरेगा व इतर योजनांशी अभिसरण',
        titleEn: 'Convergence with MNREGA and Other Schemes',
        description: 'Integration with government schemes',
        maxMarks: 6,
        items: [
          {
            itemId: '4.1',
            fieldName: 'मनरेगा रोजगार निर्माण',
            fieldNameEn: 'MNREGA Employment Generation',
            targets: { below2000: '3000', between2000_5000: '5000', above5000: '7000' },
            unit: 'मनुष्यदिन',
            maxMarks: 2
          }
        ]
      },
      {
        sectionId: 5,
        title: 'गावपातळी वरील संस्था सक्षमीकरण',
        titleEn: 'Village Level Institution Empowerment',
        description: 'Empowering village level institutions',
        maxMarks: 16,
        items: [
          {
            itemId: '5.1',
            fieldName: 'ग्राम पंचायत सक्षमीकरण',
            fieldNameEn: 'Gram Panchayat Empowerment',
            itemType: 'sub-items',
            maxMarks: 3.5,
            subItems: [
              {
                itemId: '5.1a',
                fieldName: 'घटक 1',
                fieldNameEn: 'Component 1',
                maxMarks: 0.5
              },
              {
                itemId: '5.1b',
                fieldName: 'घटक 2',
                fieldNameEn: 'Component 2',
                maxMarks: 0.5
              }
            ]
          }
        ]
      },
      {
        sectionId: 6,
        title: 'उपजिविका विकास, सामाजिक न्याय',
        titleEn: 'Livelihood Development, Social Justice',
        description: 'Livelihood and social justice initiatives',
        maxMarks: 23,
        items: [
          {
            itemId: '6.1',
            fieldName: 'प्रधानमंत्री आवास योजना व घरकुल',
            fieldNameEn: 'PM Awas Yojana and Housing',
            itemType: 'sub-items',
            maxMarks: 9,
            subItems: [
              {
                itemId: '6.1a',
                fieldName: 'टप्पा-1 अपूर्ण घरकुले पूर्ण',
                fieldNameEn: 'Phase-1 Incomplete Houses Completion',
                targets: { below2000: '100%', between2000_5000: '100%', above5000: '100%' },
                maxMarks: 1
              }
            ]
          }
        ]
      },
      {
        sectionId: 7,
        title: 'लोकसहभाग व श्रमदान माध्यमातून लोकचळवळ निर्माण करणे',
        titleEn: 'Creating People\'s Movement through Public Participation and Shramdan',
        description: 'Public participation and community work',
        maxMarks: 5,
        items: [
          {
            itemId: '7.1',
            fieldName: 'लोकसहभाग व श्रमदान',
            fieldNameEn: 'Public Participation and Shramdan',
            itemType: 'sub-items',
            maxMarks: 2.5,
            subItems: [
              {
                itemId: '7.1a',
                fieldName: 'मनुष्यदिन निर्माण',
                fieldNameEn: 'Person-days Creation',
                targets: { below2000: '100%', between2000_5000: '100%', above5000: '100%' },
                maxMarks: 1.5
              }
            ]
          }
        ]
      },
      {
        sectionId: 8,
        title: 'नाविन्यपूर्ण उपक्रम',
        titleEn: 'Innovative Initiatives',
        description: 'Innovative programs and initiatives',
        maxMarks: 5,
        items: [
          {
            itemId: '8.1',
            fieldName: 'ग्रामपंचायतीने नाविन्यपूर्ण उपक्रम राबविणे (प्रत्येक उपक्रमास 1 गुण)',
            fieldNameEn: 'Innovative Programs by Gram Panchayat (1 mark per program)',
            itemType: 'innovation',
            maxMarks: 5
          }
        ]
      }
    ];

    // Create sections and items
    for (const sectionData of sections) {
      const section = await prisma.formSection.create({
        data: {
          campaignFormId: campaignForm.id,
          sectionId: sectionData.sectionId,
          title: sectionData.title,
          titleEn: sectionData.titleEn,
          description: sectionData.description,
          maxMarks: sectionData.maxMarks,
          order: sectionData.sectionId
        }
      });

      console.log(`✅ Section ${sectionData.sectionId} created:`, section.id);

      // Create items for this section
      for (const itemData of sectionData.items) {
        const item = await prisma.formItem.create({
          data: {
            sectionId: section.id,
            itemId: itemData.itemId,
            itemType: itemData.itemType || 'simple',
            fieldName: itemData.fieldName,
            fieldNameEn: itemData.fieldNameEn,
            description: itemData.description,
            actionType: itemData.actionType,
            targets: itemData.targets || {},
            unit: itemData.unit,
            maxMarks: itemData.maxMarks,
            order: parseInt(itemData.itemId.split('.')[1]) || 1
          }
        });

        console.log(`✅ Item ${itemData.itemId} created:`, item.id);

        // Create sub-items if they exist
        if (itemData.subItems && itemData.subItems.length > 0) {
          for (const subItemData of itemData.subItems) {
            await prisma.formItem.create({
              data: {
                sectionId: section.id,
                itemId: subItemData.itemId,
                itemType: 'simple',
                fieldName: subItemData.fieldName,
                fieldNameEn: subItemData.fieldNameEn,
                maxMarks: subItemData.maxMarks,
                parentItemId: item.id,
                order: parseInt(subItemData.itemId.split('.')[2]) || 1,
                targets: subItemData.targets || {}
              }
            });

            console.log(`✅ Sub-item ${subItemData.itemId} created`);
          }
        }
      }
    }

    console.log('🎉 Campaign form seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding campaign form:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seedCampaignForm()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });
