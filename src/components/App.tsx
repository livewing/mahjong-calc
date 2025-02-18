import { type FC, Suspense, lazy, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { usePrefersColorScheme } from '../hooks/dom';
import { AppContentLoading } from './AppContentLoading';
import { Footer } from './Footer';
import { Header } from './Header';

const wrapperClasses = {
  light: 'flex flex-col min-h-screen touch-manipulation',
  dark: 'flex flex-col min-h-screen touch-manipulation dark'
} as const;

const AppContent = lazy(() => import('./AppContent'));

export const App: FC = () => {
  const [
    {
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
      <Suspense fallback={<AppContentLoading />}>
        <AppContent />
      </Suspense>
      <Footer />
    </div>
  );
};
