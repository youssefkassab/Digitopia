import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en/en_translation.json';
import arTranslation from './locales/ar/ar_translation.json';

i18n
  .use(LanguageDetector) // detects user language (optional)
  .use(initReactI18next) // passes i18n instance to react-i18next
  .init({
    resources: {
      en: { translation: enTranslation },
      ar: { translation: arTranslation }
    },
    fallbackLng: 'en', // default language if detection fails
    debug: true,       // set to false in production
    interpolation: {
      escapeValue: false, // React already escapes by default
    }
  });

export default i18n;
