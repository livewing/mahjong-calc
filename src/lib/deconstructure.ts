import type { Hand } from './hand';
import {
  compare_tile,
  compare_tiles,
  count_tiles,
  is_honor_tile,
  string_to_tile,
  tile_equals,
  tile_to_string
} from './tile';
import type { NumberTile, Tile } from './tile';
import { product3 } from './util';

export interface Shuntsu {
  type: 'shuntsu';
  first: Omit<NumberTile, 'number'> & {
    number: Exclude<NumberTile['number'], 8 | 9>;
  };
}
export interface Kotsu {
  type: 'kotsu';
  tile: Tile;
}

export interface Toitsu {
  type: 'toitsu';
  tile: Tile;
}

export interface Ryammen {
  type: 'ryammen';
  first: Omit<NumberTile, 'number'> & {
    number: Exclude<NumberTile['number'], 1 | 8 | 9>;
  };
}

export interface Penchan {
  type: 'penchan';
  first: Omit<NumberTile, 'number'> & {
    number: Exclude<NumberTile['number'], 2 | 3 | 4 | 5 | 6 | 7 | 9>;
  };
}

export interface Kanchan {
  type: 'kanchan';
  first: Omit<NumberTile, 'number'> & {
    number: Exclude<NumberTile['number'], 8 | 9>;
  };
}

export type Mentsu = Shuntsu | Kotsu;
export type Tatsu = Toitsu | Ryammen | Penchan | Kanchan;
type Parts = Mentsu | Tatsu;

export const instantiate_part = (part: Parts): Tile[] => {
  if (part.type === 'shuntsu') {
    const { first } = part;
    return [
      first,
      { ...first, number: (first.number + 1) as NumberTile['number'] },
      { ...first, number: (first.number + 2) as NumberTile['number'] }
    ];
  } else if (part.type === 'kotsu') {
    const { tile } = part;
    return [tile, tile, tile];
  } else if (part.type === 'toitsu') {
    const { tile } = part;
    return [tile, tile];
  } else if (part.type === 'ryammen' || part.type === 'penchan') {
    const { first } = part;
    return [
      first,
      { ...first, number: (first.number + 1) as NumberTile['number'] }
    ];
  } else if (part.type === 'kanchan') {
    const { first } = part;
    return [
      first,
      { ...first, number: (first.number + 2) as NumberTile['number'] }
    ];
  }

  throw new Error();
};

export const make_mentsu_from_tatsu = (tatsu: Tatsu, waiting: Tile): Mentsu => {
  if (tatsu.type === 'ryammen') {
    if (is_honor_tile(waiting)) throw new Error();
    if (tatsu.first.number < waiting.number)
      return { type: 'shuntsu', first: tatsu.first };
    else return { type: 'shuntsu', first: waiting as Shuntsu['first'] };
  } else if (tatsu.type === 'penchan') {
    return {
      type: 'shuntsu',
      first: {
        type: tatsu.first.type,
        number: tatsu.first.number === 1 ? 1 : 7
      }
    };
  } else if (tatsu.type === 'kanchan') {
    return { type: 'shuntsu', first: tatsu.first };
  } else if (tatsu.type === 'toitsu') {
    return { type: 'kotsu', tile: tatsu.tile };
  }

  throw new Error();
};

const has_first_next = (
  legal: Tile[],
  first: (Ryammen | Penchan)['first']
): boolean => {
  const counts = count_tiles(legal);
  return [first, { ...first, number: first.number + 1 }]
    .map(t => tile_to_string(t as NumberTile))
    .every(ts => typeof counts[ts] === 'number' && (counts[ts] as number) >= 1);
};

const has_first_next_plus_one = (
  legal: Tile[],
  first: Kanchan['first']
): boolean => {
  const counts = count_tiles(legal);
  return [first, { ...first, number: first.number + 2 }]
    .map(t => tile_to_string(t as NumberTile))
    .every(ts => typeof counts[ts] === 'number' && (counts[ts] as number) >= 1);
};

