import { MdAdd, MdRefresh, MdRemove } from 'react-icons/md';
import type React from 'react';
import type { FC } from 'react';

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
    className="flex basis-1/4 justify-center items-center p-2 text-blue-600 disabled:text-neutral-300 dark:text-blue-400 dark:disabled:text-neutral-700 bg-white hover:bg-neutral-100 disabled:hover:bg-white dark:bg-black dark:hover:bg-neutral-800 dark:disabled:hover:bg-black transition disabled:cursor-not-allowed"
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
  <div className="flex overflow-hidden flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 divide-x divide-neutral-300 dark:divide-neutral-700 shadow transition select-none">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(value - 1)}>
      <MdRemove />
    </StepperButton>
    <div className="flex relative basis-1/2 justify-center items-center font-bold bg-white dark:bg-black transition">
      {value !== defaultValue && (
        <button
          className="flex absolute inset-y-0 left-0 justify-center items-center px-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition"
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
