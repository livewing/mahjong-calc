import React from 'react';
import type { FC } from 'react';
import { TileImage } from '../tile-image';
import type { Tile } from '../../lib/tile';
import { BEM } from '../../lib/bem';

const bem = BEM('tile-keyboard');

interface TileKeyboardProps {
  disabled?: undefined | boolean | Tile[];
  onInput?: undefined | ((tile: Tile) => void);
}

interface TileButtonProps {
  tile: Tile;
  disabled: TileKeyboardProps['disabled'];
  onInput?: TileKeyboardProps['onInput'];
}

const TileButton: FC<TileButtonProps> = ({ tile, disabled, onInput }) => {
  const d =
    typeof disabled === 'undefined'
      ? false
      : typeof disabled === 'boolean'
      ? disabled
      : disabled.some(t => {
          if (
            t.type === 'character' ||
            t.type === 'dots' ||
            t.type === 'bamboo'
          )
            return t.type === tile.type && t.number === tile.number;
          return t.type === tile.type;
        });
  const onClick = () => {
    if (d) return;
    onInput && onInput(tile);
  };
  return (
    <div className={bem('tile', d ? 'disabled' : void 0)} onClick={onClick}>
      <TileImage tile={tile} />
    </div>
  );
};

export const TileKeyboard: FC<TileKeyboardProps> = ({ onInput, disabled }) => (
  <div className={bem()}>
    {(['character', 'dots', 'bamboo'] as const).map(t => (
      <div key={t} className={bem('row')}>
        {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(i => (
          <TileButton
            key={i}
            tile={{ type: t, number: i }}
            disabled={disabled}
            onInput={onInput}
          />
        ))}
      </div>
    ))}
    <div className={bem('row')}>
      {([
        'east',
        'south',
        'west',
        'north',
        'white',
        'green',
        'red'
      ] as const).map(t => (
        <TileButton
          key={t}
          tile={{ type: t }}
          disabled={disabled}
          onInput={onInput}
        />
      ))}
    </div>
  </div>
);
