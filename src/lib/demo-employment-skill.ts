export interface JobOpportunityData {
  id?: string;
  title: string;
  titleEn: string;
  organization: string;
  organizationEn: string;
  location: string;
  locationEn: string;
  type: string;
  typeEn: string;
  salary: string;
  experience: string;
  experienceEn: string;
  education: string;
  educationEn: string;
  description: string;
  descriptionEn: string;
  requirements: string[];
  requirementsEn: string[];
  postedDate: string;
  lastDate: string;
  applicationUrl?: string;
  isUrgent: boolean;
  order: number;
  isActive: boolean;
}

export interface TenderData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  value: string;
  lastDate: string;
  category: string;
  categoryEn: string;
  requirements: string;
  requirementsEn: string;
  tenderUrl?: string;
  order: number;
  isActive: boolean;
}

export interface TrainingProgramData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  duration: string;
  durationEn: string;
  fee: string;
  feeEn: string;
  instructor: string;
  instructorEn: string;
  startDate: string;
  seats: number;
  enrolled: number;
  registrationUrl?: string;
  order: number;
  isActive: boolean;
}

export interface FPOGroupData {
  id?: string;
  name: string;
  nameEn: string;
  members: number;
  established: string;
  contact: string;
  email?: string;
  activities: string[];
  activitiesEn: string[];
  achievements: string;
  achievementsEn: string;
  joinUrl?: string;
  order: number;
  isActive: boolean;
}

export interface VillageTalentData {
  id?: string;
  name: string;
  nameEn: string;
  skill: string;
  skillEn: string;
  experience: string;
  experienceEn: string;
  rating: number;
  contact: string;
  services: string[];
  servicesEn: string[];
  order: number;
  isActive: boolean;
}

export interface EmploymentContactInfoData {
  id?: string;
  section: string; // jobs, tenders, training, fpo, talent, general
  officeName: string;
  officeNameEn: string;
  phone: string;
  email?: string;
  address: string;
  addressEn: string;
  isActive: boolean;
}

export const jobOpportunitiesDemoData: JobOpportunityData[] = [
  {
    id: 'job-1',
    title: 'ग्रामसेवक',
    titleEn: 'Village Development Officer',
    organization: 'ग्रामपंचायत कार्यालय',
    organizationEn: 'Gram Panchayat Office',
    location: 'गाव, तालुका, जिल्हा',
    locationEn: 'Village, Taluka, District',
    type: 'सरकारी नोकरी',
    typeEn: 'Government Job',
    salary: '₹25,000 - ₹35,000',
    experience: '2-3 वर्षे',
    experienceEn: '2-3 Years',
    education: 'बी.ए. / बी.कॉम',
    educationEn: 'B.A. / B.Com',
    description: 'ग्रामपंचायत कार्यालयातील दैनंदिन कामकाज, नागरिक सेवा आणि विकास कार्यक्रमांमध्ये सहभाग',
    descriptionEn: 'Daily office work, citizen services and participation in development programs',
    requirements: ['मराठी भाषेचे ज्ञान', 'कंप्युटर साक्षरता', 'नागरिकांशी संवाद साधण्याची क्षमता'],
    requirementsEn: ['Knowledge of Marathi language', 'Computer literacy', 'Ability to communicate with citizens'],
    postedDate: '2024-01-15',
    lastDate: '2024-02-15',
    isUrgent: true,
    order: 0,
    isActive: true
  },
  {
    id: 'job-2',
    title: 'शिक्षक (अंगणवाडी)',
    titleEn: 'Anganwadi Teacher',
    organization: 'महिला व बाल विकास विभाग',
    organizationEn: 'Women & Child Development Department',
    location: 'अंगणवाडी केंद्र',
    locationEn: 'Anganwadi Center',
    type: 'सरकारी नोकरी',
    typeEn: 'Government Job',
    salary: '₹15,000 - ₹20,000',
    experience: '1-2 वर्षे',
    experienceEn: '1-2 Years',
    education: '12वी पास + प्रशिक्षण',
    educationEn: '12th Pass + Training',
    description: 'अंगणवाडी केंद्रातील मुलांची देखभाल, शिक्षण आणि पोषण कार्यक्रम',
    descriptionEn: 'Childcare, education and nutrition programs at Anganwadi center',
    requirements: ['महिला उमेदवार', 'मुलांशी प्रेम', 'सहनशीलता'],
    requirementsEn: ['Female candidate', 'Love for children', 'Patience'],
    postedDate: '2024-01-10',
    lastDate: '2024-02-10',
    isUrgent: false,
    order: 1,
    isActive: true
  },
  {
    id: 'job-3',
    title: 'स्वयंसेवक (NSS)',
    titleEn: 'NSS Volunteer',
    organization: 'राष्ट्रीय सेवा योजना',
    organizationEn: 'National Service Scheme',
    location: 'स्थानिक शाळा',
    locationEn: 'Local School',
    type: 'स्वयंसेवक',
    typeEn: 'Volunteer',
    salary: 'स्टायपेंड: ₹500/महिना',
    experience: 'कोणतेही नाही',
    experienceEn: 'No experience required',
    education: '10वी पास',
    educationEn: '10th Pass',
    description: 'सामुदायिक सेवा, स्वच्छता अभियान, शिक्षण कार्यक्रमांमध्ये सहभाग',
    descriptionEn: 'Community service, cleanliness campaigns, education programs',
    requirements: ['सामाजिक सेवेची इच्छा', 'टीम वर्क', 'नेतृत्व गुण'],
    requirementsEn: ['Desire for social service', 'Team work', 'Leadership qualities'],
    postedDate: '2024-01-05',
    lastDate: '2024-01-25',
    isUrgent: false,
    order: 2,
    isActive: true
  }
];

