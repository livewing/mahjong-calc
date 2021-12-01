import { use } from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import type { TFunction } from 'i18next';

const localesContext = require.context('../../locales');
const resources = localesContext.keys().reduce((acc, cur) => {
  const m = cur.match(/([^/]*)(?:\.([^.]+$))/);
  if (m === null) throw new Error(`Invalid import path: ${cur}`);
  return { ...acc, [m[1]]: localesContext(cur) };
}, {});

export const initI18n = (): Promise<TFunction> =>
  use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'ja',
      interpolation: { escapeValue: false },
      debug: process.env.NODE_ENV === 'development'
    });
