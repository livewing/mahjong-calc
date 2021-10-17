import React from 'react';
import type { FC } from 'react';
import { BEM } from '../../lib/bem';

const bem = BEM('segment');

interface SegmentProps {
  items: React.ReactNode[];
  index: number;
  onChanged?: undefined | ((index: number) => void);
  children?: never;
  direction?: 'horizontal' | 'vertical';
}

export const Segment: FC<SegmentProps> = ({
  items,
  index,
  onChanged,
  direction
}) => {
  const onClick = (after: number) => () => {
    if (index === after) return;
    onChanged && onChanged(after);
  };

  return (
    <div className={bem()}>
      <ul
        className={bem(
          'wrapper',
          direction === 'vertical' ? 'vertical' : void 0
        )}
      >
        {items.map((item, i) => (
          <li
            key={i}
            className={bem('element', index === i ? 'active' : void 0)}
            onClick={onClick(i)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
