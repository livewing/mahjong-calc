import React from 'react';
import type { FC } from 'react';
import { BEM } from '../../lib/bem';

const bem = BEM('select');

interface SelectProps {
  items: string[];
  index: number;
  onChanged?: undefined | ((index: number) => void);
  children?: never;
}

export const Select: FC<SelectProps> = ({ items, index, onChanged }) => {
  return (
    <select
      className={bem('select')}
      defaultValue={index}
      onChange={e => onChanged && onChanged(Number.parseInt(e.target.value))}
    >
      {items.map((item, i) => (
        <option key={i} value={i}>
          {item}
        </option>
      ))}
    </select>
  );
};