const has_shuntsu = (legal: Tile[], first: Shuntsu['first']): boolean => {
  const counts = count_tiles(legal);
  return [
    first,
    { ...first, number: first.number + 1 },
    { ...first, number: first.number + 2 }
  ]
    .map(t => tile_to_string(t as NumberTile))
    .every(ts => typeof counts[ts] === 'number' && (counts[ts] as number) >= 1);
};

const remove_first_next = (legal: Tile[], first: NumberTile): Tile[] => {
  const b = [false, false];
  return legal.filter(t => {
    if (
      t.type === first.type &&
      (t.number === first.number || t.number === first.number + 1) &&
      !b[t.number - first.number]
    ) {
      b[t.number - first.number] = true;
      return false;
    }
    return true;
  });
};

const remove_first_next_plus_one = (
  legal: Tile[],
  first: NumberTile
): Tile[] => {
  const b = [false, false];
  return legal.filter(t => {
    if (
      t.type === first.type &&
      (t.number === first.number || t.number === first.number + 2) &&
      !b[(t.number - first.number) / 2]
    ) {
      b[(t.number - first.number) / 2] = true;
      return false;
    }
    return true;
  });
};

const remove_multiple_tile = (
  legal: Tile[],
  tile: Tile,
  count: number
): Tile[] => {
  let i = 0;
  return legal.filter(t => {
    if (tile_equals(t, tile) && i < count) {
      i++;
      return false;
    }
    return true;
  });
};

const remove_shuntsu = (legal: Tile[], first: NumberTile): Tile[] => {
  const b = [false, false, false];
  return legal.filter(t => {
    if (
      t.type === first.type &&
      t.number >= first.number &&
      t.number <= first.number + 2 &&
      !b[t.number - first.number]
    ) {
      b[t.number - first.number] = true;
      return false;
    }
    return true;
  });
};

interface DeconstructureResult<T> {
  rest: Tile[];
  parts: T[];
}

export const compare_parts = (a: Parts, b: Parts): -1 | 0 | 1 => {
  if (a.type === 'shuntsu' && b.type === 'shuntsu')
    return compare_tile(a.first, b.first);
  if (a.type === 'kotsu' && b.type === 'kotsu')
    return compare_tile(a.tile, b.tile);
  if (a.type === 'toitsu' && b.type === 'toitsu')
    return compare_tile(a.tile, b.tile);
  if (a.type === 'ryammen' && b.type === 'ryammen')
    return compare_tile(a.first, b.first);
  if (a.type === 'penchan' && b.type === 'penchan')
    return compare_tile(a.first, b.first);
  if (a.type === 'kanchan' && b.type === 'kanchan')
    return compare_tile(a.first, b.first);
  return a.type < b.type ? -1 : 1;
};

const compare_deconstructure_result = (
  a: DeconstructureResult<Parts>,
  b: DeconstructureResult<Parts>
): -1 | 0 | 1 => {
  const rrest = compare_tiles(a.rest, b.rest);
  if (rrest !== 0) return rrest;

  if (a.parts.length < b.parts.length) {
    return -1;
  } else if (a.parts.length > b.parts.length) {
    return 1;
  }

  for (let i = 0; i < a.parts.length; i++) {
    const r = compare_parts(a.parts[i], b.parts[i]);
    if (r !== 0) {
      return r;
    }
  }
  return 0;
};

const dedupe_deconstructure_results = (
  results: DeconstructureResult<Parts>[]
): DeconstructureResult<Parts>[] => {
  const sorted = [...results].sort(compare_deconstructure_result);
  const d: DeconstructureResult<Parts>[] = [];
  sorted.forEach(r => {
    if (
      d.length === 0 ||
      compare_deconstructure_result(d[d.length - 1], r) !== 0
    )
      d.push(r);
  });
  return d;
};

