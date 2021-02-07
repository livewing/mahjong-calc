import React from 'react';
import type { FC } from 'react';
import type { Hora } from '../lib/yaku';
import type { HoraWithPoint } from '../lib/result';
import { TileImage } from './tile-image';
import { BEM } from '../lib/bem';
import type { TableConfig } from '../lib/config';

const bem = BEM('hora-item');

const yaku_names = (yaku: Hora['yaku'][0]): string => {
  switch (yaku.name) {
    case 'riichi':
      return '立直';
    case 'ippatsu':
      return '一発';
    case 'tsumo':
      return '門前清自摸和';
    case 'tanyao':
      return '断么九';
    case 'pinfu':
      return '平和';
    case 'iipeko':
      return '一盃口';
    case 'field-wind':
      return '場風牌';
    case 'seat-wind':
      return '自風牌';
    case 'white':
      return '白';
    case 'green':
      return '發';
    case 'red':
      return '中';
    case 'rinshan':
      return '嶺上開花';
    case 'chankan':
      return '搶槓';
    case 'haitei':
      return '海底摸月';
    case 'hotei':
      return '河底撈魚';
    case 'sanshoku-dojun':
      return '三色同順';
    case 'sanshoku-doko':
      return '三色同刻';
    case 'ittsu':
      return '一気通貫';
    case 'chanta':
      return '混全帯么九';
    case 'chitoitsu':
      return '七対子';
    case 'toitoi':
      return '対々和';
    case 'sananko':
      return '三暗刻';
    case 'honroto':
      return '混老頭';
    case 'sankantsu':
      return '三槓子';
    case 'shosangen':
      return '小三元';
    case 'double-riichi':
      return 'ダブル立直';
    case 'honitsu':
      return '混一色';
    case 'junchan':
      return '純全帯么九';
    case 'ryampeko':
      return '二盃口';
    case 'chinitsu':
      return '清一色';
    case 'dora':
      return 'ドラ';
    case 'kokushi':
      return yaku.point === 2 ? '国士無双十三面待ち' : '国士無双';
    case 'suanko':
      return yaku.point === 2 ? '四暗刻単騎待ち' : '四暗刻';
    case 'daisangen':
      return '大三元';
    case 'tsuiso':
      return '字一色';
    case 'shosushi':
      return '小四喜';
    case 'daisushi':
      return '大四喜';
    case 'ryuiso':
      return '緑一色';
    case 'chinroto':
      return '清老頭';
    case 'sukantsu':
      return '四槓子';
    case 'churen':
      return yaku.point === 2 ? '純正九蓮宝燈' : '九蓮宝燈';
    case 'tenho':
      return '天和';
    case 'chiho':
      return '地和';
  }
};
const tuples = [
  '',
  'ダブル',
  'トリプル',
  'クアドラプル',
  'クインタプル',
  'セクスタプル',
  'セプタプル',
  'オクタプル',
  'ノナプル',
  'デカプル'
];
const yakuman_tuple = (n: number): string =>
  n <= 10 ? `${tuples[n - 1]}役満` : '重ね役満';

const round_up = (score: number): number => Math.ceil(score / 100) * 100;
type DetailedScore =
  | { type: 'ron'; score: number }
  | { type: 'tsumo'; isEast: false; small: number; big: number }
  | { type: 'tsumo'; isEast: true; all: number };
const detailed_score = (
  hora: HoraWithPoint,
  tableConfig: TableConfig
): DetailedScore => {
  if (hora.hora.type === 'ron') {
    return {
      type: 'ron',
      score: round_up(hora.basicPoint * (tableConfig.seat === 'east' ? 6 : 4))
    };
  }
  if (tableConfig.seat === 'east') {
    return {
      type: 'tsumo',
      isEast: true,
      all: round_up(hora.basicPoint * 2)
    };
  }
  return {
    type: 'tsumo',
    isEast: false,
    small: round_up(hora.basicPoint),
    big: round_up(hora.basicPoint * 2)
  };
};
const total_point = (ds: DetailedScore): number => {
  if (ds.type === 'ron') return ds.score;
  if (ds.isEast) return ds.all * 3;
  return ds.big + ds.small * 2;
};
type ScoreDiff =
  | { type: 'single'; diff: number }
  | { type: 'tsumo'; small: number; big: number };
const score_diff = (ds: DetailedScore, tableConfig: TableConfig): ScoreDiff => {
  const { continue: c, deposit: d } = tableConfig;
  if (ds.type === 'ron') {
    return { type: 'single', diff: (ds.score + 300 * c) * 2 + 1000 * d };
  }
  if (ds.isEast) {
    return { type: 'single', diff: 4 * (ds.all + 100 * c) + 1000 * d };
  }
  return {
    type: 'tsumo',
    small: 2 * ds.small + ds.big + 300 * c + ds.small + 100 * c + 1000 * d,
    big: 2 * ds.small + ds.big + 300 * c + ds.big + 100 * c + 1000 * d
  };
};

