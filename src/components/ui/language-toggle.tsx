'use client';

import { useLanguage } from '@/lib/i18n/i18n-context';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'mr' ? 'en' : 'mr');
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-gray-300 hover:border-blue-600 hover:text-blue-600"
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {language === 'mr' ? 'English' : 'मराठी'}
      </span>
    </Button>
  );
}