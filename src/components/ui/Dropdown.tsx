import { MdArrowDropDown } from 'react-icons/md';
import { Button } from './Button';
import type React from 'react';
import type { FC } from 'react';

interface DropdownProps {
  id?: string;
  label?: React.ReactNode;
  open?: boolean;
  children?: React.ReactNode;
  onSetOpen?: (open: boolean) => void;
}

export const Dropdown: FC<DropdownProps> = ({
  id,
  label,
  open = false,
  children,
  onSetOpen = () => void 0
}) => (
  <>
    {open && (
      <button
        className="fixed inset-0 z-10 w-full h-full bg-transparent cursor-default"
        onClick={() => onSetOpen(false)}
      />
    )}
    <div className="relative">
      <Button id={id} onClick={() => onSetOpen(!open)}>
        {label}
        <MdArrowDropDown />
      </Button>
      <div className={open ? 'block absolute z-10 w-72' : 'hidden'}>
        <div className="overflow-hidden mt-1 bg-white/80 dark:bg-neutral-800/80 rounded-md shadow backdrop-blur">
          {children}
        </div>
      </div>
    </div>
  </>
);
