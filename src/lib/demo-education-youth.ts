export interface SchoolData {
  id?: string;
  name: string;
  nameEn: string;
  type: string;
  typeEn: string;
  students: number;
  teachers: number;
  classes: string;
  established: string;
  contact: string;
  address: string;
  addressEn: string;
  facilities: string[];
  facilitiesEn: string[];
  achievements: string[];
  achievementsEn: string[];
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface ScholarshipSchemeData {
  id?: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  amount: string;
  eligibility: string;
  eligibilityEn: string;
  lastDate: string;
  category: string;
  categoryEn: string;
  applicationUrl?: string;
  order: number;
  isActive: boolean;
}

export interface StudentAchievementData {
  id?: string;
  name: string;
  nameEn: string;
  class: string;
  classEn: string;
  achievement: string;
  achievementEn: string;
  year: string;
  category: string;
  categoryEn: string;
  school: string;
  schoolEn: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface CareerGuidanceData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  durationEn: string;
  date: string;
  time: string;
  speaker: string;
  speakerEn: string;
  type: string;
  typeEn: string;
  registrationUrl?: string;
  order: number;
  isActive: boolean;
}

export interface NSSActivityData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  participants: number;
  impact: string;
  impactEn: string;
  status: string;
  order: number;
  isActive: boolean;
}

