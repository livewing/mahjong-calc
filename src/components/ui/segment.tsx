import React from 'react';
import type { FC } from 'react';
import { BEM } from '../../lib/bem';

const bem = BEM('segment');

interface SegmentProps {
  disabled?: undefined | boolean;
  items: React.ReactNode[];
  index: number;
  onChanged?: undefined | ((index: number) => void);
  children?: never;
}

export const Segment: FC<SegmentProps> = ({
  disabled,
  items,
  index,
  onChanged
}) => {
  const onClick = (after: number) => () => {
    if (disabled) return;
    if (index === after) return;
    onChanged && onChanged(after);
  };

  return (
    <div className={bem()}>
      <ul className={bem('wrapper', disabled ? 'disabled' : void 0)}>
        {items.map((item, i) => (
          <li
            key={i}
            className={bem(
              'element',
              disabled ? 'disabled' : index === i ? 'active' : void 0
            )}
            onClick={onClick(i)}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
