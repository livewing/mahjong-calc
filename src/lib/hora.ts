import { fu, sumOfFu, type Fu } from './fu';
import {
  instantiateMeld,
  type HandOptions,
  type Input,
  type Meld
} from './input';
import { calculateBasePoint } from './score';
import {
  chinitsuColor,
  colorStats,
  compareTiles,
  countsIndexToTile,
  honitsuColor,
  nextIndex,
  tileCountsFirstIndex,
  tilesToCounts,
  tileToCountsIndex,
  type NumberTileCounts,
  type Tile,
  type TileCounts,
  type TileCountsIndex
} from './tile';
import { countBy, countGroupBy, product2, sumBy, uniqueSorted } from './util';
import type { Rule } from './rule';
import type { Table } from './table';
import type { Block } from './tile/block';
import type { DecomposeResult } from './tile/shanten';
import type { Yaku, Yakuman } from './yaku';

interface MentsuHora {
  type: 'mentsu';
  by: 'tsumo' | 'ron';
  horaTile: Tile;
  melds: Meld[];
  fu: Fu[];
  yaku: Yaku[];
}

interface SpecialHora {
  type: 'chitoitsu' | 'kokushi';
  by: 'tsumo' | 'ron';
  horaTile: Tile;
  yaku: Yaku[];
}

export type Hora = MentsuHora | SpecialHora;

const ronAndTsumo = ['ron' as const, 'tsumo' as const];

