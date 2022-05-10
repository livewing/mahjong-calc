import React, { type FC } from 'react';
import { MdArrowDropDown } from 'react-icons/md';
import { Button } from './Button';

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
      <div
        className="fixed bg-transparent w-full h-full inset-0 z-10"
        onClick={() => onSetOpen(false)}
      />
    )}
    <div className="relative">
      <Button id={id} onClick={() => onSetOpen(!open)}>
        {label}
        <MdArrowDropDown />
      </Button>
      <div className={open ? 'block absolute z-10 w-72' : 'hidden'}>
        <div className="bg-white/80 dark:bg-neutral-800/80 backdrop-blur rounded-md overflow-hidden shadow mt-1">
          {children}
        </div>
      </div>
    </div>
  </>
);
