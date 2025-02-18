import { decompose_from_counts } from 'decomposer';
import {
  type TileCount,
  type TileCounts,
  type TileCountsIndex,
  tileCountsFirstIndex
} from '.';
import { countBy, groupBy, memoize, uniqueSorted } from '../util';
import type { Block } from './block';
// const decomposer = await import('decomposer');

export interface DecomposeResult {
  rest: TileCounts;
  blocks: Block[];
}

type MeldCount = 0 | 1 | 2 | 3 | 4;

export const countShanten = (result: DecomposeResult, meldCount: MeldCount) => {
  const {
    kotsu = 0,
    shuntsu = 0,
    ryammen = 0,
    penchan = 0,
    kanchan = 0,
    toitsu = 0
  } = result.blocks.reduce(
    (acc, cur) => ({ ...acc, [cur.type]: (acc[cur.type] ?? 0) + 1 }),
    {} as { [_ in Block['type']]?: number }
  );

  const mentsu = kotsu + shuntsu + meldCount;
  const tatsuBlocks = ryammen + penchan + kanchan + toitsu;
  const tatsu = mentsu + tatsuBlocks > 4 ? 4 - mentsu : tatsuBlocks;
  const hasToitsu = mentsu + tatsuBlocks > 4 && toitsu > 0;
  return 8 - mentsu * 2 - tatsu - (hasToitsu ? 1 : 0);
};

export const minShanten = memoize(
  (
    counts: TileCounts,
    meldCount: MeldCount
  ): { shanten: number; results: DecomposeResult[] } =>
    decompose_from_counts(Uint8Array.from(counts), meldCount),
  (counts, meldCount) => `${counts.join('')}/${meldCount}`
);

export const waitingTiles = (
  decomposeResults: DecomposeResult[],
  handAndMeldsCounts: TileCounts
): TileCountsIndex[] => {
  const tiles = decomposeResults
    .flatMap(decomposeResult => {
      const toitsu = decomposeResult.blocks.filter(b => b.type === 'toitsu');
      const tatsu = decomposeResult.blocks.filter(
        b =>
          b.type === 'kanchan' || b.type === 'penchan' || b.type === 'ryammen'
      )[0];
      if (toitsu.length === 2) {
        return toitsu.map(t => t.tile);
      }
      if (typeof tatsu === 'undefined')
        return [
          decomposeResult.rest.findIndex(c => c === 1) as TileCountsIndex
        ];
      if (tatsu.type === 'ryammen') {
        return [tatsu.tile - 1, tatsu.tile + 2] as TileCountsIndex[];
      }
      if (tatsu.type === 'penchan') {
        if (tatsu.tile % 9 === 0) {
          return [(tatsu.tile + 2) as TileCountsIndex];
        }
        return [(tatsu.tile - 1) as TileCountsIndex];
      }
      if (tatsu.type === 'kanchan') {
        return [(tatsu.tile + 1) as TileCountsIndex];
      }
      throw new Error();
    })
    .filter(t => handAndMeldsCounts[t] < 4);
  tiles.sort((a, b) => a - b);
  return uniqueSorted(tiles, (a, b) => a === b);
};
export const shantenTiles = (
  decomposeResults: DecomposeResult[],
  handAndMeldsCounts: TileCounts,
  meldCount: MeldCount
): TileCountsIndex[] => {
  const ret = [...Array(34)].map(() => false);
  for (const result of decomposeResults) {
    const {
      toitsu = [],
      tatsu = [],
      mentsu = []
    } = groupBy(result.blocks, b =>
      b.type === 'toitsu'
        ? 'toitsu'
        : b.type === 'kotsu' || b.type === 'shuntsu'
          ? 'mentsu'
          : 'tatsu'
    );
    for (const t of tatsu) {
      if (t.type === 'ryammen') {
        ret[t.tile - 1] = true;
        ret[t.tile + 2] = true;
      }
      if (t.type === 'kanchan') {
        ret[t.tile + 1] = true;
      }
      if (t.type === 'penchan') {
        ret[t.tile % 9 === 0 ? t.tile + 2 : t.tile - 1] = true;
      }
    }
    if (toitsu.length === 0) {
      if (mentsu.length + meldCount + tatsu.length < 4) {
        result.rest.forEach((c, tile) => {
          if (c === 0) return;
          if (tile < tileCountsFirstIndex.z) {
            const lower = Math.floor(tile / 9) * 9;
            const upper = lower + 8;
            for (
              let i = Math.max(lower, tile - 2);
              i <= Math.min(upper, tile + 2);
              i++
            ) {
              ret[i] = true;
            }
          } else {
            ret[tile] = true;
          }
        });
      } else {
        result.rest.forEach((c, i) => {
          if (c > 0) ret[i] = true;
        });
      }
    }
    if (toitsu.length === 1) {
      if (mentsu.length + meldCount + tatsu.length < 4) {
        result.rest.forEach((c, tile) => {
          if (c === 0) return;
          if (tile < tileCountsFirstIndex.z) {
            const lower = Math.floor(tile / 9) * 9;
            const upper = lower + 8;
            for (
              let i = Math.max(lower, tile - 2);
              i <= Math.min(upper, tile + 2);
              i++
            ) {
              ret[i] = true;
            }
          } else {
            ret[tile] = true;
          }
        });
        ret[(toitsu[0] as Block).tile] = true;
      }
    }
    if (toitsu.length >= 2) {
      for (const t of toitsu) {
        ret[t.tile] = true;
      }
      if (mentsu.length + meldCount + tatsu.length + toitsu.length < 5) {
        result.rest.forEach((c, tile) => {
          if (c === 0) return;
          if (tile < tileCountsFirstIndex.z) {
            const lower = Math.floor(tile / 9) * 9;
            const upper = lower + 8;
            for (
              let i = Math.max(lower, tile - 2);
              i <= Math.min(upper, tile + 2);
              i++
            ) {
              ret[i] = true;
            }
          } else {
            ret[tile] = true;
          }
        });
      }
    }
  }
  return ret.flatMap((a, i) =>
    a && (handAndMeldsCounts[i] as TileCount) < 4 ? [i] : []
  ) as TileCountsIndex[];
};

export const countChitoitsuShanten = (counts: TileCounts): number =>
  6 -
  counts.filter(n => n >= 2).length +
  (7 - Math.min(7, counts.filter(n => n >= 1).length));

export const chitoitsuShantenTiles = (counts: TileCounts): TileCountsIndex[] =>
  (countBy(counts, c => c > 0) < 7
    ? counts.flatMap((c, i) => (c <= 1 ? [i] : []))
    : counts.flatMap((c, i) => (c === 1 ? [i] : []))) as TileCountsIndex[];

export const countKokushiShanten = (counts: TileCounts): number => {
  const yaochuCounts = counts.filter(
    (_, i) => i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z
  );
  const variantCount = yaochuCounts.filter(n => n > 0).length;
  const hasToitsu = yaochuCounts.some(n => n >= 2);
  return 13 - variantCount - (hasToitsu ? 1 : 0);
};

export const kokushiShantenTiles = (counts: TileCounts): TileCountsIndex[] => {
  const hasToitsu = counts.some(
    (c, i) =>
      (i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z) && c >= 2
  );
  return (
    hasToitsu
      ? counts.flatMap((c, i) =>
          (i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z) && c === 0
            ? [i]
            : []
        )
      : [...Array(34)].flatMap((_, i) =>
          i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z ? [i] : []
        )
  ) as TileCountsIndex[];
};
