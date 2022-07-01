import { useTranslation } from 'react-i18next';
import { useWindowSize } from '../hooks/dom';
import { compareTiles } from '../lib/tile';
import { uniqueSorted } from '../lib/util';
import { Tile } from './tile';
import type { Result } from '../lib/result';
import type { FC } from 'react';

const scrollMargin = 48;

interface ResultGlanceProps {
  result: Result;
  handOptionsPosition?: number | undefined;
}
export const ResultGlance: FC<ResultGlanceProps> = ({
  result,
  handOptionsPosition = Number.POSITIVE_INFINITY
}) => {
  const { t } = useTranslation();
  const { height } = useWindowSize();

  if (handOptionsPosition - height + scrollMargin < 0 || result === null)
    return null;

  return (
    <div className="fixed bottom-0 z-20 flex w-full flex-col gap-1 bg-white/80 p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow backdrop-blur dark:bg-neutral-800/80 md:hidden">
      {result.type === 'just-hora' && <div>{t('result.hora')}</div>}
      {result.type === 'tempai' &&
        result.tileAvailabilities.every(a => a.count === 0) && (
          <div>{t('result.no-hora-tiles')}</div>
        )}
      {result.type === 'tempai' &&
        result.tileAvailabilities.some(a => a.count > 0) && (
          <div className="flex items-center gap-2">
            <div className="shrink-0 font-bold">{t('result.tempai')}</div>
            <div className="flex flex-wrap gap-px">
              {result.tileAvailabilities
                .filter(a => a.count > 0)
                .map((a, i) => (
                  <div key={i} className="w-6">
                    <Tile tile={a.tile} />
                  </div>
                ))}
            </div>
          </div>
        )}
      {result.type === 'discard-shanten' && (
        <div className="flex items-center gap-2">
          <div className="shrink-0 font-bold">
            {(() => {
              const shanten = result.discards.reduce(
                (acc, cur) =>
                  Math.min(
                    acc,
                    cur.next.type === 'tempai'
                      ? 0
                      : cur.next.info.type === 'hora'
                      ? 0
                      : cur.next.info.shanten
                  ),
                Number.POSITIVE_INFINITY
              );
              return shanten === 0
                ? t('result.tempai')
                : t('result.shanten', { count: shanten });
            })()}
          </div>
          <div className="shrink-0 text-sm">{t('result.discard')}</div>
          <div className="flex flex-wrap gap-px">
            {result.discards.map((d, i) => (
              <div key={i} className="w-6">
                <Tile tile={d.tile} />
              </div>
            ))}
          </div>
        </div>
      )}
      {result.type === 'hora-shanten' && result.info.type === 'shanten' && (
        <div className="flex items-center gap-2">
          <div className="shrink-0 font-bold">
            {t('result.shanten', { count: result.info.shanten })}
          </div>
          <div className="shrink-0 text-sm">{t('result.acceptance')}</div>
          <div className="flex flex-wrap gap-px">
            {result.info.tileAvailabilities.map((a, i) => (
              <div key={i} className="w-6">
                <Tile tile={a.tile} />
              </div>
            ))}
          </div>
        </div>
      )}
      {result.type === 'hora-shanten' && result.info.type === 'hora' && (
        <div className="flex items-center gap-2">
          <div className="shrink-0 font-bold">{t('result.tempai')}</div>
          <div className="shrink-0 text-sm">{t('result.waiting')}</div>
          <div className="flex flex-wrap gap-px">
            {uniqueSorted(
              result.info.hora.map(h => h.horaTile),
              (a, b) => compareTiles(a, b) === 0
            ).map((t, i) => (
              <div key={i} className="w-6">
                <Tile tile={t} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