export const generateHora = (
  table: Table,
  options: HandOptions,
  decomposeResults: DecomposeResult[],
  input: Input,
  rule: Rule
): Hora[] => {
  const meldTiles = input.melds.flatMap(meld =>
    instantiateMeld(meld, rule.red)
  );
  const handAndMelds = [...input.hand, ...meldTiles];
  const handAndMeldsCounts = tilesToCounts(handAndMelds);

  const horas = decomposeResults.flatMap(decomposeResult =>
    (() => {
      const toitsu = decomposeResult.blocks.filter(b => b.type === 'toitsu');
      const tatsu = decomposeResult.blocks.filter(
        b =>
          b.type === 'kanchan' || b.type === 'penchan' || b.type === 'ryammen'
      )[0];
      if (toitsu.length === 2) {
        return toitsu;
      }
      return [
        tatsu ??
          (decomposeResult.rest.findIndex(c => c === 1) as TileCountsIndex)
      ];
    })().flatMap(tatsu =>
      (() => {
        const horaTiles: TileCountsIndex[] = [];
        if (typeof tatsu === 'number') {
          horaTiles.push(tatsu);
        } else {
          const { type, tile } = tatsu;
          if (type === 'ryammen') {
            horaTiles.push(...([tile - 1, tile + 2] as TileCountsIndex[]));
          } else if (type === 'penchan') {
            if (tile % 9 === 0) {
              horaTiles.push((tile + 2) as TileCountsIndex);
            } else {
              horaTiles.push((tile - 1) as TileCountsIndex);
            }
          } else if (type === 'kanchan') {
            horaTiles.push((tile + 1) as TileCountsIndex);
          } else if (type === 'toitsu') {
            horaTiles.push(tile);
          }
        }
        return horaTiles.flatMap(t => {
          if (handAndMeldsCounts[t] >= 4) return [];
          const tile = countsIndexToTile(t);
          if (tile.type !== 'z' && tile.n === 5) {
            const r = rule.red[tile.type];
            if (
              r ===
              countBy(
                handAndMelds,
                t => compareTiles(t, { ...tile, red: true }) === 0
              )
            )
              return [{ ...tile, red: false } as Tile];
            if (
              4 - r ===
              countBy(
                handAndMelds,
                t => compareTiles(t, { ...tile, red: false }) === 0
              )
            )
              return [{ ...tile, red: true } as Tile];
            return [
              { ...tile, red: false },
              { ...tile, red: true }
            ];
          }
          return [tile];
        });
      })().flatMap(horaTile => {
        const handAndMeldBlocks = [
          ...decomposeResult.blocks,
          ...input.melds.map(m => {
            if (m.tile === null) throw new Error();
            return {
              type: m.type === 'chii' ? 'shuntsu' : 'kotsu',
              tile: tileToCountsIndex(m.tile)
            } as Block;
          })
        ];
        const allTiles = [...input.hand, horaTile, ...meldTiles];
        const allTilesCounts = tilesToCounts(allTiles);
        const allMentsu = [
          ...decomposeResult.blocks.filter(
            b => b.type === 'kotsu' || b.type === 'shuntsu'
          ),
          ...input.melds.flatMap(m =>
            m.tile === null
              ? []
              : {
                  type: m.type === 'chii' ? 'shuntsu' : 'kotsu',
                  tile: tileToCountsIndex(m.tile)
                }
          ),
          ...(typeof tatsu === 'number'
            ? []
            : tatsu.type === 'kanchan'
            ? [{ type: 'shuntsu', tile: tatsu.tile }]
            : tatsu.type === 'ryammen' || tatsu.type === 'penchan'
            ? [
                {
                  type: 'shuntsu',
                  tile: Math.min(tatsu.tile, tileToCountsIndex(horaTile))
                }
              ]
            : tatsu.type === 'toitsu'
            ? [{ type: 'kotsu', tile: tatsu.tile }]
            : [])
        ] as { type: 'kotsu' | 'shuntsu'; tile: TileCountsIndex }[];
        const head =
          decomposeResult.blocks.find(
            b => b.type === 'toitsu' && b.tile !== tileToCountsIndex(horaTile)
          )?.tile ?? tileToCountsIndex(horaTile);
        const stats = colorStats(allTilesCounts);
        const honitsu = honitsuColor(stats);
        const chinitsu = chinitsuColor(stats);
        const menzen = input.melds.every(m => m.type === 'kan' && m.closed);

        const yakuman: { yakuman: Yakuman; ron: boolean; tsumo: boolean }[] =
          [];
        if (
          menzen &&
          handAndMeldBlocks.every(
            b => b.type === 'kotsu' || b.type === 'toitsu'
          )
        ) {
          if (typeof tatsu === 'number') {
            yakuman.push({
              yakuman: {
                type: 'yakuman',
                name: 'suanko-tanki',
                point: rule.suankoTankiDoubleYakuman ? 2 : 1
              },
              ron: true,
              tsumo: true
            });
          } else if (tatsu.type === 'toitsu') {
            yakuman.push({
              yakuman: { type: 'yakuman', name: 'suanko', point: 1 },
              ron: false,
              tsumo: true
            });
          }
        }
        if (
          allTilesCounts[(tileCountsFirstIndex.z + 4) as TileCountsIndex] >=
            3 &&
          allTilesCounts[(tileCountsFirstIndex.z + 5) as TileCountsIndex] >=
            3 &&
          allTilesCounts[(tileCountsFirstIndex.z + 6) as TileCountsIndex] >= 3
        ) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'daisangen', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (
          allTilesCounts.every((c, i) =>
            i < tileCountsFirstIndex.z ? c === 0 : true
          )
        ) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'tsuiso', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (
          allTilesCounts[(tileCountsFirstIndex.z + 0) as TileCountsIndex] >=
            3 &&
          allTilesCounts[(tileCountsFirstIndex.z + 1) as TileCountsIndex] >=
            3 &&
          allTilesCounts[(tileCountsFirstIndex.z + 2) as TileCountsIndex] >=
            3 &&
          allTilesCounts[(tileCountsFirstIndex.z + 3) as TileCountsIndex] >= 3
        ) {
          yakuman.push({
            yakuman: {
              type: 'yakuman',
              name: 'daisushi',
              point: rule.daisushiDoubleYakuman ? 2 : 1
            },
            ron: true,
            tsumo: true
          });
        } else if (
          allTilesCounts[(tileCountsFirstIndex.z + 0) as TileCountsIndex] >=
            2 &&
          allTilesCounts[(tileCountsFirstIndex.z + 1) as TileCountsIndex] >=
            2 &&
          allTilesCounts[(tileCountsFirstIndex.z + 2) as TileCountsIndex] >=
            2 &&
          allTilesCounts[(tileCountsFirstIndex.z + 3) as TileCountsIndex] >= 2
        ) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'shosushi', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (
          allTiles.every(
            t =>
              (t.type === 'z' && t.n === 6) ||
              (t.type === 's' &&
                (t.n === 2 || t.n === 3 || t.n === 4 || t.n === 6 || t.n === 8))
          )
        ) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'ryuiso', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (allTiles.every(t => t.type !== 'z' && (t.n === 1 || t.n === 9))) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'chinroto', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (countBy(input.melds, m => m.type === 'kan') === 4) {
          yakuman.push({
            yakuman: { type: 'yakuman', name: 'sukantsu', point: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (input.melds.length === 0 && chinitsu !== null) {
          const cc = allTilesCounts.slice(
            tileCountsFirstIndex[chinitsu],
            tileCountsFirstIndex[chinitsu] + 9
          ) as NumberTileCounts;
          if (
            cc[0] >= 3 &&
            cc[1] >= 1 &&
            cc[2] >= 1 &&
            cc[3] >= 1 &&
            cc[4] >= 1 &&
            cc[5] >= 1 &&
            cc[6] >= 1 &&
            cc[7] >= 1 &&
            cc[8] >= 3
          ) {
            cc[horaTile.n - 1] -= 1;

            if (
              cc[0] === 3 &&
              cc[1] === 1 &&
              cc[2] === 1 &&
              cc[3] === 1 &&
              cc[4] === 1 &&
              cc[5] === 1 &&
              cc[6] === 1 &&
              cc[7] === 1 &&
              cc[8] === 3
            ) {
              yakuman.push({
                yakuman: {
                  type: 'yakuman',
                  name: 'pure-churen',
                  point: rule.pureChurenDoubleYakuman ? 2 : 1
                },
                ron: true,
                tsumo: true
              });
            } else {
              yakuman.push({
                yakuman: { type: 'yakuman', name: 'churen', point: 1 },
                ron: true,
                tsumo: true
              });
            }
          }
        }
        if (input.melds.length === 0 && options.tenho) {
          yakuman.push({
            yakuman: {
              type: 'yakuman',
              name: table.seat === 'east' ? 'tenho' : 'chiho',
              point: 1
            },
            ron: false,
            tsumo: true
          });
          return [
            {
              type: 'mentsu',
              by: 'tsumo',
              fu: fu(
                decomposeResult,
                input.melds,
                tileToCountsIndex(horaTile),
                'tsumo',
                table,
                rule
              ),
              horaTile,
              melds: input.melds,
              yaku: yakuman.flatMap(y => (y.tsumo ? [y.yakuman] : []))
            } as MentsuHora
          ];
        }

        const yaku: { yaku: Yaku; ron: boolean; tsumo: boolean }[] = [];

        if (menzen && options.riichi !== 'none') {
          yaku.push({
            yaku: {
              type: 'yaku',
              name: options.riichi,
              han: options.riichi === 'double-riichi' ? 2 : 1
            },
            ron: true,
            tsumo: true
          });
          if (options.ippatsu) {
            yaku.push({
              yaku: { type: 'yaku', name: 'ippatsu', han: 1 },
              ron: true,
              tsumo: true
            });
          }
        }
        if (menzen) {
          yaku.push({
            yaku: { type: 'yaku', name: 'tsumo', han: 1 },
            ron: false,
            tsumo: true
          });
        }
        if (allTiles.every(t => t.type !== 'z' && t.n !== 1 && t.n !== 9)) {
          yaku.push({
            yaku: { type: 'yaku', name: 'tanyao', han: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (
          input.melds.length === 0 &&
          typeof tatsu !== 'number' &&
          tatsu.type === 'ryammen' &&
          decomposeResult.blocks.every(
            b =>
              (b.type === 'shuntsu' ||
                b.type === 'ryammen' ||
                b.type === 'toitsu') &&
              head < tileCountsFirstIndex.z + 4 &&
              head !==
                tileCountsFirstIndex.z +
                  ['east', 'south', 'west', 'north'].indexOf(table.round) &&
              head !==
                tileCountsFirstIndex.z +
                  ['east', 'south', 'west', 'north'].indexOf(table.seat)
          )
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'pinfu', han: 1 },
            ron: true,
            tsumo: true
          });
        }
        let ryampeko = false;
        if (menzen) {
          const c = sumBy(
            Object.values(
              countGroupBy(allMentsu, m =>
                m.type === 'shuntsu' ? m.tile : null
              )
            ),
            n => Math.floor(n / 2)
          );
          if (c === 1) {
            yaku.push({
              yaku: { type: 'yaku', name: 'iipeko', han: 1 },
              ron: true,
              tsumo: true
            });
          } else if (c === 2) {
            ryampeko = true;
          }
        }
        if (
          allTilesCounts[
            (tileCountsFirstIndex.z +
              ['east', 'south', 'west', 'north'].indexOf(
                table.round
              )) as TileCountsIndex
          ] >= 3
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'field-wind', han: 1 },
            ron: true,
            tsumo: true
          });
        }
        if (
          allTilesCounts[
            (tileCountsFirstIndex.z +
              ['east', 'south', 'west', 'north'].indexOf(
                table.seat
              )) as TileCountsIndex
          ] >= 3
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'seat-wind', han: 1 },
            ron: true,
            tsumo: true
          });
        }
        yaku.push(
          ...[0, 1, 2].flatMap(i =>
            allTilesCounts[
              (tileCountsFirstIndex.z + 4 + i) as TileCountsIndex
            ] >= 3
              ? [
                  {
                    yaku: {
                      type: 'yaku',
                      name: (['white', 'green', 'red'] as const)[i],
                      han: 1
                    } as Yaku,
                    ron: true,
                    tsumo: true
                  }
                ]
              : []
          )
        );
        if (input.melds.some(m => m.type === 'kan') && options.rinshan) {
          yaku.push({
            yaku: { type: 'yaku', name: 'rinshan', han: 1 },
            ron: false,
            tsumo: true
          });
        }
        if (
          options.chankan &&
          options.riichi !== 'double-riichi' &&
          typeof tatsu !== 'number' &&
          (tatsu.type === 'kanchan' ||
            tatsu.type === 'penchan' ||
            tatsu.type === 'ryammen')
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'chankan', han: 1 },
            ron: true,
            tsumo: false
          });
        }
        if (
          options.haitei &&
          (options.riichi === 'double-riichi' ? !options.ippatsu : true)
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'haitei', han: 1 },
            ron: false,
            tsumo: true
          });
          yaku.push({
            yaku: { type: 'yaku', name: 'hotei', han: 1 },
            ron: true,
            tsumo: false
          });
        }

        if (
          [0, 1, 2, 3, 4, 5, 6].some(s =>
            [0, 1, 2].every(
              t =>
                allMentsu.findIndex(
                  m => m.type === 'shuntsu' && m.tile === t * 9 + s
                ) !== -1
            )
          )
        ) {
          yaku.push({
            yaku: {
              type: 'yaku',
              name: 'sanshoku-dojun',
              han: menzen ? 2 : 1
            },
            ron: true,
            tsumo: true
          });
        }
        if (
          [0, 1, 2, 3, 4, 5, 6, 7, 8].some(s =>
            [0, 1, 2].every(
              t =>
                allMentsu.findIndex(
                  m => m.type === 'kotsu' && m.tile === t * 9 + s
                ) !== -1
            )
          )
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'sanshoku-doko', han: 2 },
            ron: true,
            tsumo: true
          });
        }
        if (
          [0, 1, 2].some(t =>
            [0, 3, 6].every(
              s =>
                allMentsu.findIndex(
                  m => m.type === 'shuntsu' && m.tile === t * 9 + s
                ) !== -1
            )
          )
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'ittsu', han: menzen ? 2 : 1 },
            ron: true,
            tsumo: true
          });
        }
        let junchan = false;
        if (
          allMentsu.every(
            m =>
              (m.type === 'kotsu' &&
                (m.tile >= tileCountsFirstIndex.z ||
                  m.tile % 9 === 0 ||
                  m.tile % 9 === 8)) ||
              (m.type === 'shuntsu' && (m.tile % 9 === 0 || m.tile % 9 === 6))
          ) &&
          allMentsu.some(m => m.type === 'shuntsu') &&
          (head >= tileCountsFirstIndex.z || head % 9 === 0 || head % 9 === 8)
        ) {
          if (allTiles.every(t => t.type !== 'z')) {
            junchan = true;
          } else {
            yaku.push({
              yaku: { type: 'yaku', name: 'chanta', han: menzen ? 2 : 1 },
              ron: true,
              tsumo: true
            });
          }
        }
        if (allMentsu.every(m => m.type === 'kotsu')) {
          yaku.push({
            yaku: { type: 'yaku', name: 'toitoi', han: 2 },
            ron: true,
            tsumo: true
          });
        }
        const anko =
          countBy(decomposeResult.blocks, b => b.type === 'kotsu') +
          countBy(input.melds, m => m.type === 'kan' && m.closed);
        if (anko === 3) {
          yaku.push({
            yaku: { type: 'yaku', name: 'sananko', han: 2 },
            ron: true,
            tsumo: true
          });
        } else if (
          anko === 2 &&
          typeof tatsu !== 'number' &&
          tatsu.type === 'toitsu'
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'sananko', han: 2 },
            ron: false,
            tsumo: true
          });
        }
        if (allTiles.every(t => t.type === 'z' || t.n === 1 || t.n === 9)) {
          yaku.push({
            yaku: { type: 'yaku', name: 'honroto', han: 2 },
            ron: true,
            tsumo: true
          });
        }
        if (countBy(input.melds, m => m.type === 'kan') === 3) {
          yaku.push({
            yaku: { type: 'yaku', name: 'sankantsu', han: 2 },
            ron: true,
            tsumo: true
          });
        }
        if (
          allTilesCounts[(tileCountsFirstIndex.z + 4) as TileCountsIndex] >=
            2 &&
          allTilesCounts[(tileCountsFirstIndex.z + 5) as TileCountsIndex] >=
            2 &&
          allTilesCounts[(tileCountsFirstIndex.z + 6) as TileCountsIndex] >= 2
        ) {
          yaku.push({
            yaku: { type: 'yaku', name: 'shosangen', han: 2 },
            ron: true,
            tsumo: true
          });
        }

        if (honitsu !== null) {
          yaku.push({
            yaku: { type: 'yaku', name: 'honitsu', han: menzen ? 3 : 2 },
            ron: true,
            tsumo: true
          });
        }
        if (junchan) {
          yaku.push({
            yaku: { type: 'yaku', name: 'junchan', han: menzen ? 3 : 2 },
            ron: true,
            tsumo: true
          });
        }
        if (ryampeko) {
          yaku.push({
            yaku: { type: 'yaku', name: 'ryampeko', han: 3 },
            ron: true,
            tsumo: true
          });
        }

        if (chinitsu !== null) {
          yaku.push({
            yaku: { type: 'yaku', name: 'chinitsu', han: menzen ? 6 : 5 },
            ron: true,
            tsumo: true
          });
        }

        const d = sumBy(
          input.dora,
          t => allTilesCounts[nextIndex(tileToCountsIndex(t))]
        );
        if (d > 0) {
          yaku.push({
            yaku: { type: 'yaku', name: 'dora', han: d },
            ron: true,
            tsumo: true
          });
        }
        const r = countBy(allTiles, t => t.type !== 'z' && t.n === 5 && t.red);
        if (r > 0) {
          yaku.push({
            yaku: { type: 'yaku', name: 'red-dora', han: r },
            ron: true,
            tsumo: true
          });
        }

        const tsumo: MentsuHora = {
          type: 'mentsu',
          by: 'tsumo',
          horaTile,
          melds: input.melds,
          fu: fu(
            decomposeResult,
            input.melds,
            tileToCountsIndex(horaTile),
            'tsumo',
            table,
            rule
          ),
          yaku: yakuman.some(y => y.tsumo)
            ? yakuman.flatMap(y => (y.tsumo ? [y.yakuman] : []))
            : yaku.flatMap(y => (y.tsumo ? [y.yaku] : []))
        };

        const ron: MentsuHora = {
          type: 'mentsu',
          by: 'ron',
          horaTile,
          melds: input.melds,
          fu: fu(
            decomposeResult,
            input.melds,
            tileToCountsIndex(horaTile),
            'ron',
            table,
            rule
          ),
          yaku: yakuman.some(y => y.ron)
            ? yakuman.flatMap(y => (y.ron ? [y.yakuman] : []))
            : yaku.flatMap(y => (y.ron ? [y.yaku] : []))
        };

        if (options.rinshan && tsumo.yaku.some(y => y.name === 'rinshan')) {
          return [tsumo];
        }
        if (options.chankan && ron.yaku.some(y => y.name === 'chankan')) {
          return [ron];
        }

        return [tsumo, ron];
      })
    )
  );
  return horas;
};

