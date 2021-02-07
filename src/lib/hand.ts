import { compare_tile } from './tile';
import type { NumberTile, Tile } from './tile';

export interface Pong {
  type: 'pong';
  tile: Tile;
}

export interface Chow {
  type: 'chow';
  first: {
    type: NumberTile['type'];
    number: Exclude<NumberTile['number'], 8 | 9>;
  };
}

export interface Kong {
  type: 'kong';
  tile: Tile;
  concealed: boolean;
}

export type Meld = Pong | Chow | Kong;

export const instantiate_meld = (meld: Meld): Tile[] => {
  if (meld.type === 'pong') {
    return [meld.tile, meld.tile, meld.tile];
  } else if (meld.type === 'chow') {
    return [
      meld.first,
      {
        ...meld.first,
        number: (meld.first.number + 1) as NumberTile['number']
      },
      {
        ...meld.first,
        number: (meld.first.number + 2) as NumberTile['number']
      }
    ];
  } else {
    return [meld.tile, meld.tile, meld.tile, meld.tile];
  }
};

export const instantiate_meld_input = (meld: MeldInput): Tile[] => {
  if (
    (meld.type === 'pong' && typeof meld.tile !== 'undefined') ||
    (meld.type === 'chow' && typeof meld.first !== 'undefined') ||
    (meld.type === 'kong' && typeof meld.tile !== 'undefined')
  )
    return instantiate_meld(meld as Meld);
  return [];
};

type Ti = Tile;
export interface LegalHand {
  legal: [Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti];
}
export type Hand =
  | LegalHand
  | {
      legal: [Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti];
      melds: [Meld];
    }
  | {
      legal: [Ti, Ti, Ti, Ti, Ti, Ti, Ti];
      melds: [Meld, Meld];
    }
  | {
      legal: [Ti, Ti, Ti, Ti];
      melds: [Meld, Meld, Meld];
    }
  | {
      legal: [Ti];
      melds: [Meld, Meld, Meld, Meld];
    };

type PartialRequired<T, K extends keyof T> = Pick<T, K> & Partial<Omit<T, K>>;
type TP = Tile | undefined;
export type MeldInput =
  | PartialRequired<Pong, 'type'>
  | PartialRequired<Chow, 'type'>
  | PartialRequired<Kong, 'type' | 'concealed'>;

export interface LegalInput {
  legal: [TP, TP, TP, TP, TP, TP, TP, TP, TP, TP, TP, TP, TP];
}
export interface SingleLegalInput {
  legal: [TP];
  melds: [MeldInput, MeldInput, MeldInput, MeldInput];
}
export type HandInput =
  | LegalInput
  | {
      legal: [TP, TP, TP, TP, TP, TP, TP, TP, TP, TP];
      melds: [MeldInput];
    }
  | {
      legal: [TP, TP, TP, TP, TP, TP, TP];
      melds: [MeldInput, MeldInput];
    }
  | {
      legal: [TP, TP, TP, TP];
      melds: [MeldInput, MeldInput, MeldInput];
    }
  | SingleLegalInput;

export const EMPTY_INPUT: HandInput = {
  legal: [
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0,
    void 0
  ]
};

export const sort_input = (hand: HandInput): HandInput =>
  ({
    ...hand,
    legal: [...hand.legal].sort((a, b) => {
      if (typeof a === 'undefined' || typeof b === 'undefined') {
        // `undefined` is never evaluated in compare function
        throw new Error();
      }
      return compare_tile(a, b);
    })
  } as HandInput);

export const is_complete_input = (hand: HandInput): hand is Hand => {
  if (hand.legal.some(t => typeof t === 'undefined')) return false;
  if ('melds' in hand) {
    if (
      hand.melds.some(
        m =>
          (m.type === 'pong' && typeof m.tile === 'undefined') ||
          (m.type === 'chow' && typeof m.first === 'undefined') ||
          (m.type === 'kong' && typeof m.tile === 'undefined')
      )
    )
      return false;
  }
  return true;
};

export const has_three_empty_tiles = (
  legal: HandInput['legal']
): legal is Exclude<HandInput['legal'], SingleLegalInput['legal']> =>
  legal.filter(t => typeof t === 'undefined').length >= 3;

export const remove_three_empty_tiles = (
  legal: HandInput['legal']
): Exclude<HandInput['legal'], LegalInput['legal']> => {
  if (!has_three_empty_tiles(legal)) throw new Error();
  const a: TP[] = [];
  let n = 0;
  for (const t of [...legal].reverse()) {
    if (typeof t === 'undefined' && n < 3) {
      n++;
    } else {
      a.push(t);
    }
  }
  return a.reverse() as Exclude<HandInput['legal'], LegalInput['legal']>;
};

export const add_meld = (
  hand: Exclude<HandInput, SingleLegalInput>,
  meld: MeldInput
): Exclude<HandInput, LegalInput> => {
  const legal = remove_three_empty_tiles(hand.legal);
  if ('melds' in hand) {
    return {
      legal,
      melds: [...hand.melds, meld]
    } as Exclude<HandInput, LegalInput>;
  } else {
    return {
      legal,
      melds: [meld]
    } as Exclude<HandInput, LegalInput>;
  }
};

export const remove_meld = (
  hand: Exclude<HandInput, LegalInput>,
  index: number
): Exclude<HandInput, SingleLegalInput> => {
  if (index >= hand.melds.length) throw new Error();
  const legal = [...hand.legal, void 0, void 0, void 0];
  const melds = [...hand.melds];
  melds.splice(index, 1);
  if (melds.length === 0) {
    return { legal } as Exclude<HandInput, SingleLegalInput>;
  }
  return { legal, melds } as Exclude<HandInput, SingleLegalInput>;
};

export const input_to_tiles = (hand: HandInput): Tile[] => {
  const a: Tile[] = [];
  for (const t of hand.legal) {
    if (typeof t === 'undefined') continue;
    a.push(t);
  }
  if ('melds' in hand) {
    for (const m of hand.melds) {
      if (typeof m === 'undefined') continue;
      a.push(...instantiate_meld_input(m));
    }
  }
  return a;
};
