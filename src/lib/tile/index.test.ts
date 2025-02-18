import { describe, expect, test } from 'vitest';
import {
  type Tile,
  type TileCounts,
  countsIndexToTile,
  tileToCountsIndex,
  tilesToCounts
} from '.';

describe('tileToCountsIndex', () => {
  test('1m', () => {
    expect(tileToCountsIndex({ type: 'm', n: 1 })).toBe(0);
  });
  test('2p', () => {
    expect(tileToCountsIndex({ type: 'p', n: 2 })).toBe(10);
  });
  test('3s', () => {
    expect(tileToCountsIndex({ type: 's', n: 3 })).toBe(20);
  });
  test('4z', () => {
    expect(tileToCountsIndex({ type: 'z', n: 4 })).toBe(30);
  });
});

describe('countsIndexToTile', () => {
  test('0', () => {
    expect(countsIndexToTile(0)).toEqual<Tile>({ type: 'm', n: 1 });
  });
  test('4', () => {
    expect(countsIndexToTile(4)).toEqual<Tile>({ type: 'm', n: 5, red: false });
  });
  test('10', () => {
    expect(countsIndexToTile(10)).toEqual<Tile>({ type: 'p', n: 2 });
  });
  test('20', () => {
    expect(countsIndexToTile(20)).toEqual<Tile>({ type: 's', n: 3 });
  });
  test('30', () => {
    expect(countsIndexToTile(30)).toEqual<Tile>({ type: 'z', n: 4 });
  });
  test('33', () => {
    expect(countsIndexToTile(33)).toEqual<Tile>({ type: 'z', n: 7 });
  });
});

describe('tilesToCounts', () => {
  test('empty', () => {
    expect(tilesToCounts([])).toEqual<TileCounts>(
      // biome-ignore format:
      [
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
      ]
    );
  });
  test('1m0p9s17z', () => {
    expect(
      tilesToCounts([
        { type: 'm', n: 1 },
        { type: 'p', n: 5, red: true },
        { type: 's', n: 9 },
        { type: 'z', n: 1 },
        { type: 'z', n: 7 }
      ])
    ).toEqual<TileCounts>(
      // biome-ignore format:
      [
        1, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 1, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 0, 0, 0, 0, 1
      ]
    );
  });
  test('1111m', () => {
    expect(
      tilesToCounts([
        { type: 'm', n: 1 },
        { type: 'm', n: 1 },
        { type: 'm', n: 1 },
        { type: 'm', n: 1 }
      ])
    ).toEqual<TileCounts>(
      // biome-ignore format:
      [
        4, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0, 0, 0, 0
      ]
    );
  });
  test('11111m', () => {
    expect(() =>
      tilesToCounts([
        { type: 'm', n: 1 },
        { type: 'm', n: 1 },
        { type: 'm', n: 1 },
        { type: 'm', n: 1 },
        { type: 'm', n: 1 }
      ])
    ).toThrow();
  });
});