export const generateChitoitsuHora = (
  table: Table,
  hand: Tile[],
  options: HandOptions,
  dora: Tile[],
  rule: Rule
): Hora[] => {
  const counts = tilesToCounts(hand);
  const stats = colorStats(counts);
  const honitsu = honitsuColor(stats);
  const chinitsu = chinitsuColor(stats);

  const horaTiles: Tile[] = (() => {
    const tile = counts.flatMap((c, i) =>
      c === 1 ? countsIndexToTile(i as TileCountsIndex) : []
    )[0] as Tile;
    if (tile.type !== 'z' && tile.n === 5) {
      const r = rule.red[tile.type];
      if (
        r === 0 ||
        (r === 1 &&
          hand.some(t => compareTiles(t, { ...tile, red: true }) === 0))
      )
        return [{ ...tile, red: false }];
      if (
        r === 4 ||
        (r === 3 &&
          hand.some(t => compareTiles(t, { ...tile, red: false }) === 0))
      )
        return [{ ...tile, red: true }];
      return [
        { ...tile, red: false },
        { ...tile, red: true }
      ];
    }
    return [tile];
  })();

  return horaTiles.flatMap(horaTile => {
    const yakuman: Yakuman[] = [];
    if (counts.every((c, i) => (i < tileCountsFirstIndex.z ? c === 0 : true))) {
      yakuman.push({ type: 'yakuman', name: 'tsuiso', point: 1 });
    }
    if (options.tenho) {
      return [
        {
          type: 'chitoitsu',
          by: 'tsumo',
          horaTile,
          yaku: [
            ...yakuman,
            {
              type: 'yakuman',
              name: table.seat === 'east' ? 'tenho' : 'chiho',
              point: 1
            }
          ]
        }
      ];
    }
    if (yakuman.length > 0) {
      return ronAndTsumo.flatMap(by => ({
        type: 'chitoitsu',
        by,
        horaTile,
        yaku: yakuman
      }));
    }

    const yaku: { yaku: Yaku; ron: boolean; tsumo: boolean }[] = [];
    if (options.riichi !== 'none') {
      yaku.push({
        yaku: {
          type: 'yaku',
          name: options.riichi,
          han: options.riichi === 'double-riichi' ? 2 : 1
        },
        ron: true,
        tsumo: true
      });
      if (options.ippatsu) {
        yaku.push({
          yaku: { type: 'yaku', name: 'ippatsu', han: 1 },
          ron: true,
          tsumo: true
        });
      }
    }
    yaku.push({
      yaku: { type: 'yaku', name: 'tsumo', han: 1 },
      ron: false,
      tsumo: true
    });
    if (
      counts.every((c, i) =>
        i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z
          ? c === 0
          : true
      )
    ) {
      yaku.push({
        yaku: { type: 'yaku', name: 'tanyao', han: 1 },
        ron: true,
        tsumo: true
      });
    }
    if (
      options.haitei &&
      (options.riichi === 'double-riichi' ? !options.ippatsu : true)
    ) {
      yaku.push(
        {
          yaku: { type: 'yaku', name: 'hotei', han: 1 },
          ron: true,
          tsumo: false
        },
        {
          yaku: { type: 'yaku', name: 'haitei', han: 1 },
          ron: false,
          tsumo: true
        }
      );
    }
    yaku.push({
      yaku: { type: 'yaku', name: 'chitoitsu', han: 2 },
      ron: true,
      tsumo: true
    });
    if (
      counts.every((c, i) =>
        i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z
          ? true
          : c === 0
      )
    ) {
      yaku.push({
        yaku: { type: 'yaku', name: 'honroto', han: 2 },
        ron: true,
        tsumo: true
      });
    }
    if (honitsu !== null) {
      yaku.push({
        yaku: { type: 'yaku', name: 'honitsu', han: 3 },
        ron: true,
        tsumo: true
      });
    }
    if (chinitsu !== null) {
      yaku.push({
        yaku: { type: 'yaku', name: 'chinitsu', han: 6 },
        ron: true,
        tsumo: true
      });
    }
    const all = [...hand, horaTile];
    const allCounts = tilesToCounts(all);
    const d = sumBy(dora, t => allCounts[nextIndex(tileToCountsIndex(t))]);
    if (d > 0) {
      yaku.push({
        yaku: { type: 'yaku', name: 'dora', han: d },
        ron: true,
        tsumo: true
      });
    }
    const r = countBy(all, t => t.type !== 'z' && t.n === 5 && t.red);
    if (r > 0) {
      yaku.push({
        yaku: { type: 'yaku', name: 'red-dora', han: r },
        ron: true,
        tsumo: true
      });
    }

    return ronAndTsumo.flatMap(by => ({
      type: 'chitoitsu',
      by,
      horaTile,
      yaku: yaku.flatMap(y => (y[by] ? [y.yaku] : []))
    }));
  });
};

