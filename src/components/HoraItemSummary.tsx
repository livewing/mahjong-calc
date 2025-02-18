import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import type { Hora } from '../lib/hora';
import { calculateBasePoint, ceil10, ceil100 } from '../lib/score';
import { sumBy } from '../lib/util';
import { LimitBadge } from './LimitBadge';
import { Tile } from './tile';

interface HoraItemProps {
  info: Hora;
}

export const HoraItemSummary: FC<HoraItemProps> = ({ info }) => {
  const [
    {
      appConfig: { showBazoro },
      currentRule: {
        accumlatedYakuman,
        multipleYakuman,
        roundedMangan,
        honbaBonus
      },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  const base =
    info.type === 'kokushi' || info.yaku.some(y => y.type === 'yakuman')
      ? info.yaku.reduce((acc, cur) => {
          const p = cur.type === 'yakuman' ? cur.point : 0;
          if (multipleYakuman) return acc + p;
          return Math.max(acc, p);
        }, 0) * 8000
      : info.yaku.every(y => y.name === 'dora' || y.name === 'red-dora')
        ? 0
        : calculateBasePoint(
            info.type === 'mentsu' ? sumOfFu(info.fu) : 25,
            sumBy(info.yaku, y => (y.type === 'yaku' ? y.han : 0)),
            roundedMangan,
            accumlatedYakuman
          );
  const point =
    table.seat === 'east'
      ? info.by === 'ron'
        ? ceil100(base * 6)
        : ceil100(base * 2) * 3
      : info.by === 'ron'
        ? ceil100(base * 4)
        : ceil100(base) * 2 + ceil100(base * 2);

  return (
    <div className="flex items-center gap-2 rounded-md p-2 transition hover:bg-neutral-200 dark:hover:bg-neutral-800">
      <div className="relative w-12">
        <Tile tile={info.horaTile} />
        <div className="absolute -top-2 -right-3 text-xs text-white">
          <div
            className={
              info.by === 'tsumo'
                ? 'rounded-full bg-red-500/80 px-1 backdrop-blur-sm'
                : 'rounded-full bg-blue-500/80 px-1 backdrop-blur-sm'
            }
          >
            {t(`result.${info.by}`)}
          </div>
        </div>
      </div>
      {base === 0 && (
        <div className="text-xl italic text-neutral-500">
          {t('result.no-yaku')}
        </div>
      )}
      {base > 0 && (
        <div className="flex flex-1 flex-col items-start">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl">{point}</span>
            {(table.continue > 0 || table.deposit > 0) && (
              <span className="text-lg">
                (+{table.continue * honbaBonus * 3 + table.deposit * 1000})
              </span>
            )}
            <span>{t('result.points')}</span>
            <div className="ml-1 self-center">
              <LimitBadge base={base} />
            </div>
          </div>
          {info.by === 'ron' && table.continue > 0 && (
            <div>
              {t('result.ron-detail', {
                a: point,
                b: point + table.continue * honbaBonus * 3
              })}
            </div>
          )}
          {info.by === 'tsumo' &&
            table.continue === 0 &&
            table.seat === 'east' && (
              <div>
                {t('result.tsumo-east-detail', { count: ceil100(base * 2) })}
              </div>
            )}
          {info.by === 'tsumo' &&
            table.continue > 0 &&
            table.seat === 'east' && (
              <div>
                {t('result.tsumo-east-continue-detail', {
                  a: ceil100(base * 2),
                  b: ceil100(base * 2) + table.continue * honbaBonus
                })}
              </div>
            )}
          {info.by === 'tsumo' &&
            table.continue === 0 &&
            table.seat !== 'east' && (
              <div>
                {t('result.tsumo-other-detail', {
                  a: ceil100(base),
                  b: ceil100(base * 2)
                })}
              </div>
            )}
          {info.by === 'tsumo' &&
            table.continue > 0 &&
            table.seat !== 'east' && (
              <div>
                {t('result.tsumo-other-continue-detail', {
                  a: ceil100(base),
                  b: ceil100(base * 2),
                  c: ceil100(base) + table.continue * honbaBonus,
                  d: ceil100(base * 2) + table.continue * honbaBonus
                })}
              </div>
            )}
        </div>
      )}
      {base > 0 && info.yaku.every(y => y.type !== 'yakuman') && (
        <div className="hidden sm:block">
          {t('result.fu-han', {
            a: info.type === 'mentsu' ? ceil10(sumOfFu(info.fu)) : 25,
            b:
              sumBy(info.yaku, y => (y.type === 'yaku' ? y.han : 0)) +
              (showBazoro ? 2 : 0)
          })}
        </div>
      )}
    </div>
  );
};