export interface YouthSuccessStoryData {
  id?: string;
  name: string;
  nameEn: string;
  age: number;
  story: string;
  storyEn: string;
  achievement: string;
  achievementEn: string;
  current: string;
  currentEn: string;
  status: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface EducationContactInfoData {
  id?: string;
  section: string; // education, youth
  officeName: string;
  officeNameEn: string;
  phone: string;
  email?: string;
  address: string;
  addressEn: string;
  isActive: boolean;
}

export const schoolsDemoData: SchoolData[] = [
  {
    id: 'school-1',
    name: 'श्री गणपती प्राथमिक शाळा',
    nameEn: 'Shri Ganpati Primary School',
    type: 'प्राथमिक शाळा',
    typeEn: 'Primary School',
    students: 156,
    teachers: 8,
    classes: '1-7',
    established: '1985',
    achievements: ['100% उत्तीर्णता', 'स्वच्छता पुरस्कार', 'सर्वोत्कृष्ट शिक्षक पुरस्कार'],
    achievementsEn: ['100% Pass Rate', 'Sanitation Award', 'Best Teacher Award'],
    facilities: ['कंप्युटर लॅब', 'पुस्तकालय', 'खेळाचे मैदान', 'स्वच्छतागृह'],
    facilitiesEn: ['Computer Lab', 'Library', 'Playground', 'Toilets'],
    contact: '+91 98765 43210',
    address: 'गाव मध्यभागी, तालुका, जिल्हा',
    addressEn: 'Village Center, Taluka, District',
    order: 0,
    isActive: true
  },
  {
    id: 'school-2',
    name: 'महात्मा गांधी माध्यमिक शाळा',
    nameEn: 'Mahatma Gandhi Secondary School',
    type: 'माध्यमिक शाळा',
    typeEn: 'Secondary School',
    students: 89,
    teachers: 12,
    classes: '8-10',
    established: '1992',
    achievements: ['राज्यस्तरीय क्रीडा पुरस्कार', 'विज्ञान प्रदर्शन पुरस्कार'],
    achievementsEn: ['State Level Sports Award', 'Science Exhibition Award'],
    facilities: ['विज्ञान प्रयोगशाळा', 'कंप्युटर लॅब', 'पुस्तकालय', 'खेळाचे मैदान'],
    facilitiesEn: ['Science Laboratory', 'Computer Lab', 'Library', 'Playground'],
    contact: '+91 98765 43211',
    address: 'गाव पूर्व भाग, तालुका, जिल्हा',
    addressEn: 'Village East, Taluka, District',
    order: 1,
    isActive: true
  }
];

export const scholarshipSchemesDemoData: ScholarshipSchemeData[] = [
  {
    id: 'scholarship-1',
    name: 'मुख्यमंत्री शिष्यवृत्ती योजना',
    nameEn: 'Chief Minister Scholarship Scheme',
    amount: '₹5,000 - ₹15,000',
    eligibility: '10वी/12वी 80% पेक्षा जास्त गुण',
    eligibilityEn: '10th/12th with 80%+ marks',
    lastDate: '2024-03-15',
    description: 'उत्कृष्ट विद्यार्थ्यांसाठी वार्षिक शिष्यवृत्ती',
    descriptionEn: 'Annual scholarship for meritorious students',
    category: 'शासकीय',
    categoryEn: 'Government',
    order: 0,
    isActive: true
  },
  {
    id: 'scholarship-2',
    name: 'आदिवासी विद्यार्थी शिष्यवृत्ती',
    nameEn: 'Tribal Student Scholarship',
    amount: '₹3,000 - ₹8,000',
    eligibility: 'आदिवासी समुदाय, 60% पेक्षा जास्त गुण',
    eligibilityEn: 'Tribal community, 60%+ marks',
    lastDate: '2024-03-20',
    description: 'आदिवासी विद्यार्थ्यांसाठी विशेष शिष्यवृत्ती',
    descriptionEn: 'Special scholarship for tribal students',
    category: 'शासकीय',
    categoryEn: 'Government',
    order: 1,
    isActive: true
  },
  {
    id: 'scholarship-3',
    name: 'महिला शिक्षण प्रोत्साहन',
    nameEn: 'Women Education Encouragement',
    amount: '₹2,000 - ₹5,000',
    eligibility: 'महिला विद्यार्थी, 70% पेक्षा जास्त गुण',
    eligibilityEn: 'Female students, 70%+ marks',
    lastDate: '2024-03-25',
    description: 'महिला शिक्षणासाठी प्रोत्साहन रक्कम',
    descriptionEn: 'Encouragement amount for women education',
    category: 'शासकीय',
    categoryEn: 'Government',
    order: 2,
    isActive: true
  }
];

export const studentAchievementsDemoData: StudentAchievementData[] = [
  {
    id: 'achievement-1',
    name: 'प्रिया पाटील',
    nameEn: 'Priya Patil',
    class: '10वी',
    classEn: '10th',
    achievement: 'राज्यस्तरीय गणित स्पर्धा - प्रथम स्थान',
    achievementEn: 'State Level Math Competition - 1st Position',
    year: '2024',
    category: 'शैक्षणिक',
    categoryEn: 'Academic',
    school: 'महात्मा गांधी माध्यमिक शाळा',
    schoolEn: 'Mahatma Gandhi Secondary School',
    order: 0,
    isActive: true
  },
  {
    id: 'achievement-2',
    name: 'राजेश शिंदे',
    nameEn: 'Rajesh Shinde',
    class: '9वी',
    classEn: '9th',
    achievement: 'जिल्हा स्तरीय क्रिकेट स्पर्धा - सर्वोत्कृष्ट खेळाडू',
    achievementEn: 'District Level Cricket Competition - Best Player',
    year: '2024',
    category: 'क्रीडा',
    categoryEn: 'Sports',
    school: 'श्री गणपती प्राथमिक शाळा',
    schoolEn: 'Shri Ganpati Primary School',
    order: 1,
    isActive: true
  },
  {
    id: 'achievement-3',
    name: 'सुनीता कांबळे',
    nameEn: 'Sunita Kambale',
    class: '8वी',
    classEn: '8th',
    achievement: 'विज्ञान प्रदर्शन - सर्वोत्कृष्ट प्रकल्प',
    achievementEn: 'Science Exhibition - Best Project',
    year: '2024',
    category: 'विज्ञान',
    categoryEn: 'Science',
    school: 'महात्मा गांधी माध्यमिक शाळा',
    schoolEn: 'Mahatma Gandhi Secondary School',
    order: 2,
    isActive: true
  }
];

export const careerGuidanceDemoData: CareerGuidanceData[] = [
  {
    id: 'career-1',
    title: 'इंजिनिअरिंग क्षेत्रातील संधी',
    titleEn: 'Opportunities in Engineering Field',
    description: 'विविध इंजिनिअरिंग शाखांमध्ये करिअर मार्गदर्शन',
    descriptionEn: 'Career guidance in various engineering branches',
    duration: '2 तास',
    durationEn: '2 Hours',
    date: '2024-02-15',
    time: '10:00 AM',
    speaker: 'डॉ. विजय पाटील (IIT मुंबई)',
    speakerEn: 'Dr. Vijay Patil (IIT Mumbai)',
    type: 'व्याख्यान',
    typeEn: 'Lecture',
    order: 0,
    isActive: true
  },
  {
    id: 'career-2',
    title: 'वैद्यकीय क्षेत्रातील करिअर',
    titleEn: 'Career in Medical Field',
    description: 'वैद्यकीय शिक्षण आणि करिअर संधी',
    descriptionEn: 'Medical education and career opportunities',
    duration: '1.5 तास',
    durationEn: '1.5 Hours',
    date: '2024-02-20',
    time: '2:00 PM',
    speaker: 'डॉ. सुनीता शर्मा (AIIMS)',
    speakerEn: 'Dr. Sunita Sharma (AIIMS)',
    type: 'व्याख्यान',
    typeEn: 'Lecture',
    order: 1,
    isActive: true
  },
  {
    id: 'career-3',
    title: 'सरकारी नोकरी तयारी',
    titleEn: 'Government Job Preparation',
    description: 'UPSC, MPSC आणि इतर सरकारी परीक्षांची तयारी',
    descriptionEn: 'Preparation for UPSC, MPSC and other government exams',
    duration: '3 तास',
    durationEn: '3 Hours',
    date: '2024-02-25',
    time: '9:00 AM',
    speaker: 'श्री. अमित जोशी (UPSC टॉपर)',
    speakerEn: 'Shri. Amit Joshi (UPSC Topper)',
    type: 'वर्कशॉप',
    typeEn: 'Workshop',
    order: 2,
    isActive: true
  }
];

export const nssActivitiesDemoData: NSSActivityData[] = [
  {
    id: 'nss-1',
    title: 'स्वच्छता अभियान',
    titleEn: 'Cleanliness Campaign',
    date: '2024-02-10',
    participants: 25,
    description: 'गावातील स्वच्छता सुधारणा आणि जागरूकता निर्माण',
    descriptionEn: 'Village cleanliness improvement and awareness creation',
    impact: '50 किलो कचरा गोळा केला',
    impactEn: '50 kg waste collected',
    status: 'पूर्ण',
    order: 0,
    isActive: true
  },
  {
    id: 'nss-2',
    title: 'वृक्षारोपण कार्यक्रम',
    titleEn: 'Tree Plantation Program',
    date: '2024-01-15',
    participants: 30,
    description: 'गावातील वृक्षारोपण आणि पर्यावरण संवर्धन',
    descriptionEn: 'Tree plantation and environmental conservation in village',
    impact: '100 झाडे लावली',
    impactEn: '100 trees planted',
    status: 'पूर्ण',
    order: 1,
    isActive: true
  },
  {
    id: 'nss-3',
    title: 'शिक्षण जागरूकता',
    titleEn: 'Education Awareness',
    date: '2024-01-20',
    participants: 20,
    description: 'मुलांच्या शिक्षणासाठी पालकांना जागरूक करणे',
    descriptionEn: 'Creating awareness among parents for children\'s education',
    impact: '15 कुटुंबांना शिक्षणाचे महत्त्व समजावले',
    impactEn: 'Educated 15 families about importance of education',
    status: 'पूर्ण',
    order: 2,
    isActive: true
  }
];

export const youthSuccessStoriesDemoData: YouthSuccessStoryData[] = [
  {
    id: 'youth-1',
    name: 'अमित पाटील',
    nameEn: 'Amit Patil',
    age: 22,
    story: 'गावातील पहिला इंजिनिअर बनला. आता मुंबईत नोकरी करतो आणि गावाच्या विकासासाठी मदत करतो.',
    storyEn: 'Became the first engineer from the village. Now works in Mumbai and helps in village development.',
    achievement: 'IIT मुंबईत प्रवेश',
    achievementEn: 'Admission to IIT Mumbai',
    current: 'सॉफ्टवेअर इंजिनिअर, मुंबई',
    currentEn: 'Software Engineer, Mumbai',
    status: 'यशस्वी',
    order: 0,
    isActive: true
  },
  {
    id: 'youth-2',
    name: 'प्रिया शिंदे',
    nameEn: 'Priya Shinde',
    age: 20,
    story: 'गावातील पहिली डॉक्टर बनली. आता स्थानिक आरोग्य केंद्रात काम करते.',
    storyEn: 'Became the first doctor from the village. Now works at local health center.',
    achievement: 'MBBS पूर्ण केले',
    achievementEn: 'Completed MBBS',
    current: 'डॉक्टर, स्थानिक आरोग्य केंद्र',
    currentEn: 'Doctor, Local Health Center',
    status: 'यशस्वी',
    order: 1,
    isActive: true
  }
];

export const educationContactInfoDemoData: EducationContactInfoData[] = [
  {
    id: 'contact-education',
    section: 'education',
    officeName: 'शिक्षण विभाग',
    officeNameEn: 'Education Department',
    phone: '+91 12345 67890',
    email: 'education@grampanchayat.com',
    address: 'शिक्षण विभाग, ग्रामपंचायत कार्यालय',
    addressEn: 'Education Department, Gram Panchayat Office',
    isActive: true
  },
  {
    id: 'contact-youth',
    section: 'youth',
    officeName: 'युवक कल्याण केंद्र',
    officeNameEn: 'Youth Welfare Center',
    phone: '+91 12345 67891',
    email: 'youth@grampanchayat.com',
    address: 'युवक कल्याण केंद्र, ग्रामपंचायत कार्यालय',
    addressEn: 'Youth Welfare Center, Gram Panchayat Office',
    isActive: true
  }
];

