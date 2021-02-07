import React from 'react';
import type { FC } from 'react';
import { BEM } from '../../lib/bem';

const bem = BEM('container');

interface ContainerProps {
  header: React.ReactNode;
  modifier?: undefined | 'primary' | 'warning' | 'danger';
}

export const Container: FC<ContainerProps> = ({
  header,
  modifier,
  children
}) => (
  <div className={bem()}>
    <div className={bem('wrapper', modifier)}>
      <div className={bem('header', modifier)}>{header}</div>
      <div className={bem('content', modifier)}>{children}</div>
    </div>
  </div>
);
