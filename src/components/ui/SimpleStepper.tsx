import { MdAdd, MdRemove } from 'react-icons/md';
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
    className="flex flex-1 items-center justify-center bg-white p-2 text-blue-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:text-neutral-300 disabled:hover:bg-white dark:bg-black dark:text-blue-400 dark:hover:bg-neutral-800 dark:disabled:text-neutral-700 dark:disabled:hover:bg-black"
  >
    {children}
  </button>
);

interface SimpleStepperProps {
  canDecrement?: boolean;
  canIncrement?: boolean;
  onChange?: (delta: 1 | -1) => void;
}
export const SimpleStepper: FC<SimpleStepperProps> = ({
  canDecrement = true,
  canIncrement = true,
  onChange = () => void 0
}) => (
  <div className="flex flex-1 select-none divide-x divide-neutral-300 overflow-hidden rounded-md border border-neutral-300 shadow transition dark:divide-neutral-700 dark:border-neutral-700">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(-1)}>
      <MdRemove />
    </StepperButton>
    <StepperButton disabled={!canIncrement} onClick={() => onChange(1)}>
      <MdAdd />
    </StepperButton>
  </div>
);
