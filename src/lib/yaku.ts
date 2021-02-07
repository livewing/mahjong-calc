import type { TableConfig, HandConfig, RuleConfig } from './config';
import {
  compare_parts,
  instantiate_part,
  make_mentsu_from_tatsu
} from './deconstructure';
import type {
  Kanchan,
  Kotsu,
  Mentsu,
  Pattern,
  Penchan,
  Ryammen,
  Shuntsu,
  Tatsu,
  Toitsu
} from './deconstructure';
import { instantiate_meld } from './hand';
import type { Chow, LegalHand, Meld, Pong } from './hand';
import {
  count_tiles,
  is_tanyao_tile,
  string_to_tile,
  is_honor_tile,
  is_roto_tile,
  is_honitsu,
  is_chinitsu,
  is_tile,
  tile_to_string,
  compare_tile,
  is_dragon_tile,
  is_wind_tile
} from './tile';
import type { Tile, NumberTile } from './tile';
import { kokushi_tile_string } from './special-hands';
import { product2 } from './util';

export const yaku_names = [
  'riichi',
  'ippatsu',
  'tsumo',
  'tanyao',
  'pinfu',
  'iipeko',
  'field-wind',
  'seat-wind',
  'white',
  'green',
  'red',
  'rinshan',
  'chankan',
  'haitei',
  'hotei',
  'sanshoku-dojun',
  'sanshoku-doko',
  'ittsu',
  'chanta',
  'chitoitsu',
  'toitoi',
  'sananko',
  'honroto',
  'sankantsu',
  'shosangen',
  'double-riichi',
  'honitsu',
  'junchan',
  'ryampeko',
  'chinitsu',
  'dora'
] as const;
export const yakuman_yaku_names = [
  'kokushi',
  'suanko',
  'daisangen',
  'tsuiso',
  'shosushi',
  'daisushi',
  'ryuiso',
  'chinroto',
  'sukantsu',
  'churen',
  'tenho',
  'chiho'
] as const;

export const is_yakuman_yaku = (
  yaku_name: typeof yaku_names[number] | typeof yakuman_yaku_names[number]
): yaku_name is typeof yakuman_yaku_names[number] => {
  for (const y of yakuman_yaku_names) {
    if (y === yaku_name) return true;
  }
  return false;
};

interface Yaku {
  name: typeof yaku_names[number] | typeof yakuman_yaku_names[number];
  point: number;
}

export type Hora = {
  type: 'tsumo' | 'ron';
  tile: Tile;
  yaku: Yaku[];
} & (MentsuHora | SpecialHora);

interface MentsuHora {
  form: 'mentsu';
  parts: (Mentsu | Toitsu)[];
  tatsu: Tile | Tatsu;
  melds: Meld[];
}

interface SpecialHora {
  form: 'chitoitsu' | 'kokushi';
}

