import {
  type Hora,
  generateChitoitsuHora,
  generateHora,
  generateKokushiHora,
  uniqueHoras
} from './hora';
import { type HandOptions, type Input, instantiateMeld } from './input';
import type { Rule } from './rule';
import type { Table } from './table';
import {
  type Tile,
  type TileAvailability,
  type TileCountsIndex,
  compareTiles,
  countsIndexToTile,
  tileAvailableCount,
  tilesToCounts
} from './tile';
import {
  chitoitsuShantenTiles,
  countChitoitsuShanten,
  countKokushiShanten,
  kokushiShantenTiles,
  minShanten,
  shantenTiles,
  waitingTiles
} from './tile/shanten';
import { countBy, minsBy, uniqueSorted } from './util';

interface HoraInfo {
  type: 'hora';
  hora: Hora[];
}

interface ShantenInfo {
  type: 'shanten';
  shanten: number;
  tileAvailabilities: TileAvailability[];
}

export interface Discard {
  tile: Tile;
  next: HoraShanten | Tempai;
}

interface HoraShanten {
  type: 'hora-shanten';
  info: HoraInfo | ShantenInfo;
}

interface DiscardShanten {
  type: 'discard-shanten';
  discards: Discard[];
}

interface Tempai {
  type: 'tempai';
  tileAvailabilities: TileAvailability[];
}

interface JustHora {
  type: 'just-hora';
}

export type Result = HoraShanten | DiscardShanten | Tempai | JustHora | null;

