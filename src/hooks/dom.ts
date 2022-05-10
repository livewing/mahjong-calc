import { useEffect, useRef, useState } from 'react';

const mediaQuery = '(prefers-color-scheme: dark)';

export const usePrefersColorScheme = () => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(
    window.matchMedia(mediaQuery).matches ? 'dark' : 'light'
  );

  useEffect(() => {
    const media = window.matchMedia(mediaQuery);
    const f = ({ matches }: MediaQueryListEvent) =>
      setColorScheme(matches ? 'dark' : 'light');
    media.addEventListener('change', f);
    return () => media.removeEventListener('change', f);
  });

  return colorScheme;
};

export const useBoundingClientRect = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const [boundingClientRect, setBoundingClientRect] = useState(
    ref.current?.getBoundingClientRect()
  );

  useEffect(() => {
    const observer = new ResizeObserver(() =>
      setBoundingClientRect(ref.current?.getBoundingClientRect())
    );
    if (typeof ref.current !== 'undefined' && ref.current !== null)
      observer.observe(ref.current);

    const f = () => setBoundingClientRect(ref.current?.getBoundingClientRect());
    window.addEventListener('scroll', f);

    return () => {
      window.removeEventListener('scroll', f);
      observer.disconnect();
    };
  }, []);

  return [ref, boundingClientRect] as const;
};

export const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const f = () =>
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  return windowSize;
};