const generate_hora_with_tile = (
  tableConfig: TableConfig,
  parts: (Mentsu | Toitsu)[],
  tatsu: Tile | Tatsu,
  waitingTile: Tile,
  melds: Meld[],
  handConfig: HandConfig,
  ruleConfig: RuleConfig
): Hora[] => {
  const tiles = [
    ...parts.flatMap(instantiate_part),
    ...(is_tile(tatsu) ? [tatsu] : instantiate_part(tatsu)),
    waitingTile,
    ...melds.flatMap(instantiate_meld)
  ].sort(compare_tile);
  const counts = count_tiles(tiles);
  const shuntsu = [
    ...parts,
    ...(is_tile(tatsu) ? [] : [make_mentsu_from_tatsu(tatsu, waitingTile)]),
    ...melds
      .filter(m => m.type === 'chow')
      .map(c => ({ type: 'shuntsu', first: (c as Chow).first } as Shuntsu))
  ]
    .filter(p => p.type === 'shuntsu')
    .sort(compare_parts) as Shuntsu[];
  const isMenzen = melds.every(m => m.type === 'kong' && m.concealed);

  const yakuman: { tsumo: boolean; ron: boolean; yaku: Yaku }[] = [];
  if (isMenzen && parts.every(p => p.type === 'kotsu' || p.type === 'toitsu')) {
    if (tatsu.type === 'toitsu') {
      yakuman.push({
        tsumo: true,
        ron: false,
        yaku: { name: 'suanko', point: 1 }
      });
    } else if (is_tile(tatsu)) {
      yakuman.push({
        tsumo: true,
        ron: true,
        yaku: {
          name: 'suanko',
          point: ruleConfig.suankoTankiDoubleYakuman ? 2 : 1
        }
      });
    }
  }
  if (
    (['white', 'green', 'red'] as const)
      .map(type => tile_to_string({ type }))
      .every(ts => (counts[ts] || 0) >= 3)
  ) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'daisangen', point: 1 }
    });
  }
  if (tiles.every(is_honor_tile)) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'tsuiso', point: 1 }
    });
  }
  if (
    (['east', 'south', 'west', 'north'] as const)
      .map(type => tile_to_string({ type }))
      .every(ts => (counts[ts] || 0) >= 3)
  ) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: {
        name: 'daisushi',
        point: ruleConfig.daisushiDoubleYakuman ? 2 : 1
      }
    });
  } else if (
    (['east', 'south', 'west', 'north'] as const)
      .map(type => tile_to_string({ type }))
      .every(ts => (counts[ts] || 0) >= 2)
  ) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'shosushi', point: 1 }
    });
  }
  if (
    tiles.every(
      tile =>
        tile.type === 'green' ||
        (tile.type === 'bamboo' &&
          (tile.number === 2 ||
            tile.number === 3 ||
            tile.number === 4 ||
            tile.number === 6 ||
            tile.number === 8))
    )
  ) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'ryuiso', point: 1 }
    });
  }
  if (
    tiles.every(
      tile =>
        (tile.type === 'character' ||
          tile.type === 'dots' ||
          tile.type === 'bamboo') &&
        (tile.number === 1 || tile.number === 9)
    )
  ) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'chinroto', point: 1 }
    });
  }
  if (melds.filter(m => m.type === 'kong').length === 4) {
    yakuman.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'sukantsu', point: 1 }
    });
  }
  if (
    melds.length === 0 &&
    (tiles.every(t => t.type === 'character') ||
      tiles.every(t => t.type === 'dots') ||
      tiles.every(t => t.type === 'bamboo'))
  ) {
    const t = tiles as NumberTile[];
    const numbers = t.reduce(
      (acc, cur) => ({ ...acc, [cur.number]: (acc[cur.number] ?? 0) + 1 }),
      {} as { [_ in NumberTile['number']]?: number }
    );
    const waiting = (waitingTile as NumberTile).number;
    if (
      (numbers[1] ?? 0) >= 3 &&
      (numbers[2] ?? 0) >= 1 &&
      (numbers[3] ?? 0) >= 1 &&
      (numbers[4] ?? 0) >= 1 &&
      (numbers[5] ?? 0) >= 1 &&
      (numbers[6] ?? 0) >= 1 &&
      (numbers[7] ?? 0) >= 1 &&
      (numbers[8] ?? 0) >= 1 &&
      (numbers[9] ?? 0) >= 3
    ) {
      numbers[waiting] = (numbers[waiting] ?? 0) - 1;
      if (
        numbers[1] === 3 &&
        numbers[2] === 1 &&
        numbers[3] === 1 &&
        numbers[4] === 1 &&
        numbers[5] === 1 &&
        numbers[6] === 1 &&
        numbers[7] === 1 &&
        numbers[8] === 1 &&
        numbers[9] === 3
      ) {
        yakuman.push({
          tsumo: true,
          ron: true,
          yaku: {
            name: 'churen',
            point: ruleConfig.pureChurenDoubleYakuman ? 2 : 1
          }
        });
      } else {
        yakuman.push({
          tsumo: true,
          ron: true,
          yaku: { name: 'churen', point: 1 }
        });
      }
    }
  }
  if (melds.length === 0 && handConfig.blessing) {
    yakuman.push({
      tsumo: true,
      ron: false,
      yaku: tenho_or_chiho(tableConfig)
    });
    return [
      {
        form: 'mentsu',
        type: 'tsumo',
        tile: waitingTile,
        yaku: yakuman.filter(y => y.tsumo).map(y => y.yaku),
        parts,
        tatsu,
        melds
      }
    ];
  }

  const yaku: { tsumo: boolean; ron: boolean; yaku: Yaku }[] = [];

  if (isMenzen && handConfig.riichi !== 'none') {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: {
        name: handConfig.riichi,
        point: handConfig.riichi === 'double-riichi' ? 2 : 1
      }
    });

    if (handConfig.ippatsu) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: {
          name: 'ippatsu',
          point: 1
        }
      });
    }
  }
  if (isMenzen)
    yaku.push({ tsumo: true, ron: false, yaku: { name: 'tsumo', point: 1 } });
  if (tiles.every(is_tanyao_tile))
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'tanyao', point: 1 } });
  if (
    melds.length === 0 &&
    parts.every(
      p =>
        p.type === 'shuntsu' ||
        (p.type === 'toitsu' &&
          (is_wind_tile(p.tile)
            ? p.tile.type !== tableConfig.round &&
              p.tile.type !== tableConfig.seat
            : !is_dragon_tile(p.tile)))
    ) &&
    tatsu.type === 'ryammen'
  )
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'pinfu', point: 1 } });
  let ryampeko = false;
  if (isMenzen) {
    let pair = 0;
    let first: Shuntsu | undefined = void 0;
    for (const s of shuntsu) {
      if (typeof first === 'undefined' || compare_parts(first, s) !== 0)
        first = s;
      else if (compare_parts(first, s) === 0) {
        pair += 1;
        first = void 0;
      }
    }
    if (pair === 1) {
      yaku.push({ tsumo: true, ron: true, yaku: { name: 'iipeko', point: 1 } });
    } else if (pair === 2) {
      ryampeko = true;
    }
  }
  if ((counts[tile_to_string({ type: tableConfig.round })] ?? 0) >= 3) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'field-wind', point: 1 }
    });
  }
  if ((counts[tile_to_string({ type: tableConfig.seat })] ?? 0) >= 3) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'seat-wind', point: 1 }
    });
  }
  (['white', 'green', 'red'] as const).forEach(type => {
    if ((counts[tile_to_string({ type })] ?? 0) >= 3) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: { name: type, point: 1 }
      });
    }
  });
  if (melds.some(m => m.type === 'kong') && handConfig.rinshan)
    yaku.push({ tsumo: true, ron: false, yaku: { name: 'rinshan', point: 1 } });
  if (
    handConfig.chankan &&
    handConfig.riichi !== 'double-riichi' &&
    (tatsu.type === 'kanchan' ||
      tatsu.type === 'penchan' ||
      tatsu.type === 'ryammen')
  )
    yaku.push({ tsumo: false, ron: true, yaku: { name: 'chankan', point: 1 } });
  if (handConfig.last) {
    yaku.push({ tsumo: true, ron: false, yaku: { name: 'haitei', point: 1 } });
    yaku.push({ tsumo: false, ron: true, yaku: { name: 'hotei', point: 1 } });
  }

  if (
    [...Array(7)]
      .map((_, i) => (i + 1) as Shuntsu['first']['number'])
      .some(i =>
        (['character', 'dots', 'bamboo'] as const).every(type =>
          shuntsu.some(s => s.first.type === type && s.first.number === i)
        )
      )
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'sanshoku-dojun', point: isMenzen ? 2 : 1 }
    });
  }
  {
    const kotsu = [
      ...parts,
      ...(is_tile(tatsu) ? [] : [make_mentsu_from_tatsu(tatsu, waitingTile)]),
      ...melds
        .filter(m => m.type === 'pong' || m.type === 'kong')
        .map(k => ({ type: 'kotsu', tile: (k as Pong).tile } as Kotsu))
    ]
      .filter(p => p.type === 'kotsu')
      .sort(compare_parts) as Kotsu[];

    if (
      [...Array(9)]
        .map((_, i) => (i + 1) as NumberTile['number'])
        .some(i =>
          (['character', 'dots', 'bamboo'] as const).every(type =>
            kotsu.some(k => k.tile.type === type && k.tile.number === i)
          )
        )
    ) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: { name: 'sanshoku-doko', point: 2 }
      });
    }
  }
  if (
    (['character', 'dots', 'bamboo'] as const).some(type =>
      ([1, 4, 7] as const).every(first =>
        shuntsu.some(s => s.first.type === type && s.first.number === first)
      )
    )
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'ittsu', point: isMenzen ? 2 : 1 }
    });
  }
  let junchan = false;
  if (
    parts.every(
      p =>
        (p.type === 'shuntsu' &&
          (p.first.number === 1 || p.first.number === 7)) ||
        ((p.type === 'kotsu' || p.type === 'toitsu') && !is_tanyao_tile(p.tile))
    ) &&
    melds.every(
      m =>
        ((m.type === 'pong' || m.type === 'kong') && !is_tanyao_tile(m.tile)) ||
        (m.type === 'chow' && (m.first.number === 1 || m.first.number === 7))
    ) &&
    (is_tile(tatsu)
      ? !is_tanyao_tile(tatsu)
      : (() => {
          const mentsu = make_mentsu_from_tatsu(tatsu, waitingTile);
          return mentsu.type === 'kotsu'
            ? !is_tanyao_tile(mentsu.tile)
            : mentsu.first.number === 1 || mentsu.first.number === 7;
        })()) &&
    (parts.some(p => p.type === 'shuntsu') ||
      melds.some(m => m.type === 'chow') ||
      (!is_tile(tatsu) && tatsu.type !== 'toitsu'))
  ) {
    if (tiles.some(is_honor_tile)) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: { name: 'chanta', point: isMenzen ? 2 : 1 }
      });
    } else {
      junchan = true;
    }
  }
  if (
    parts.every(p => p.type === 'kotsu' || p.type === 'toitsu') &&
    melds.every(m => m.type !== 'chow') &&
    (is_tile(tatsu) || tatsu.type === 'toitsu')
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'toitoi', point: 2 }
    });
  }
  {
    const kotsu = parts.filter(p => p.type === 'kotsu').length;
    const kong = melds.filter(m => m.type === 'kong' && m.concealed).length;
    if (kotsu + kong === 3) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: { name: 'sananko', point: 2 }
      });
    } else if (kotsu + kong === 2 && tatsu.type === 'toitsu') {
      yaku.push({
        tsumo: true,
        ron: false,
        yaku: { name: 'sananko', point: 2 }
      });
    }
  }
  if (!tiles.some(is_tanyao_tile)) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'honroto', point: 2 }
    });
  }
  if (melds.filter(m => m.type === 'kong').length === 3) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'sankantsu', point: 2 }
    });
  }
  if (
    (['white', 'green', 'red'] as const)
      .map(type => tile_to_string({ type }))
      .every(ts => (counts[ts] || 0) >= 2)
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'shosangen', point: 2 }
    });
  }

  if (
    tiles.some(is_honor_tile) &&
    (['character', 'dots', 'bamboo'] as const).some(type =>
      tiles.every(t => is_honor_tile(t) || t.type === type)
    )
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'honitsu', point: isMenzen ? 3 : 2 }
    });
  }
  if (junchan) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'junchan', point: 3 }
    });
  }
  if (ryampeko) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'ryampeko', point: 3 }
    });
  }

  if (
    (['character', 'dots', 'bamboo'] as const).some(type =>
      tiles.every(t => t.type === type)
    )
  ) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'chinitsu', point: isMenzen ? 6 : 5 }
    });
  }

  if (handConfig.dora > 0)
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'dora', point: handConfig.dora }
    });

  const tsumo: Hora = {
    form: 'mentsu',
    type: 'tsumo',
    tile: waitingTile,
    yaku:
      yakuman.filter(y => y.tsumo).length > 0
        ? yakuman.filter(y => y.tsumo).map(y => y.yaku)
        : yaku.filter(y => y.tsumo).map(y => y.yaku),
    parts,
    tatsu,
    melds
  };
  const ron: Hora = {
    form: 'mentsu',
    type: 'ron',
    tile: waitingTile,
    yaku:
      yakuman.filter(y => y.ron).length > 0
        ? yakuman.filter(y => y.ron).map(y => y.yaku)
        : yaku.filter(y => y.ron).map(y => y.yaku),
    parts,
    tatsu,
    melds
  };

  if (handConfig.rinshan && tsumo.yaku.some(y => y.name === 'rinshan')) {
    return [tsumo];
  }
  if (handConfig.chankan && ron.yaku.some(y => y.name === 'chankan')) {
    return [ron];
  }
  return [tsumo, ron];
};

