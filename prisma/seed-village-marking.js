const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedVillageMarking() {
  try {
    console.log('🌱 Starting village marking system seed...');

    // Create default template
    const template = await prisma.villageMarkingTemplate.create({
      data: {
        name: 'महाराष्ट्र शासन ग्रामपंचायत गुणांक फॉर्म',
        nameEn: 'Maharashtra Government Village Marking Form',
        description: 'महाराष्ट्र शासनाच्या ग्रामपंचायत गुणांक प्रणालीचा मानक फॉर्म',
        descriptionEn: 'Standard form for Maharashtra Government Village Marking System',
        isActive: true,
        isDefault: true,
      }
    });

    console.log('✅ Created default template');

    // Government format sections based on Maharashtra Government guidelines
    const sections = [
      {
        title: 'ग्रामपंचायत विकास योजना',
        titleEn: 'Village Development Plan',
        description: 'ग्रामपंचायत विकास योजनेची तयारी आणि अंमलबजावणी',
        descriptionEn: 'Preparation and implementation of village development plan',
        maxMarks: 10,
        order: 1
      },
      {
        title: 'पंचायत राज',
        titleEn: 'Panchayat Raj',
        description: 'पंचायत राज व्यवस्थेची कार्यक्षमता',
        descriptionEn: 'Efficiency of Panchayat Raj system',
        maxMarks: 15,
        order: 2
      },
      {
        title: 'स्वच्छता',
        titleEn: 'Cleanliness',
        description: 'गावातील स्वच्छता आणि साफसफाई',
        descriptionEn: 'Cleanliness and sanitation in village',
        maxMarks: 20,
        order: 3
      },
      {
        title: 'पाणी व्यवस्थापन',
        titleEn: 'Water Management',
        description: 'पाणी पुरवठा आणि व्यवस्थापन',
        descriptionEn: 'Water supply and management',
        maxMarks: 15,
        order: 4
      },
      {
        title: 'वीज व्यवस्थापन',
        titleEn: 'Electricity Management',
        description: 'वीज पुरवठा आणि व्यवस्थापन',
        descriptionEn: 'Electricity supply and management',
        maxMarks: 10,
        order: 5
      },
      {
        title: 'रस्ते आणि वाहतूक',
        titleEn: 'Roads and Transportation',
        description: 'रस्ते, पूल आणि वाहतूक व्यवस्था',
        descriptionEn: 'Roads, bridges and transportation system',
        maxMarks: 15,
        order: 6
      },
      {
        title: 'शिक्षण',
        titleEn: 'Education',
        description: 'शैक्षणिक सुविधा आणि गुणवत्ता',
        descriptionEn: 'Educational facilities and quality',
        maxMarks: 20,
        order: 7
      },
      {
        title: 'आरोग्य सेवा',
        titleEn: 'Health Services',
        description: 'आरोग्य सेवा आणि सुविधा',
        descriptionEn: 'Health services and facilities',
        maxMarks: 20,
        order: 8
      },
      {
        title: 'कृषी विकास',
        titleEn: 'Agricultural Development',
        description: 'कृषी तंत्रज्ञान आणि विकास',
        descriptionEn: 'Agricultural technology and development',
        maxMarks: 15,
        order: 9
      },
      {
        title: 'पशुसंवर्धन',
        titleEn: 'Animal Husbandry',
        description: 'पशुसंवर्धन सेवा आणि सुविधा',
        descriptionEn: 'Animal husbandry services and facilities',
        maxMarks: 10,
        order: 10
      },
      {
        title: 'मत्स्यपालन',
        titleEn: 'Fisheries',
        description: 'मत्स्यपालन विकास',
        descriptionEn: 'Fisheries development',
        maxMarks: 5,
        order: 11
      },
      {
        title: 'वनसंवर्धन',
        titleEn: 'Forest Conservation',
        description: 'वनसंवर्धन आणि पर्यावरण संरक्षण',
        descriptionEn: 'Forest conservation and environmental protection',
        maxMarks: 10,
        order: 12
      },
      {
        title: 'महिला सक्षमीकरण',
        titleEn: 'Women Empowerment',
        description: 'महिला सक्षमीकरण कार्यक्रम',
        descriptionEn: 'Women empowerment programs',
        maxMarks: 15,
        order: 13
      },
      {
        title: 'बाल विकास',
        titleEn: 'Child Development',
        description: 'बाल विकास कार्यक्रम',
        descriptionEn: 'Child development programs',
        maxMarks: 10,
        order: 14
      },
      {
        title: 'वृद्ध सेवा',
        titleEn: 'Senior Citizen Services',
        description: 'वृद्ध नागरिक सेवा',
        descriptionEn: 'Senior citizen services',
        maxMarks: 5,
        order: 15
      },
      {
        title: 'अपंग सेवा',
        titleEn: 'Disability Services',
        description: 'अपंग नागरिक सेवा',
        descriptionEn: 'Disability services',
        maxMarks: 5,
        order: 16
      },
      {
        title: 'युवा विकास',
        titleEn: 'Youth Development',
        description: 'युवा विकास कार्यक्रम',
        descriptionEn: 'Youth development programs',
        maxMarks: 10,
        order: 17
      },
      {
        title: 'खेळ आणि संस्कृती',
        titleEn: 'Sports and Culture',
        description: 'खेळ आणि सांस्कृतिक कार्यक्रम',
        descriptionEn: 'Sports and cultural programs',
        maxMarks: 10,
        order: 18
      },
      {
        title: 'सामाजिक न्याय',
        titleEn: 'Social Justice',
        description: 'सामाजिक न्याय आणि समानता',
        descriptionEn: 'Social justice and equality',
        maxMarks: 15,
        order: 19
      },
      {
        title: 'आर्थिक विकास',
        titleEn: 'Economic Development',
        description: 'आर्थिक विकास आणि रोजगार',
        descriptionEn: 'Economic development and employment',
        maxMarks: 15,
        order: 20
      },
      {
        title: 'सहकारी संस्था',
        titleEn: 'Cooperative Societies',
        description: 'सहकारी संस्थांचा विकास',
        descriptionEn: 'Development of cooperative societies',
        maxMarks: 10,
        order: 21
      },
      {
        title: 'बचत गट',
        titleEn: 'Self Help Groups',
        description: 'बचत गट आणि सूक्ष्म वित्त',
        descriptionEn: 'Self help groups and microfinance',
        maxMarks: 10,
        order: 22
      },
      {
        title: 'तंत्रज्ञान वापर',
        titleEn: 'Technology Usage',
        description: 'डिजिटल तंत्रज्ञानाचा वापर',
        descriptionEn: 'Usage of digital technology',
        maxMarks: 10,
        order: 23
      },
      {
        title: 'सुरक्षा व्यवस्था',
        titleEn: 'Security System',
        description: 'गावातील सुरक्षा व्यवस्था',
        descriptionEn: 'Security system in village',
        maxMarks: 10,
        order: 24
      },
      {
        title: 'आपत्ती व्यवस्थापन',
        titleEn: 'Disaster Management',
        description: 'आपत्ती व्यवस्थापन आणि तयारी',
        descriptionEn: 'Disaster management and preparedness',
        maxMarks: 10,
        order: 25
      },
      {
        title: 'पर्यावरण संरक्षण',
        titleEn: 'Environmental Protection',
        description: 'पर्यावरण संरक्षण उपक्रम',
        descriptionEn: 'Environmental protection initiatives',
        maxMarks: 15,
        order: 26
      },
      {
        title: 'ऊर्जा संवर्धन',
        titleEn: 'Energy Conservation',
        description: 'ऊर्जा संवर्धन आणि नूतनीकरण',
        descriptionEn: 'Energy conservation and renewable energy',
        maxMarks: 10,
        order: 27
      },
      {
        title: 'कचरा व्यवस्थापन',
        titleEn: 'Waste Management',
        description: 'कचरा व्यवस्थापन आणि पुनर्वापर',
        descriptionEn: 'Waste management and recycling',
        maxMarks: 15,
        order: 28
      },
      {
        title: 'सार्वजनिक सुविधा',
        titleEn: 'Public Facilities',
        description: 'सार्वजनिक सुविधा आणि सेवा',
        descriptionEn: 'Public facilities and services',
        maxMarks: 15,
        order: 29
      },
      {
        title: 'नागरिक सहभाग',
        titleEn: 'Citizen Participation',
        description: 'नागरिक सहभाग आणि सहकार्य',
        descriptionEn: 'Citizen participation and cooperation',
        maxMarks: 20,
        order: 30
      },
      {
        title: 'पारदर्शकता',
        titleEn: 'Transparency',
        description: 'पारदर्शकता आणि जबाबदारी',
        descriptionEn: 'Transparency and accountability',
        maxMarks: 15,
        order: 31
      }
    ];

    // Create sections
    const createdSections = [];
    for (const sectionData of sections) {
      const section = await prisma.villageMarkingSection.create({
        data: {
          ...sectionData,
          isActive: true,
          isRequired: true,
        }
      });
      createdSections.push(section);
      console.log(`✅ Created section: ${sectionData.title}`);
    }

    // Create default fields for each section
    for (const section of createdSections) {
      const fields = [
        {
          fieldName: 'उदिष्ट',
          fieldNameEn: 'Target',
          fieldType: 'udisht',
          isEditable: true,
          order: 1,
          validationRules: {
            required: true,
            min: 0,
            message: 'उदिष्ट मूल्य 0 पेक्षा जास्त असावे'
          }
        },
        {
          fieldName: 'साध्य',
          fieldNameEn: 'Achievement',
          fieldType: 'sadhya',
          isEditable: true,
          order: 2,
          validationRules: {
            required: true,
            min: 0,
            message: 'साध्य मूल्य 0 पेक्षा जास्त किंवा समान असावे'
          }
        },
        {
          fieldName: 'टक्केवारी',
          fieldNameEn: 'Percentage',
          fieldType: 'percentage',
          formula: '(sadhya/udisht)*100',
          isEditable: false,
          order: 3,
          validationRules: {
            readonly: true
          }
        },
        {
          fieldName: 'गुण',
          fieldNameEn: 'Marks',
          fieldType: 'marks',
          formula: 'IF(percentage >= 90, 10, IF(percentage >= 75, 8, IF(percentage >= 60, 6, IF(percentage >= 50, 4, 2))))',
          isEditable: false,
          order: 4,
          validationRules: {
            readonly: true
          }
        }
      ];

      for (const fieldData of fields) {
        await prisma.villageMarkingField.create({
          data: {
            ...fieldData,
            sectionId: section.id,
            isActive: true,
            validationRules: fieldData.validationRules
          }
        });
      }
      console.log(`✅ Created fields for section: ${section.title}`);
    }

    console.log('🎉 Village marking system seed completed successfully!');
    console.log(`📊 Created ${createdSections.length} sections with default fields`);

  } catch (error) {
    console.error('❌ Error seeding village marking system:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedVillageMarking()
    .then(() => {
      console.log('✅ Seed completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    });
}

module.exports = { seedVillageMarking };
