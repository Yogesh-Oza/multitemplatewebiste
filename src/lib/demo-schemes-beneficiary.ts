export interface ApplicationStep {
  step: number;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  color: string;
  bgColor: string;
}

export interface RequiredDocument {
  name: string;
  nameEn: string;
  required: boolean;
  description: string;
  descriptionEn: string;
}

export interface ApplicationProcessConfigData {
  id?: string;
  steps: ApplicationStep[];
  requiredDocuments: RequiredDocument[];
  applicationFormUrl?: string;
  sampleFormUrl?: string;
  isActive?: boolean;
}

export interface BeneficiaryStoryData {
  id?: string;
  name: string;
  nameEn: string;
  age: number;
  scheme: string;
  schemeEn: string;
  story: string;
  storyEn: string;
  impact: string;
  impactEn: string;
  beforeImage: string;
  afterImage: string;
  location: string;
  locationEn: string;
  date: string;
  benefits: string[];
  rating: number;
  isStar: boolean;
  order: number;
  isActive: boolean;
}

export interface WardScheme {
  name: string;
  nameEn: string;
  beneficiaries: number;
  color: string;
}

export interface WardCoverageDataData {
  id?: string;
  wardNumber: string;
  wardName: string;
  wardNameEn: string;
  totalHouseholds: number;
  beneficiaries: number;
  coveragePercentage: number;
  schemes: WardScheme[];
  lastUpdated: string;
  order: number;
  isActive: boolean;
}

export const applicationProcessDemoConfig: ApplicationProcessConfigData = {
  steps: [
    {
      step: 1,
      title: 'पात्रता तपासणी',
      titleEn: 'Eligibility Check',
      description: 'योजनेच्या पात्रता निकषांची तपासणी करा',
      descriptionEn: 'Check the eligibility criteria for the scheme',
      icon: 'CheckCircle',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      step: 2,
      title: 'कागदपत्रे तयार करा',
      titleEn: 'Prepare Documents',
      description: 'सर्व आवश्यक कागदपत्रे तयार करा',
      descriptionEn: 'Prepare all required documents',
      icon: 'FileText',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      step: 3,
      title: 'अर्ज भरा',
      titleEn: 'Fill Application',
      description: 'ऑनलाइन किंवा ऑफलाइन अर्ज भरा',
      descriptionEn: 'Fill online or offline application',
      icon: 'User',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      step: 4,
      title: 'सबमिट करा',
      titleEn: 'Submit Application',
      description: 'अर्ज सबमिट करा आणि रसीद घ्या',
      descriptionEn: 'Submit application and get receipt',
      icon: 'ArrowRight',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      step: 5,
      title: 'अनुवीक्षण',
      titleEn: 'Monitoring',
      description: 'अर्जाची स्थिती तपासत रहा',
      descriptionEn: 'Keep checking application status',
      icon: 'Clock',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    }
  ],
  requiredDocuments: [
    {
      name: 'आधार कार्ड',
      nameEn: 'Aadhaar Card',
      required: true,
      description: 'वैध आधार कार्डची प्रत',
      descriptionEn: 'Valid Aadhaar card copy'
    },
    {
      name: 'पैन कार्ड',
      nameEn: 'PAN Card',
      required: true,
      description: 'पैन कार्डची प्रत',
      descriptionEn: 'PAN card copy'
    },
    {
      name: 'राहण्याचा पुरावा',
      nameEn: 'Address Proof',
      required: true,
      description: 'राहण्याचा पुरावा (वीज बिल, पाणी बिल)',
      descriptionEn: 'Address proof (electricity bill, water bill)'
    },
    {
      name: 'जातीचा दाखला',
      nameEn: 'Caste Certificate',
      required: false,
      description: 'जर लागू असेल तर जातीचा दाखला',
      descriptionEn: 'Caste certificate if applicable'
    },
    {
      name: 'आय प्रमाणपत्र',
      nameEn: 'Income Certificate',
      required: true,
      description: 'तहसीलदार कार्यालयातून घेतलेले आय प्रमाणपत्र',
      descriptionEn: 'Income certificate from Tehsildar office'
    },
    {
      name: 'फोटो',
      nameEn: 'Photograph',
      required: true,
      description: '२ पासपोर्ट साइज फोटो',
      descriptionEn: '2 passport size photographs'
    }
  ],
  applicationFormUrl: '',
  sampleFormUrl: '',
  isActive: true
};

