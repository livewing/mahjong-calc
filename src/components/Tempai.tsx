import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { TileButton } from './ui/TileButton';
import type { TileAvailability } from '../lib/tile';

interface TempaiProps {
  tileAvailabilities: TileAvailability[];
}

export const Tempai: FC<TempaiProps> = ({ tileAvailabilities }) => {
  const [{ inputFocus }, dispatch] = useStore();
  const { t } = useTranslation();

  const ta = tileAvailabilities.filter(a => a.count > 0);

  return (
    <div className="flex flex-col gap-2">
      <div className="text-xl font-bold">{t('result.tempai')}</div>
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
