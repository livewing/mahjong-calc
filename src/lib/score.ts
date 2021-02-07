import type { RuleConfig, TableConfig } from './config';
import type { Toitsu } from './deconstructure';
import { is_dragon_tile, is_tanyao_tile, is_tile } from './tile';
import { is_yakuman_yaku } from './yaku';
import type { Hora } from './yaku';

const mangan = 2000;
const haneman = 3000;
const baiman = 4000;
const sambaiman = 6000;
const yakuman = 8000;

export type PointSet =
  | { type: 'yakuman'; point: number }
  | { type: 'normal'; fu: number; han: number };

export const calculate_point_set = (
  hora: Hora,
  tableConfig: TableConfig,
  ruleConfig: RuleConfig
): PointSet => {
  if (hora.form === 'kokushi' || hora.yaku.some(y => is_yakuman_yaku(y.name))) {
    return {
      type: 'yakuman',
      point: hora.yaku.map(y => y.point).reduce((cur, acc) => cur + acc, 0)
    };
  }

  const fu = (() => {
    if (hora.form === 'chitoitsu') return 25;
    if (hora.form !== 'mentsu') throw new Error();

    let fu = 20;

    hora.parts.forEach(m => {
      if (m.type === 'kotsu') {
        fu += is_tanyao_tile(m.tile) ? 4 : 8;
      }
    });
    if (hora.tatsu.type === 'toitsu') {
      if (hora.type === 'tsumo') fu += is_tanyao_tile(hora.tatsu.tile) ? 4 : 8;
      else fu += is_tanyao_tile(hora.tatsu.tile) ? 2 : 4;
    }

    hora.melds.forEach(m => {
      if (m.type === 'pong') {
        fu += is_tanyao_tile(m.tile) ? 2 : 4;
      } else if (m.type === 'kong' && !m.concealed) {
        fu += is_tanyao_tile(m.tile) ? 8 : 16;
      } else if (m.type === 'kong' && m.concealed) {
        fu += is_tanyao_tile(m.tile) ? 16 : 32;
      }
    });

    fu += (() => {
      const toitsu = hora.parts.filter(p => p.type === 'toitsu') as Toitsu[];
      const head = toitsu.length === 1 ? toitsu[0].tile : hora.tile;

      let headFu = 0;

      if (is_dragon_tile(head)) headFu = 2;

      if (head.type === tableConfig.round) headFu = 2;
      if (head.type === tableConfig.seat) headFu += 2;
      if (ruleConfig.doubleWindFu === 2) headFu = Math.min(headFu, 2);

      return headFu;
    })();

    if (
      is_tile(hora.tatsu) ||
      hora.tatsu.type === 'kanchan' ||
      hora.tatsu.type === 'penchan'
    ) {
      fu += 2;
    }

    if (
      hora.melds.every(m => m.type === 'kong' && m.concealed) &&
      hora.type === 'ron'
    ) {
      fu += 10;
    }

    if (hora.type === 'tsumo' && !hora.yaku.some(y => y.name === 'pinfu')) {
      fu += 2;
    }

    if (fu === 20 && hora.melds.length > 0) {
      fu = 30;
    }

    return 10 * Math.ceil(fu / 10);
  })();

  if (hora.yaku.length > 0 && hora.yaku.every(y => y.name === 'dora')) {
    return { type: 'normal', fu, han: 0 };
  }

  return {
    type: 'normal',
    fu,
    han: hora.yaku.map(y => y.point).reduce((acc, cur) => acc + cur, 0)
  };
};

export const calculate_basic_point = (
  ps: PointSet,
  ruleConfig: RuleConfig
): number => {
  if (ps.type === 'yakuman') {
    return yakuman * (ruleConfig.multipleYakuman ? ps.point : 1);
  } else {
    if (ps.han >= 13 && ruleConfig.countedYakuman) return yakuman;
    if (ps.han >= 11) return sambaiman;
    if (ps.han >= 8) return baiman;
    if (ps.han >= 6) return haneman;
    if (ps.han >= 5) return mangan;

    const bp = ps.fu * Math.pow(2, ps.han + 2);
    if (bp >= 1920 && ruleConfig.roundUpMangan) return mangan;
    return Math.min(bp, mangan);
  }
};