export const generateKokushiHora = (
  table: Table,
  counts: TileCounts,
  options: HandOptions,
  rule: Rule
): Hora[] => {
  const lack = counts.flatMap((c, i) =>
    (i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z) && c === 0
      ? [i as TileCountsIndex]
      : []
  );
  const wait13 = lack.length === 0;
  const horaTiles = wait13
    ? [...Array(34)].flatMap((_, i) =>
        i % 9 === 0 || i % 9 === 8 || i >= tileCountsFirstIndex.z
          ? [countsIndexToTile(i as TileCountsIndex)]
          : []
      )
    : [countsIndexToTile(lack[0] as TileCountsIndex)];

  if (options.tenho) {
    return horaTiles.map(horaTile => ({
      type: 'kokushi',
      by: 'tsumo',
      horaTile,
      yaku: [
        {
          type: 'yakuman',
          name: wait13 ? 'kokushi-13' : 'kokushi',
          point: wait13 && rule.kokushi13DoubleYakuman ? 2 : 1
        },
        {
          type: 'yakuman',
          name: table.seat === 'east' ? 'tenho' : 'chiho',
          point: 1
        }
      ]
    }));
  }

  return product2(horaTiles, ronAndTsumo).map(([horaTile, by]) => ({
    type: 'kokushi',
    by,
    horaTile,
    yaku: [
      {
        type: 'yakuman',
        name: wait13 ? 'kokushi-13' : 'kokushi',
        point: wait13 && rule.kokushi13DoubleYakuman ? 2 : 1
      }
    ]
  }));
};

