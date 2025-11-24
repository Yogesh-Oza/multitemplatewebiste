export interface EnvironmentalMetricData {
  id?: string;
  metric: string;
  metricEn: string;
  description: string;
  descriptionEn: string;
  current: number;
  target: number;
  unit: string;
  unitEn: string;
  progress: number;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

export interface GreenInitiativeData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  status: string;
  statusEn: string;
  category: string;
  categoryEn: string;
  treesPlanted: number;
  target: number;
  participants: number;
  startDate: string;
  endDate: string;
  impact: string;
  impactEn: string;
  order: number;
  isActive: boolean;
}

export interface WasteManagementProgramData {
  id?: string;
  type: string;
  typeEn: string;
  description: string;
  descriptionEn: string;
  households: number;
  totalHouseholds: number;
  percentage: number;
  status: string;
  statusEn: string;
  benefits: string[];
  benefitsEn: string[];
  order: number;
  isActive: boolean;
}

export interface WaterConservationProjectData {
  id?: string;
  project: string;
  projectEn: string;
  description: string;
  descriptionEn: string;
  capacity: string;
  capacityEn: string;
  locations: number;
  status: string;
  statusEn: string;
  impact: string;
  impactEn: string;
  order: number;
  isActive: boolean;
}

export interface AdoptedTreeData {
  id?: string;
  treeName: string;
  treeNameEn: string;
  location: string;
  locationEn: string;
  adoptedBy: string;
  adoptedByEn: string;
  plantedDate: string;
  status: string;
  statusEn: string;
  height: string;
  heightEn: string;
  sponsor: string;
  careInstructions: string;
  careInstructionsEn?: string;
  imageUrl?: string;
  order: number;
  isActive: boolean;
}

export interface EnvironmentEventData {
  id?: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  date: string;
  time: string;
  location: string;
  locationEn: string;
  participants: number;
  type: string;
  typeEn: string;
  order: number;
  isActive: boolean;
}

export interface EnvironmentContactInfoData {
  id?: string;
  section: string; // environment, green
  officeName: string;
  officeNameEn: string;
  phone: string;
  email?: string;
  isActive: boolean;
}

export const environmentalMetricsDemoData: EnvironmentalMetricData[] = [
  {
    id: 'metric-1',
    metric: 'वृक्षसंख्या',
    metricEn: 'Tree Count',
    description: 'गावातील एकूण वृक्षसंख्या',
    descriptionEn: 'Total number of trees in the village',
    current: 1250,
    target: 2000,
    unit: 'झाडे',
    unitEn: 'Trees',
    progress: 62.5,
    color: 'green',
    icon: 'TreePine',
    order: 0,
    isActive: true
  },
  {
    id: 'metric-2',
    metric: 'स्वच्छता टक्केवारी',
    metricEn: 'Sanitation Percentage',
    description: 'स्वच्छतागृह कव्हरेज',
    descriptionEn: 'Toilet coverage percentage',
    current: 85,
    target: 100,
    unit: '%',
    unitEn: '%',
    progress: 85,
    color: 'blue',
    icon: 'Shield',
    order: 1,
    isActive: true
  },
  {
    id: 'metric-3',
    metric: 'कचरा वर्गीकरण',
    metricEn: 'Waste Segregation',
    description: 'घरांमध्ये कचरा वर्गीकरण',
    descriptionEn: 'Waste segregation in households',
    current: 90,
    target: 100,
    unit: '%',
    unitEn: '%',
    progress: 90,
    color: 'purple',
    icon: 'Recycle',
    order: 2,
    isActive: true
  },
  {
    id: 'metric-4',
    metric: 'सौर ऊर्जा वापर',
    metricEn: 'Solar Energy Usage',
    description: 'सौर ऊर्जा वापर टक्केवारी',
    descriptionEn: 'Percentage of solar energy usage',
    current: 35,
    target: 80,
    unit: '%',
    unitEn: '%',
    progress: 43.75,
    color: 'yellow',
    icon: 'Sun',
    order: 3,
    isActive: true
  }
];

