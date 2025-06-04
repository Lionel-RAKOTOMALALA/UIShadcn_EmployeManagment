import { useEffect } from 'react';
import { useSettingsStore } from '../store/settingsStore';

// Définition des devises avec leurs symboles
const currencySymbols: { [key: string]: string } = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  MGA: 'Ar'
};

// Fonction pour formater un montant selon la devise
export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = currencySymbols[currency] || '€';
  
  // Configuration spéciale pour l'Ariary (MGA)
  if (currency === 'MGA') {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' ' + symbol;
  }

  // Pour les autres devises
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: currency,
    currencyDisplay: 'symbol'
  }).format(amount);
};

export const useGlobalSettings = () => {
  const { currency, language } = useSettingsStore();

  useEffect(() => {
    // Appliquer la langue à l'ensemble du document
    document.documentElement.lang = language;

    // Appliquer les formats régionaux selon la langue
    switch (language) {
      case 'fr':
        document.documentElement.setAttribute('lang', 'fr');
        document.dir = 'ltr';
        break;
      case 'en':
        document.documentElement.setAttribute('lang', 'en');
        document.dir = 'ltr';
        break;
      case 'mg':
        document.documentElement.setAttribute('lang', 'mg');
        document.dir = 'ltr';
        break;
      default:
        document.documentElement.setAttribute('lang', 'fr');
        document.dir = 'ltr';
    }
  }, [language]);

  return {
    formatCurrency: (amount: number) => formatCurrency(amount, currency),
    currentLanguage: language,
    currentCurrency: currency
  };
}; 