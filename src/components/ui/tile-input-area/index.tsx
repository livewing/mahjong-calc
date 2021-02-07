import React, { useState } from 'react';
import type { FC } from 'react';
import { BEM } from '../../../lib/bem';
import {
  add_meld,
  EMPTY_INPUT,
  has_three_empty_tiles,
  remove_meld,
  sort_input
} from '../../../lib/hand';
import type { HandInput, MeldInput, SingleLegalInput } from '../../../lib/hand';
import { Button } from '../button';
import { Piece } from './piece';
import { MeldPiece } from './meld-piece';

const bem = BEM('tile-input-area');

export type TileInputAreaFocus =
  | {
      type: 'legal';
    }
  | {
      type: 'melds';
      index: number;
    };

interface TileInputAreaProps {
  value: HandInput;
  onInput?: undefined | ((hand: HandInput) => void);
  onFocusChange?: undefined | ((focus: TileInputAreaFocus) => void);
}

export const TileInputArea: FC<TileInputAreaProps> = ({
  value,
  onInput,
  onFocusChange
}) => {
  const sortedValue = sort_input(value);
  const [focus, setFocus] = useState<TileInputAreaFocus>({ type: 'legal' });

  const onSetFocus = (newFocus: TileInputAreaFocus) => {
    if (newFocus.type === 'legal' && focus.type === 'legal') return;
    if (
      newFocus.type === 'melds' &&
      focus.type === 'melds' &&
      newFocus.index === focus.index
    )
      return;
    setFocus(newFocus);
    onFocusChange && onFocusChange(newFocus);
  };
  const onSetValue = (
    newValue: HandInput,
    focus: TileInputAreaFocus = { type: 'legal' }
  ) => {
    const sortedNewValue = sort_input(newValue);
    onSetFocus(focus);
    onInput && onInput(sortedNewValue);
  };

  const canMeld = has_three_empty_tiles(value.legal);

  const addMeld = (meld: MeldInput): void => {
    if (!canMeld) return;
    const newValue = add_meld(
      sortedValue as Exclude<HandInput, SingleLegalInput>,
      meld
    );
    onSetValue(newValue);
    onSetFocus({ type: 'melds', index: newValue.melds.length - 1 });
  };

  return (
    <div className={bem()}>
      <div className={bem('hand')}>
        <div
          className={bem('legal', focus.type === 'legal' ? 'focus' : void 0)}
          onClick={() => onSetFocus({ type: 'legal' })}
        >
          {sortedValue.legal.map((t, i) => (
            <div
              key={i}
              onClick={() => {
                if (focus.type === 'legal' && typeof t !== 'undefined') {
                  const newHand = sortedValue;
                  newHand.legal[i] = void 0;
                  onSetValue(newHand);
                }
              }}
            >
              <Piece bem={bem} tile={t} />
            </div>
          ))}
        </div>
        {'melds' in sortedValue && (
          <div className={bem('melds')}>
            {sortedValue.melds.map((m, i) => (
              <div
                key={i}
                className={bem(
                  'meld',
                  focus.type === 'melds' && focus.index === i ? 'focus' : void 0
                )}
                onClick={() => {
                  if (focus.type === 'melds' && focus.index === i) {
                    if (m.type === 'pong') {
                      if (typeof m.tile !== 'undefined') {
                        const newValue = sortedValue;
                        newValue.melds[i] = { type: 'pong' };
                        onSetValue(newValue, { type: 'melds', index: i });
                      } else {
                        onSetValue(remove_meld(sortedValue, i));
                      }
                    } else if (m.type === 'chow') {
                      if (typeof m.first !== 'undefined') {
                        const newValue = sortedValue;
                        newValue.melds[i] = { type: 'chow' };
                        onSetValue(newValue, { type: 'melds', index: i });
                      } else {
                        onSetValue(remove_meld(sortedValue, i));
                      }
                    } else if (m.type === 'kong') {
                      if (typeof m.tile !== 'undefined') {
                        const newValue = sortedValue;
                        newValue.melds[i] = {
                          type: 'kong',
                          concealed: m.concealed
                        };
                        onSetValue(newValue, { type: 'melds', index: i });
                      } else {
                        onSetValue(remove_meld(sortedValue, i));
                      }
                    }
                  } else {
                    onSetFocus({ type: 'melds', index: i });
                  }
                }}
              >
                <MeldPiece bem={bem} meld={m} />
              </div>
            ))}
          </div>
        )}
      </div>
      <div className={bem('buttons')}>
        <Button modifier="danger" onClick={() => onSetValue(EMPTY_INPUT)}>
          クリア
        </Button>
        <Button
          disabled={!canMeld}
          onClick={() => {
            addMeld({ type: 'pong' });
          }}
        >
          ポン
        </Button>
        <Button
          disabled={!canMeld}
          onClick={() => {
            addMeld({ type: 'chow' });
          }}
        >
          チー
        </Button>
        <Button
          disabled={!canMeld}
          onClick={() => {
            addMeld({ type: 'kong', concealed: false });
          }}
        >
          明槓
        </Button>
        <Button
          disabled={!canMeld}
          onClick={() => {
            addMeld({ type: 'kong', concealed: true });
          }}
        >
          暗槓
        </Button>
      </div>
    </div>
  );
};
