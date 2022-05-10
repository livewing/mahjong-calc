import { countBy } from '../util';
import type { Rule } from '../rule';

export type NumberTile = {
  type: 'm' | 'p' | 's';
} & (
  | {
      n: 1 | 2 | 3 | 4 | 6 | 7 | 8 | 9;
    }
  | {
      n: 5;
      red: boolean;
    }
);
export interface WindTile {
  type: 'z';
  n: 1 | 2 | 3 | 4;
}
export interface DragonTile {
  type: 'z';
  n: 5 | 6 | 7;
}
export interface Back {
  type: 'back';
}
export type CharacterTile = WindTile | DragonTile;
export type Tile = NumberTile | CharacterTile;
export type TileOrBack = Tile | Back;

export type TileCount = 0 | 1 | 2 | 3 | 4;
type TC = TileCount;
export type NumberTileCounts = [TC, TC, TC, TC, TC, TC, TC, TC, TC];
export type CharacterTileCounts = [TC, TC, TC, TC, TC, TC, TC];
export type TileCounts = [
  ...NumberTileCounts,
  ...NumberTileCounts,
  ...NumberTileCounts,
  ...CharacterTileCounts
];
export type TileCountsIndex =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
  | 32
  | 33;
export type NumberTileCountsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
export type CharacterTileCountsIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type ColorStats = { m: number; p: number; s: number; z: number };

export interface TileAvailability {
  tile: Tile;
  count: number;
}

export const tileCountsFirstIndex = {
  m: 0,
  p: 9,
  s: 18,
  z: 27
} as const;

export const compareTiles = (a: Tile, b: Tile) =>
  a.type !== b.type
    ? a.type.localeCompare(b.type)
    : a.type !== 'z' && b.type !== 'z' && a.n === 5 && b.n === 5
    ? (a.red ? 1 : 0) - (b.red ? 1 : 0)
    : a.n - b.n;

export const isAvailableTiles = (
  red: Rule['red'],
  existing: Tile[],
  toUse: Tile[]
): boolean => {
  const merged = [...existing, ...toUse];
  const counts = [...Array(34)].map(() => 0);
  merged.forEach(t => (counts[tileToCountsIndex(t)] += 1));
  if (counts.some(c => c > 4)) return false;
  const fiveCounts = merged.reduce(
    (acc, cur) =>
      cur.type === 'z' || cur.n !== 5
        ? acc
        : {
            ...acc,
            [cur.type]: cur.red
              ? [acc[cur.type][0], acc[cur.type][1] + 1]
              : [acc[cur.type][0] + 1, acc[cur.type][1]]
          },
    { m: [0, 0], p: [0, 0], s: [0, 0] }
  );
  return (['m', 'p', 's'] as const).every(
    type =>
      fiveCounts[type][0] <= 4 - red[type] && fiveCounts[type][1] <= red[type]
  );
};

export const tileAvailableCount = (
  red: Rule['red'],
  existing: Tile[],
  toUse: Tile
): number | null => {
  const count = countBy(existing, t => compareTiles(t, toUse) === 0);
  if (toUse.type !== 'z' && toUse.n === 5) {
    const r = red[toUse.type];
    if ((r === 4 && !toUse.red) || (r === 0 && toUse.red)) return null;
    return toUse.red ? r - count : 4 - r - count;
  }
  return 4 - count;
};

export const tileToCountsIndex = (tile: Tile): TileCountsIndex =>
  (tileCountsFirstIndex[tile.type] + tile.n - 1) as TileCountsIndex;

export const countsIndexToTile = (index: TileCountsIndex): Tile => {
  const type = (() => {
    if (index < 9) return 'm';
    if (index < 18) return 'p';
    if (index < 27) return 's';
    return 'z';
  })();
  const n = ((index % 9) + 1) as Tile['n'];
  if (type !== 'z' && n === 5) {
    return { type, n, red: false };
  }
  return { type, n } as Tile;
};

export const tilesToCounts = (tiles: Tile[]): TileCounts => {
  const counts = [...Array(34)].map(() => 0) as TileCounts;
  tiles.forEach(t => (counts[tileToCountsIndex(t)] += 1));
  if (counts.some(c => c > 4)) throw new Error();
  return counts;
};

export const nextIndex = (index: TileCountsIndex): TileCountsIndex =>
  (index < tileCountsFirstIndex.z
    ? ((index + 1) % 9) + Math.floor(index / 9) * 9
    : index < tileCountsFirstIndex.z + 4
    ? tileCountsFirstIndex.z + ((index - tileCountsFirstIndex.z + 1) % 4)
    : tileCountsFirstIndex.z +
      4 +
      ((index - (tileCountsFirstIndex.z + 4) + 1) % 3)) as TileCountsIndex;

export const colorStats = (counts: TileCounts): ColorStats =>
  counts.reduce(
    (acc, cur, i) =>
      i < tileCountsFirstIndex.p
        ? { ...acc, m: acc.m + cur }
        : i < tileCountsFirstIndex.s
        ? { ...acc, p: acc.p + cur }
        : i < tileCountsFirstIndex.z
        ? { ...acc, s: acc.s + cur }
        : { ...acc, z: acc.z + cur },
    { m: 0, p: 0, s: 0, z: 0 }
  );

export const honitsuColor = ({
  m,
  p,
  s,
  z
}: ColorStats): 'm' | 'p' | 's' | null => {
  if (m > 0 && p === 0 && s === 0 && z > 0) return 'm';
  if (m === 0 && p > 0 && s === 0 && z > 0) return 'p';
  if (m === 0 && p === 0 && s > 0 && z > 0) return 's';
  return null;
};

export const chinitsuColor = ({
  m,
  p,
  s,
  z
}: ColorStats): 'm' | 'p' | 's' | null => {
  if (m > 0 && p === 0 && s === 0 && z === 0) return 'm';
  if (m === 0 && p > 0 && s === 0 && z === 0) return 'p';
  if (m === 0 && p === 0 && s > 0 && z === 0) return 's';
  return null;
};

export const tilesToMpsz = (tiles: Tile[]) =>
  [...tiles, null].reduce(
    (acc, cur) =>
      cur === null
        ? { ...acc, s: acc.s + (acc.last === null ? '' : acc.last.type) }
        : {
            last: cur,
            s:
              acc.s +
              (acc.last !== null && acc.last.type !== cur.type
                ? acc.last.type
                : '') +
              (cur.type !== 'z' && cur.n === 5 && cur.red ? '0' : `${cur.n}`)
          },
    {
      last: null as Tile | null,
      s: ''
    }
  ).s;
