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
        className="fixed inset-0 z-10 h-full w-full cursor-default bg-transparent"
        onClick={() => onSetOpen(false)}
      />
    )}
    <div className="relative">
      <Button id={id} onClick={() => onSetOpen(!open)}>
        {label}
        <MdArrowDropDown />
      </Button>
      <div className={open ? 'absolute z-10 block w-72' : 'hidden'}>
        <div className="mt-1 overflow-hidden rounded-md bg-white/80 shadow backdrop-blur dark:bg-neutral-800/80">
          {children}
        </div>
      </div>
    </div>
  </>
);