const deconstructureIsolatedKotsu = (
  legal: Tile[]
): DeconstructureResult<Kotsu> => {
  let rest = [...legal];
  const k: Kotsu[] = [];
  const counts = count_tiles(rest);

  // wind and dragon
  for (const t of [
    'east',
    'south',
    'west',
    'north',
    'white',
    'green',
    'red'
  ] as const) {
    const tile = { type: t };
    const c = counts[tile_to_string(tile)];
    if (typeof c !== 'undefined' && c >= 3) {
      rest = remove_multiple_tile(rest, tile, 3);
      k.push({ type: 'kotsu', tile });
    }
  }

  // number
  for (const t of ['character', 'dots', 'bamboo'] as const) {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
      const tile = { type: t, number: n };
      const ts = tile_to_string(tile);
      const c = counts[ts];
      if (typeof c === 'undefined' || c < 3) continue;

      let destruct = true;
      for (let d = Math.max(1, n - 2); d <= Math.min(9, n + 2); d++) {
        if (d === n) continue;
        const dc = counts[tile_to_string({ type: t, number: d } as Tile)];
        if (typeof dc !== 'undefined' && dc > 0) {
          destruct = false;
          break;
        }
      }
      if (destruct) {
        rest = remove_multiple_tile(rest, tile, 3);
        k.push({ type: 'kotsu', tile });
      }
    }
  }

  return { rest, parts: k };
};

const deconstructureIsolatedShuntsu = (
  legal: Tile[]
): DeconstructureResult<Shuntsu> => {
  let rest = [...legal];
  const s: Shuntsu[] = [];
  const counts = count_tiles(rest);

  for (const t of ['character', 'dots', 'bamboo'] as const) {
    for (const n of [1, 2, 3, 4, 5, 6, 7] as const) {
      const tile = { type: t, number: n };
      const ts = [
        tile_to_string(tile),
        tile_to_string({ ...tile, number: n + 1 } as Tile),
        tile_to_string({ ...tile, number: n + 2 } as Tile)
      ];
      const c = ts.map(s => counts[s]);
      if (c.some(c => typeof c === 'undefined' || c !== 1)) continue;

      let destruct = true;
      for (let d = Math.max(1, n - 2); d <= Math.min(9, n + 2 + 2); d++) {
        if (d >= n && d <= n + 2) continue;
        const dc = counts[tile_to_string({ type: t, number: d } as Tile)];
        if (typeof dc !== 'undefined' && dc > 0) {
          destruct = false;
          break;
        }
      }
      if (destruct) {
        rest = remove_shuntsu(rest, tile);
        s.push({ type: 'shuntsu', first: tile });
      }
    }
  }

  return { rest, parts: s };
};

const deconstructureIsolatedTile = (
  legal: Tile[]
): DeconstructureResult<Tile> => {
  let rest = [...legal];
  const iso: Tile[] = [];
  const counts = count_tiles(rest);

  // wind and dragon
  for (const t of [
    'east',
    'south',
    'west',
    'north',
    'white',
    'green',
    'red'
  ] as const) {
    const tile = { type: t };
    const c = counts[tile_to_string(tile)];
    if (typeof c !== 'undefined' && c === 1) {
      rest = rest.filter(t => t.type !== tile.type);
      iso.push(tile);
    }
  }

  // number
  for (const t of ['character', 'dots', 'bamboo'] as const) {
    for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
      const tile = { type: t, number: n };
      const ts = tile_to_string(tile);
      const c = counts[ts];
      if (typeof c === 'undefined' || c !== 1) continue;

      let destruct = true;
      for (let d = Math.max(1, n - 2); d <= Math.min(9, n + 2); d++) {
        if (d === n) continue;
        const dc = counts[tile_to_string({ type: t, number: d } as Tile)];
        if (typeof dc !== 'undefined' && dc > 0) {
          destruct = false;
          break;
        }
      }
      if (destruct) {
        rest = rest.filter(
          t => t.type !== tile.type || t.number !== tile.number
        );
        iso.push(tile);
      }
    }
  }

  return { rest, parts: iso };
};

const deconstructureIsolated = (
  legal: Tile[]
): DeconstructureResult<Mentsu> & { isolatedTiles: Tile[] } => {
  const { rest: rest1, parts: kotsu } = deconstructureIsolatedKotsu(legal);
  const { rest: rest2, parts: shuntsu } = deconstructureIsolatedShuntsu(rest1);
  const { rest: rest3, parts: isolated } = deconstructureIsolatedTile(rest2);
  return {
    rest: rest3,
    parts: [...kotsu, ...shuntsu].sort(compare_parts),
    isolatedTiles: isolated.sort(compare_tile)
  };
};

