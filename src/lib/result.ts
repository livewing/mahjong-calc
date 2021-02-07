import type { HandConfig, RuleConfig, TableConfig } from './config';
import { deconstructure_and_count_shanten } from './deconstructure';
import type { Hand } from './hand';
import { calculate_basic_point, calculate_point_set, PointSet } from './score';
import {
  count_chitoitsu_shanten,
  count_kokushi_shanten
} from './special-hands';
import { compare_tile } from './tile';
import {
  generate_chitoitsu_hora,
  generate_hora,
  generate_kokushi_hora
} from './yaku';
import type { Hora } from './yaku';

interface NotTempai {
  tempai: false;
  shanten: number;
  shantenChitoitsu?: number | undefined;
  shantenKokushi?: number | undefined;
}

interface Tempai {
  tempai: true;
  hora: HoraWithPoint[];
}

type Result = NotTempai | Tempai;

export interface HoraWithPoint {
  hora: Hora;
  pointSet: PointSet;
  basicPoint: number;
}

const dedupe_hora = (
  hora: Hora[],
  tableConfig: TableConfig,
  ruleConfig: RuleConfig
): HoraWithPoint[] => {
  const hp: HoraWithPoint[] = hora.map(h => {
    const pointSet = calculate_point_set(h, tableConfig, ruleConfig);
    const basicPoint = calculate_basic_point(pointSet, ruleConfig);
    return { hora: h, pointSet, basicPoint };
  });
  hp.sort((a, b) => {
    const tile = compare_tile(a.hora.tile, b.hora.tile);
    if (tile !== 0) return tile;
    if (a.hora.type !== b.hora.type) return a.hora.type < b.hora.type ? -1 : 1;
    if (a.basicPoint !== b.basicPoint) return b.basicPoint - a.basicPoint;
    if (a.pointSet.type === 'yakuman' && b.pointSet.type === 'yakuman')
      return b.pointSet.point - a.pointSet.point;
    if (a.pointSet.type === 'normal' && b.pointSet.type === 'normal')
      return b.pointSet.han - a.pointSet.han;
    return 0;
  });

  const result: HoraWithPoint[] = [];
  for (const a of hp) {
    if (result.length === 0) {
      result.push(a);
      continue;
    }
    const last = result[result.length - 1];
    if (
      compare_tile(a.hora.tile, last.hora.tile) !== 0 ||
      a.hora.type !== last.hora.type
    ) {
      result.push(a);
    }
  }
  return result;
};

export const generate_result = (
  hand: Hand,
  tableConfig: TableConfig,
  handConfig: HandConfig,
  ruleConfig: RuleConfig
): Result => {
  if ('melds' in hand) {
    const { results, shanten } = deconstructure_and_count_shanten(
      hand.legal,
      hand.melds.length
    );
    if (shanten !== 0) {
      return { tempai: false, shanten };
    }
    const hp = dedupe_hora(
      results.flatMap(pattern =>
        generate_hora(tableConfig, pattern, hand.melds, handConfig, ruleConfig)
      ),
      tableConfig,
      ruleConfig
    );
    return { tempai: true, hora: hp };
  } else {
    const shanten = deconstructure_and_count_shanten(hand.legal, 0);
    const shantenChitoitsu = count_chitoitsu_shanten(hand.legal);
    const shantenKokushi = count_kokushi_shanten(hand.legal);
    if (
      shanten.shanten === 0 ||
      shantenChitoitsu === 0 ||
      shantenKokushi === 0
    ) {
      const hp = dedupe_hora(
        [
          ...(shanten.shanten === 0
            ? shanten.results.flatMap(pattern =>
                generate_hora(tableConfig, pattern, [], handConfig, ruleConfig)
              )
            : []),
          ...(shantenChitoitsu === 0
            ? generate_chitoitsu_hora(tableConfig, hand, handConfig)
            : []),
          ...(shantenKokushi === 0
            ? generate_kokushi_hora(tableConfig, hand, handConfig, ruleConfig)
            : [])
        ],
        tableConfig,
        ruleConfig
      );
      return { tempai: true, hora: hp };
    }

    return {
      tempai: false,
      shanten: shanten.shanten,
      shantenChitoitsu,
      shantenKokushi
    };
  }
};
