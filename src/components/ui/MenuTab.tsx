import type React from 'react';
import type { FC } from 'react';

interface MenuTabProps {
  items?: React.ReactNode[];
  index?: number;
  row?: boolean;
  onSetIndex?: (index: number) => void;
}

export const MenuTab: FC<MenuTabProps> = ({
  items = [],
  index = 0,
  row = false,
  onSetIndex = () => void 0
}) => (
  <nav
    className={
      row
        ? 'flex flex-row gap-2 overflow-auto'
        : 'flex flex-row gap-2 overflow-auto sm:flex-col'
    }
  >
    {items.map((item, i) => (
      <button
        type="button"
        key={i}
        className={
          row
            ? 'flex flex-1 justify-center rounded p-2 transition hover:bg-blue-100 disabled:bg-blue-200 disabled:font-bold disabled:text-blue-700 hover:dark:bg-blue-900 disabled:dark:bg-blue-800 disabled:dark:text-blue-100'
            : 'flex flex-1 justify-center rounded p-2 transition hover:bg-blue-100 disabled:bg-blue-200 disabled:font-bold disabled:text-blue-700 hover:dark:bg-blue-900 disabled:dark:bg-blue-800 disabled:dark:text-blue-100 sm:justify-start'
        }
        disabled={i === index}
        onClick={() => onSetIndex(i)}
      >
        {item}
      </button>
    ))}
  </nav>
);
