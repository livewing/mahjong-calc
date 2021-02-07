import React from 'react';
import type { FC } from 'react';
import type { BEM } from '../../../lib/bem';
import { MeldInput } from '../../../lib/hand';
import { Piece } from './piece';

interface MeldPieceProps {
  meld: MeldInput;
  bem: ReturnType<typeof BEM>;
}

export const MeldPiece: FC<MeldPieceProps> = ({ meld, bem }) => {
  if (meld.type === 'pong') {
    return (
      <>
        <Piece bem={bem} tile={meld.tile} />
        <Piece bem={bem} tile={meld.tile} />
        <Piece bem={bem} tile={meld.tile} />
      </>
    );
  } else if (meld.type === 'chow') {
    if (meld.first) {
      return (
        <>
          <Piece bem={bem} tile={meld.first} />
          <Piece
            bem={bem}
            tile={{
              ...meld.first,
              number: (meld.first.number + 1) as 2 | 3 | 4 | 5 | 6 | 7 | 8
            }}
          />
          <Piece
            bem={bem}
            tile={{
              ...meld.first,
              number: (meld.first.number + 2) as 3 | 4 | 5 | 6 | 7 | 8 | 9
            }}
          />
        </>
      );
    } else {
      return (
        <>
          <Piece bem={bem} />
          <Piece bem={bem} />
          <Piece bem={bem} />
        </>
      );
    }
  } else if (meld.type === 'kong') {
    if (meld.concealed) {
      if (meld.tile) {
        return (
          <>
            <Piece bem={bem} tile={{ type: 'back' }} />
            <Piece bem={bem} tile={meld.tile} />
            <Piece bem={bem} tile={meld.tile} />
            <Piece bem={bem} tile={{ type: 'back' }} />
          </>
        );
      } else {
        return (
          <>
            <Piece bem={bem} />
            <Piece bem={bem} />
            <Piece bem={bem} />
            <Piece bem={bem} />
          </>
        );
      }
    } else {
      return (
        <>
          <Piece bem={bem} tile={meld.tile} />
          <Piece bem={bem} tile={meld.tile} />
          <Piece bem={bem} tile={meld.tile} />
          <Piece bem={bem} tile={meld.tile} />
        </>
      );
    }
  }
  throw new Error();
};
