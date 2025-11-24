export interface EducationHealthSnapshotData {
  id?: string;
  sectionTitle: string;
  sectionTitleEn: string;
  sectionSubtitle: string;
  sectionSubtitleEn: string;
  educationInfoTitle: string;
  educationInfoTitleEn: string;
  educationTotalSchools: number;
  educationPrimarySchools: number;
  educationSecondarySchools: number;
  educationAnganwadis: number;
  educationTotalStudents: number;
  educationTotalTeachers: number;
  educationLiteracyRate: number;
  educationLastCensus: string;
  healthInfoTitle: string;
  healthInfoTitleEn: string;
  healthTotalCenters: number;
  healthPrimaryHealthCenters: number;
  healthSubCenters: number;
  healthAnganwadiCenters: number;
  healthTotalDoctors: number;
  healthTotalNurses: number;
  healthTotalBeds: number;
  healthLastInspection: string;
  issueTitle: string;
  issueTitleEn: string;
  issueDescription: string;
  issueDescriptionEn: string;
  issueContactLabel: string;
  issueContactLabelEn: string;
  issueContactNumber: string;
  issueActionLabel1: string;
  issueActionLabel1En: string;
  issueActionLabel2?: string;
  issueActionLabel2En?: string;
  isActive?: boolean;
}

export interface EducationHealthFacilityData {
  id?: string;
  title: string;
  titleEn: string;
  type: string; // school, anganwadi, health_center, hospital
  status: string; // operational, maintenance, non-functional
  statusEn: string;
  location: string;
  locationEn: string;
  capacity: string;
  staff: number;
  lastInspection: string;
  contactNumber: string;
  contactLabel: string;
  contactLabelEn: string;
  actionLabel: string;
  actionLabelEn: string;
  services: string[];
  order: number;
  isActive: boolean;
}

export interface EducationHealthApiResponse {
  snapshot: EducationHealthSnapshotData;
  facilities: EducationHealthFacilityData[];
  isDemo: boolean;
}

export const educationHealthDemoSnapshot: EducationHealthSnapshotData = {
  sectionTitle: 'शाळा, अंगणवाडी, आरोग्य केंद्रे',
  sectionTitleEn: 'Schools, Anganwadis, Health Centers',
  sectionSubtitle: 'गावातील शैक्षणिक आणि आरोग्य सुविधा',
  sectionSubtitleEn: 'Village educational and health facilities',
  educationInfoTitle: 'शिक्षण माहिती',
  educationInfoTitleEn: 'Education Information',
  educationTotalSchools: 8,
  educationPrimarySchools: 5,
  educationSecondarySchools: 3,
  educationAnganwadis: 12,
  educationTotalStudents: 1250,
  educationTotalTeachers: 45,
  educationLiteracyRate: 78.5,
  educationLastCensus: 'अद्यतन: १/१/२०२१',
  healthInfoTitle: 'आरोग्य माहिती',
  healthInfoTitleEn: 'Health Information',
  healthTotalCenters: 6,
  healthPrimaryHealthCenters: 1,
  healthSubCenters: 3,
  healthAnganwadiCenters: 12,
  healthTotalDoctors: 3,
  healthTotalNurses: 8,
  healthTotalBeds: 15,
  healthLastInspection: 'अद्यतन: २०/११/२०२४',
  issueTitle: 'शिक्षण आणि आरोग्य सेवा',
  issueTitleEn: 'Education & Health Services',
  issueDescription: 'शिक्षण किंवा आरोग्य संबंधित कोणतीही माहिती किंवा सेवा हवी असल्यास संपर्क करा',
  issueDescriptionEn: 'Contact for any education or health related information or services',
  issueContactLabel: 'संपर्क माहिती',
  issueContactLabelEn: 'Contact Information',
  issueContactNumber: '+91-XXXX-XXXXXX',
  issueActionLabel1: 'शिक्षण माहिती',
  issueActionLabel1En: 'Education Information',
  issueActionLabel2: 'आरोग्य सेवा',
  issueActionLabel2En: 'Health Services',
  isActive: true
};

export const educationHealthDemoFacilities: EducationHealthFacilityData[] = [
  {
    id: 'demo-school-1',
    title: 'प्राथमिक शाळा',
    titleEn: 'Primary School',
    type: 'school',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'गावाच्या मध्य भागात',
    locationEn: 'In the center of the village',
    capacity: '200 विद्यार्थी',
    staff: 8,
    lastInspection: 'अद्यतन: १५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    services: ['प्राथमिक शिक्षण', 'मध्यान्ह भोजन', 'पुस्तकालय'],
    order: 0,
    isActive: true
  },
  {
    id: 'demo-school-2',
    title: 'माध्यमिक शाळा',
    titleEn: 'Secondary School',
    type: 'school',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'गावाच्या पूर्व भागात',
    locationEn: 'In the eastern part of the village',
    capacity: '300 विद्यार्थी',
    staff: 12,
    lastInspection: 'अद्यतन: १०/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    services: ['माध्यमिक शिक्षण', 'विज्ञान प्रयोगशाळा', 'संगणक केंद्र'],
    order: 1,
    isActive: true
  },
  {
    id: 'demo-health-1',
    title: 'प्राथमिक आरोग्य केंद्र',
    titleEn: 'Primary Health Center',
    type: 'health_center',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'ग्रामपंचायत कार्यालयजवळ',
    locationEn: 'Near Gram Panchayat office',
    capacity: '50 रुग्ण',
    staff: 5,
    lastInspection: 'अद्यतन: २०/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    services: ['सामान्य उपचार', 'लसीकरण', 'प्रसूती सेवा'],
    order: 2,
    isActive: true
  },
  {
    id: 'demo-anganwadi-1',
    title: 'अंगणवाडी केंद्र',
    titleEn: 'Anganwadi Center',
    type: 'anganwadi',
    status: 'चालू',
    statusEn: 'Operational',
    location: 'वॉर्ड क्र. २ मध्ये',
    locationEn: 'In Ward No. 2',
    capacity: '25 मुले',
    staff: 2,
    lastInspection: 'अद्यतन: २५/११/२०२४',
    contactNumber: '+91-XXXX-XXXXXX',
    contactLabel: 'संपर्क माहिती',
    contactLabelEn: 'Contact Information',
    actionLabel: 'कॉल करा',
    actionLabelEn: 'Call Now',
    services: ['पूर्व प्राथमिक शिक्षण', 'पोषण', 'आरोग्य तपासणी'],
    order: 3,
    isActive: true
  }
];