interface ScoreBadge {
  basicPoint: number;
}

const ScoreBadge: FC<ScoreBadge> = ({ basicPoint }) => {
  if (basicPoint < 2000) return null;
  if (basicPoint === 2000)
    return <div className={bem('score-badge', 'mangan')}>満貫</div>;
  if (basicPoint === 3000)
    return <div className={bem('score-badge', 'haneman')}>跳満</div>;
  if (basicPoint === 4000)
    return <div className={bem('score-badge', 'baiman')}>倍満</div>;
  if (basicPoint === 6000)
    return <div className={bem('score-badge', 'sambaiman')}>三倍満</div>;
  return (
    <div className={bem('score-badge', 'yakuman')}>
      {yakuman_tuple(basicPoint / 8000)}
    </div>
  );
};

interface HoraItemProps {
  hora: HoraWithPoint;
  tableConfig: TableConfig;
}

export const HoraItem: FC<HoraItemProps> = ({ hora, tableConfig }) => {
  const detailedScore = detailed_score(hora, tableConfig);
  const totalPoint = total_point(detailedScore);
  const plusPoint = tableConfig.continue * 300 + tableConfig.deposit * 1000;
  const scoreDiff = score_diff(detailedScore, tableConfig);
  const noYaku = hora.pointSet.type === 'normal' && hora.pointSet.han === 0;
  return (
    <details className={bem()}>
      <summary>
        <div className={bem('summary')}>
          <div className={bem('tile')}>
            <TileImage tile={hora.hora.tile} />
          </div>
          <div className={bem('hora-type', hora.hora.type)}>
            {hora.hora.type === 'tsumo' ? 'ツモ' : 'ロン'}
          </div>
          {noYaku ? (
            <div className={bem('total-score', 'none')}>役無し</div>
          ) : (
            <div className={bem('score')}>
              <div className={bem('total-score')}>
                <div className={bem('total-point')}>{totalPoint}</div>
                {plusPoint !== 0 && (
                  <div className={bem('plus-point')}> (+{plusPoint})</div>
                )}
                <div> 点</div>
                <ScoreBadge basicPoint={hora.basicPoint} />
              </div>
              {(tableConfig.continue > 0 ||
                tableConfig.deposit > 0 ||
                detailedScore.type === 'tsumo') && (
                <div className={bem('detailed-score')}>
                  {detailedScore.type === 'ron' && tableConfig.continue > 0 && (
                    <span>
                      {totalPoint} は {totalPoint + tableConfig.continue * 300}
                    </span>
                  )}
                  {detailedScore.type === 'tsumo' &&
                    detailedScore.isEast &&
                    tableConfig.continue === 0 && (
                      <span>{detailedScore.all} オール</span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    detailedScore.isEast &&
                    tableConfig.continue > 0 && (
                      <span>
                        {detailedScore.all} は{' '}
                        {detailedScore.all + tableConfig.continue * 100} オール
                      </span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    !detailedScore.isEast &&
                    tableConfig.continue === 0 && (
                      <span>
                        {detailedScore.small} &middot; {detailedScore.big}
                      </span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    !detailedScore.isEast &&
                    tableConfig.continue > 0 && (
                      <span>
                        {detailedScore.small} &middot; {detailedScore.big} は{' '}
                        {detailedScore.small + 100 * tableConfig.continue}{' '}
                        &middot;{' '}
                        {detailedScore.big + 100 * tableConfig.continue}
                      </span>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </summary>
      {hora.hora.yaku.map((y, i) => (
        <div key={i} className={bem('yaku')}>
          <div className={bem('yaku-name')}>{yaku_names(y)}</div>
          <div>
            {hora.pointSet.type === 'yakuman'
              ? yakuman_tuple(y.point)
              : `${y.point} 飜`}
          </div>
        </div>
      ))}
      {hora.pointSet.type !== 'yakuman' && (
        <div className={bem('point-set')}>
          {hora.pointSet.fu} 符 {hora.pointSet.han} 飜
          {hora.pointSet.type === 'normal' && hora.pointSet.han > 0 && (
            <span className={bem('basic-point')}>
              {' '}
              (基本点 {hora.basicPoint} 点)
            </span>
          )}
        </div>
      )}
      {!noYaku && scoreDiff.type === 'single' && (
        <div className={bem('score-diff')}>点差: {scoreDiff.diff} 点</div>
      )}
      {!noYaku && scoreDiff.type === 'tsumo' && (
        <>
          <div className={bem('score-diff')}>
            親との点差: {scoreDiff.big} 点
          </div>
          <div className={bem('score-diff')}>
            子との点差: {scoreDiff.small} 点
          </div>
        </>
      )}
    </details>
  );
};
