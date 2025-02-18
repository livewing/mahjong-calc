import { type FC, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { usePrefersColorScheme } from '../hooks/dom';
import { Calculator } from './Calculator';
import { Footer } from './Footer';
import { Header } from './Header';
import { ScoringTable } from './ScoringTable';
import { Settings } from './Settings';

const wrapperClasses = {
  light: 'flex flex-col min-h-screen touch-manipulation',
  dark: 'flex flex-col min-h-screen touch-manipulation dark'
} as const;

export const App: FC = () => {
  const [
    {
      currentScreen,
      appConfig: { theme }
    }
  ] = useStore();
  const systemColor = usePrefersColorScheme();
  const isDark =
    theme === 'dark' || (theme === 'auto' && systemColor === 'dark');
  const {
    i18n: { resolvedLanguage }
  } = useTranslation();
  useLayoutEffect(() => {
    const html = document.querySelector('html');
    if (html === null) return;
    html.lang = resolvedLanguage ?? 'ja';
  }, [resolvedLanguage]);
  return (
    <div className={isDark ? wrapperClasses.dark : wrapperClasses.light}>
      <Header />
      <div className="relative flex-1 bg-neutral-100 text-neutral-900 transition dark:bg-neutral-900 dark:text-neutral-100">
        {currentScreen === 'main' && <Calculator />}
        {currentScreen === 'scoring-table' && <ScoringTable />}
        {currentScreen === 'settings' && <Settings />}
      </div>
      <Footer />
    </div>
  );
};
