'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { NAVIGATION_ITEMS } from '@/lib/constants';

interface HeaderProps {
  villageName?: string;
  villageNameEn?: string;
}

export function Header({ villageName, villageNameEn }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full gradient-theme" />
          <span className="text-xl font-bold text-gray-900">
            {villageName || 'ग्रामपंचायत'}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {NAVIGATION_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-3 text-base font-medium transition-all duration-300 rounded-md group ${
                  isActive 
                    ? 'text-theme-primary bg-theme-primary/10 shadow-sm' 
                    : 'text-gray-700 hover:text-theme-primary hover:bg-gray-50'
                }`}
              >
                {item.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 gradient-theme rounded-full animate-pulse" />
                )}
                <div className="absolute inset-0 gradient-theme opacity-0 group-hover:opacity-10 rounded-md transition-opacity duration-300" />
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions - Removed for cleaner design */}

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px]">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-2 pb-4 border-b">
                <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                <span className="text-lg font-bold text-gray-900">ग्रामपंचायत</span>
              </div>
              
              <nav className="flex flex-col space-y-2">
                {NAVIGATION_ITEMS.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-4 py-3 text-base font-medium rounded-md transition-all duration-300 ${
                        isActive 
                          ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-500 shadow-sm' 
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Login button removed for cleaner design */}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
