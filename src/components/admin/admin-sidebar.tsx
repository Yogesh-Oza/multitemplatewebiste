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
    href: '/admin',
    label: 'डॅशबोर्ड',
    icon: Home,
  },
  {
    href: '/admin/village-info',
    label: 'गाव माहिती',
    icon: Users,
  },
  {
    href: '/admin/history',
    label: 'इतिहास',
    icon: History,
  },
  {
    href: '/admin/announcements',
    label: 'सूचना',
    icon: Megaphone,
  },
  {
    href: '/admin/cultural-heritage',
    label: 'सांस्कृतिक वारसा',
    icon: Globe,
  },
  {
    href: '/admin/hero-images',
    label: 'मुख्य प्रतिमा',
    icon: Image,
  },
  {
    href: '/admin/settings',
    label: 'सेटिंग्स',
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {adminNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
