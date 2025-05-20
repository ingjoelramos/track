import { useContext } from 'react';
import { LanguageContext } from './LanguageContext';
import { translations, Language } from './translations';

export function useTranslation() {
  const { language } = useContext(LanguageContext);
  
  const t = (key: string, params?: Record<string, string>) => {
    const keys = key.split('.');
    let value = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k as keyof typeof value];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    if (typeof value !== 'string') {
      console.warn(`Invalid translation value for key: ${key}`);
      return key;
    }
    
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (_, key) => params[key] || `{{${key}}}`);
    }
    
    return value;
  };
  
  return { t, language };
}