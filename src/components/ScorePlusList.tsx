import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdArrowForward } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import { calculateBasePoint, ceil100 } from '../lib/score';
import { sumBy } from '../lib/util';
import { LimitBadge } from './LimitBadge';
import type { Hora } from '../lib/hora';

interface ScorePlusListProps {
  info: Hora;
}

export const ScorePlusList: FC<ScorePlusListProps> = ({ info }) => {
  const [
    {
      currentRule: { roundedMangan, accumlatedYakuman, honbaBonus },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  if (
    info.type === 'kokushi' ||
    info.yaku.some(y => y.type === 'yakuman') ||
    info.yaku.every(y => y.name === 'dora' || y.name === 'red-dora')
  )
    return null;

  const fu = info.type === 'mentsu' ? sumOfFu(info.fu) : 25;
  const han = sumBy(info.yaku, y => (y.type === 'yaku' ? y.han : 0));
  if (han > 13) return null;

  const orig = calculateBasePoint(fu, han, roundedMangan, accumlatedYakuman);
  const points = [...Array(13 - han)]
    .map((_, i) => ({
      plus: i + 1,
      base: calculateBasePoint(
        fu,
        han + i + 1,
        roundedMangan,
        accumlatedYakuman
      )
    }))
    .reduce(
      (acc, { plus, base }) =>
        base === orig
          ? acc
          : acc.length === 0 || acc[acc.length - 1]?.base !== base
          ? [...acc, { start: plus, end: plus, base }]
          : acc.flatMap((e, i) =>
              i === acc.length - 1 ? { ...e, end: plus } : e
            ),
      [] as { start: number; end: number; base: number }[]
    );
  if (points.length === 0) return null;
  (points[points.length - 1] as typeof points[number]).end =
    Number.POSITIVE_INFINITY;

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-xl font-bold">{t('result.change-in-score')}</div>
      <div className="overflow-x-auto">
        <div className="grid grid-cols-[max-content,max-content,max-content] gap-2">
          {points.map((p, i) => (
            <React.Fragment key={i}>
              <div className="text-right">
                {p.start === p.end && (
                  <span>{t('result.plus-han', { count: p.start })}</span>
                )}
                {p.end - p.start === 1 && (
                  <span>
                    {t('result.plus-han-2', { a: p.start, b: p.end })}
                  </span>
                )}
                {p.end - p.start > 1 && Number.isFinite(p.end) && (
                  <span>
                    {t('result.plus-han-range', { a: p.start, b: p.end })}
                  </span>
                )}
                {!Number.isFinite(p.end) && (
                  <span>{t('result.plus-gte-han', { count: p.start })}</span>
                )}
              </div>
              <div className="flex justify-center items-center">
                <MdArrowForward />
              </div>
              <div className="flex gap-2 items-center">
                {info.by === 'ron' && table.continue === 0 && (
                  <div>
                    {table.seat === 'east'
                      ? ceil100(p.base * 6)
                      : ceil100(p.base * 4)}{' '}
                    {t('result.points')}
                  </div>
                )}
                {info.by === 'ron' && table.continue > 0 && (
                  <div>
                    {t(
                      'result.ron-detail',
                      (() => {
                        const point =
                          table.seat === 'east'
                            ? ceil100(p.base * 6)
                            : ceil100(p.base * 4);
                        return {
                          a: point,
                          b: point + table.continue * honbaBonus * 3
                        };
                      })()
                    )}
                  </div>
                )}
                {info.by === 'tsumo' &&
                  table.continue === 0 &&
                  table.seat === 'east' && (
                    <div>
                      {t('result.tsumo-east-detail', {
                        count: ceil100(p.base * 2)
                      })}
                    </div>
                  )}
                {info.by === 'tsumo' &&
                  table.continue > 0 &&
                  table.seat === 'east' && (
                    <div>
                      {t('result.tsumo-east-continue-detail', {
                        a: ceil100(p.base * 2),
                        b: ceil100(p.base * 2) + table.continue * honbaBonus
                      })}
                    </div>
                  )}
                {info.by === 'tsumo' &&
                  table.continue === 0 &&
                  table.seat !== 'east' && (
                    <div>
                      {t('result.tsumo-other-detail', {
                        a: ceil100(p.base),
                        b: ceil100(p.base * 2)
                      })}
                    </div>
                  )}
                {info.by === 'tsumo' &&
                  table.continue > 0 &&
                  table.seat !== 'east' && (
                    <div>
                      {t('result.tsumo-other-continue-detail', {
                        a: ceil100(p.base),
                        b: ceil100(p.base * 2),
                        c: ceil100(p.base) + table.continue * honbaBonus,
                        d: ceil100(p.base * 2) + table.continue * honbaBonus
                      })}
                    </div>
                  )}
                <LimitBadge base={p.base} />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
