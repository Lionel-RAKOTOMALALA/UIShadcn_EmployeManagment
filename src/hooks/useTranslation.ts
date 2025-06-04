import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../locales/translations';

export const useTranslation = () => {
  const { language } = useSettingsStore();

  const t = (key: string): string => {
    const currentTranslations = translations[language] || translations['fr'];
    return currentTranslations[key] || key;
  };

  return { t };
}; 