export const tendersDemoData: TenderData[] = [
  {
    id: 'tender-1',
    title: 'रस्ते दुरुस्ती काम',
    titleEn: 'Road Repair Work',
    description: 'गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा',
    descriptionEn: 'Repair and improvement of main roads in the village',
    value: '₹2,50,000',
    lastDate: '2024-02-20',
    category: 'बांधकाम',
    categoryEn: 'Construction',
    requirements: 'लायसेंस असलेले कंत्राटदार',
    requirementsEn: 'Licensed contractor',
    order: 0,
    isActive: true
  },
  {
    id: 'tender-2',
    title: 'स्वच्छता अभियान',
    titleEn: 'Sanitation Campaign',
    description: 'गावातील स्वच्छता सुविधांची स्थापना आणि देखभाल',
    descriptionEn: 'Installation and maintenance of sanitation facilities',
    value: '₹1,80,000',
    lastDate: '2024-02-15',
    category: 'स्वच्छता',
    categoryEn: 'Sanitation',
    requirements: 'पर्यावरणीय अनुभव',
    requirementsEn: 'Environmental experience',
    order: 1,
    isActive: true
  }
];

export const trainingProgramsDemoData: TrainingProgramData[] = [
  {
    id: 'training-1',
    title: 'डिजिटल साक्षरता प्रशिक्षण',
    titleEn: 'Digital Literacy Training',
    description: 'कंप्युटर, इंटरनेट आणि स्मार्टफोन वापराचे प्रशिक्षण',
    descriptionEn: 'Training in computer, internet and smartphone usage',
    duration: '30 दिवस',
    durationEn: '30 Days',
    fee: 'मोफत',
    feeEn: 'Free',
    instructor: 'राज्य शासन',
    instructorEn: 'State Government',
    startDate: '2024-02-01',
    seats: 25,
    enrolled: 18,
    order: 0,
    isActive: true
  },
  {
    id: 'training-2',
    title: 'कृषी तंत्रज्ञान प्रशिक्षण',
    titleEn: 'Agricultural Technology Training',
    description: 'आधुनिक शेती पद्धती, सिंचन तंत्रज्ञान आणि पिकांची काळजी',
    descriptionEn: 'Modern farming methods, irrigation technology and crop care',
    duration: '15 दिवस',
    durationEn: '15 Days',
    fee: '₹500',
    feeEn: '₹500',
    instructor: 'कृषी विभाग',
    instructorEn: 'Agriculture Department',
    startDate: '2024-02-15',
    seats: 20,
    enrolled: 12,
    order: 1,
    isActive: true
  }
];

