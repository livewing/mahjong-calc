import type React from 'react';
import type { FC } from 'react';

interface SegmentProps {
  items?: React.ReactNode[];
  index?: number;
  onChange?: (index: number) => void;
}

export const Segment: FC<SegmentProps> = ({
  items = [],
  index = 0,
  onChange = () => void 0
}) => (
  <div className="flex select-none divide-x divide-neutral-300 overflow-hidden rounded-md border border-neutral-300 shadow transition dark:divide-neutral-700 dark:border-neutral-700">
    {items.map((item, i) => (
      <button
        type="button"
        key={i}
        className="flex-1 whitespace-nowrap bg-white p-1 transition hover:bg-neutral-200 disabled:bg-blue-600 disabled:text-white dark:bg-black dark:hover:bg-neutral-800 dark:disabled:bg-blue-600 dark:disabled:text-white"
        disabled={index === i}
        onClick={() => onChange(i)}
      >
        {item}
      </button>
    ))}
  </div>
);
