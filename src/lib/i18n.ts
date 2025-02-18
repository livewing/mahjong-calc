import i18next, {
  type ResourceLanguage,
  use,
  type Resource,
  type TFunction
} from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

export const getResources = (): Resource => {
  const yamls = import.meta.glob<true, never, ResourceLanguage>(
    ['../../locales/*.yml', '../../locales/*.yaml'],
    {
      import: 'default',
      eager: true
    }
  );
  const ret: Resource = {};
  for (const [key, value] of Object.entries(yamls)) {
    const m = key.match(/([^/]*)(?:\.([^.]+$))/);
    if (m === null) throw new Error(`Invalid import path: ${key}`);
    ret[m[1] as RegExpMatchArray[number]] = value;
  }
  return ret;
};

type InitI18nParams = Partial<{
  useDetector: boolean;
  lng: string;
}>;
export const initI18n = (params?: InitI18nParams): Promise<TFunction> =>
  ((params?.useDetector ?? true) ? use(LanguageDetector) : i18next)
    .use(initReactI18next)
    .init(
      (() => {
        const lng = params?.lng;
        return typeof lng === 'undefined'
          ? {
              resources: getResources(),
              fallbackLng: 'en',
              interpolation: { escapeValue: false },
              debug: import.meta.env.DEV
            }
          : {
              resources: getResources(),
              lng,
              fallbackLng: 'en',
              interpolation: { escapeValue: false },
              debug: import.meta.env.DEV
            };
      })()
    );
