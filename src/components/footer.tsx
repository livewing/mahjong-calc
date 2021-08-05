import React from 'react';
import type { FC } from 'react';
import { BEM } from '../lib/bem';

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
      この Web アプリケーションは{' '}
      <a
        className={bem('link')}
        href="https://github.com/livewing/mahjong-calc/blob/main/LICENSE"
        target="_blank"
        rel="noopener noreferrer"
      >
        The MIT License
      </a>{' '}
      の下でライセンスされています。本アプリケーションの作者は、本アプリケーションに関しての責任を負わないものとします。
    </p>
    <p className={bem('paragraph')}>
      麻雀牌の画像は{' '}
      <a
        className={bem('link')}
        href="http://sozai.7gates.net/docs/mahjong01/"
        target="_blank"
        rel="noopener noreferrer"
      >
        無料素材倶楽部
      </a>{' '}
      のものを使用しています。
    </p>
  </footer>
);
