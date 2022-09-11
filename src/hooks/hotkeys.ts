import { useEffect, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { useStore } from '../contexts/store';
import { instantiateMeld } from '../lib/input';
import { compareTiles, isAvailableTiles, type Tile } from '../lib/tile';
import type { Meld } from '../lib/input';

export const useTileInputAreaHotkeys = () => {
  const [inputString, setInputString] = useState('');
  const [
    {
      currentRule,
      input: { dora, hand, melds },
      inputFocus
    },
    dispatch
  ] = useStore();
  useEffect(() => setInputString(''), [inputFocus, dora, hand, melds]);
  useHotkeys('ctrl+backspace, cmd+backspace', () =>
    dispatch({ type: 'clear-input', payload: null })
  );
  useHotkeys(
    'up',
    e => {
      if (inputFocus.type !== 'dora') {
        dispatch({ type: 'set-input-focus', payload: { type: 'dora' } });
        e.preventDefault();
      }
    },
    [inputFocus]
  );
  useHotkeys(
    'down',
    e => {
      if (inputFocus.type === 'dora') {
        dispatch({ type: 'set-input-focus', payload: { type: 'hand' } });
        e.preventDefault();
      }
    },
    [inputFocus]
  );
  useHotkeys(
    'left',
    e => {
      if (inputFocus.type === 'meld') {
        dispatch({
          type: 'set-input-focus',
          payload:
            inputFocus.i === melds.length - 1
              ? { type: 'hand' }
              : { type: 'meld', i: inputFocus.i + 1 }
        });
        e.preventDefault();
      }
    },
    [melds, inputFocus]
  );
  useHotkeys(
    'right',
    e => {
      if (inputFocus.type === 'meld' && inputFocus.i > 0) {
        dispatch({
          type: 'set-input-focus',
          payload: { type: 'meld', i: inputFocus.i - 1 }
        });
        e.preventDefault();
      } else if (inputFocus.type === 'hand' && melds.length > 0) {
        dispatch({
          type: 'set-input-focus',
          payload: { type: 'meld', i: melds.length - 1 }
        });
        e.preventDefault();
      }
    },
    [melds, inputFocus]
  );
  useHotkeys(
    'backspace, ctrl+h',
    e => {
      if (inputString.length > 0) {
        setInputString(inputString =>
          inputString.substring(0, inputString.length - 1)
        );
        e.preventDefault();
      } else if (inputFocus.type === 'dora' && dora.length > 0) {
        dispatch({ type: 'remove-dora-tile', payload: dora.length - 1 });
        e.preventDefault();
      } else if (inputFocus.type === 'hand' && hand.length > 0) {
        dispatch({ type: 'remove-hand-tile', payload: hand.length - 1 });
        e.preventDefault();
      } else if (inputFocus.type === 'meld') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const meld = melds[inputFocus.i]!;
        if (meld.tile === null) {
          dispatch({ type: 'remove-meld', payload: inputFocus.i });
        } else {
          dispatch({
            type: 'update-meld',
            payload: { meld: { ...meld, tile: null }, i: inputFocus.i }
          });
        }
        e.preventDefault();
      }
    },
    [dora, hand, melds, inputFocus, inputString]
  );
  useHotkeys(
    '0, 1, 2, 3, 4, 5, 6, 7, 8, 9',
    e => {
      const l = inputString.length;
      if (
        inputString
          .split('')
          .reduce((acc, cur) => acc + (cur === e.key ? 1 : 0), 0) >= 4
      )
        return;
      if (
        (inputFocus.type === 'dora' && l + dora.length < 10) ||
        (inputFocus.type === 'hand' &&
          l + hand.length - melds.length * 3 < 14) ||
        (inputFocus.type === 'meld' &&
          l === 0 &&
          melds[inputFocus.i]?.tile === null &&
          !(melds[inputFocus.i]?.type === 'chii' && /[89]/.test(e.key)))
      ) {
        setInputString(inputString => `${inputString}${e.key}`);
        e.preventDefault();
      }
    },
    [dora, hand, melds, inputFocus, inputString]
  );
  useHotkeys(
    'm, p, s, z',
    e => {
      console.log(inputString, /^[0-9]+$/.test(inputString));
      if (!/^[0-9]+$/.test(inputString)) return;
      const type = e.key as 'm' | 'p' | 's' | 'z';
      if (type === 'z' && /[089]/.test(inputString)) return;
      const addTiles = inputString.split('').map(ns => {
        const n = Number.parseInt(ns);
        return (
          type !== 'z' && (n === 0 || n === 5)
            ? { type, n: 5, red: n === 0 }
            : { type, n }
        ) as Tile;
      });
      const allInputTiles = [
        ...hand,
        ...melds.flatMap(meld => instantiateMeld(meld, currentRule.red)),
        ...dora
      ];
      if (
        inputFocus.type === 'dora' &&
        isAvailableTiles(currentRule.red, allInputTiles, addTiles)
      ) {
        dispatch({
          type: 'set-input',
          payload: { dora: [...dora, ...addTiles].slice(0, 10), hand, melds }
        });
        e.preventDefault();
      } else if (
        inputFocus.type === 'hand' &&
        isAvailableTiles(currentRule.red, allInputTiles, addTiles)
      ) {
        const h = [...hand, ...addTiles];
        dispatch({
          type: 'set-input',
          payload: {
            dora,
            hand: (h.length % 3 === 2
              ? [
                  ...h.slice(0, h.length - 1).sort(compareTiles),
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  h[h.length - 1]!
                ]
              : h.sort(compareTiles)
            ).slice(0, 14 - melds.length * 3),
            melds
          }
        });
        e.preventDefault();
      } else if (inputFocus.type === 'meld') {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const meld = melds[inputFocus.i]!;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const tile = addTiles[0]!;

        if (meld.tile !== null) return;
        if (meld.type === 'chii' && (tile.type === 'z' || tile.n >= 8)) return;
        if (
          isAvailableTiles(
            currentRule.red,
            allInputTiles,
            instantiateMeld({ ...meld, tile } as Meld, currentRule.red)
          )
        ) {
          dispatch({
            type: 'update-meld',
            payload: { meld: { ...meld, tile } as Meld, i: inputFocus.i }
          });
          e.preventDefault();
        }
      }
    },
    [dora, hand, melds, inputFocus, inputString, currentRule]
  );
  useHotkeys('esc', e => {
    setInputString('');
    e.preventDefault();
  });
  useHotkeys('shift+s', e => {
    dispatch({ type: 'set-input-random', payload: 5 });
    e.preventDefault();
  });
  useHotkeys('shift+d', e => {
    dispatch({ type: 'set-input-random', payload: 8 });
    e.preventDefault();
  });
  useHotkeys('shift+f', e => {
    dispatch({ type: 'set-input-random', payload: 11 });
    e.preventDefault();
  });
  useHotkeys('shift+g', e => {
    dispatch({ type: 'set-input-random', payload: 14 });
    e.preventDefault();
  });
  useHotkeys('shift+z', e => {
    dispatch({ type: 'set-input-random', payload: 'chinitsu' });
    e.preventDefault();
  });
  useHotkeys(
    'shift+p',
    e => {
      if (melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3) return;
      dispatch({ type: 'add-meld', payload: { type: 'pon', tile: null } });
      e.preventDefault();
    },
    [hand, melds]
  );
  useHotkeys(
    'shift+c',
    e => {
      if (melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3) return;
      dispatch({
        type: 'add-meld',
        payload: { type: 'chii', tile: null, includeRed: false }
      });
      e.preventDefault();
    },
    [hand, melds]
  );
  useHotkeys(
    'shift+m',
    e => {
      if (melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3) return;
      dispatch({
        type: 'add-meld',
        payload: { type: 'kan', tile: null, closed: false }
      });
      e.preventDefault();
    },
    [hand, melds]
  );
  useHotkeys(
    'shift+a',
    e => {
      if (melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3) return;
      dispatch({
        type: 'add-meld',
        payload: { type: 'kan', tile: null, closed: true }
      });
      e.preventDefault();
    },
    [hand, melds]
  );
  useHotkeys('shift+r', e => {
    dispatch({ type: 'toggle-current-meld-red', payload: null });
    e.preventDefault();
  });
  return inputString;
};
