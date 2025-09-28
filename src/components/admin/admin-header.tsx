'use client';

import { Bell, Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function AdminHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">प्रशासन पैनल</h1>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            सक्रिय
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Settings className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-700">प्रशासक</span>
          </div>
          
          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
            <LogOut className="h-4 w-4 mr-2" />
            बाहेर जा
          </Button>
        </div>
      </div>
    </header>
  );
}
