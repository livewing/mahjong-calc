import type React from 'react';
import type { FC } from 'react';

interface ConfigItemProps {
  label?: React.ReactNode;
  labelFor?: string;
  children?: React.ReactNode;
}

export const ConfigItem: FC<ConfigItemProps> = ({
  label,
  labelFor,
  children
}) => (
  <div className="flex flex-col gap-1">
    <label className="font-bold" htmlFor={labelFor}>
      {label}
    </label>
    {children}
  </div>
);
