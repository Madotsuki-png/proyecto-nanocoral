import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: { "inicio": "Inicio", "tienda": "Tienda" } },
      en: { translation: { "inicio": "Home", "tienda": "Shop" } },
      de: { translation: { "inicio": "Start", "tienda": "Shop" } }
    },
    fallbackLng: 'es',
    supportedLngs: ['es', 'en', 'de'], // Agrega esta línea
    interpolation: { escapeValue: false }
  });

export default i18n; // Asegúrate de esta exportación