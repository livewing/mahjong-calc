import React from 'react';
import { useTranslation } from 'react-i18next';
import { BEM } from '../../lib/bem';
import type { FC } from 'react';

const bem = BEM('stepper');

interface StepperProps {
  disabled?: undefined | boolean;
  min: number;
  max: number;
  value: number;
  defaultValue: number;
  onChanged?: undefined | ((value: number) => void);
}

export const Stepper: FC<StepperProps> = ({
  disabled,
  min,
  max,
  value,
  defaultValue,
  onChanged
}) => {
  const { t } = useTranslation();

  const onClick = (after: number) => () => {
    if (disabled) return;
    if (value === after) return;
    onChanged && onChanged(after);
  };

  return (
    <div className={bem()}>
      <div className={bem('wrapper', disabled ? 'disabled' : void 0)}>
        <div
          className={bem('reset', disabled ? 'disabled' : void 0)}
          onClick={onClick(defaultValue)}
        >
          {t('ui.reset')}
        </div>
        <div
          className={bem(
            'step',
            disabled || value <= min ? 'disabled' : void 0
          )}
          onClick={value > min ? onClick(value - 1) : void 0}
        >
          -
        </div>
        <div className={bem('value', disabled ? 'disabled' : void 0)}>
          {value}
        </div>
        <div
          className={bem(
            'step',
            disabled || value >= max ? 'disabled' : void 0
          )}
          onClick={value < max ? onClick(value + 1) : void 0}
        >
          +
        </div>
      </div>
    </div>
  );
};