export const beneficiaryStoriesDemoData: BeneficiaryStoryData[] = [
  {
    id: 'story-1',
    name: 'सुनीता देवी',
    nameEn: 'Sunita Devi',
    age: 35,
    scheme: 'मनरेगा योजना',
    schemeEn: 'MGNREGA Scheme',
    story: 'मनरेगा योजनेमुळे माझे जीवन पूर्णपणे बदलले. मी आता स्वतंत्रपणे माझ्या कुटुंबाचा पोसणा करू शकते. या योजनेने मला आत्मविश्वास दिला आणि माझ्या मुलांच्या शिक्षणासाठी पैसे जमा करणे शक्य झाले.',
    storyEn: 'MGNREGA scheme completely changed my life. I can now independently support my family. This scheme gave me confidence and made it possible to save money for my children\'s education.',
    impact: 'मासिक उत्पन्न ८००० रुपये वाढले, मुलांच्या शिक्षणासाठी पैसे जमा केले',
    impactEn: 'Monthly income increased by Rs. 8000, saved money for children\'s education',
    beforeImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=face',
    afterImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
    location: 'वॉर्ड क्र. १, ग्रामपंचायत',
    locationEn: 'Ward No. 1, Gram Panchayat',
    date: '2024-01-15',
    benefits: ['नियमित रोजगार', 'सामाजिक सुरक्षा', 'आत्मविश्वास वाढ'],
    rating: 5,
    isStar: true,
    order: 0,
    isActive: true
  },
  {
    id: 'story-2',
    name: 'रामदास पाटील',
    nameEn: 'Ramdas Patil',
    age: 42,
    scheme: 'पीएम आवास योजना',
    schemeEn: 'PM Awas Yojana',
    story: 'पीएम आवास योजनेमुळे मला स्वतःचे घर मिळाले. २० वर्षे किराय्याच्या घरात राहिल्यानंतर आता माझे स्वतःचे घर आहे. माझ्या कुटुंबाला सुरक्षित वातावरण मिळाले.',
    storyEn: 'PM Awas Yojana gave me my own house. After living in rented house for 20 years, now I have my own house. My family got a secure environment.',
    impact: 'स्वतःचे घर मिळाले, किराया बचत १५००० रुपये/महिना',
    impactEn: 'Got own house, rent saving Rs. 15000/month',
    beforeImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face',
    afterImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face',
    location: 'वॉर्ड क्र. ३, ग्रामपंचायत',
    locationEn: 'Ward No. 3, Gram Panchayat',
    date: '2024-02-20',
    benefits: ['स्वतःचे घर', 'किराया बचत', 'कुटुंब सुरक्षा'],
    rating: 5,
    isStar: true,
    order: 1,
    isActive: true
  },
  {
    id: 'story-3',
    name: 'कविता शिंदे',
    nameEn: 'Kavita Shinde',
    age: 28,
    scheme: 'स्वयं सहायता गट योजना',
    schemeEn: 'Self Help Group Scheme',
    story: 'स्वयं सहायता गटामुळे मी छोटे व्यवसाय सुरू करू शकले. मी आता माझ्या गावात छोटे किराणा दुकान चालवते. या योजनेने मला आर्थिक स्वातंत्र्य मिळाले.',
    storyEn: 'Self Help Group helped me start a small business. I now run a small grocery store in my village. This scheme gave me financial independence.',
    impact: 'छोटे व्यवसाय सुरू केले, मासिक नफा १२००० रुपये',
    impactEn: 'Started small business, monthly profit Rs. 12000',
    beforeImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=300&fit=crop&crop=face',
    afterImage: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop&crop=face',
    location: 'वॉर्ड क्र. २, ग्रामपंचायत',
    locationEn: 'Ward No. 2, Gram Panchayat',
    date: '2024-03-10',
    benefits: ['व्यवसाय सुरुवात', 'आर्थिक स्वातंत्र्य', 'सामाजिक स्थान'],
    rating: 5,
    isStar: true,
    order: 2,
    isActive: true
  }
];

export const wardCoverageDemoData: WardCoverageDataData[] = [
  {
    id: 'ward-1',
    wardNumber: '1',
    wardName: 'वॉर्ड क्र. १',
    wardNameEn: 'Ward No. 1',
    totalHouseholds: 150,
    beneficiaries: 120,
    coveragePercentage: 80,
    schemes: [
      { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 45, color: 'bg-blue-500' },
      { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 30, color: 'bg-green-500' },
      { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 25, color: 'bg-purple-500' },
      { name: 'इतर', nameEn: 'Others', beneficiaries: 20, color: 'bg-orange-500' }
    ],
    lastUpdated: '2024-01-15',
    order: 0,
    isActive: true
  },
  {
    id: 'ward-2',
    wardNumber: '2',
    wardName: 'वॉर्ड क्र. २',
    wardNameEn: 'Ward No. 2',
    totalHouseholds: 180,
    beneficiaries: 135,
    coveragePercentage: 75,
    schemes: [
      { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 50, color: 'bg-blue-500' },
      { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 35, color: 'bg-green-500' },
      { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 30, color: 'bg-purple-500' },
      { name: 'इतर', nameEn: 'Others', beneficiaries: 20, color: 'bg-orange-500' }
    ],
    lastUpdated: '2024-01-15',
    order: 1,
    isActive: true
  },
  {
    id: 'ward-3',
    wardNumber: '3',
    wardName: 'वॉर्ड क्र. ३',
    wardNameEn: 'Ward No. 3',
    totalHouseholds: 200,
    beneficiaries: 160,
    coveragePercentage: 80,
    schemes: [
      { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 60, color: 'bg-blue-500' },
      { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 40, color: 'bg-green-500' },
      { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 35, color: 'bg-purple-500' },
      { name: 'इतर', nameEn: 'Others', beneficiaries: 25, color: 'bg-orange-500' }
    ],
    lastUpdated: '2024-01-15',
    order: 2,
    isActive: true
  },
  {
    id: 'ward-4',
    wardNumber: '4',
    wardName: 'वॉर्ड क्र. ४',
    wardNameEn: 'Ward No. 4',
    totalHouseholds: 120,
    beneficiaries: 90,
    coveragePercentage: 75,
    schemes: [
      { name: 'मनरेगा', nameEn: 'MGNREGA', beneficiaries: 35, color: 'bg-blue-500' },
      { name: 'पीएम आवास', nameEn: 'PM Awas', beneficiaries: 25, color: 'bg-green-500' },
      { name: 'स्वयं सहायता', nameEn: 'Self Help', beneficiaries: 20, color: 'bg-purple-500' },
      { name: 'इतर', nameEn: 'Others', beneficiaries: 10, color: 'bg-orange-500' }
    ],
    lastUpdated: '2024-01-15',
    order: 3,
    isActive: true
  }
];

