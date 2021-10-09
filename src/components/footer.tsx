import React from 'react';
import { Trans } from 'react-i18next';
import { BEM } from '../lib/bem';
import type { FC } from 'react';

const bem = BEM('footer');

export const Footer: FC = () => (
  <footer className={bem()}>
    <p className={bem('paragraph')}>
      &copy;{' '}
      <a
        className={bem('link')}
        href="https://livewing.net/"
        target="_blank"
        rel="noopener noreferrer"
      >
        livewing.net
      </a>
    </p>
    <p className={bem('paragraph')}>
      <Trans i18nKey="footer.license">
        {''}
        <a
          className={bem('link')}
          href="https://github.com/livewing/mahjong-calc/blob/main/LICENSE"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </Trans>
    </p>
    <p className={bem('paragraph')}>
      <Trans i18nKey="footer.credit">
        {''}
        <a
          className={bem('link')}
          href="http://sozai.7gates.net/docs/mahjong01/"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
      </Trans>
    </p>
  </footer>
);
