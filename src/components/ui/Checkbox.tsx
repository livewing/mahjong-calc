import type React from 'react';
import type { FC } from 'react';

interface CheckboxProps {
  id: string;
  checked?: boolean;
  children?: React.ReactNode;
  onChange?: (checked: boolean) => void;
}

export const Checkbox: FC<CheckboxProps> = ({
  id,
  checked = false,
  children,
  onChange = () => void 0
}) => (
  <div className="flex items-center gap-2">
    <input
      id={id}
      className="h-5 w-5 rounded-md border border-neutral-300 bg-white shadow transition checked:bg-blue-600 hover:bg-neutral-200 checked:hover:bg-blue-700 dark:border-neutral-700 dark:bg-black dark:checked:bg-blue-500 dark:hover:bg-neutral-800 dark:checked:hover:bg-blue-600"
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    <label htmlFor={id}>{children}</label>
  </div>
);
