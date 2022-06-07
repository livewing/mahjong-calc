import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import { calculateBasePoint, ceil100 } from '../lib/score';
import { sumBy } from '../lib/util';
import type { Hora } from '../lib/hora';
import type { FC } from 'react';

interface PointDiffProps {
  info: Hora;
}

export const PointDiff: FC<PointDiffProps> = ({ info }) => {
  const [
    {
      currentRule: {
        roundedMangan,
        accumlatedYakuman,
        multipleYakuman,
        honbaBonus
      },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  if (info.yaku.every(y => y.name === 'dora' || y.name === 'red-dora'))
    return null;

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
  const isDealer = table.seat === 'east';

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="text-xl font-bold">{t('result.point-diff')}</div>
      {info.by === 'ron' && (
        <div>
          {t('result.point', {
            count:
              (ceil100(base * (isDealer ? 6 : 4)) +
                table.continue * 3 * honbaBonus) *
                2 +
              1000 * table.deposit
          })}
        </div>
      )}
      {info.by === 'tsumo' && isDealer && (
        <div>
          {t('result.point', {
            count:
              (ceil100(base * 2) + table.continue * honbaBonus) * 4 +
              1000 * table.deposit
          })}
        </div>
      )}
      {info.by === 'tsumo' && !isDealer && (
        <>
          <div>
            {t('result.non-dealer-diff', {
              count:
                ceil100(base) * 3 +
                ceil100(base * 2) +
                table.continue * honbaBonus * 4 +
                1000 * table.deposit
            })}
          </div>
          <div>
            {t('result.dealer-diff', {
              count:
                ceil100(base) * 2 +
                ceil100(base * 2) * 2 +
                table.continue * honbaBonus * 4 +
                1000 * table.deposit
            })}
          </div>
        </>
      )}
    </div>
  );
};
