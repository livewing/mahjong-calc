import React, { useState } from 'react';
import type { FC } from 'react';
import { Container } from './container';
import { TileInputArea } from './tile-input-area';
import type { TileInputAreaFocus } from './tile-input-area';
import { TileKeyboard } from './tile-keyboard';
import { BEM } from '../../lib/bem';
import { EMPTY_INPUT, input_to_tiles, sort_input } from '../../lib/hand';
import type { HandInput } from '../../lib/hand';
import { count_tiles, string_to_tile, tile_to_string } from '../../lib/tile';
import type { Tile, TileString } from '../../lib/tile';

const bem = BEM('tile-input');

interface TileInputProps {
  onChange?: undefined | ((hand: HandInput) => void);
}

export const TileInput: FC<TileInputProps> = ({ onChange }) => {
  const [focus, setFocus] = useState<TileInputAreaFocus>({ type: 'legal' });
  const [value, setValue] = useState(EMPTY_INPUT);
  const onSetValue = (newValue: HandInput) => {
    const si = sort_input(newValue);
    setValue(si);
    onChange && onChange(si);
  };
  const onKeyboardInput = (tile: Tile) => {
    if (focus.type === 'legal') {
      const newLegal = [...value.legal];
      for (const i in [...Array(newLegal.length)]) {
        if (typeof newLegal[i] === 'undefined') {
          newLegal[i] = tile;
          break;
        }
      }
      onSetValue({ ...value, legal: newLegal } as HandInput);
    } else if (focus.type === 'melds' && 'melds' in value) {
      const meld = value.melds[focus.index];
      if (meld.type === 'pong' && typeof meld.tile === 'undefined') {
        const newMelds = [...value.melds];
        newMelds[focus.index] = { ...meld, tile };
        onSetValue({ ...value, melds: newMelds } as HandInput);
      } else if (meld.type === 'chow' && typeof meld.first === 'undefined') {
        if (
          tile.type !== 'character' &&
          tile.type !== 'dots' &&
          tile.type !== 'bamboo'
        )
          return;
        if (tile.number === 8 || tile.number === 9) return;

        const newMelds = [...value.melds];
        newMelds[focus.index] = {
          ...meld,
          first: { type: tile.type, number: tile.number }
        };
        onSetValue({ ...value, melds: newMelds } as HandInput);
      } else if (meld.type === 'kong' && typeof meld.tile === 'undefined') {
        const newMelds = [...value.melds];
        newMelds[focus.index] = { ...meld, tile };
        onSetValue({ ...value, melds: newMelds } as HandInput);
      }
    }
  };
  const keyboardDisabled: Tile[] | boolean = (() => {
    const a: Tile[] = [];
    const counts = count_tiles(input_to_tiles(value));
    if (focus.type === 'legal') {
      if (value.legal.every(t => typeof t !== 'undefined')) return true;
      for (const key of Object.keys(counts)) {
        const ts = key as TileString;
        if ((counts[ts] as number) >= 4) {
          a.push(string_to_tile(ts));
        }
      }
    } else if (focus.type === 'melds' && 'melds' in value) {
      const meld = value.melds[focus.index];
      if (meld.type === 'pong') {
        if (typeof meld.tile !== 'undefined') return true;
        for (const key of Object.keys(counts)) {
          const ts = key as TileString;
          if ((counts[ts] as number) >= 2) {
            a.push(string_to_tile(ts));
          }
        }
      } else if (meld.type === 'chow') {
        if (typeof meld.first !== 'undefined') return true;
        a.push(
          { type: 'character', number: 8 },
          { type: 'character', number: 9 },
          { type: 'dots', number: 8 },
          { type: 'dots', number: 9 },
          { type: 'bamboo', number: 8 },
          { type: 'bamboo', number: 9 },
          { type: 'east' },
          { type: 'south' },
          { type: 'west' },
          { type: 'north' },
          { type: 'white' },
          { type: 'green' },
          { type: 'red' }
        );
        for (const type of ['character', 'dots', 'bamboo'] as const) {
          for (const number of [1, 2, 3, 4, 5, 6, 7] as const) {
            for (const delta of [0, 1, 2] as const) {
              const ts = tile_to_string({
                type,
                number: number + delta
              } as Tile);
              if (
                typeof counts[ts] !== 'undefined' &&
                (counts[ts] as number) >= 4
              ) {
                a.push({ type, number });
                break;
              }
            }
          }
        }
      } else if (meld.type === 'kong') {
        if (typeof meld.tile !== 'undefined') return true;
        for (const key of Object.keys(counts)) {
          const ts = key as TileString;
          if ((counts[ts] as number) >= 1) {
            a.push(string_to_tile(ts));
          }
        }
      }
    }
    return a;
  })();
  return (
    <Container header="手牌">
      <TileInputArea
        value={value}
        onFocusChange={setFocus}
        onInput={onSetValue}
      />
      <hr className={bem('separator')} />
      <TileKeyboard disabled={keyboardDisabled} onInput={onKeyboardInput} />
    </Container>
  );
};
