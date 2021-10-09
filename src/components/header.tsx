import React from 'react';
import { useTranslation } from 'react-i18next';
import { BEM } from '../lib/bem';
import type { FC } from 'react';

const bem = BEM('header');

export const Header: FC = () => {
  const { t } = useTranslation();
  return (
    <header className={bem()}>
      <h1 className={bem('title')}>{t('header.title')}</h1>
      <div className={bem('link-list')}>
        <a
          className={bem('link')}
          href="https://github.com/livewing/mahjong-calc/blob/main/doc/how-to-use.md"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('header.how-to-use')}
        </a>
        <a
          className={bem('link')}
          href="https://github.com/livewing/mahjong-calc"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
    </header>
  );
};
