import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import { calculateBasePoint, ceil100 } from '../lib/score';
import { compareTiles, tilesToCounts } from '../lib/tile';
import { countBy, sumBy, uniqueSorted } from '../lib/util';
import { TileButton } from './ui/TileButton';
import type { Hora } from '../lib/hora';
import type { Discard } from '../lib/result';

const HoraSummary: FC<{ hora: Hora[] }> = ({ hora }) => {
  const [
    {
      currentRule: { multipleYakuman, roundedMangan, accumlatedYakuman },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  const { noYaku, min, max } = hora.reduce(
    (acc, cur) => {
      if (
        cur.yaku.length === 0 ||
        cur.yaku.every(y => y.name === 'dora' || y.name === 'red-dora')
      ) {
        return { ...acc, noYaku: true };
      }
      const base =
        cur.type === 'kokushi' || cur.yaku.some(y => y.type === 'yakuman')
          ? cur.yaku.reduce((acc, cur) => {
              const p = cur.type === 'yakuman' ? cur.point : 0;
              if (multipleYakuman) return acc + p;
              return Math.max(acc, p);
            }, 0) * 8000
          : cur.yaku.every(y => y.name === 'dora' || y.name === 'red-dora')
          ? 0
          : calculateBasePoint(
              cur.type === 'mentsu' ? sumOfFu(cur.fu) : 25,
              sumBy(cur.yaku, y => (y.type === 'yaku' ? y.han : 0)),
              roundedMangan,
              accumlatedYakuman
            );
      const point =
        table.seat === 'east'
          ? cur.by === 'ron'
            ? ceil100(base * 6)
            : ceil100(base * 2) * 3
          : cur.by === 'ron'
          ? ceil100(base * 4)
          : ceil100(base) * 2 + ceil100(base * 2);
      return {
        ...acc,
        min: Math.min(acc.min, point),
        max: Math.max(acc.max, point)
      };
    },
    {
      noYaku: false,
      min: Number.POSITIVE_INFINITY,
      max: Number.NEGATIVE_INFINITY
    }
  );

  if (noYaku && !Number.isFinite(min) && !Number.isFinite(max)) {
    return <div className="text-sm">({t('result.no-yaku')})</div>;
  }

  if (hora.length === 0) {
    return <div className="text-sm">({t('result.no-hora-tiles')})</div>;
  }

  if (min === max) {
    return (
      <div className="text-sm">
        ({noYaku && <>{t('result.no-yaku')} / </>}
        {t('result.point', { count: min })})
      </div>
    );
  }
  return (
    <div className="text-sm">
      ({noYaku && <>{t('result.no-yaku')} / </>}
      {t('result.point-range', { a: min, b: max })})
    </div>
  );
};

interface DiscardItemProps {
  discard: Discard;
}

export const DiscardItem: FC<DiscardItemProps> = ({ discard }) => {
  const [
    {
      input: { hand },
      inputFocus
    },
    dispatch
  ] = useStore();
  const { t } = useTranslation();

  const tiles = uniqueSorted(
    (discard.next.type === 'tempai'
      ? discard.next.tileAvailabilities.flatMap(a =>
          a.count > 0 ? [a.tile] : []
        )
      : discard.next.info.type === 'hora'
      ? discard.next.info.hora.map(h => h.horaTile)
      : discard.next.info.tileAvailabilities.flatMap(a =>
          a.count > 0 ? [a.tile] : []
        )
    ).sort(compareTiles),
    (a, b) => compareTiles(a, b) === 0
  );

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center">
        <div className="text-sm font-bold">{t('result.discard')}</div>
        <div className="w-12 shrink-0">
          <TileButton
            tile={discard.tile}
            onClick={() => {
              const focus = inputFocus.type !== 'hand' ? inputFocus : null;
              dispatch({
                type: 'remove-hand-tile',
                payload: hand.findIndex(
                  h => compareTiles(h, discard.tile) === 0
                )
              });
              if (focus !== null)
                dispatch({ type: 'set-input-focus', payload: focus });
            }}
          />
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex gap-2">
          <div className="text-sm font-bold">
            {t(
              discard.next.type === 'tempai' ||
                discard.next.info.type === 'hora'
                ? 'result.waiting'
                : 'result.acceptance'
            )}
          </div>
          {discard.next.type === 'hora-shanten' &&
            discard.next.info.type === 'shanten' && (
              <div className="text-sm">
                {t('result.type', {
                  count: countBy(
                    tilesToCounts(
                      discard.next.info.tileAvailabilities.flatMap(a =>
                        a.count > 0 ? [a.tile] : []
                      )
                    ),
                    c => c > 0
                  )
                })}{' '}
                {t('result.tile', {
                  count: sumBy(
                    discard.next.info.tileAvailabilities,
                    a => a.count
                  )
                })}
              </div>
            )}
          {discard.next.type === 'hora-shanten' &&
            discard.next.info.type === 'hora' && (
              <HoraSummary hora={discard.next.info.hora} />
            )}
        </div>
        <div className="flex flex-wrap gap-px">
          {tiles.map((t, i) => (
            <div key={i} className="w-8">
              <TileButton
                tile={t}
                onClick={() => {
                  const focus = inputFocus.type !== 'hand' ? inputFocus : null;
                  dispatch({
                    type: 'remove-hand-tile',
                    payload: hand.findIndex(
                      h => compareTiles(h, discard.tile) === 0
                    )
                  });
                  dispatch({ type: 'click-tile-keyboard', payload: t });
                  if (focus !== null)
                    dispatch({ type: 'set-input-focus', payload: focus });
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