export const generate_hora = (
  tableConfig: TableConfig,
  pattern: Pattern,
  melds: Meld[],
  handConfig: HandConfig,
  ruleConfig: RuleConfig
): Hora[] => {
  const counts = count_tiles([
    ...pattern.parts.flatMap(instantiate_part),
    ...pattern.rest,
    ...melds.flatMap(instantiate_meld)
  ]);

  const ryammen = pattern.parts.filter(p => p.type === 'ryammen')[0];
  if (typeof ryammen !== 'undefined') {
    const ryammenTatsu = ryammen as Ryammen;
    const first = ryammenTatsu.first;
    const waitingTiles = [
      { ...first, number: first.number - 1 } as NumberTile,
      { ...first, number: first.number + 2 } as NumberTile
    ].filter(t => (counts[tile_to_string(t)] ?? 0) !== 4);
    return waitingTiles.flatMap(t =>
      generate_hora_with_tile(
        tableConfig,
        pattern.parts.filter(p => compare_parts(p, ryammenTatsu) !== 0) as (
          | Mentsu
          | Toitsu
        )[],
        ryammenTatsu,
        t,
        melds,
        handConfig,
        ruleConfig
      )
    );
  }

  const penchan = pattern.parts.filter(p => p.type === 'penchan')[0];
  if (typeof penchan !== 'undefined') {
    const penchanTatsu = penchan as Penchan;
    const first = penchanTatsu.first;
    const waitingTile = {
      ...first,
      number: first.number === 1 ? (3 as const) : (7 as const)
    };
    if ((counts[tile_to_string(waitingTile)] ?? 0) === 4) {
      return [];
    }
    return generate_hora_with_tile(
      tableConfig,
      pattern.parts.filter(p => compare_parts(p, penchanTatsu) !== 0) as (
        | Mentsu
        | Toitsu
      )[],
      penchanTatsu,
      waitingTile,
      melds,
      handConfig,
      ruleConfig
    );
  }

  const kanchan = pattern.parts.filter(p => p.type === 'kanchan')[0];
  if (typeof kanchan !== 'undefined') {
    const kanchanTatsu = kanchan as Kanchan;
    const first = kanchanTatsu.first;
    const waitingTile = { ...first, number: first.number + 1 } as NumberTile;
    if ((counts[tile_to_string(waitingTile)] ?? 0) === 4) {
      return [];
    }
    return generate_hora_with_tile(
      tableConfig,
      pattern.parts.filter(p => compare_parts(p, kanchanTatsu) !== 0) as (
        | Mentsu
        | Toitsu
      )[],
      kanchanTatsu,
      waitingTile,
      melds,
      handConfig,
      ruleConfig
    );
  }

  const shampon = pattern.parts.filter(p => p.type === 'toitsu');
  if (shampon.length === 2) {
    return (shampon as Toitsu[]).flatMap(t =>
      (counts[tile_to_string(t.tile)] ?? 0) === 4
        ? []
        : generate_hora_with_tile(
            tableConfig,
            pattern.parts.filter(p => compare_parts(p, t) !== 0) as (
              | Mentsu
              | Toitsu
            )[],
            t,
            t.tile,
            melds,
            handConfig,
            ruleConfig
          )
    );
  }

  const tanki = pattern.rest[0];
  if (typeof tanki !== 'undefined') {
    if ((counts[tile_to_string(tanki)] ?? 0) === 4) {
      return [];
    }
    return generate_hora_with_tile(
      tableConfig,
      pattern.parts as (Mentsu | Toitsu)[],
      tanki,
      tanki,
      melds,
      handConfig,
      ruleConfig
    );
  }

  throw new Error();
};