export const uniqueHoras = (horas: Hora[], rule: Rule): Hora[] => {
  const ret = [...horas];
  ret.sort((a, b) => {
    const t = compareTiles(a.horaTile, b.horaTile);
    if (t !== 0) return t;
    if (a.by !== b.by) return a.by === 'tsumo' ? 1 : -1;
    if (
      a.yaku.some(y => y.type === 'yakuman') ||
      b.yaku.some(y => y.type === 'yakuman')
    )
      return (
        sumBy(b.yaku, y => (y.type === 'yakuman' ? y.point : 0)) -
        sumBy(a.yaku, y => (y.type === 'yakuman' ? y.point : 0))
      );
    const ah = sumBy(a.yaku, y => (y.type === 'yaku' ? y.han : 0));
    const bh = sumBy(b.yaku, y => (y.type === 'yaku' ? y.han : 0));
    if (ah >= 5 || bh >= 5) return bh - ah;
    const af = a.type === 'mentsu' ? sumOfFu(a.fu) : 25;
    const bf = b.type === 'mentsu' ? sumOfFu(b.fu) : 25;
    const ap = calculateBasePoint(af, ah, rule.roundedMangan, false);
    const bp = calculateBasePoint(bf, bh, rule.roundedMangan, false);
    if (ap !== bp) return bp - ap;
    return bh - ah;
  });

  return uniqueSorted(
    ret,
    (a, b) => compareTiles(a.horaTile, b.horaTile) === 0 && a.by === b.by
  );
};