const deconstructureKotsu = (
  legal: Tile[],
  type: NumberTile['type']
): DeconstructureResult<Mentsu>[] => {
  const results: DeconstructureResult<Mentsu>[] = [];
  const counts = count_tiles(legal.filter(t => t.type === type));
  const kotsuCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(k => typeof counts[k] !== 'undefined' && (counts[k] as number) >= 3);

  if (kotsuCandidates.length === 0) {
    return [{ rest: legal, parts: [] }];
  }

  for (const kotsu of kotsuCandidates) {
    const kotsuTile = string_to_tile(kotsu);
    const rest = remove_multiple_tile(legal, kotsuTile, 3);

    results.push(
      ...deconstructureKotsu(rest, type).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, { type: 'kotsu' as const, tile: kotsuTile }].sort(
              compare_parts
            )
          } as DeconstructureResult<Mentsu>)
      )
    );

    results.push(
      ...deconstructureShuntsu(rest, type).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, { type: 'kotsu' as const, tile: kotsuTile }].sort(
              compare_parts
            )
          } as DeconstructureResult<Mentsu>)
      )
    );
  }

  return results;
};

const deconstructureShuntsu = (
  legal: Tile[],
  type: NumberTile['type']
): DeconstructureResult<Mentsu>[] => {
  const results: DeconstructureResult<Mentsu>[] = [];
  const counts = count_tiles(
    legal.filter(t => t.type === type && t.number <= 7)
  );
  const shuntsuCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(
    k =>
      typeof counts[k] !== 'undefined' &&
      has_shuntsu(legal, string_to_tile(k) as Shuntsu['first'])
  );

  if (shuntsuCandidates.length === 0) {
    return [{ rest: legal, parts: [] }];
  }

  for (const shuntsu of shuntsuCandidates) {
    const shuntsuFirst = string_to_tile(shuntsu);
    const rest = remove_shuntsu(legal, shuntsuFirst as Shuntsu['first']);

    results.push(
      ...deconstructureKotsu(rest, type).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'shuntsu', first: shuntsuFirst } as Shuntsu
            ].sort(compare_parts)
          } as DeconstructureResult<Mentsu>)
      )
    );

    results.push(
      ...deconstructureShuntsu(rest, type).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'shuntsu', first: shuntsuFirst } as Shuntsu
            ].sort(compare_parts)
          } as DeconstructureResult<Mentsu>)
      )
    );
  }

  return results;
};

const deconstructureToitsu = (
  legal: Tile[],
  type: NumberTile['type'],
  recurse: number
): DeconstructureResult<Tatsu>[] => {
  const results: DeconstructureResult<Tatsu>[] = [];
  const counts = count_tiles(legal.filter(t => t.type === type));
  const toitsuCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(k => typeof counts[k] !== 'undefined' && (counts[k] as number) >= 2);

  if (recurse === 0 || toitsuCandidates.length === 0) {
    return [{ rest: legal, parts: [] }];
  }

  for (const toitsu of toitsuCandidates) {
    const toitsuTile = string_to_tile(toitsu);
    const rest = remove_multiple_tile(legal, toitsuTile, 2);

    results.push(
      ...deconstructureToitsu(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'toitsu' as const, tile: toitsuTile }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureRyammenAndPenchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'toitsu' as const, tile: toitsuTile }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureKanchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'toitsu' as const, tile: toitsuTile }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );
  }

  return results;
};

