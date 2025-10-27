'use client';

import { useLanguage } from '@/lib/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Globe, Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const languages = [
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
  ] as const;

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-sm font-medium"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage?.flag} {currentLanguage?.name}
          </span>
          <span className="sm:hidden">
            {currentLanguage?.flag}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code as 'mr' | 'en')}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? 'bg-accent' : ''
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="font-medium">{lang.name}</span>
            {language === lang.code && (
              <span className="ml-auto text-xs text-muted-foreground">✓</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple toggle button version
export function LanguageToggleSimple() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-sm font-medium"
    >
      <Languages className="h-4 w-4" />
      <span className="hidden sm:inline">
        {language === 'mr' ? 'English' : 'मराठी'}
      </span>
      <span className="sm:hidden">
        {language === 'mr' ? 'EN' : 'मर'}
      </span>
    </Button>
  );
}