import type React from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { yakumanTupleKey } from '../lib/score';
import { sumBy } from '../lib/util';
import type { Yaku } from '../lib/yaku';

interface YakuBadgeProps {
  l?: React.ReactNode;
  r?: React.ReactNode;
  yakuman?: boolean;
}
const YakuBadge: FC<YakuBadgeProps> = ({ l, r, yakuman = false }) => (
  <div className="flex overflow-hidden rounded-full border border-neutral-100 dark:border-neutral-800">
    <div className="flex items-center bg-neutral-200 px-2 text-center dark:bg-neutral-700">
      {l}
    </div>
    <div
      className={
        yakuman
          ? 'flex items-center bg-purple-600 px-2 text-center text-white'
          : 'flex items-center bg-neutral-300 px-2 text-center dark:bg-neutral-600'
      }
    >
      {r}
    </div>
  </div>
);

interface YakuListProps {
  yaku: Yaku[];
}
export const YakuList: FC<YakuListProps> = ({ yaku }) => {
  const [
    {
      appConfig: { showBazoro }
    }
  ] = useStore();
  const { t } = useTranslation();

  const isYakuman = yaku.some(y => y.type === 'yakuman');

  return (
    <div className="flex flex-col gap-2 p-2">
      {isYakuman && <div className="text-xl font-bold">{t('yaku.yaku')}</div>}
      {!isYakuman && (
        <div className="text-xl font-bold">
          {t('yaku.yaku')} &middot;{' '}
          {t('result.han', {
            count:
              sumBy(yaku, y => (y.type === 'yaku' ? y.han : 0)) +
              (showBazoro ? 2 : 0)
          })}
        </div>
      )}
      {(showBazoro || yaku.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {yaku.map(y => (
            <YakuBadge
              key={y.name}
              l={t(`yaku.${y.name}`)}
              r={
                y.type === 'yakuman'
                  ? t(yakumanTupleKey(y.point))
                  : t('result.han', { count: y.han })
              }
              yakuman={y.type === 'yakuman'}
            />
          ))}
          {showBazoro && !isYakuman && (
            <YakuBadge l={t('yaku.bazoro')} r={t('result.han', { count: 2 })} />
          )}
        </div>
      )}
      {!showBazoro && yaku.length === 0 && (
        <div className="italic text-neutral-500">{t('result.no-yaku')}</div>
      )}
    </div>
  );
};
