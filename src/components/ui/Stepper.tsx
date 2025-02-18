import type React from 'react';
import type { FC } from 'react';
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
    type="button"
    disabled={disabled}
    onClick={onClick}
    className="flex basis-1/4 items-center justify-center bg-white p-2 text-blue-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-white dark:bg-black dark:text-blue-400 dark:hover:bg-neutral-800 dark:disabled:text-neutral-700 dark:disabled:hover:bg-black"
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
  <div className="flex flex-1 select-none divide-x divide-neutral-300 overflow-hidden rounded-md border border-neutral-300 shadow transition dark:divide-neutral-700 dark:border-neutral-700">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(value - 1)}>
      <MdRemove />
    </StepperButton>
    <div className="relative flex basis-1/2 items-center justify-center bg-white font-bold transition dark:bg-black">
      {value !== defaultValue && (
        <button
          type="button"
          className="absolute inset-y-0 left-0 flex items-center justify-center px-1 text-neutral-500 transition hover:text-neutral-900 dark:hover:text-neutral-100"
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
