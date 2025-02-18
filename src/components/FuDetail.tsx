import type { FC } from 'react';
import type React from 'react';
import { useTranslation } from 'react-i18next';
import { MdOutlineArrowForward } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import type { Fu } from '../lib/fu';
import { ceil10 } from '../lib/score';
import {
  countsIndexToTile,
  tileCountsFirstIndex,
  tileToCountsIndex
} from '../lib/tile';
import type { TileCountsIndex } from '../lib/tile';
import { groupBy } from '../lib/util';
import { Tile } from './tile';

interface FuBadgeProps {
  l?: React.ReactNode;
  r?: React.ReactNode;
}
const FuBadge: FC<FuBadgeProps> = ({ l, r }) => (
  <div className="flex overflow-hidden rounded-full border border-neutral-100 dark:border-neutral-800">
    <div className="flex items-center bg-neutral-200 px-2 text-center dark:bg-neutral-700">
      {l}
    </div>
    <div className="flex items-center bg-neutral-300 px-2 text-center dark:bg-neutral-600">
      {r}
    </div>
  </div>
);

const HandBlockTile: FC<{ tile?: TileCountsIndex | undefined }> = ({
  tile
}) => (
  <div className="w-6">
    <Tile
      tile={
        typeof tile === 'undefined' ? { type: 'back' } : countsIndexToTile(tile)
      }
    />
  </div>
);

const HandBlockTiles: FC<{ fu: Fu }> = ({ fu }) => {
  if (fu.type === 'head') {
    return (
      <div className="flex gap-px">
        <HandBlockTile tile={fu.tile} />
        <HandBlockTile tile={fu.tile} />
      </div>
    );
  }

  if (fu.type === 'shuntsu')
    return (
      <div className="flex gap-px">
        <HandBlockTile tile={fu.tile} />
        <HandBlockTile tile={(fu.tile + 1) as TileCountsIndex} />
        <HandBlockTile tile={(fu.tile + 2) as TileCountsIndex} />
      </div>
    );

  if (fu.type === 'kotsu')
    return (
      <div className="flex gap-px">
        <HandBlockTile tile={fu.kotsuType === 'ankan' ? void 0 : fu.tile} />
        <HandBlockTile tile={fu.tile} />
        <HandBlockTile tile={fu.tile} />
        {(fu.kotsuType === 'ankan' || fu.kotsuType === 'minkan') && (
          <HandBlockTile tile={fu.kotsuType === 'ankan' ? void 0 : fu.tile} />
        )}
      </div>
    );

  return null;
};

const HandBlockFuBadge: FC<{ fu: Fu }> = ({ fu }) => {
  const [
    {
      table: { seat, round }
    }
  ] = useStore();
  const { t } = useTranslation();

  if (fu.type === 'head') {
    const seatIndex = tileToCountsIndex({
      type: 'z',
      n: (['east', 'south', 'west', 'north'].indexOf(seat) + 1) as 1 | 2 | 3 | 4
    });
    const roundIndex = tileToCountsIndex({
      type: 'z',
      n: (['east', 'south', 'west', 'north'].indexOf(round) + 1) as
        | 1
        | 2
        | 3
        | 4
    });

    return (
      <FuBadge
        l={t(
          fu.tile >= tileCountsFirstIndex.z + 4
            ? 'fu.dragon-head'
            : seatIndex === fu.tile && roundIndex === fu.tile
              ? 'fu.double-wind-head'
              : seatIndex === fu.tile
                ? 'fu.seat-wind-head'
                : roundIndex === fu.tile
                  ? 'fu.round-wind-head'
                  : 'fu.head'
        )}
        r={t('fu.fu', { count: fu.fu })}
      />
    );
  }

  if (fu.type === 'shuntsu')
    return <FuBadge l={t('fu.shuntsu')} r={t('fu.fu', { count: fu.fu })} />;

  if (fu.type === 'kotsu')
    return (
      <FuBadge
        l={t(
          `fu.${
            fu.tile >= tileCountsFirstIndex.z ||
            fu.tile % 9 === 0 ||
            fu.tile % 9 === 8
              ? 'yaochu'
              : 'chunchan'
          }-${fu.kotsuType}`
        )}
        r={t('fu.fu', { count: fu.fu })}
      />
    );
  return null;
};

const HandBlock: FC<{ fu: Fu }> = ({ fu }) => {
  const { t } = useTranslation();

  if (fu.type === 'waiting') {
    return (
      <div className="flex flex-col items-center gap-px">
        <HandBlockTiles fu={fu.block} />
        <HandBlockFuBadge fu={fu.block} />
        <FuBadge
          l={t(`fu.${fu.waitingType}`)}
          r={t('fu.fu', { count: fu.fu })}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-px">
      <HandBlockTiles fu={fu} />
      <HandBlockFuBadge fu={fu} />
    </div>
  );
};

interface FuDetailProps {
  fu?: Fu[] | 'chitoitsu' | undefined;
}
export const FuDetail: FC<FuDetailProps> = ({ fu }) => {
  const { t } = useTranslation();

  if (typeof fu === 'undefined') return null;
  if (fu === 'chitoitsu')
    return (
      <div className="flex flex-col gap-2 p-2">
        <div className="text-xl font-bold">
          {t('fu.title')} &middot; {t('fu.fu', { count: 25 })}
        </div>
        <div className="flex flex-wrap gap-2">
          <FuBadge l={t('fu.chitoitsu')} r={t('fu.fu', { count: 25 })} />
        </div>
      </div>
    );

  const { hand = [], others = [] } = groupBy(fu, f =>
    f.type === 'head' ||
    f.type === 'kotsu' ||
    f.type === 'shuntsu' ||
    f.type === 'waiting'
      ? 'hand'
      : 'others'
  );
  const total = sumOfFu(fu);

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center text-xl font-bold">
        {t('fu.title')} &middot; {t('fu.fu', { count: total })}
        {total % 10 !== 0 && (
          <>
            {' '}
            <MdOutlineArrowForward /> {t('fu.fu', { count: ceil10(total) })}
          </>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {hand.map((f, i) => (
          <HandBlock key={i} fu={f} />
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {others.map(f => (
          <FuBadge
            key={f.type}
            l={t(`fu.${f.type}`)}
            r={t('fu.fu', { count: f.fu })}
          />
        ))}
      </div>
    </div>
  );
};
