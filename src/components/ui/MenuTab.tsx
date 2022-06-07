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
        ? 'flex gap-2 flex-row overflow-auto'
        : 'flex gap-2 flex-row overflow-auto sm:flex-col'
    }
  >
    {items.map((item, i) => (
      <button
        key={i}
        className={
          row
            ? 'flex flex-1 p-2 rounded justify-center hover:bg-blue-100 hover:dark:bg-blue-900 disabled:font-bold disabled:bg-blue-200 disabled:text-blue-700 disabled:dark:bg-blue-800 disabled:dark:text-blue-100 transition'
            : 'flex flex-1 p-2 rounded justify-center sm:justify-start hover:bg-blue-100 hover:dark:bg-blue-900 disabled:font-bold disabled:bg-blue-200 disabled:text-blue-700 disabled:dark:bg-blue-800 disabled:dark:text-blue-100 transition'
        }
        disabled={i === index}
        onClick={() => onSetIndex(i)}
      >
        {item}
      </button>
    ))}
  </nav>
);
