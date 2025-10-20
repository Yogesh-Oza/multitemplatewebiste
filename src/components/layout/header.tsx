'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, Globe, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { SearchModal } from '@/components/search/search-modal';
import { NAVIGATION_ITEMS } from '@/lib/constants';

interface HeaderProps {
  villageName?: string;
  villageNameEn?: string;
}

interface VillageData {
  villageLogo?: string;
  villageName?: string;
  villageNameEn?: string;
}

export function Header({ villageName, villageNameEn }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [villageData, setVillageData] = useState<VillageData>({});
  const pathname = usePathname();

  // Fetch village data for dynamic branding
  useEffect(() => {
    const fetchVillageData = async () => {
      try {
        const response = await fetch('/api/village-info');
        if (response.ok) {
          const data = await response.json();
          setVillageData({
            villageLogo: data.villageLogo,
            villageName: data.villageName,
            villageNameEn: data.villageNameEn
          });
        }
      } catch (error) {
        console.error('Error fetching village data:', error);
      }
    };

    fetchVillageData();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Government branding strip */}
      <div className="w-full border-b bg-black">
        <div className="container flex h-12 items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            {/* Digital India logo */}
            <Image
              src="/images/gov-logos/digital-india.png"
              alt="Digital India"
              width={80}
              height={32}
              className="h-8 w-auto object-contain"
              priority
              unoptimized={false}
              onError={(e) => {
                console.error('Failed to load Digital India logo:', e);
              }}
            />
            <div className="h-6 w-px bg-white/30 hidden sm:block"></div>
            <span className="font-medium text-white">
              शासन महाराष्ट्र • ग्रामीण विकास विभाग
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-white/90 font-medium">
              अधिकृत ग्रामपंचायत संकेतस्थळ
            </span>
            
            <Image
              src="/images/gov-logos/satyamev_jayate_logo.png"
              alt="Satyamev Jayate"
              width={32}
              height={32}
              className="h-8 w-auto object-contain"
              priority
              unoptimized={false}
              onError={(e) => {
                console.error('Failed to load Satyamev Jayate logo:', e);
              }}
            />
          </div>
        </div>
      </div>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {villageData.villageLogo ? (
            <Image
              src={villageData.villageLogo}
              alt="Village Logo"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
              priority
            />
          ) : (
            <div className="h-8 w-8 rounded-full gradient-theme" />
          )}
          <span className="text-xl font-bold text-gray-900">
            {villageData.villageName || villageName || 'ग्रामपंचायत'}
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

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">शोध</span>
          </Button>
        </div>

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
                {villageData.villageLogo ? (
                  <Image
                    src={villageData.villageLogo}
                    alt="Village Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                )}
                <span className="text-lg font-bold text-gray-900">
                  {villageData.villageName || villageName || 'ग्रामपंचायत'}
                </span>
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

              {/* Mobile Search */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex items-center gap-2 w-full justify-center"
              >
                <Search className="h-4 w-4" />
                <span>शोध</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Search Modal */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          subdomain={villageName || 'default'}
        />
      </div>
    </header>
  );
}