export const greenInitiativesDemoData: GreenInitiativeData[] = [
  {
    id: 'initiative-1',
    title: 'वृक्षारोपण मोहीम',
    titleEn: 'Tree Plantation Campaign',
    description: 'गावातील सर्व जागी वृक्षारोपण करून हरित क्षेत्र वाढवणे',
    descriptionEn: 'Increasing green cover by planting trees throughout the village',
    status: 'चालू',
    statusEn: 'Ongoing',
    category: 'वृक्षारोपण',
    categoryEn: 'Tree Plantation',
    treesPlanted: 250,
    target: 500,
    participants: 45,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    impact: 'वायु प्रदूषण 15% कमी',
    impactEn: '15% reduction in air pollution',
    order: 0,
    isActive: true
  },
  {
    id: 'initiative-2',
    title: 'प्लास्टिक-मुक्त अभियान',
    titleEn: 'Plastic-Free Campaign',
    description: 'प्लास्टिक वापर कमी करून पर्यावरणाचे संरक्षण',
    descriptionEn: 'Protecting environment by reducing plastic usage',
    status: 'पूर्ण',
    statusEn: 'Completed',
    category: 'कचरा व्यवस्थापन',
    categoryEn: 'Waste Management',
    treesPlanted: 0,
    target: 0,
    participants: 120,
    startDate: '2023-06-01',
    endDate: '2023-12-31',
    impact: 'प्लास्टिक वापर 80% कमी',
    impactEn: '80% reduction in plastic usage',
    order: 1,
    isActive: true
  },
  {
    id: 'initiative-3',
    title: 'सौर ऊर्जा योजना',
    titleEn: 'Solar Energy Scheme',
    description: 'सौर ऊर्जा वापरून नवीकरणीय ऊर्जेचा वापर',
    descriptionEn: 'Using renewable energy through solar power',
    status: 'चालू',
    statusEn: 'Ongoing',
    category: 'ऊर्जा संवर्धन',
    categoryEn: 'Energy Conservation',
    treesPlanted: 0,
    target: 0,
    participants: 30,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    impact: 'वीज बिल 40% कमी',
    impactEn: '40% reduction in electricity bill',
    order: 2,
    isActive: true
  }
];

export const wasteManagementProgramsDemoData: WasteManagementProgramData[] = [
  {
    id: 'waste-1',
    type: 'कचरा वर्गीकरण',
    typeEn: 'Waste Segregation',
    description: 'घराघरात कचरा वर्गीकरणाची सुरुवात',
    descriptionEn: 'Starting waste segregation at household level',
    households: 180,
    totalHouseholds: 200,
    percentage: 90,
    status: 'यशस्वी',
    statusEn: 'Successful',
    benefits: ['पुनर्वापर वाढला', 'कचरा कमी झाला', 'पर्यावरण स्वच्छ'],
    benefitsEn: ['Recycling increased', 'Waste reduced', 'Environment cleaner'],
    order: 0,
    isActive: true
  },
  {
    id: 'waste-2',
    type: 'कंपोस्ट उत्पादन',
    typeEn: 'Compost Production',
    description: 'घरगुती कचऱ्यापासून कंपोस्ट तयार करणे',
    descriptionEn: 'Producing compost from household waste',
    households: 150,
    totalHouseholds: 200,
    percentage: 75,
    status: 'चालू',
    statusEn: 'Ongoing',
    benefits: ['खताची गरज कमी', 'माती सुधारली', 'कचरा कमी'],
    benefitsEn: ['Less need for fertilizer', 'Soil improved', 'Waste reduced'],
    order: 1,
    isActive: true
  }
];

