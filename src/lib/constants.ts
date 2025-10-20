export const NAVIGATION_ITEMS = [
  { href: '/', label: 'मुख्यपृष्ठ', labelEn: 'Home' },
  { href: '/about', label: 'आमच्याबद्दल', labelEn: 'About Us' },
  { href: '/history', label: 'इतिहास', labelEn: 'History' },
  { href: '/programs', label: 'कार्यक्रम', labelEn: 'Programs' },
  { href: '/gallery', label: 'गॅलरी', labelEn: 'Gallery' },
  { href: '/jama-kharch', label: 'जमा-खर्च', labelEn: 'Income-Expenditure' },
  { href: '/announcements', label: 'सूचना', labelEn: 'Announcements' },
  { href: '/gov-programs', label: 'शासकीय योजना', labelEn: 'Government Schemes' },
  { href: '/departments', label: 'विभाग', labelEn: 'Departments' },
  { href: '/amenities', label: 'सोई-सुविधा', labelEn: 'Amenities' },
  { href: '/contact', label: 'संपर्क', labelEn: 'Contact' },
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
