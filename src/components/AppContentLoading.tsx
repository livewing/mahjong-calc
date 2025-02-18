import type { FC } from 'react';
import Stick1000 from '../images/point-stick/1000.svg?react';

export const AppContentLoading: FC = () => (
  <div className="flex flex-1 items-center justify-center bg-neutral-100 dark:bg-neutral-900 transition">
    <Stick1000 className="w-32 grayscale dark:invert transition rotate-30 motion-safe:animate-pulse" />
  </div>
);
