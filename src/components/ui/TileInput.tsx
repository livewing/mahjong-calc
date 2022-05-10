import React, { type FC } from 'react';
import { TileInputArea } from './TileInputArea';
import { TileKeyboard } from './TileKeyboard';

export const TileInput: FC = () => {
  return (
    <div className="flex flex-col gap-2">
      <TileInputArea />
      <TileKeyboard />
    </div>
  );
};
