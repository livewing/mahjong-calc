import { TileInputArea } from './TileInputArea';
import { TileKeyboard } from './TileKeyboard';
import type { FC } from 'react';

export const TileInput: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <TileInputArea />
      <TileKeyboard />
    </div>
  );
};
