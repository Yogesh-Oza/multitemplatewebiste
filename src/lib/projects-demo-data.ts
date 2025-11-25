import { DEFAULT_SANKALP_ITEMS, SankalpTrackerItem } from './sankalp-defaults';

// Impact Dashboard Metrics Demo Data
export interface DemoImpactMetric {
  id: string;
  title: string;
  titleEn: string;
  value: number;
  target: number;
  unit: string;
  unitEn: string;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getDemoImpactMetrics(): DemoImpactMetric[] {
  return [
    {
      id: 'demo-metric-1',
      title: 'एकूण प्रकल्प',
      titleEn: 'Total Projects',
      value: 6,
      target: 20,
      unit: 'प्रकल्प',
      unitEn: 'Projects',
      color: 'blue',
      icon: 'Target',
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-metric-2',
      title: 'पूर्ण प्रकल्प',
      titleEn: 'Completed Projects',
      value: 3,
      target: 15,
      unit: 'प्रकल्प',
      unitEn: 'Projects',
      color: 'green',
      icon: 'CheckCircle',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-metric-3',
      title: 'एकूण खर्च',
      titleEn: 'Total Expenditure',
      value: 10000000,
      target: 5000000,
      unit: '₹',
      unitEn: '₹',
      color: 'purple',
      icon: 'DollarSign',
      order: 2,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-metric-4',
      title: 'लाभार्थी',
      titleEn: 'Beneficiaries',
      value: 1250,
      target: 2000,
      unit: 'लोक',
      unitEn: 'People',
      color: 'orange',
      icon: 'Users',
      order: 3,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

// Before/After Gallery Demo Data
export interface DemoBeforeAfterItem {
  id: string;
  title: string;
  titleEn: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  descriptionEn: string;
  impact: string;
  impactEn: string;
  year: string;
  cost: string;
  category: string;
  categoryEn: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export function getDemoBeforeAfterItems(): DemoBeforeAfterItem[] {
  return [
    {
      id: 'demo-gallery-1',
      title: 'रस्ते दुरुस्ती प्रकल्प',
      titleEn: 'Road Repair Project',
      beforeImage: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
      afterImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop&crop=center',
      description: 'गावातील मुख्य रस्त्यांची दुरुस्ती आणि सुधारणा',
      descriptionEn: 'Repair and improvement of main roads in the village',
      impact: 'रस्ते सुधारले, वाहतूक सुगम झाली, दुर्घटना कमी झाल्या',
      impactEn: 'Roads improved, traffic became smoother, accidents reduced',
      year: '२०२३',
      cost: '₹२५ लाख',
      category: 'पायाभूत सुविधा',
      categoryEn: 'Infrastructure',
      order: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'demo-gallery-2',
      title: 'स्वच्छता सुविधा',
      titleEn: 'Sanitation Facilities',
      beforeImage: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=600&h=400&fit=crop&crop=center',
      afterImage: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&crop=center',
      description: 'स्वच्छतागृहांची स्थापना आणि देखभाल',
      descriptionEn: 'Installation and maintenance of toilets',
      impact: 'स्वच्छता सुविधा वाढल्या',
      impactEn: 'Sanitation facilities increased',
      year: '२०२३',
      cost: '₹१५ लाख',
      category: 'स्वच्छता',
      categoryEn: 'Sanitation',
      order: 1,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}

// Projects Demo Data
export interface DemoProject {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  category: string;
  categoryEn: string;
  startDate: string;
  endDate?: string;
  budget?: number;
  isFeatured: boolean;
  impactMetrics: Array<{ label: string; value: string | number }>;
  photosBefore?: string[];
  photosAfter?: string[];
  image?: string;
  order?: number;
}

export function getDemoProjects(): DemoProject[] {
  return [
    {
      id: 'demo-project-1',
      title: 'पाणी पुरवठा योजना',
      titleEn: 'Water Supply Project',
      description: 'गावातील सर्व भागांमध्ये २४ तास पाणी पुरवठा सुनिश्चित करण्यासाठी आधुनिक पंपिंग सिस्टम स्थापना पूर्ण झाली.',
      descriptionEn: 'Modern pumping system installation completed to ensure 24-hour water supply in all areas of the village.',
      status: 'completed',
      category: 'पायाभूत सुविधा',
      categoryEn: 'Infrastructure',
      startDate: '2024-01-15',
      endDate: '2024-03-23',
      budget: 2500000,
      isFeatured: true,
      impactMetrics: [
        { label: 'लाभार्थी', value: '1200' },
        { label: 'कव्हरेज', value: '100%' },
        { label: 'कामगिरी', value: '95%' },
        { label: 'समाधान', value: '98%' }
      ],
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&crop=center',
      order: 0
    },
    {
      id: 'demo-project-2',
      title: 'शिक्षण क्षेत्रात राज्यस्तरीय पुरस्कार',
      titleEn: 'State Level Award in Education',
      description: 'आमच्या गावातील प्राथमिक शाळेला डिजिटल शिक्षणातील उत्कृष्ट कामगिरीसाठी राज्य सरकारकडून सन्मान मिळाला.',
      descriptionEn: 'Our village primary school received recognition from the state government for excellent performance in digital education.',
      status: 'completed',
      category: 'शिक्षण',
      categoryEn: 'Education',
      startDate: '2024-01-01',
      endDate: '2024-02-15',
      budget: 500000,
      isFeatured: true,
      impactMetrics: [
        { label: 'विद्यार्थी', value: '450' },
        { label: 'शिक्षक', value: '12' },
        { label: 'सुविधा', value: '100%' },
        { label: 'गुणवत्ता', value: 'A+' }
      ],
      image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop&crop=center',
      order: 1
    },
    {
      id: 'demo-project-3',
      title: 'स्वच्छता अभियान मोठे यश',
      titleEn: 'Sanitation Campaign Great Success',
      description: 'गावव्यापी स्वच्छता अभियानात ९८% कुटुंबांनी सहभाग घेतला आणि गावाला \'स्वच्छ गाव\' चा दर्जा मिळाला.',
      descriptionEn: '98% of families participated in the village-wide sanitation campaign and the village received \'Clean Village\' status.',
      status: 'completed',
      category: 'स्वच्छता',
      categoryEn: 'Sanitation',
      startDate: '2024-01-08',
      endDate: '2024-01-31',
      budget: 800000,
      isFeatured: false,
      impactMetrics: [
        { label: 'सहभाग', value: '98%' },
        { label: 'स्वच्छतागृहे', value: '95%' },
        { label: 'दर्जा', value: 'A+' },
        { label: 'प्रगती', value: '100%' }
      ],
      image: 'https://images.unsplash.com/photo-1581578731548-c6a0c3f2f2c0?w=600&h=400&fit=crop&crop=center',
      order: 2
    },
    {
      id: 'demo-project-4',
      title: 'डिजिटल साक्षरता मोहीम',
      titleEn: 'Digital Literacy Campaign',
      description: 'गावातील सर्व नागरिकांना डिजिटल साक्षरता प्रदान करण्यासाठी व्यापक मोहीम सुरू केली.',
      descriptionEn: 'Comprehensive campaign launched to provide digital literacy to all citizens of the village.',
      status: 'ongoing',
      category: 'शिक्षण',
      categoryEn: 'Education',
      startDate: '2024-02-01',
      endDate: '2024-06-30',
      budget: 1200000,
      isFeatured: false,
      impactMetrics: [
        { label: 'प्रशिक्षित', value: '650' },
        { label: 'लक्ष्य', value: '1000' },
        { label: 'प्रगती', value: '65%' },
        { label: 'केंद्रे', value: '5' }
      ],
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop&crop=center',
      order: 3
    },
    {
      id: 'demo-project-5',
      title: 'सौर ऊर्जा योजना',
      titleEn: 'Solar Energy Project',
      description: 'गावातील सार्वजनिक इमारतींवर सौर पॅनेल स्थापित करून नवीकरणीय ऊर्जा वापर सुरू केला.',
      descriptionEn: 'Solar panels installed on public buildings in the village to start using renewable energy.',
      status: 'ongoing',
      category: 'ऊर्जा',
      categoryEn: 'Energy',
      startDate: '2024-03-01',
      endDate: '2024-08-31',
      budget: 3000000,
      isFeatured: true,
      impactMetrics: [
        { label: 'पॅनेल', value: '50' },
        { label: 'ऊर्जा', value: '25kW' },
        { label: 'बचत', value: '40%' },
        { label: 'प्रगती', value: '60%' }
      ],
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&crop=center',
      order: 4
    },
    {
      id: 'demo-project-6',
      title: 'युवक कौशल्य विकास केंद्र',
      titleEn: 'Youth Skill Development Center',
      description: 'युवकांसाठी कौशल्य विकास केंद्र स्थापन करून रोजगार संधी निर्माण केल्या.',
      descriptionEn: 'Skill development center established for youth to create employment opportunities.',
      status: 'upcoming',
      category: 'रोजगार',
      categoryEn: 'Employment',
      startDate: '2024-07-01',
      endDate: '2024-12-31',
      budget: 2000000,
      isFeatured: false,
      impactMetrics: [
        { label: 'लक्ष्य', value: '200' },
        { label: 'कोर्सेस', value: '8' },
        { label: 'प्रशिक्षक', value: '6' },
        { label: 'प्रगती', value: '0%' }
      ],
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop&crop=center',
      order: 5
    }
  ];
}

// Sankalp Items Demo Data (reuse existing)
export function getDemoSankalpItems(): SankalpTrackerItem[] {
  return DEFAULT_SANKALP_ITEMS;
}