const deconstructureRyammenAndPenchan = (
  legal: Tile[],
  type: NumberTile['type'],
  recurse: number
): DeconstructureResult<Tatsu>[] => {
  const results: DeconstructureResult<Tatsu>[] = [];
  const counts = count_tiles(
    legal.filter(t => t.type === type && t.number <= 8)
  );
  const ryammenAndPenchanCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(
    k =>
      typeof counts[k] !== 'undefined' &&
      has_first_next(legal, string_to_tile(k) as (Ryammen | Penchan)['first'])
  );

  if (recurse === 0 || ryammenAndPenchanCandidates.length === 0) {
    return [{ rest: legal, parts: [] }];
  }

  for (const ryammenOrPenchan of ryammenAndPenchanCandidates) {
    const ryammenOrPenchanFirst = string_to_tile(ryammenOrPenchan) as (
      | Ryammen
      | Penchan
    )['first'];
    const rest = remove_first_next(
      legal,
      ryammenOrPenchanFirst as (Ryammen | Penchan)['first']
    );

    const part: Ryammen | Penchan = (() => {
      if (
        ryammenOrPenchanFirst.number === 1 ||
        ryammenOrPenchanFirst.number === 8
      ) {
        return { type: 'penchan', first: ryammenOrPenchanFirst } as Penchan;
      } else {
        return { type: 'ryammen', first: ryammenOrPenchanFirst } as Ryammen;
      }
    })();

    results.push(
      ...deconstructureToitsu(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, part].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureRyammenAndPenchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, part].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureKanchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, part].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );
  }

  return results;
};

const deconstructureKanchan = (
  legal: Tile[],
  type: NumberTile['type'],
  recurse: number
): DeconstructureResult<Tatsu>[] => {
  const results: DeconstructureResult<Tatsu>[] = [];
  const counts = count_tiles(
    legal.filter(t => t.type === type && t.number <= 7)
  );
  const kanchanCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(
    k =>
      typeof counts[k] !== 'undefined' &&
      has_first_next_plus_one(legal, string_to_tile(k) as Kanchan['first'])
  );

  if (recurse === 0 || kanchanCandidates.length === 0) {
    return [{ rest: legal, parts: [] }];
  }

  for (const kanchan of kanchanCandidates) {
    const kanchanFirst = string_to_tile(kanchan) as Kanchan['first'];
    const rest = remove_first_next_plus_one(
      legal,
      kanchanFirst as Kanchan['first']
    );

    results.push(
      ...deconstructureToitsu(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'kanchan' as const, first: kanchanFirst }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureRyammenAndPenchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'kanchan' as const, first: kanchanFirst }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );

    results.push(
      ...deconstructureKanchan(rest, type, recurse - 1).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [
              ...parts,
              { type: 'kanchan' as const, first: kanchanFirst }
            ].sort(compare_parts)
          } as DeconstructureResult<Tatsu>)
      )
    );
  }

  return results;
};

const deconstructureTatsu = (
  legal: Tile[],
  type: NumberTile['type'],
  recurse: number
): DeconstructureResult<Tatsu>[] =>
  dedupe_deconstructure_results([
    ...deconstructureToitsu(legal, type, recurse),
    ...deconstructureRyammenAndPenchan(legal, type, recurse),
    ...deconstructureKanchan(legal, type, recurse)
  ]) as DeconstructureResult<Tatsu>[];

const deconstructureWindAndDragonToitsu = (
  legal: Tile[]
): DeconstructureResult<Toitsu> => {
  let rest = [...legal];
  const toitsu: Toitsu[] = [];
  const counts = count_tiles(rest);

  for (const t of [
    'east',
    'south',
    'west',
    'north',
    'white',
    'green',
    'red'
  ] as const) {
    const tile = { type: t };
    const c = counts[tile_to_string(tile)];
    if (typeof c !== 'undefined' && c >= 2) {
      rest = remove_multiple_tile(rest, tile, 3);
      toitsu.push({ type: 'toitsu', tile });
    }
  }

  return { rest, parts: toitsu };
};

