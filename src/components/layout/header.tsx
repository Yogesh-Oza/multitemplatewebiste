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

// Grouped navigation for desktop dropdowns
const MENU_GROUPS = [
  {
    label: 'गाव माहिती',
    items: [
      { href: '/', label: 'मुख्यपृष्ठ' },
      { href: '/about', label: 'ग्रामपंचायतीबद्दल' },
      { href: '/history', label: 'आमचे गाव' }
    ]
  },
  {
    label: 'विकास व प्रशासन',
    items: [
      { href: '/projects', label: 'प्रकल्प आणि उपक्रम' },
      { href: '/gr', label: 'शासकीय ठराव' },
      { href: '/programs', label: 'कार्यक्रम' },
      { href: '/departments', label: 'विभाग' },
      { href: '/amenities', label: 'पायाभूत सुविधा' },
      { href: '/gov-programs', label: 'योजना आणि लाभार्थी' },
      { href: '/jama-kharch', label: 'अर्थसंकल्प' }
    ]
  },
  {
    label: 'नागरिक सेवा',
    items: [
      { href: '/citizen-services', label: 'नागरिक सेवा आणि फॉर्म्स' },
      { href: '/jobs', label: 'रोजगार आणि कौशल्य' },
      { href: '/education', label: 'शिक्षण आणि युवक' },
      { href: '/environment', label: 'पर्यावरण आणि शाश्वत' },
      { href: '/feedback', label: 'तक्रार निवारण' },
      { href: '/contact', label: 'संपर्क आणि सहकार्य' }
    ]
  },
  {
    label: 'माध्यम व अद्यतने',
    items: [
      { href: '/announcements', label: 'घोषणा' },
      { href: '/gallery', label: 'गॅलरी आणि मीडिया' }
    ]
  },
  {
    label: 'डाटा व नकाशा',
    items: [
      { href: '/dashboard', label: 'डॅशबोर्ड' },
      { href: '/sitemap', label: 'साइटमॅप' }
    ]
  }
];

interface VillageData {
  villageLogo?: string;
  villageName?: string;
  villageNameEn?: string;
  satyamevJayateLogoUrl?: string;
  digitalIndiaLogoUrl?: string;
  govDeptText?: string;
  officialSiteText?: string;
}

interface HeaderProps {
  villageName?: string;
  villageNameEn?: string;
  villageData?: VillageData;
}