export const waterConservationProjectsDemoData: WaterConservationProjectData[] = [
  {
    id: 'water-1',
    project: 'पावसाचे पाणी साठवण',
    projectEn: 'Rainwater Harvesting',
    description: 'पावसाचे पाणी साठवून भूजल पुनर्भरण',
    descriptionEn: 'Groundwater recharge through rainwater harvesting',
    capacity: '50,000 लिटर',
    capacityEn: '50,000 Liters',
    locations: 5,
    status: 'पूर्ण',
    statusEn: 'Completed',
    impact: 'भूजल स्तर 2 मीटर वाढला',
    impactEn: 'Groundwater level increased by 2 meters',
    order: 0,
    isActive: true
  },
  {
    id: 'water-2',
    project: 'नळजोडणी सुधारणा',
    projectEn: 'Water Supply Improvement',
    description: 'पाणीपुरवठा व्यवस्था सुधारणे आणि गळती थांबवणे',
    descriptionEn: 'Improving water supply system and stopping leaks',
    capacity: '100% कव्हरेज',
    capacityEn: '100% Coverage',
    locations: 1,
    status: 'चालू',
    statusEn: 'Ongoing',
    impact: 'पाणी गळती 60% कमी',
    impactEn: '60% reduction in water leakage',
    order: 1,
    isActive: true
  }
];

export const adoptedTreesDemoData: AdoptedTreeData[] = [
  {
    id: 'tree-1',
    treeName: 'नीम',
    treeNameEn: 'Neem',
    location: 'गाव मध्यभागी',
    locationEn: 'Village Center',
    adoptedBy: 'राम पाटील',
    adoptedByEn: 'Ram Patil',
    plantedDate: '2024-01-15',
    status: 'वाढत आहे',
    statusEn: 'Growing',
    height: '2.5 फूट',
    heightEn: '2.5 Feet',
    sponsor: '₹500',
    careInstructions: 'दररोज पाणी द्या, महिन्यातून एकदा खत द्या',
    careInstructionsEn: 'Water daily, fertilize once a month',
    order: 0,
    isActive: true
  },
  {
    id: 'tree-2',
    treeName: 'आंबा',
    treeNameEn: 'Mango',
    location: 'शाळेजवळ',
    locationEn: 'Near School',
    adoptedBy: 'प्रिया शिंदे',
    adoptedByEn: 'Priya Shinde',
    plantedDate: '2024-01-20',
    status: 'वाढत आहे',
    statusEn: 'Growing',
    height: '3.2 फूट',
    heightEn: '3.2 Feet',
    sponsor: '₹800',
    careInstructions: 'दररोज पाणी द्या, तोडणी करा, कीटकनाशक वापरा',
    careInstructionsEn: 'Water daily, prune regularly, use pesticides',
    order: 1,
    isActive: true
  }
];

export const environmentEventsDemoData: EnvironmentEventData[] = [
  {
    id: 'event-1',
    title: 'विश्व पर्यावरण दिन',
    titleEn: 'World Environment Day',
    description: 'पर्यावरण संवर्धनावर व्याख्यान आणि वृक्षारोपण',
    descriptionEn: 'Lecture on environmental conservation and tree plantation',
    date: '2024-06-05',
    time: '9:00 AM',
    location: 'ग्रामपंचायत कार्यालय',
    locationEn: 'Gram Panchayat Office',
    participants: 50,
    type: 'कार्यक्रम',
    typeEn: 'Event',
    order: 0,
    isActive: true
  },
  {
    id: 'event-2',
    title: 'स्वच्छता अभियान',
    titleEn: 'Cleanliness Campaign',
    description: 'गावातील सर्व जागी स्वच्छता करणे',
    descriptionEn: 'Cleaning all areas of the village',
    date: '2024-02-15',
    time: '7:00 AM',
    location: 'गाव सर्वत्र',
    locationEn: 'Throughout Village',
    participants: 100,
    type: 'अभियान',
    typeEn: 'Campaign',
    order: 1,
    isActive: true
  }
];

export const environmentContactInfoDemoData: EnvironmentContactInfoData[] = [
  {
    id: 'contact-environment',
    section: 'environment',
    officeName: 'पर्यावरण विभाग',
    officeNameEn: 'Environment Department',
    phone: '+91 12345 67890',
    email: 'environment@grampanchayat.com',
    isActive: true
  },
  {
    id: 'contact-green',
    section: 'green',
    officeName: 'हरित कार्यक्रम समन्वयक',
    officeNameEn: 'Green Program Coordinator',
    phone: '+91 12345 67891',
    email: 'green@grampanchayat.com',
    isActive: true
  }
];

