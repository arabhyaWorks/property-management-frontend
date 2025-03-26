import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { t };
}