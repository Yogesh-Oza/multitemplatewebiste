'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  History, 
  Megaphone, 
  Image, 
  Settings,
  FileText,
  Globe,
  Calendar,
  Camera,
  DollarSign,
  Building,
  Wrench,
  Phone,
  BookOpen,
  Layout,
  FolderOpen,
  MessageSquare,
  BarChart3,
  Search,
  Map
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    href: '/admin/hero-images',
    label: 'मुख्य प्रतिमा',
    icon: Image,
    description: 'होमपेज मुख्य प्रतिमा व्यवस्थापन'
  },
  {
    href: '/admin/village-info',
    label: 'गाव माहिती',
    icon: Users,
    description: 'गावाची मुख्य माहिती आणि आकडेवारी'
  },
  {
    href: '/admin/announcements',
    label: 'सूचना',
    icon: Megaphone,
    description: 'सूचना आणि जाहीराती व्यवस्थापन'
  },
  {
    href: '/admin/history',
    label: 'इतिहास',
    icon: History,
    description: 'गावाचा इतिहास आणि परंपरा'
  },
  {
    href: '/admin/cultural-heritage',
    label: 'सांस्कृतिक वारसा',
    icon: Globe,
    description: 'सांस्कृतिक उत्सव आणि परंपरागत कला'
  },
  {
    href: '/admin/programs',
    label: 'कार्यक्रम',
    icon: Calendar,
    description: 'कार्यक्रम आणि उत्सव व्यवस्थापन'
  },
  {
    href: '/admin/gallery',
    label: 'गॅलरी',
    icon: Camera,
    description: 'प्रतिमा गॅलरी व्यवस्थापन'
  },
  {
    href: '/admin/income-expense',
    label: 'जमा-खर्च',
    icon: DollarSign,
    description: 'आर्थिक माहिती व्यवस्थापन'
  },
  {
    href: '/admin/government-schemes',
    label: 'शासकीय योजना',
    icon: Building,
    description: 'सरकारी योजना व्यवस्थापन'
  },
  {
    href: '/admin/departments',
    label: 'विभाग',
    icon: BookOpen,
    description: 'विभागीय माहिती व्यवस्थापन'
  },
  {
    href: '/admin/facilities',
    label: 'सोई-सुविधा',
    icon: Wrench,
    description: 'सुविधा व्यवस्थापन'
  },
  {
    href: '/admin/contact',
    label: 'संपर्क',
    icon: Phone,
    description: 'संपर्क माहिती व्यवस्थापन'
  },
  {
    href: '/admin/footer',
    label: 'फुटर',
    icon: Layout,
    description: 'फुटर सामग्री व्यवस्थापन'
  },
  // New sections
  {
    href: '/admin/projects',
    label: 'प्रकल्प',
    icon: FolderOpen,
    description: 'विकास प्रकल्प व्यवस्थापन'
  },
  {
    href: '/admin/government-resolutions',
    label: 'शासकीय ठराव',
    icon: FileText,
    description: 'शासकीय ठराव आणि परिपत्रके'
  },
  {
    href: '/admin/feedback',
    label: 'फीडबॅक',
    icon: MessageSquare,
    description: 'नागरिक फीडबॅक व्यवस्थापन'
  },
  {
    href: '/admin/dashboard-metrics',
    label: 'डॅशबोर्ड',
    icon: BarChart3,
    description: 'डॅशबोर्ड मेट्रिक्स व्यवस्थापन'
  },
  {
    href: '/admin/search-sitemap',
    label: 'शोध आणि साइटमॅप',
    icon: Search,
    description: 'शोध आणि साइटमॅप व्यवस्थापन'
  },
  {
    href: '/admin/settings',
    label: 'सेटिंग्स',
    icon: Settings,
    description: 'थीम, फॉन्ट आणि सामान्य सेटिंग्स'
  },
];

interface AdminSidebarProps {
  subdomain?: string;
}

export function AdminSidebar({ subdomain }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">वेबसाइट व्यवस्थापन</h2>
        <nav className="space-y-3">
          {adminNavItems.map((item) => {
            const href = subdomain ? `/subdomain/${subdomain}/admin${item.href.replace('/admin', '')}` : item.href;
            const isActive = pathname === href;
            return (
              <Link
                key={item.href}
                href={href}
                className={cn(
                  'block p-4 rounded-xl transition-all duration-200 hover:shadow-md',
                  isActive
                    ? 'bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <div className="flex items-start space-x-3">
                  <div className={cn(
                    'p-2 rounded-lg',
                    isActive ? 'bg-purple-100' : 'bg-gray-100'
                  )}>
                    <item.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm">{item.label}</h3>
                    <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
