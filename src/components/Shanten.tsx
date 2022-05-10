import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { tilesToCounts, type TileAvailability } from '../lib/tile';
import { countBy, sumBy } from '../lib/util';
import { TileButton } from './ui/TileButton';

interface ShantenProps {
  shanten: number;
  tileAvailabilities: TileAvailability[];
}

export const Shanten: FC<ShantenProps> = ({ shanten, tileAvailabilities }) => {
  const [{ inputFocus }, dispatch] = useStore();
  const { t } = useTranslation();

  const ta = tileAvailabilities.filter(a => a.count > 0);
  const ty = countBy(tilesToCounts(ta.map(a => a.tile)), c => c > 0);
  const n = sumBy(tileAvailabilities, a => a.count);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-4">
        <div className="text-xl font-bold">
          {t('result.shanten', { count: shanten })}
        </div>
        <div>
          {t('result.type', { count: ty })} {t('result.tile', { count: n })}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {ta.map((a, i) => (
          <div key={i} className="flex gap-1 items-center">
            <div className="w-10">
              <TileButton
                tile={a.tile}
                onClick={() => {
                  const focus = inputFocus.type !== 'hand' ? inputFocus : null;
                  if (focus !== null)
                    dispatch({
                      type: 'set-input-focus',
                      payload: { type: 'hand' }
                    });
                  dispatch({ type: 'click-tile-keyboard', payload: a.tile });
                  if (focus !== null)
                    dispatch({ type: 'set-input-focus', payload: focus });
                }}
              />
            </div>
            <div>&times; {a.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
