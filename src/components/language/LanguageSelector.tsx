import React from 'react';
import { Globe } from 'lucide-react';
import { Button } from '../ui/button';
import { useTranslation } from '../../lib/i18n/useTranslation';
import LanguageContext from '../../lib/i18n/LanguageContext';
import type { Language } from '../../lib/i18n/translations';

export function LanguageSelector() {
  const { language } = useTranslation();
  const { setLanguage } = React.useContext(LanguageContext);
  
  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'es' : 'en');
  };
  
  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={toggleLanguage}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span className="uppercase">{language}</span>
    </Button>
  );
}