import {
  tileCountsFirstIndex,
  tileToCountsIndex,
  type TileCountsIndex
} from './tile';
import { sumBy } from './util';
import type { Meld } from './input';
import type { Rule } from './rule';
import type { Table } from './table';
import type { DecomposeResult } from './tile/shanten';

interface Futei {
  type: 'futei';
  fu: 20;
}

interface ShuntsuFu {
  type: 'shuntsu';
  tile: TileCountsIndex;
  fu: 0;
}

interface KotsuFu {
  type: 'kotsu';
  tile: TileCountsIndex;
  kotsuType: 'minko' | 'anko' | 'minkan' | 'ankan';
  fu: 2 | 4 | 8 | 16 | 32;
}

interface HeadFu {
  type: 'head';
  tile: TileCountsIndex;
  fu: 0 | 2 | 4;
}

interface WaitingFu {
  type: 'waiting';
  waitingType: 'ryammen' | 'shampon' | 'kanchan' | 'penchan' | 'tanki';
  block: ShuntsuFu | KotsuFu | HeadFu;
  fu: 0 | 2;
}

interface MenzenRon {
  type: 'menzen-ron';
  fu: 10;
}

interface TsumoFu {
  type: 'tsumo';
  fu: 2;
}

interface PinfuTsumoFu {
  type: 'pinfu-tsumo';
  fu: 0;
}

interface KuiPinfuFu {
  type: 'kui-pinfu';
  fu: 10;
}

export type Fu =
  | Futei
  | ShuntsuFu
  | KotsuFu
  | HeadFu
  | WaitingFu
  | MenzenRon
  | TsumoFu
  | PinfuTsumoFu
  | KuiPinfuFu;

export const fu = (
  decomposeResult: DecomposeResult,
  melds: Meld[],
  waiting: TileCountsIndex,
  by: 'tsumo' | 'ron',
  { round, seat }: Table,
  { doubleWindFu }: Rule
): Fu[] => {
  const ret: Fu[] = [{ type: 'futei', fu: 20 }];
  const tatsu =
    decomposeResult.blocks.find(
      b => b.type === 'kanchan' || b.type === 'penchan' || b.type === 'ryammen'
    ) ??
    decomposeResult.blocks.find(
      b => b.type === 'toitsu' && b.tile !== waiting
    ) ??
    waiting;
  const head =
    decomposeResult.blocks.find(b => b.type === 'toitsu' && b.tile !== waiting)
      ?.tile ?? waiting;
  const roundHead =
    head ===
    tileCountsFirstIndex.z + ['east', 'south', 'west', 'north'].indexOf(round);
  const seatHead =
    head ===
    tileCountsFirstIndex.z + ['east', 'south', 'west', 'north'].indexOf(seat);
  ret.push(
    ...decomposeResult.blocks.flatMap(b =>
      b.type === 'shuntsu'
        ? [{ type: 'shuntsu', tile: b.tile, fu: 0 } as Fu]
        : b.type === 'kotsu'
        ? [
            {
              type: 'kotsu',
              tile: b.tile,
              kotsuType: 'anko',
              fu:
                b.tile >= tileCountsFirstIndex.z ||
                b.tile % 9 === 0 ||
                b.tile % 9 === 8
                  ? 8
                  : 4
            } as KotsuFu
          ]
        : []
    )
  );
  ret.push(
    ...melds.flatMap(m =>
      m.tile === null
        ? []
        : m.type === 'chii'
        ? [{ type: 'shuntsu', tile: tileToCountsIndex(m.tile), fu: 0 } as Fu]
        : [
            {
              type: 'kotsu',
              tile: tileToCountsIndex(m.tile),
              kotsuType:
                m.type === 'pon' ? 'minko' : m.closed ? 'ankan' : 'minkan',
              fu:
                m.tile.type === 'z' || m.tile.n === 1 || m.tile.n === 9
                  ? m.type === 'pon'
                    ? 4
                    : m.closed
                    ? 32
                    : 16
                  : m.type === 'pon'
                  ? 2
                  : m.closed
                  ? 16
                  : 8
            } as KotsuFu
          ]
    )
  );
  if (typeof tatsu !== 'number') {
    ret.push({
      type: 'head',
      tile: head,
      fu:
        head >= tileCountsFirstIndex.z + 4
          ? 2
          : roundHead && seatHead
          ? doubleWindFu
          : roundHead || seatHead
          ? 2
          : 0
    });
  }
  ret.push({
    type: 'waiting',
    waitingType:
      typeof tatsu === 'number'
        ? 'tanki'
        : tatsu.type === 'toitsu'
        ? 'shampon'
        : (tatsu.type as 'ryammen' | 'kanchan' | 'penchan'),
    block:
      typeof tatsu === 'number'
        ? ({
            type: 'head',
            tile: waiting,
            fu:
              head >= tileCountsFirstIndex.z + 4
                ? 2
                : roundHead && seatHead
                ? doubleWindFu
                : roundHead || seatHead
                ? 2
                : 0
          } as HeadFu)
        : tatsu.type === 'kanchan'
        ? ({ type: 'shuntsu', tile: tatsu.tile, fu: 0 } as ShuntsuFu)
        : tatsu.type === 'penchan' || tatsu.type === 'ryammen'
        ? ({
            type: 'shuntsu',
            tile: Math.min(tatsu.tile, waiting),
            fu: 0
          } as ShuntsuFu)
        : ({
            type: 'kotsu',
            kotsuType: by === 'tsumo' ? 'anko' : 'minko',
            tile: waiting,
            fu:
              waiting >= tileCountsFirstIndex.z ||
              waiting % 9 === 0 ||
              waiting % 9 === 8
                ? by === 'tsumo'
                  ? 8
                  : 4
                : by === 'tsumo'
                ? 4
                : 2
          } as KotsuFu),
    fu:
      typeof tatsu === 'number' ||
      tatsu.type === 'kanchan' ||
      tatsu.type === 'penchan'
        ? 2
        : 0
  });
  if (by === 'ron' && melds.every(m => m.type === 'kan' && m.closed)) {
    ret.push({ type: 'menzen-ron', fu: 10 });
  }
  if (by === 'tsumo') {
    if (
      melds.length === 0 &&
      typeof tatsu !== 'number' &&
      tatsu.type === 'ryammen' &&
      decomposeResult.blocks.every(
        b => b.type === 'shuntsu' || b.type === 'ryammen' || b.type === 'toitsu'
      ) &&
      head < tileCountsFirstIndex.z + 4 &&
      !roundHead &&
      !seatHead
    ) {
      ret.push({ type: 'pinfu-tsumo', fu: 0 });
    } else {
      ret.push({ type: 'tsumo', fu: 2 });
    }
  }
  if (
    melds.length > 0 &&
    melds.every(m => m.type === 'chii') &&
    sumOfFu(ret) === 20
  ) {
    ret.push({ type: 'kui-pinfu', fu: 10 });
  }

  return ret;
};

export const sumOfFu = (fu: Fu[]): number =>
  sumBy(fu, f => f.fu + (f.type === 'waiting' ? f.block.fu : 0));
