import React from 'react';
import { useTranslation } from 'react-i18next';
import { TileImage } from './tile-image';
import { BEM } from '../lib/bem';
import { FuDetail } from './fu-detail';
import type { FC } from 'react';
import type { TFunction } from 'react-i18next';
import type { Hora } from '../lib/yaku';
import type { HoraWithPoint } from '../lib/result';
import type { RuleConfig, TableConfig } from '../lib/config';

const bem = BEM('hora-item');

const yaku_names = (yaku: Hora['yaku'][0], t: TFunction): string => {
  if (yaku.name === 'kokushi') {
    return t(yaku.point === 2 ? 'yaku.kokushi-13' : 'yaku.kokushi');
  }
  if (yaku.name === 'suanko') {
    return t(yaku.point === 2 ? 'yaku.suanko-tanki' : 'yaku.suanko');
  }
  if (yaku.name === 'churen') {
    return t(yaku.point === 2 ? 'yaku.pure-churen' : 'yaku.churen');
  }
  return t(`yaku.${yaku.name}`);
};
const tuples = [
  '',
  'double-',
  'triple-',
  'quadruple-',
  'quintuple-',
  'sextuple-',
  'septuple-',
  'octuple-',
  'nonuple-',
  'decuple-'
];
const yakuman_tuple = (n: number, t: TFunction): string =>
  t(n <= 10 ? `hora-item.${tuples[n - 1]}yakuman` : 'hora-item.more-yakuman');

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
  const { t } = useTranslation();

  if (basicPoint < 2000) return null;
  if (basicPoint === 2000)
    return (
      <div className={bem('score-badge', 'mangan')}>
        {t('hora-item.mangan')}
      </div>
    );
  if (basicPoint === 3000)
    return (
      <div className={bem('score-badge', 'haneman')}>
        {t('hora-item.haneman')}
      </div>
    );
  if (basicPoint === 4000)
    return (
      <div className={bem('score-badge', 'baiman')}>
        {t('hora-item.baiman')}
      </div>
    );
  if (basicPoint === 6000)
    return (
      <div className={bem('score-badge', 'sambaiman')}>
        {t('hora-item.sambaiman')}
      </div>
    );
  return (
    <div className={bem('score-badge', 'yakuman')}>
      {yakuman_tuple(basicPoint / 8000, t)}
    </div>
  );
};

interface HoraItemProps {
  hora: HoraWithPoint;
  tableConfig: TableConfig;
  ruleConfig: RuleConfig;
}

export const HoraItem: FC<HoraItemProps> = ({
  hora,
  tableConfig,
  ruleConfig
}) => {
  const { t } = useTranslation();
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
            {hora.hora.type === 'tsumo'
              ? t('hora-item.tsumo')
              : t('hora-item.ron')}
          </div>
          {noYaku ? (
            <div className={bem('total-score', 'none')}>
              {t('hora-item.no-yaku')}
            </div>
          ) : (
            <div className={bem('score')}>
              <div className={bem('total-score')}>
                <div className={bem('total-point')}>{totalPoint}</div>
                {plusPoint !== 0 && (
                  <div className={bem('plus-point')}> (+{plusPoint})</div>
                )}
                <div>&nbsp;{t('hora-item.points')}</div>
                <ScoreBadge basicPoint={hora.basicPoint} />
              </div>
              {(tableConfig.continue > 0 ||
                tableConfig.deposit > 0 ||
                detailedScore.type === 'tsumo') && (
                <div className={bem('detailed-score')}>
                  {detailedScore.type === 'ron' && tableConfig.continue > 0 && (
                    <span>
                      {t('hora-item.ron-detail', {
                        a: totalPoint,
                        b: totalPoint + tableConfig.continue * 300
                      })}
                    </span>
                  )}
                  {detailedScore.type === 'tsumo' &&
                    detailedScore.isEast &&
                    tableConfig.continue === 0 && (
                      <span>
                        {t('hora-item.tsumo-east-detail', {
                          count: detailedScore.all
                        })}
                      </span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    detailedScore.isEast &&
                    tableConfig.continue > 0 && (
                      <span>
                        {t('hora-item.tsumo-east-continue-detail', {
                          a: detailedScore.all,
                          b: detailedScore.all + tableConfig.continue * 100
                        })}
                      </span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    !detailedScore.isEast &&
                    tableConfig.continue === 0 && (
                      <span>
                        {t('hora-item.tsumo-other-detail', {
                          a: detailedScore.small,
                          b: detailedScore.big
                        })}
                      </span>
                    )}
                  {detailedScore.type === 'tsumo' &&
                    !detailedScore.isEast &&
                    tableConfig.continue > 0 && (
                      <span>
                        {t('hora-item.tsumo-other-continue-detail', {
                          a: detailedScore.small,
                          b: detailedScore.big,
                          c: detailedScore.small + 100 * tableConfig.continue,
                          d: detailedScore.big + 100 * tableConfig.continue
                        })}
                      </span>
                    )}
                </div>
              )}
            </div>
          )}
        </div>
      </summary>
      {hora.hora.form !== 'kokushi' && (
        <div className={bem('detail-header')}>{t('fu-detail.title')}</div>
      )}
      <FuDetail
        hora={hora.hora}
        tableConfig={tableConfig}
        ruleConfig={ruleConfig}
      />
      {!noYaku && (
        <>
          <div className={bem('detail-header')}>{t('yaku-detail.title')}</div>
          <div className={bem('yaku-names')}>
            {hora.hora.yaku.map((y, i) => (
              <div key={i} className={bem('yaku')}>
                <div className={bem('yaku-name')}>{yaku_names(y, t)}</div>
                <div>
                  {hora.pointSet.type === 'yakuman'
                    ? yakuman_tuple(y.point, t)
                    : t('yaku-detail.han', { count: y.point })}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {hora.pointSet.type !== 'yakuman' && (
        <>
          <div className={bem('detail-header')}>{t('score-detail.title')}</div>
          <div className={bem('point-set')}>
            {t('score-detail.fu', { count: hora.pointSet.fu })}{' '}
            {t('score-detail.han', { count: hora.pointSet.han })}
            {hora.pointSet.type === 'normal' && hora.pointSet.han > 0 && (
              <span className={bem('basic-point')}>
                {' '}
                ({t('score-detail.basic-point', { count: hora.basicPoint })})
              </span>
            )}
          </div>
        </>
      )}
      {!noYaku && (
        <div className={bem('detail-header')}>{t('diff-detail.title')}</div>
      )}
      {!noYaku && scoreDiff.type === 'single' && (
        <div className={bem('score-diff')}>
          {t('diff-detail.point', { count: scoreDiff.diff })}
        </div>
      )}
      {!noYaku && scoreDiff.type === 'tsumo' && (
        <>
          <div className={bem('score-diff')}>
            {t('diff-detail.east-diff', { count: scoreDiff.big })}
          </div>
          <div className={bem('score-diff')}>
            {t('diff-detail.other-diff', { count: scoreDiff.small })}
          </div>
        </>
      )}
    </details>
  );
};
