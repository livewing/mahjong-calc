import React from 'react';
import type { FC } from 'react';
import { BEM } from '../lib/bem';

const bem = BEM('header');

export const Header: FC = () => (
  <header className={bem()}>
    <h1 className={bem('title')}>麻雀得点計算機</h1>
    <div className={bem('link-list')}>
      <a
        className={bem('link')}
        href="https://github.com/livewing/mahjong-calc/blob/main/doc/how-to-use.md"
        target="_blank"
        rel="noopener noreferrer"
      >
        使用方法
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