export function Header({ villageName, villageNameEn, villageData }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();
  const [selectedLang, setSelectedLang] = useState('mr');

  // Fallback language switcher using googtrans cookie
  const applyGoogleTranslate = (targetLang: string) => {
    try {
      const sourceLang = 'mr';
      const cookieValue = `/` + sourceLang + `/` + targetLang;
      const expires = new Date();
      expires.setTime(expires.getTime() + 365 * 24 * 60 * 60 * 1000);
      const cookieBase = `; expires=${expires.toUTCString()}; path=/`;
      // Set for current domain and dot-domain to cover subdomains
      document.cookie = `googtrans=${cookieValue}${cookieBase}`;
      document.cookie = `googtrans=${cookieValue}${cookieBase}; domain=.${window.location.hostname}`;
      // eslint-disable-next-line no-console
      console.log('[GT] fallback cookie set', cookieValue);
      try { setSelectedLang(targetLang); } catch {}
      // Trigger translation (element is already loaded)
      window.location.reload();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('[GT] fallback translate failed', e);
    }
  };

  // Google Translate loader
  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Initialize selected language from cookie if available
    try {
      const cookie = document.cookie.match(/(?:^|; )googtrans=([^;]+)/);
      if (cookie && cookie[1]) {
        const val = decodeURIComponent(cookie[1]);
        const parts = val.split('/');
        const lang = parts[parts.length - 1] || 'mr';
        setSelectedLang(lang);
      }
    } catch {}
    if ((window as any)._gt_loaded) {
      // eslint-disable-next-line no-console
      console.log('[GT] loader skipped: already loaded');
      return;
    }
    (window as any)._gt_loaded = true;

    // Defensive: cleanup any injected Google Translate UI artifacts
    const hideGoogleBanner = () => {
      try {
        const bannerIframes = document.querySelectorAll('iframe.goog-te-banner-frame, .goog-te-banner-frame, iframe.skiptranslate, .skiptranslate iframe, iframe[class*="VIpgJd-"]');
        bannerIframes.forEach((el: Element) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
          (el as HTMLElement).style.setProperty('height', '0px', 'important');
          (el as HTMLElement).style.setProperty('max-height', '0px', 'important');
        });
        const balloon = document.querySelectorAll('#goog-gt-tt, .goog-te-balloon-frame');
        balloon.forEach((el: Element) => {
          (el as HTMLElement).style.setProperty('display', 'none', 'important');
          (el as HTMLElement).style.setProperty('visibility', 'hidden', 'important');
          (el as HTMLElement).style.setProperty('height', '0px', 'important');
          (el as HTMLElement).style.setProperty('max-height', '0px', 'important');
        });
        const menuFrame = document.querySelector('iframe.goog-te-menu-frame');
        if (menuFrame) {
          (menuFrame as HTMLElement).style.setProperty('display', 'block', 'important');
          (menuFrame as HTMLElement).style.setProperty('visibility', 'visible', 'important');
          (menuFrame as HTMLElement).style.setProperty('z-index', '2147483647', 'important');
          (menuFrame as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
        }
        // Reset body/html offset Google may set
        document.documentElement.style.setProperty('top', '0px', 'important');
        document.body.style.setProperty('top', '0px', 'important');
        document.body.style.setProperty('position', 'static', 'important');
        document.body.style.setProperty('margin-top', '0px', 'important');
        document.body.style.setProperty('padding-top', '0px', 'important');
        (document.documentElement as HTMLElement).style.setProperty('transform', 'none', 'important');
        (document.body as HTMLElement).style.setProperty('transform', 'none', 'important');
        // eslint-disable-next-line no-console
        console.log('[GT] hideGoogleBanner applied');
      } catch {
        // no-op
      }
    };

    // Initial cleanup and a short retry window in case injection is delayed
    hideGoogleBanner();
    const retryTimer = window.setInterval(hideGoogleBanner, 300);
    window.setTimeout(() => window.clearInterval(retryTimer), 4000);

    // Observe DOM changes to catch reinjections
    const observer = new MutationObserver((mutations) => {
      // eslint-disable-next-line no-console
      console.log('[GT] DOM mutated, applying cleanup', { mutations: mutations.length });
      hideGoogleBanner();
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    (window as any).googleTranslateElementInit = function () {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      // @ts-ignore
      new (window as any).google.translate.TranslateElement({
        pageLanguage: 'mr',
        includedLanguages: 'mr,en,hi,gu,bn,ta,te,kn,pa,ur',
        layout:  (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
        autoDisplay: false,
      }, 'google_translate_element');
      // eslint-disable-next-line no-console
      console.log('[GT] googleTranslateElementInit executed');
    };
    const script = document.createElement('script');
    script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    script.async = true;
    document.body.appendChild(script);
    // eslint-disable-next-line no-console
    console.log('[GT] translate script injected');

    // Global listener for GT trigger clicks (fallback)
    const clickHandler = (ev: MouseEvent) => {
      const target = ev.target as HTMLElement | null;
      if (!target) return;
      const isGtTrigger = target.closest('#google_translate_element') || target.closest('a.VIpgJd-ZVi9od-xl07Ob-lTBxed');
      if (isGtTrigger) {
        // eslint-disable-next-line no-console
        console.log('[GT] global click detected on widget');
        setTimeout(() => {
          const menu = document.querySelector('iframe.goog-te-menu-frame');
          // eslint-disable-next-line no-console
          console.log('[GT] post-click menu frame present?', !!menu);
          if (menu) {
            (menu as HTMLElement).style.setProperty('z-index', '2147483647', 'important');
            (menu as HTMLElement).style.setProperty('display', 'block', 'important');
            (menu as HTMLElement).style.setProperty('visibility', 'visible', 'important');
            (menu as HTMLElement).style.setProperty('pointer-events', 'auto', 'important');
          }
        }, 200);
      }
    };
    window.addEventListener('click', clickHandler, true);
    
    return () => {
      try {
        observer.disconnect();
      } catch {
        // ignore
      }
      try {
        window.removeEventListener('click', clickHandler, true);
      } catch {
        // ignore
      }
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      {/* Government branding strip */}
      <div className="w-full border-b bg-black">
        <div className="container flex h-12 items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            {/* Satyamev Jayate logo */}
            <Image
              src={villageData?.satyamevJayateLogoUrl || '/images/gov-logos/satyamev_jayate_logo.png'}
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

            <div className="h-6 w-px bg-white/30 hidden sm:block"></div>
            <span className="font-medium text-white">
              {villageData?.govDeptText || 'शासन महाराष्ट्र • ग्रामीण विकास विभाग'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <span className="text-white/90 font-medium">
              {villageData?.officialSiteText || 'अधिकृत ग्रामपंचायत संकेतस्थळ'}
            </span>
            <Image
              src={villageData?.digitalIndiaLogoUrl || '/images/gov-logos/digital-india.png'}
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
          </div>
        </div>
      </div>
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          {villageData?.villageLogo ? (
            <Image
              src={villageData?.villageLogo}
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
            {villageData?.villageName || villageName || 'ग्रामपंचायत'}
          </span>
        </Link>

        {/* Desktop Navigation with hoverable dropdowns */}
        <nav className="hidden md:flex items-center space-x-1">
          {MENU_GROUPS.map((group) => {
            const groupActive = group.items.some((it) => pathname === it.href || pathname?.startsWith(it.href + '/'));
            return (
              <div key={group.label} className="relative group">
                <button
                  className={`px-4 py-3 text-base font-medium rounded-md transition-all duration-300 flex items-center gap-2 ${
                    groupActive ? 'text-theme-primary bg-theme-primary/10 shadow-sm' : 'text-gray-700 hover:text-theme-primary hover:bg-gray-50'
                  }`}
                >
                  {group.label}
                </button>
                <div className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200 absolute left-0 mt-2 w-64 bg-white shadow-lg border rounded-lg p-2">
                  <ul className="max-h-[70vh] overflow-auto">
                    {group.items.map((child) => {
                      const isActive = pathname === child.href;
                      return (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className={`flex w-full items-center justify-between px-3 py-2 rounded-md text-sm transition-colors ${
                              isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                            }`}
                          >
                            <span>{child.label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Desktop Actions: Translate + quick links + Search */}
        <div className="hidden md:flex items-center space-x-4">

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            <span className="hidden lg:inline">Search</span>
          </Button>
          
          {/* Fallback select (applies googtrans cookie and reloads) */}
          <select
            aria-label="Fallback language"
            className="text-sm border rounded px-2 py-1"
            value={selectedLang || ''}
            onChange={(e) => {
              const lang = e.target.value;
              if (!lang) return;
              applyGoogleTranslate(lang);
            }}
          >
            <option value="mr">भाषा चुने</option>
            <option value="mr">Marathi</option>
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="gu">Gujarati</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
            <option value="kn">Kannada</option>
            <option value="pa">Punjabi</option>
            <option value="ur">Urdu</option>
          </select>
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
                {villageData?.villageLogo ? (
                  <Image
                    src={villageData?.villageLogo}
                    alt="Village Logo"
                    width={24}
                    height={24}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                ) : (
                  <div className="h-6 w-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
                )}
                <span className="text-lg font-bold text-gray-900">
                  {villageData?.villageName || villageName || 'ग्रामपंचायत'}
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
