'use client';

import { Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { useAdminContext } from '@/components/providers/admin-context';

interface AdminHeaderProps {
  villageName?: string;
}

export function AdminHeader({ villageName }: AdminHeaderProps) {
  const { isSubdomain, villageName: contextVillageName } = useAdminContext();
  const displayVillageName = villageName || contextVillageName;
  
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            {displayVillageName ? `${displayVillageName} - प्रशासन पैनल` : 'प्रशासन पैनल'}
          </h1>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            सक्रिय
          </Badge>
          {isSubdomain && (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              सबडोमेन
            </Badge>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          <Link href="/admin/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          
          <Link href="/admin/profile">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700">प्रशासक</span>
            </div>
          </Link>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
          >
            <LogOut className="h-4 w-4 mr-2" />
            बाहेर जा
          </Button>
        </div>
      </div>
    </header>
  );
}