export const generate_chitoitsu_hora = (
  tableConfig: TableConfig,
  hand: LegalHand,
  handConfig: HandConfig
): Hora[] => {
  const counts = count_tiles(hand.legal);
  const waitingTile = string_to_tile(
    (Object.keys(counts) as (keyof typeof counts)[]).filter(
      ts => counts[ts] === 1
    )[0]
  );

  const yakuman: Yaku[] = [];
  if (hand.legal.every(t => is_honor_tile(t))) {
    yakuman.push({ name: 'tsuiso', point: 1 });
  }
  if (handConfig.blessing) {
    yakuman.push(tenho_or_chiho(tableConfig));
  }
  if (yakuman.length > 0) {
    if (yakuman.some(y => y.name === 'tenho' || y.name == 'chiho')) {
      return [
        { form: 'chitoitsu', type: 'tsumo', tile: waitingTile, yaku: yakuman }
      ];
    } else {
      return ['tsumo' as const, 'ron' as const].map(type => ({
        form: 'chitoitsu',
        type,
        tile: waitingTile,
        yaku: yakuman
      }));
    }
  }

  const yaku: { tsumo: boolean; ron: boolean; yaku: Yaku }[] = [];

  if (handConfig.riichi !== 'none') {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: {
        name: handConfig.riichi,
        point: handConfig.riichi === 'double-riichi' ? 2 : 1
      }
    });

    if (handConfig.ippatsu) {
      yaku.push({
        tsumo: true,
        ron: true,
        yaku: {
          name: 'ippatsu',
          point: 1
        }
      });
    }
  }
  yaku.push({ tsumo: true, ron: false, yaku: { name: 'tsumo', point: 1 } });
  if (hand.legal.every(is_tanyao_tile))
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'tanyao', point: 1 } });
  if (handConfig.last) {
    yaku.push({ tsumo: true, ron: false, yaku: { name: 'haitei', point: 1 } });
    yaku.push({ tsumo: false, ron: true, yaku: { name: 'hotei', point: 1 } });
  }

  yaku.push({ tsumo: true, ron: true, yaku: { name: 'chitoitsu', point: 2 } });
  if (hand.legal.every(t => is_honor_tile(t) || is_roto_tile(t)))
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'honroto', point: 2 } });

  if (is_honitsu(hand.legal))
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'honitsu', point: 3 } });

  if (typeof is_chinitsu(hand.legal) !== 'undefined')
    yaku.push({ tsumo: true, ron: true, yaku: { name: 'chinitsu', point: 6 } });

  if (handConfig.dora > 0) {
    yaku.push({
      tsumo: true,
      ron: true,
      yaku: { name: 'dora', point: handConfig.dora }
    });
  }

  return [
    {
      form: 'chitoitsu',
      type: 'tsumo',
      tile: waitingTile,
      yaku: yaku.filter(y => y.tsumo).map(y => y.yaku)
    },
    {
      form: 'chitoitsu',
      type: 'ron',
      tile: waitingTile,
      yaku: yaku.filter(y => y.ron).map(y => y.yaku)
    }
  ];
};

