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
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    href: '/admin/village-info',
    label: 'गाव माहिती',
    icon: Users,
    description: 'गावाची मुख्य माहिती आणि आकडेवारी'
  },
  {
    href: '/admin/history',
    label: 'इतिहास कार्ड',
    icon: History,
    description: 'गावाचा इतिहास आणि परंपरा'
  },
  {
    href: '/admin/announcements',
    label: 'सूचना',
    icon: Megaphone,
    description: 'सूचना आणि जाहीराती व्यवस्थापन'
  },
  {
    href: '/admin/cultural-heritage',
    label: 'सांस्कृतिक वारसा',
    icon: Globe,
    description: 'सांस्कृतिक उत्सव आणि परंपरागत कला'
  },
  {
    href: '/admin/hero-images',
    label: 'मुख्य प्रतिमा',
    icon: Image,
    description: 'होमपेज मुख्य प्रतिमा व्यवस्थापन'
  },
  {
    href: '/admin/settings',
    label: 'सेटिंग्स',
    icon: Settings,
    description: 'थीम, फॉन्ट आणि सामान्य सेटिंग्स'
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">वेबसाइट व्यवस्थापन</h2>
        <nav className="space-y-3">
          {adminNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
