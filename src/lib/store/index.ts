import { instantiateMeld, type Meld } from '../input';
import { compareTiles, isAvailableTiles } from '../tile';
import { product2, shuffle } from '../util';
import type { Rule } from '../rule';
import type { Tile } from '../tile';
import type { Action } from './action';
import type { AppState } from './state';
import type { Reducer } from 'react';

const reducerImpl: Reducer<AppState, Action> = (state, { type, payload }) => {
  switch (type) {
    case 'set-current-screen':
      return { ...state, currentScreen: payload };
    case 'set-current-scoring-table-tab':
      return { ...state, currentScoringTableTab: payload };
    case 'set-current-settings-tab':
      return { ...state, currentSettingsTab: payload };
    case 'set-app-config':
      return { ...state, appConfig: payload };
    case 'set-current-rule': {
      const prev =
        state.currentRule.red.m !== payload.red.m ||
        state.currentRule.red.p !== payload.red.p ||
        state.currentRule.red.s !== payload.red.s
          ? reducerImpl(state, { type: 'clear-input', payload: null })
          : state;
      return { ...prev, currentRule: payload };
    }
    case 'set-table':
      return { ...state, table: payload };
    case 'set-input-random': {
      const wall = shuffle([
        ...product2(['m', 'p', 's'], [1, 2, 3, 4, 5, 6, 7, 8, 9]).flatMap(
          ([type, n]) => {
            if (n === 5) {
              return [...Array(4)].map(
                (_, i) =>
                  ({
                    type,
                    n,
                    red: i < state.currentRule.red[type as keyof Rule['red']]
                  } as Tile)
              );
            }
            return [...Array(4)].map(() => ({ type, n } as Tile));
          }
        ),
        ...[1, 2, 3, 4, 5, 6, 7].flatMap(n =>
          [...Array(4)].flatMap(() => ({ type: 'z', n } as Tile))
        )
      ]);
      const hand = (
        payload === 'chinitsu'
          ? (() => {
              const type = shuffle(['m', 'p', 's'])[0];
              return wall.filter(t => t.type === type).splice(0, 14);
            })()
          : wall.splice(0, payload)
      ).sort(compareTiles);
      hand.push(...hand.splice(Math.floor(Math.random() * hand.length), 1));
      return {
        ...state,
        input: { hand, melds: [], dora: [] },
        inputFocus: { type: 'hand' }
      };
    }
    case 'set-input-focus':
      return { ...state, inputFocus: payload };
    case 'remove-hand-tile':
      return {
        ...state,
        input: {
          ...state.input,
          hand: (() => {
            const removed = state.input.hand.flatMap((tile, i) =>
              i === payload ? [] : [tile]
            );
            return removed.length % 3 !== 2
              ? removed.sort(compareTiles)
              : removed;
          })()
        },
        inputFocus: { type: 'hand' }
      };
    case 'remove-dora-tile':
      return {
        ...state,
        input: {
          ...state.input,
          dora: state.input.dora.flatMap((tile, i) =>
            i === payload ? [] : [tile]
          )
        },
        inputFocus: { type: 'dora' }
      };
    case 'add-meld':
      if (
        state.input.melds.length < 4 &&
        14 - state.input.melds.length * 3 - state.input.hand.length >= 3
      )
        return {
          ...state,
          input: { ...state.input, melds: [...state.input.melds, payload] },
          inputFocus: { type: 'meld', i: state.input.melds.length }
        };
      else return state;
    case 'update-meld':
      return {
        ...state,
        input: {
          ...state.input,
          melds: state.input.melds.flatMap((meld, i) =>
            i === payload.i ? [payload.meld] : [meld]
          )
        }
      };
    case 'remove-meld':
      return {
        ...state,
        input: {
          ...state.input,
          melds: state.input.melds.flatMap((meld, i) =>
            i === payload ? [] : [meld]
          )
        },
        inputFocus: { type: 'hand' }
      };
    case 'toggle-current-meld-red': {
      if (state.inputFocus.type !== 'meld') return state;
      const meldIndex = state.inputFocus.i;
      const meld = state.input.melds[meldIndex];
      if (meld.tile === null) return state;
      if (meld.type === 'kan') return state;
      const toSwap: Meld | null =
        meld.type === 'pon' && meld.tile.type !== 'z' && meld.tile.n === 5
          ? {
              ...meld,
              tile: { ...meld.tile, red: !meld.tile.red }
            }
          : meld.type === 'chii'
          ? meld.tile.n === 5
            ? {
                ...meld,
                tile: { ...meld.tile, red: !meld.tile.red }
              }
            : meld.tile.n === 3 || meld.tile.n === 4
            ? { ...meld, includeRed: !meld.includeRed }
            : null
          : null;
      if (
        toSwap !== null &&
        isAvailableTiles(
          state.currentRule.red,
          [
            ...state.input.hand,
            ...state.input.melds.flatMap((m, i) =>
              i === meldIndex ? [] : instantiateMeld(m, state.currentRule.red)
            ),
            ...state.input.dora
          ],
          instantiateMeld(toSwap, state.currentRule.red)
        )
      ) {
        return reducerImpl(state, {
          type: 'update-meld',
          payload: { i: meldIndex, meld: toSwap }
        });
      }
      return state;
    }
    case 'clear-input':
      return {
        ...state,
        input: { hand: [], melds: [], dora: [] },
        inputFocus: { type: 'hand' }
      };
    case 'click-tile-keyboard': {
      const allInputTiles = [
        ...state.input.hand,
        ...state.input.melds.flatMap(meld =>
          instantiateMeld(meld, state.currentRule.red)
        ),
        ...state.input.dora
      ];
      switch (state.inputFocus.type) {
        case 'hand':
          if (
            state.input.hand.length < 14 - state.input.melds.length * 3 &&
            isAvailableTiles(state.currentRule.red, allInputTiles, [payload])
          ) {
            return {
              ...state,
              input: {
                ...state.input,
                hand:
                  (state.input.hand.length + 1) % 3 === 2
                    ? [...state.input.hand, payload]
                    : [...state.input.hand, payload].sort(compareTiles)
              }
            };
          }
          return state;
        case 'meld': {
          const meld = state.input.melds[state.inputFocus.i];
          if (meld.tile === null) {
            switch (meld.type) {
              case 'pon': {
                const toAdd: Meld = { type: 'pon', tile: payload };
                if (
                  isAvailableTiles(
                    state.currentRule.red,
                    allInputTiles,
                    instantiateMeld(toAdd, state.currentRule.red)
                  )
                ) {
                  return reducerImpl(state, {
                    type: 'update-meld',
                    payload: { i: state.inputFocus.i, meld: toAdd }
                  });
                }
                break;
              }
              case 'chii': {
                if (payload.type === 'z' || payload.n >= 8) return state;
                const toAddNonRed: Meld = {
                  type: 'chii',
                  tile: payload,
                  includeRed: false
                };
                const toAddRed: Meld = {
                  type: 'chii',
                  tile: payload,
                  includeRed: true
                };
                if (
                  isAvailableTiles(
                    state.currentRule.red,
                    allInputTiles,
                    instantiateMeld(toAddNonRed, state.currentRule.red)
                  )
                ) {
                  return reducerImpl(state, {
                    type: 'update-meld',
                    payload: { i: state.inputFocus.i, meld: toAddNonRed }
                  });
                } else if (
                  isAvailableTiles(
                    state.currentRule.red,
                    allInputTiles,
                    instantiateMeld(toAddRed, state.currentRule.red)
                  )
                ) {
                  return reducerImpl(state, {
                    type: 'update-meld',
                    payload: { i: state.inputFocus.i, meld: toAddRed }
                  });
                }
                break;
              }
              case 'kan': {
                const toAdd: Meld = {
                  type: 'kan',
                  tile: payload,
                  closed: meld.closed
                };
                if (
                  isAvailableTiles(
                    state.currentRule.red,
                    allInputTiles,
                    instantiateMeld(toAdd, state.currentRule.red)
                  )
                ) {
                  return reducerImpl(state, {
                    type: 'update-meld',
                    payload: { i: state.inputFocus.i, meld: toAdd }
                  });
                }
                break;
              }
            }
          }
          return state;
        }
        case 'dora':
          if (
            state.input.dora.length < 10 &&
            isAvailableTiles(state.currentRule.red, allInputTiles, [payload])
          ) {
            return {
              ...state,
              input: {
                ...state.input,
                dora: [...state.input.dora, payload]
              }
            };
          }
          return state;
      }
    }
    case 'set-hand-options':
      return { ...state, handOptions: payload };
    case 'delete-saved-rule':
      return {
        ...state,
        savedRules: Object.entries(state.savedRules).reduce(
          (acc, [name, rule]) =>
            name === payload ? acc : { ...acc, [name]: rule },
          {} as typeof state.savedRules
        )
      };
    case 'save-current-rule':
      return {
        ...state,
        savedRules: { ...state.savedRules, [payload]: state.currentRule }
      };
    default: {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _: never = type;
      return state;
    }
  }
};

export const reducer: Reducer<AppState, Action> = (state, action) => {
  const newState = reducerImpl(state, action);
  localStorage.setItem(
    'store',
    JSON.stringify({ revision: 1, store: newState })
  );
  return newState;
};