export const generateResult = (
  table: Table,
  input: Input,
  handOptions: HandOptions,
  rule: Rule
): Result => {
  if (input.hand.length % 3 === 0) return null;

  const handCounts = tilesToCounts(input.hand);
  const meldTiles = input.melds.flatMap(meld =>
    instantiateMeld(meld, rule.red)
  );
  const handAndMelds = [...input.hand, ...meldTiles];
  const allInputTiles = [...handAndMelds, ...input.dora];
  const handAndMeldsCounts = tilesToCounts(handAndMelds);
  const tileCountsIndexToTileAvailabilities = (index: TileCountsIndex) => {
    const tile = countsIndexToTile(index);
    if (tile.type !== 'z' && tile.n === 5) {
      return [false, true].flatMap(red => {
        const t = {
          ...tile,
          red
        };
        const c = tileAvailableCount(rule.red, allInputTiles, t);
        return c === null ? [] : [{ tile: t, count: c } as TileAvailability];
      });
    }
    return [
      {
        tile,
        count: tileAvailableCount(rule.red, allInputTiles, tile)
      } as TileAvailability
    ];
  };

  if (input.hand.length % 3 === 1) {
    const { shanten, results } = minShanten(
      tilesToCounts(input.hand),
      ((14 - input.hand.length - 1) / 3) as 0 | 1 | 2 | 3 | 4
    );
    if (input.hand.length === 13) {
      const chitoitsuShanten = countChitoitsuShanten(handCounts);
      const kokushiShanten = countKokushiShanten(handCounts);
      if (shanten === 0 || chitoitsuShanten === 0 || kokushiShanten === 0) {
        const horas = [
          ...(shanten === 0
            ? generateHora(table, handOptions, results, input, rule)
            : []),
          ...(chitoitsuShanten === 0
            ? generateChitoitsuHora(
                table,
                input.hand,
                handOptions,
                input.dora,
                rule
              )
            : []),
          ...(kokushiShanten === 0
            ? generateKokushiHora(table, handCounts, handOptions, rule)
            : [])
        ];
        return {
          type: 'hora-shanten',
          info: {
            type: 'hora',
            hora: uniqueHoras(horas, rule)
          }
        };
      }
      const min = Math.min(shanten, chitoitsuShanten, kokushiShanten);
      return {
        type: 'hora-shanten',
        info: {
          type: 'shanten',
          shanten: min,
          tileAvailabilities: uniqueSorted(
            [
              ...(shanten === min
                ? shantenTiles(results, handAndMeldsCounts, 0).flatMap(
                    tileCountsIndexToTileAvailabilities
                  )
                : []),
              ...(chitoitsuShanten === min
                ? chitoitsuShantenTiles(handCounts).flatMap(
                    tileCountsIndexToTileAvailabilities
                  )
                : []),
              ...(kokushiShanten === min
                ? kokushiShantenTiles(handCounts).flatMap(
                    tileCountsIndexToTileAvailabilities
                  )
                : [])
            ].sort((a, b) => compareTiles(a.tile, b.tile)),
            (a, b) => compareTiles(a.tile, b.tile) === 0
          )
        }
      };
    }
    if (
      input.hand.length + countBy(input.melds, m => m.tile !== null) * 3 ===
      13
    ) {
      if (shanten === 0) {
        return {
          type: 'hora-shanten',
          info: {
            type: 'hora',
            hora: uniqueHoras(
              generateHora(table, handOptions, results, input, rule),
              rule
            )
          }
        };
      }
      return {
        type: 'hora-shanten',
        info: {
          type: 'shanten',
          shanten,
          tileAvailabilities: shantenTiles(
            results,
            handAndMeldsCounts,
            input.melds.length as 0 | 1 | 2 | 3 | 4
          ).flatMap(tileCountsIndexToTileAvailabilities)
        }
      };
    }
    if (shanten === 0) {
      return {
        type: 'tempai',
        tileAvailabilities: waitingTiles(results, handAndMeldsCounts).flatMap(
          tileCountsIndexToTileAvailabilities
        )
      };
    }
    return {
      type: 'hora-shanten',
      info: {
        type: 'shanten',
        shanten,
        tileAvailabilities: shantenTiles(
          results,
          handAndMeldsCounts,
          ((14 - input.hand.length - 1) / 3) as 0 | 1 | 2 | 3 | 4
        ).flatMap(tileCountsIndexToTileAvailabilities)
      }
    };
  }
  if (input.hand.length % 3 === 2) {
    const [handWithoutLast, last] = (() => {
      const a = [...input.hand];
      const b = a.pop();
      if (typeof b === 'undefined') throw new Error();
      return [a, b];
    })();
    const result = generateResult(
      table,
      { ...input, hand: handWithoutLast },
      handOptions,
      rule
    );
    if (
      result === null ||
      (result.type !== 'hora-shanten' && result.type !== 'tempai')
    )
      throw new Error();

    if (result.type === 'hora-shanten' && result.info.type === 'hora') {
      const h = result.info.hora.filter(
        h => compareTiles(h.horaTile, last) === 0
      );
      if (h.length > 0) {
        return {
          type: 'hora-shanten',
          info: {
            type: 'hora',
            hora: h
          }
        };
      }
    }
    if (
      result.type === 'tempai' &&
      result.tileAvailabilities.some(a => compareTiles(a.tile, last) === 0)
    ) {
      return { type: 'just-hora' };
    }

    const discardCandidates = uniqueSorted(
      handWithoutLast,
      (a, b) => compareTiles(a, b) === 0
    ).filter(t => compareTiles(t, last) !== 0);

    const discards = [
      ...discardCandidates.map(t => {
        const hand = [...input.hand];
        hand.splice(
          hand.findIndex(h => compareTiles(h, t) === 0),
          1
        );
        const r = generateResult(table, { ...input, hand }, handOptions, rule);
        if (r === null || (r.type !== 'hora-shanten' && r.type !== 'tempai'))
          throw new Error();

        return { tile: t, next: r };
      }),
      { tile: last, next: result }
    ];
    const [, best] = minsBy(discards, d =>
      d.next.type === 'tempai' || d.next.info.type === 'hora'
        ? 0
        : d.next.info.shanten
    );
    return { type: 'discard-shanten', discards: best };
  }

  throw new Error();
};
