export const NAVIGATION_ITEMS = [
  { href: '/', label: 'मुख्यपृष्ठ', labelEn: 'Home' },
  { href: '/about', label: 'ग्रामपंचायतीबद्दल', labelEn: 'About Gram Panchayat' },
  { href: '/history', label: 'आमचे गाव – ओळख आणि संस्कृती', labelEn: 'Our Village – Identity & Culture' },
  { href: '/projects', label: 'प्रमुख प्रकल्प आणि उपक्रम', labelEn: 'Key Projects & Initiatives' },
  { href: '/gr', label: 'शासकीय ठराव', labelEn: 'Government Resolutions' },
  { href: '/citizen-services', label: 'नागरिक सेवा आणि फॉर्म्स', labelEn: 'Citizen Services & Forms' },
  { href: '/jobs', label: 'रोजगार आणि कौशल्य विकास', labelEn: 'Employment & Skill Development' },
  { href: '/education', label: 'शिक्षण आणि युवक कोपरा', labelEn: 'Education & Youth Corner' },
  { href: '/environment', label: 'पर्यावरण आणि शाश्वत विकास', labelEn: 'Environment & Sustainability' },
  { href: '/programs', label: 'कार्यक्रम', labelEn: 'Programs' },
  { href: '/gallery', label: 'गॅलरी आणि मीडिया', labelEn: 'Gallery & Media' },
  { href: '/jama-kharch', label: 'अर्थसंकल्प आणि पारदर्शकता', labelEn: 'Finance & Budget Transparency' },
  { href: '/announcements', label: 'घोषणा आणि परिपत्रके', labelEn: 'Announcements & Circulars' },
  { href: '/gov-programs', label: 'योजना आणि लाभार्थी माहिती', labelEn: 'Schemes & Beneficiary Information' },
  { href: '/departments', label: 'विभाग', labelEn: 'Departments' },
  { href: '/amenities', label: 'ग्राम पायाभूत सुविधा आणि सुविधा', labelEn: 'Village Infrastructure & Facilities' },
  { href: '/feedback', label: 'तक्रार निवारण आणि फीडबॅक', labelEn: 'Grievance Redressal & Feedback' },
  { href: '/dashboard', label: 'डॅशबोर्ड – माझे गाव, माझी प्रगती', labelEn: 'Dashboard – My Village, My Progress' },
  { href: '/sitemap', label: 'साइटमॅप', labelEn: 'Sitemap' },
  { href: '/contact', label: 'संपर्क आणि सहकार्य', labelEn: 'Contact & Collaboration' },
] as const;

export const NEW_NAVIGATION_ITEMS = [
  { href: '/projects', label: 'प्रकल्प', labelEn: 'Projects' },
  { href: '/gr', label: 'शासकीय ठराव', labelEn: 'Government Resolutions' },
  { href: '/feedback', label: 'फीडबॅक', labelEn: 'Feedback' },
  { href: '/dashboard', label: 'डॅशबोर्ड', labelEn: 'Dashboard' },
  { href: '/sitemap', label: 'साइटमॅप', labelEn: 'Sitemap' },
] as const;

export const VILLAGE_STATS = [
  { value: '227', label: 'कुटुंबे', labelEn: 'Families', icon: '👨‍👩‍👧‍👦' },
  { value: '1958', label: 'लोकसंख्या', labelEn: 'Population', icon: '👥' },
  { value: '1', label: 'ग्रामपंचायत', labelEn: 'Gram Panchayat', icon: '🏛️' },
  { value: '654.40', label: 'क्षेत्रफळ (हेक्टर)', labelEn: 'Area (Hectares)', icon: '🌾' },
] as const;

export const HERO_IMAGES = [
  '/images/hero-1.jpg',
  '/images/hero-2.jpg',
  '/images/hero-3.jpg',
  '/images/hero-4.jpg',
  '/images/hero-5.jpg',
] as const;

export const HISTORY_CARDS = [
  {
    title: 'ग्रामाचा इतिहास',
    titleEn: 'Village History',
    description: 'आमच्या गावाचा समृद्ध इतिहास आणि परंपरा',
    descriptionEn: 'Rich history and traditions of our village',
    gradient: 'from-amber-500 to-orange-600',
    icon: 'BookOpen',
  },
  {
    title: 'सांस्कृतिक वारसा',
    titleEn: 'Cultural Heritage',
    description: 'सांस्कृतिक उत्सव आणि परंपरागत कला',
    descriptionEn: 'Cultural festivals and traditional arts',
    gradient: 'from-emerald-500 to-teal-600',
    icon: 'Palette',
  },
  {
    title: 'सामाजिक विकास',
    titleEn: 'Social Development',
    description: 'गावाच्या सामाजिक प्रगतीचा प्रवास',
    descriptionEn: 'Journey of social progress in the village',
    gradient: 'from-blue-500 to-indigo-600',
    icon: 'TrendingUp',
  },
] as const;
