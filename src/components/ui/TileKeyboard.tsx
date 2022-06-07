import React, { type FC } from 'react';
import { useStore } from '../../contexts/store';
import { instantiateMeld } from '../../lib/input';
import { isAvailableTiles, type Tile } from '../../lib/tile';
import { TileButton } from './TileButton';

export const TileKeyboard: FC = () => {
  const [
    {
      input,
      currentRule: { red },
      inputFocus
    },
    dispatch
  ] = useStore();

  const showNonRed = red.m !== 4 || red.p !== 4 || red.s !== 4;
  const showRed = red.m !== 0 || red.p !== 0 || red.s !== 0;

  const allInputTiles = [
    ...input.hand,
    ...input.melds.flatMap(meld => instantiateMeld(meld, red)),
    ...input.dora
  ];
  const isDisabled = (tile: Tile) =>
    inputFocus.type === 'hand'
      ? !isAvailableTiles(red, allInputTiles, [tile]) ||
        input.hand.length >= 14 - input.melds.length * 3
      : inputFocus.type === 'dora'
      ? !isAvailableTiles(red, allInputTiles, [tile]) || input.dora.length >= 10
      : input.melds[inputFocus.i]?.tile !== null ||
        (input.melds[inputFocus.i]?.type === 'chii'
          ? tile.type === 'z' ||
            tile.n >= 8 ||
            !isAvailableTiles(
              red,
              allInputTiles,
              instantiateMeld({ type: 'chii', tile, includeRed: false }, red)
            )
          : input.melds[inputFocus.i]?.type === 'pon'
          ? !isAvailableTiles(
              red,
              allInputTiles,
              instantiateMeld({ type: 'pon', tile }, red)
            )
          : input.melds[inputFocus.i]?.type === 'kan'
          ? !isAvailableTiles(
              red,
              allInputTiles,
              instantiateMeld({ type: 'kan', tile, closed: true }, red)
            )
          : true);
  return (
    <div className="flex flex-col gap-px max-w-lg select-none">
      {(['m', 'p', 's'] as const).map(type => (
        <div key={type} className="flex gap-px">
          {([1, 2, 3, 4, 5, 6, 7, 8, 9] as const).map(n => (
            <React.Fragment key={n}>
              {n === 5 && showNonRed && (
                <TileButton
                  tile={{ type, n, red: false }}
                  disabled={
                    red[type] === 4 || isDisabled({ type, n, red: false })
                  }
                  onClick={() =>
                    dispatch({
                      type: 'click-tile-keyboard',
                      payload: { type, n, red: false }
                    })
                  }
                />
              )}
              {n === 5 && showRed && (
                <TileButton
                  tile={{ type, n, red: true }}
                  disabled={
                    red[type] === 0 || isDisabled({ type, n, red: true })
                  }
                  onClick={() =>
                    dispatch({
                      type: 'click-tile-keyboard',
                      payload: { type, n, red: true }
                    })
                  }
                />
              )}
              {n !== 5 && (
                <TileButton
                  tile={{ type, n }}
                  disabled={isDisabled({ type, n })}
                  onClick={() =>
                    dispatch({
                      type: 'click-tile-keyboard',
                      payload: { type, n }
                    })
                  }
                />
              )}
            </React.Fragment>
          ))}
        </div>
      ))}
      <div className="flex gap-px">
        {([1, 2, 3, 4, 5, 6, 7] as const).map(n => (
          <TileButton
            key={n}
            tile={{ type: 'z', n }}
            disabled={isDisabled({ type: 'z', n })}
            onClick={() =>
              dispatch({
                type: 'click-tile-keyboard',
                payload: { type: 'z', n }
              })
            }
          />
        ))}
        <div className="w-full" />
        <div className="w-full" />
        {showNonRed && showRed && <div className="w-full" />}
      </div>
    </div>
  );
};
