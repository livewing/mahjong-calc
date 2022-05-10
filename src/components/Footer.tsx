import React, { type FC } from 'react';
import { Trans, useTranslation } from 'react-i18next';

const Link: FC<{ href: string; children?: React.ReactNode }> = ({
  href,
  children
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-neutral-900 hover:underline hover:text-blue-700 dark:text-neutral-100 dark:hover:text-blue-300 transition"
  >
    {children}
  </a>
);

export const Footer: FC = () => {
  const { i18n } = useTranslation();
  return (
    <footer className="flex gap-2 flex-col p-2 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] pb-[max(0.5rem,env(safe-area-inset-bottom))] text-xs bg-neutral-300 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300 transition">
      <p>
        &copy; <Link href="https://livewing.net/">livewing.net</Link>
      </p>
      <p>
        <Trans i18n={i18n} i18nKey="footer.license">
          {''}
          <Link href="https://github.com/livewing/mahjong-calc/blob/main/LICENSE" />
        </Trans>
      </p>
      <p>
        <Trans i18n={i18n} i18nKey="footer.credit">
          {''}
          <Link href="https://github.com/FluffyStuff/riichi-mahjong-tiles" />
          <Link href="https://github.com/FluffyStuff/riichi-mahjong-tiles/blob/master/LICENSE.md" />
        </Trans>
      </p>
    </footer>
  );
};