export const fpoGroupsDemoData: FPOGroupData[] = [
  {
    id: 'fpo-1',
    name: 'ग्रामीण उत्पादक संघ',
    nameEn: 'Rural Producers Association',
    members: 45,
    established: '2020',
    contact: '+91 98765 43210',
    email: 'fpo1@example.com',
    activities: ['सेंद्रिय शेती', 'पशुपालन', 'हस्तकला'],
    activitiesEn: ['Organic Farming', 'Animal Husbandry', 'Handicrafts'],
    achievements: 'वर्षभरात ₹5 लाख उत्पन्न',
    achievementsEn: '₹5 Lakh income in one year',
    order: 0,
    isActive: true
  },
  {
    id: 'fpo-2',
    name: 'महिला स्वयंसाहाय्य गट',
    nameEn: 'Women Self Help Group',
    members: 20,
    established: '2019',
    contact: '+91 98765 43211',
    email: 'shg2@example.com',
    activities: ['कुटिर उद्योग', 'बचत गट', 'महिला सशक्तीकरण'],
    activitiesEn: ['Cottage Industry', 'Savings Group', 'Women Empowerment'],
    achievements: '15 महिलांना रोजगार',
    achievementsEn: 'Employment for 15 women',
    order: 1,
    isActive: true
  }
];

export const villageTalentsDemoData: VillageTalentData[] = [
  {
    id: 'talent-1',
    name: 'राम पाटील',
    nameEn: 'Ram Patil',
    skill: 'वीजतज्ञ',
    skillEn: 'Electrician',
    experience: '10 वर्षे',
    experienceEn: '10 Years',
    contact: '+91 98765 43212',
    rating: 4.8,
    services: ['घरातील वीज दुरुस्ती', 'नवीन कनेक्शन', 'सौर ऊर्जा स्थापना'],
    servicesEn: ['Home electrical repair', 'New connections', 'Solar installation'],
    order: 0,
    isActive: true
  },
  {
    id: 'talent-2',
    name: 'सीता शिंदे',
    nameEn: 'Sita Shinde',
    skill: 'टेलर',
    skillEn: 'Tailor',
    experience: '8 वर्षे',
    experienceEn: '8 Years',
    contact: '+91 98765 43213',
    rating: 4.9,
    services: ['साड्या शिवणे', 'पुरुषांचे कपडे', 'स्कूल युनिफॉर्म'],
    servicesEn: ['Saree stitching', 'Men\'s clothing', 'School uniforms'],
    order: 1,
    isActive: true
  },
  {
    id: 'talent-3',
    name: 'विजय कांबळे',
    nameEn: 'Vijay Kambale',
    skill: 'राजमिस्त्री',
    skillEn: 'Mason',
    experience: '15 वर्षे',
    experienceEn: '15 Years',
    contact: '+91 98765 43214',
    rating: 4.7,
    services: ['घर बांधकाम', 'दुरुस्ती काम', 'टाइल्स लावणे'],
    servicesEn: ['House construction', 'Repair work', 'Tile laying'],
    order: 2,
    isActive: true
  }
];

export const employmentContactInfoDemoData: EmploymentContactInfoData[] = [
  {
    id: 'contact-general',
    section: 'general',
    officeName: 'ग्रामपंचायत कार्यालय',
    officeNameEn: 'Gram Panchayat Office',
    phone: '+91 12345 67890',
    email: 'jobs@grampanchayat.com',
    address: 'ग्रामपंचायत कार्यालय, गाव',
    addressEn: 'Gram Panchayat Office, Village',
    isActive: true
  },
  {
    id: 'contact-employment',
    section: 'jobs',
    officeName: 'रोजगार केंद्र',
    officeNameEn: 'Employment Center',
    phone: '+91 12345 67891',
    email: 'employment@grampanchayat.com',
    address: 'रोजगार केंद्र, ग्रामपंचायत कार्यालय',
    addressEn: 'Employment Center, Gram Panchayat Office',
    isActive: true
  }
];

