import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import Stick100 from '../images/point-stick/100.svg';
import Stick1000 from '../images/point-stick/1000.svg';
import { instantiateMeld } from '../lib/input';
import { compareRules } from '../lib/rule';
import { Tile } from './tile';
import type { Tile as TileType } from '../lib/tile';

const scrollMargin = 48;
const headerHeight = 48;

interface InputGlanceProps {
  rulePosition?: number | undefined;
  tablePosition?: number | undefined;
  handOptionsPosition?: number | undefined;
}
export const InputGlance: FC<InputGlanceProps> = ({
  rulePosition = Number.POSITIVE_INFINITY,
  tablePosition = Number.POSITIVE_INFINITY,
  handOptionsPosition = Number.POSITIVE_INFINITY
}) => {
  const [
    {
      currentRule,
      savedRules,
      table,
      input: { dora, hand, melds },
      handOptions
    }
  ] = useStore();
  const { t } = useTranslation();

  if (rulePosition - headerHeight - scrollMargin >= 0) return null;

  const ruleName =
    Object.entries(savedRules).find(([, r]) =>
      compareRules(r, currentRule)
    )?.[0] ?? t('settings.untitled-rule');

  const handOptionsText = [
    ...(!handOptions.tenho &&
    handOptions.riichi !== 'none' &&
    melds.every(m => m.type === 'kan' && m.closed)
      ? [t(`hand-options.${handOptions.riichi}`)]
      : []),
    ...(!handOptions.tenho &&
    handOptions.ippatsu &&
    handOptions.riichi !== 'none' &&
    melds.every(m => m.type === 'kan' && m.closed)
      ? [t('hand-options.ippatsu')]
      : []),
    ...(!handOptions.tenho &&
    handOptions.rinshan &&
    melds.some(m => m.type === 'kan')
      ? [t('hand-options.rinshan')]
      : []),
    ...(!handOptions.tenho && handOptions.chankan
      ? [t('hand-options.chankan')]
      : []),
    ...(!handOptions.tenho &&
    handOptions.haitei &&
    (handOptions.riichi === 'riichi'
      ? melds.every(m => m.type === 'kan' && m.closed)
      : handOptions.riichi === 'double-riichi'
      ? !handOptions.ippatsu && melds.every(m => m.type === 'kan' && m.closed)
      : true)
      ? [t('hand-options.haitei-hotei')]
      : []),
    ...(handOptions.tenho && melds.length === 0
      ? [t(`hand-options.${table.seat === 'east' ? 'tenho' : 'chiho'}`)]
      : [])
  ].join(' · ');

  return (
    <div className="flex fixed top-12 z-20 flex-col gap-1 p-2 w-full bg-white/80 dark:bg-neutral-800/80 shadow backdrop-blur md:hidden">
      <div className="flex gap-2 justify-between">
        <div className="font-bold">{t('settings.rule')}</div>
        <div className="flex-1 text-right truncate">{ruleName}</div>
      </div>
      {tablePosition - headerHeight - scrollMargin * 2 < 0 && (
        <div className="flex gap-2 justify-between items-center">
          <div className="flex flex-1 gap-2">
            {t(`input-glance.round-${table.round}`)} &middot;{' '}
            {t(`input-glance.seat-${table.seat}`)}
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex gap-1">
              <Stick1000 className="w-12 drop-shadow" />
              {table.deposit}
            </div>
            <div className="flex gap-1">
              <Stick100 className="w-12 drop-shadow" />
              {table.continue}
            </div>
          </div>
        </div>
      )}
      {tablePosition - headerHeight < 0 && dora.length > 0 && (
        <div className="flex flex-1 gap-px max-w-sm">
          {[...Array(14)].map((_, i) => (
            <div key={i} className="w-full">
              {i < dora.length && <Tile key={i} tile={dora[i] as TileType} />}
            </div>
          ))}
        </div>
      )}
      {tablePosition - headerHeight + scrollMargin < 0 &&
        (hand.length > 0 || melds.some(m => m.tile !== null)) && (
          <div className="flex flex-1 gap-px max-w-sm">
            {[...Array(14 - Math.min(4, melds.length) * 3)].map((_, i) => (
              <div key={i} className="w-full">
                {i < hand.length && <Tile tile={hand[i] as TileType} />}
              </div>
            ))}
            {[...melds].reverse().map((meld, i) => (
              <React.Fragment key={i}>
                <div className="basis-1/3" />
                {meld.type === 'pon' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(3)].map(() => void 0)
                      : instantiateMeld(meld, currentRule.red)
                    ).map((tile, j) => (
                      <div key={j} className="w-full">
                        {typeof tile !== 'undefined' && (
                          <Tile tile={tile} key={j} />
                        )}
                      </div>
                    ))}
                  </>
                )}
                {meld.type === 'chii' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(3)].map(() => void 0)
                      : instantiateMeld(meld, currentRule.red)
                    ).map((tile, j) => (
                      <div key={j} className="w-full">
                        {typeof tile !== 'undefined' && (
                          <Tile tile={tile} key={j} />
                        )}
                      </div>
                    ))}
                  </>
                )}
                {meld.type === 'kan' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(4)].map(() => void 0)
                      : instantiateMeld(meld, currentRule.red)
                    ).map((tile, j, tiles) => (
                      <div key={j} className="w-full">
                        {typeof tile !== 'undefined' && (
                          <Tile
                            tile={
                              meld.closed && meld.tile !== null
                                ? j === 0 || j === 3
                                  ? { type: 'back' }
                                  : tiles[j + 1] ?? { type: 'back' }
                                : tile
                            }
                            key={j}
                          />
                        )}
                      </div>
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      {handOptionsPosition - headerHeight - scrollMargin * 4 < 0 &&
        handOptionsText.length > 0 && <div>{handOptionsText}</div>}
    </div>
  );
};
