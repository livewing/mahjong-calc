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
    className="flex flex-1 justify-center items-center p-2 text-blue-600 disabled:text-neutral-300 dark:text-blue-400 dark:disabled:text-neutral-700 bg-white hover:bg-neutral-100 disabled:hover:bg-white dark:bg-black dark:hover:bg-neutral-800 dark:disabled:hover:bg-black transition disabled:cursor-not-allowed"
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
  <div className="flex overflow-hidden flex-1 rounded-md border border-neutral-300 dark:border-neutral-700 divide-x divide-neutral-300 dark:divide-neutral-700 shadow transition select-none">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(-1)}>
      <MdRemove />
    </StepperButton>
    <StepperButton disabled={!canIncrement} onClick={() => onChange(1)}>
      <MdAdd />
    </StepperButton>
  </div>
);
