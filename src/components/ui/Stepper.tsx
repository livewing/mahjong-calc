import React, { type FC } from 'react';
import { MdAdd, MdRefresh, MdRemove } from 'react-icons/md';

interface StepperButtonProps {
  children?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}
const StepperButton: FC<StepperButtonProps> = ({
  children,
  disabled = false,
  onClick = () => void 0
}) => (
  <button
    disabled={disabled}
    onClick={onClick}
    className="flex basis-1/4 p-2 justify-center items-center bg-white hover:bg-neutral-100 text-blue-600 disabled:text-neutral-300 disabled:hover:bg-white dark:bg-black dark:hover:bg-neutral-800 dark:text-blue-400 dark:disabled:text-neutral-700 dark:disabled:hover:bg-black disabled:cursor-not-allowed transition"
  >
    {children}
  </button>
);

interface StepperProps {
  value?: number;
  defaultValue?: number;
  canDecrement?: boolean;
  canIncrement?: boolean;
  onChange?: (value: number) => void;
}
export const Stepper: FC<StepperProps> = ({
  value = 0,
  defaultValue = 0,
  canDecrement = true,
  canIncrement = true,
  onChange = () => void 0
}) => (
  <div className="flex flex-1 border border-neutral-300 dark:border-neutral-700 rounded-md divide-x divide-neutral-300 dark:divide-neutral-700 shadow select-none overflow-hidden transition">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(value - 1)}>
      <MdRemove />
    </StepperButton>
    <div className="relative flex basis-1/2 font-bold justify-center items-center bg-white dark:bg-black transition">
      {value !== defaultValue && (
        <button
          className="absolute flex justify-center items-center px-1 left-0 inset-y-0 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
          onClick={() => onChange(defaultValue)}
        >
          <MdRefresh />
        </button>
      )}
      {value}
    </div>
    <StepperButton disabled={!canIncrement} onClick={() => onChange(value + 1)}>
      <MdAdd />
    </StepperButton>
  </div>
);
