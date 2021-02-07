import React from 'react';
import type { FC } from 'react';
import { TileImage } from '../../tile-image';
import { TileOrBack } from '../../../lib/tile';
import type { BEM } from '../../../lib/bem';

interface PieceProps {
  tile?: TileOrBack | undefined;
  bem: ReturnType<typeof BEM>;
}

export const Piece: FC<PieceProps> = ({ tile, bem }) => {
  if (tile) {
    return (
      <div className={bem('piece')}>
        <TileImage tile={tile} />
      </div>
    );
  } else {
    return (
      <div className={bem('piece', 'empty')}>
        <TileImage tile={{ type: 'white' }} />
      </div>
    );
  }
};
