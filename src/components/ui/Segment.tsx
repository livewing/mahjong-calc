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
  <div className="flex overflow-hidden rounded-md border border-neutral-300 dark:border-neutral-700 divide-x divide-neutral-300 dark:divide-neutral-700 shadow transition select-none">
    {items.map((item, i) => (
      <button
        key={i}
        className="flex-1 p-1 disabled:text-white dark:disabled:text-white whitespace-nowrap bg-white hover:bg-neutral-200 disabled:bg-blue-600 dark:bg-black dark:hover:bg-neutral-800 dark:disabled:bg-blue-600 transition"
        disabled={index === i}
        onClick={() => onChange(i)}
      >
        {item}
      </button>
    ))}
  </div>
);
