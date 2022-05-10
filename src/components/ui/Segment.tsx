import React, { type FC } from 'react';

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
  <div className="flex border border-neutral-300 dark:border-neutral-700 rounded-md divide-x divide-neutral-300 dark:divide-neutral-700 shadow select-none overflow-hidden transition">
    {items.map((item, i) => (
      <button
        key={i}
        className="flex-1 p-1 whitespace-nowrap bg-white dark:bg-black hover:bg-neutral-200 dark:hover:bg-neutral-800 disabled:bg-blue-600 disabled:text-white dark:disabled:bg-blue-600 dark:disabled:text-white transition"
        disabled={index === i}
        onClick={() => onChange(i)}
      >
        {item}
      </button>
    ))}
  </div>
);