const deconstructureMentsuAndTatsu = (
  legal: Tile[]
): DeconstructureResult<Parts>[] => {
  const [character, dots, bamboo] = (
    ['character', 'dots', 'bamboo'] as const
  ).map(type =>
    dedupe_deconstructure_results([
      ...deconstructureKotsu(legal, type),
      ...deconstructureShuntsu(legal, type)
    ]).flatMap(r =>
      deconstructureTatsu(r.rest, type, Math.max(0, 4 - r.parts.length)).map(
        ({ rest, parts }) => ({
          rest,
          parts: [...parts, ...r.parts].sort(compare_parts)
        })
      )
    )
  );

  return product3(character, dots, bamboo).map(([c, d, b]) => {
    const rest = [
      ...c.rest.filter(t => t.type === 'character'),
      ...d.rest.filter(t => t.type === 'dots'),
      ...b.rest.filter(t => t.type === 'bamboo')
    ];
    const parts = [...c.parts, ...d.parts, ...b.parts];

    const { rest: rt, parts: pt } = deconstructureWindAndDragonToitsu(c.rest);
    rest.push(
      ...rt.filter(
        t => t.type !== 'character' && t.type !== 'dots' && t.type !== 'bamboo'
      )
    );
    parts.push(...pt);

    return { rest: rest.sort(compare_tile), parts: parts.sort(compare_parts) };
  });
};

const deconstructureHeadAndMentsu = (
  legal: Tile[]
): DeconstructureResult<Parts>[] => {
  const results: DeconstructureResult<Parts>[] = [];
  const counts = count_tiles(legal);
  const headCandidates = (
    Object.keys(counts) as (keyof typeof counts)[]
  ).filter(k => typeof counts[k] !== 'undefined' && (counts[k] as number) >= 2);

  for (const head of headCandidates) {
    const headTile = string_to_tile(head);
    const rest = remove_multiple_tile(legal, headTile, 2);
    results.push(
      ...deconstructureMentsuAndTatsu(rest).map(
        ({ rest, parts }) =>
          ({
            rest,
            parts: [...parts, { type: 'toitsu' as const, tile: headTile }].sort(
              compare_parts
            )
          } as DeconstructureResult<Parts>)
      )
    );
  }
  results.push(...deconstructureMentsuAndTatsu(legal));

  return results;
};

const deconstructure = (
  legal: Hand['legal']
): DeconstructureResult<Parts>[] => {
  const {
    rest,
    parts: isolatedParts,
    isolatedTiles
  } = deconstructureIsolated(legal);
  return dedupe_deconstructure_results(
    deconstructureHeadAndMentsu(rest).map(({ rest, parts }) => ({
      rest: [...rest, ...isolatedTiles].sort(compare_tile),
      parts: [...parts, ...isolatedParts].sort(compare_parts)
    }))
  );
};

const count_shanten = (
  result: DeconstructureResult<Parts>,
  meldCount: 0 | 1 | 2 | 3 | 4
): number => {
  const mentsu =
    result.parts.filter(p => p.type === 'kotsu' || p.type === 'shuntsu')
      .length + meldCount;
  const tatsuParts = result.parts.filter(
    p => p.type !== 'kotsu' && p.type !== 'shuntsu'
  );
  const tatsu = mentsu + tatsuParts.length > 4 ? 4 - mentsu : tatsuParts.length;
  const hasToitsu =
    mentsu + tatsuParts.length > 4 && tatsuParts.some(t => t.type === 'toitsu');
  return 8 - mentsu * 2 - tatsu - (hasToitsu ? 1 : 0);
};

const best_results = (
  results: DeconstructureResult<Parts>[],
  meldCount: 0 | 1 | 2 | 3 | 4
): { results: DeconstructureResult<Parts>[]; shanten: number } => {
  const result: DeconstructureResult<Parts>[] = [];
  let minShanten: number | undefined = void 0;
  for (const r of results.sort(
    (a, b) => count_shanten(a, meldCount) - count_shanten(b, meldCount)
  )) {
    const rs = count_shanten(r, meldCount);
    if (typeof minShanten === 'undefined') {
      minShanten = rs;
    } else if (rs > minShanten) {
      break;
    }
    result.push(r);
  }
  if (typeof minShanten === 'undefined') throw new Error();
  return { results: result, shanten: minShanten };
};

export type Pattern = DeconstructureResult<Parts>;

export const deconstructure_and_count_shanten = (
  legal: Hand['legal'],
  meldCount: 0 | 1 | 2 | 3 | 4
): { results: Pattern[]; shanten: number } =>
  best_results(deconstructure(legal), meldCount);