export const generate_kokushi_hora = (
  tableConfig: TableConfig,
  hand: LegalHand,
  handConfig: HandConfig,
  ruleConfig: RuleConfig
): Hora[] => {
  const counts = count_tiles(hand.legal);
  const kokushi_counts = kokushi_tile_string.map(s => counts[s] || 0);
  const wait13 = kokushi_counts.every(c => c === 1);
  const tiles = wait13
    ? kokushi_tile_string.map(string_to_tile)
    : [string_to_tile(kokushi_tile_string[kokushi_counts.indexOf(0)])];

  if (handConfig.blessing) {
    return tiles.map(tile => ({
      form: 'kokushi',
      type: 'tsumo',
      tile,
      yaku: [
        {
          name: 'kokushi',
          point: wait13 && ruleConfig.kokushi13DoubleYakuman ? 2 : 1
        },
        tenho_or_chiho(tableConfig)
      ]
    }));
  }

  return product2(['tsumo' as const, 'ron' as const], tiles).map(
    ([type, tile]) => ({
      form: 'kokushi',
      type,
      tile,
      yaku: [
        {
          name: 'kokushi',
          point: wait13 && ruleConfig.kokushi13DoubleYakuman ? 2 : 1
        }
      ]
    })
  );
};

const tenho_or_chiho = (tableConfig: TableConfig): Yaku =>
  tableConfig.seat === 'east'
    ? { name: 'tenho', point: 1 }
    : { name: 'chiho', point: 1 };
