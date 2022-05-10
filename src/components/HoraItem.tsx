import React, { useState, type FC } from 'react';
import { FuDetail } from './FuDetail';
import { HoraItemSummary } from './HoraItemSummary';
import { PointDiff } from './PointDiff';
import { Score } from './Score';
import { ScorePlusList } from './ScorePlusList';
import { YakuList } from './YakuList';
import type { Hora } from '../lib/hora';

interface HoraItemProps {
  info: Hora;
}

export const HoraItem: FC<HoraItemProps> = ({ info }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col bg-white dark:bg-black rounded-md shadow">
      <button onClick={() => setOpen(open => !open)} className="peer ">
        <HoraItemSummary info={info} />
      </button>
      {open && (
        <>
          <div className="border-t border-neutral-200 dark:border-neutral-800 mx-2 peer-hover:opacity-0 transition" />
          <FuDetail
            fu={
              info.type === 'mentsu'
                ? info.fu
                : info.type === 'chitoitsu'
                ? 'chitoitsu'
                : void 0
            }
          />
          <YakuList yaku={info.yaku} />
          <Score info={info} />
          <ScorePlusList info={info} />
          <PointDiff info={info} />
        </>
      )}
    </div>
  );
};
