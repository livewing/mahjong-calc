import React, { type FC } from 'react';
import { MdAdd, MdRemove } from 'react-icons/md';

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
    className="flex flex-1 p-2 justify-center items-center bg-white hover:bg-neutral-100 text-blue-600 disabled:text-neutral-300 disabled:hover:bg-white dark:bg-black dark:hover:bg-neutral-800 dark:text-blue-400 dark:disabled:text-neutral-700 dark:disabled:hover:bg-black disabled:cursor-not-allowed transition"
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
  <div className="flex flex-1 border border-neutral-300 dark:border-neutral-700 rounded-md divide-x divide-neutral-300 dark:divide-neutral-700 shadow select-none overflow-hidden transition">
    <StepperButton disabled={!canDecrement} onClick={() => onChange(-1)}>
      <MdRemove />
    </StepperButton>
    <StepperButton disabled={!canIncrement} onClick={() => onChange(1)}>
      <MdAdd />
    </StepperButton>
  </div>
);
