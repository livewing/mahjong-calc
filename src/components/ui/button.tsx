import React from 'react';
import type { FC } from 'react';
import { BEM } from '../../lib/bem';

const bem = BEM('button');

interface ButtonProps {
  disabled?: boolean;
  modifier?: undefined | 'primary' | 'danger';
  onClick?: undefined | (() => void);
}

export const Button: FC<ButtonProps> = ({
  disabled,
  modifier,
  children,
  onClick
}) => {
  const mod = disabled ? 'disabled' : modifier;
  return (
    <div className={bem()} onClick={disabled ? void 0 : onClick}>
      <div className={bem('content', mod)}>{children}</div>
    </div>
  );
};
