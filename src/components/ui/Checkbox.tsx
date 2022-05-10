import React, { type FC } from 'react';

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
      className="w-5 h-5 border border-neutral-300 dark:border-neutral-700 bg-white checked:bg-blue-600 checked:hover:bg-blue-700 dark:bg-black dark:checked:bg-blue-500 dark:checked:hover:bg-blue-600 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md shadow transition"
      type="checkbox"
      checked={checked}
      onChange={e => onChange(e.target.checked)}
    />
    <label htmlFor={id}>{children}</label>
  </div>
);
