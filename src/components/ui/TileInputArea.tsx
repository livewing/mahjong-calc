import copy from 'copy-to-clipboard';
import React, { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdCopy } from 'react-icons/io';
import { MdKeyboard, MdMenu, MdRefresh, MdShuffle } from 'react-icons/md';
import { useStore } from '../../contexts/store';
import { useTileInputAreaHotkeys } from '../../hooks/hotkeys';
import { instantiateMeld, type Meld } from '../../lib/input';
import { formatKeys } from '../../lib/os';
import { isAvailableTiles, tilesToMpsz } from '../../lib/tile';
import { KeyboardHelp } from '../KeyboardHelp';
import { Button } from './Button';
import { ConfigItem } from './ConfigItem';
import { Dropdown } from './Dropdown';
import { TileButton } from './TileButton';

export const TileInputArea: FC = () => {
  const [openTileMenu, setOpenTileMenu] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const [
    {
      currentRule: { red },
      input: { hand, melds, dora },
      inputFocus
    },
    dispatch
  ] = useStore();
  const [inputString, helpTrigger] = useTileInputAreaHotkeys();
  useEffect(() => setShowKeyboardHelp(helpTrigger > 0), [helpTrigger]);
  const { t } = useTranslation();
  return (
    <>
      <div className="flex flex-col gap-2">
        <ConfigItem label={t('tile-input.dora-indicators')}>
          <div className="flex flex-1 gap-px">
            {[...Array(10)].map((_, i) =>
              i >= dora.length ? (
                <TileButton
                  key={i}
                  dim
                  focusIndicator={
                    inputFocus.type === 'dora' && i === dora.length
                  }
                  overlayText={
                    inputFocus.type === 'dora'
                      ? inputString[i - dora.length]
                      : void 0
                  }
                  onClick={() =>
                    dispatch({
                      type: 'set-input-focus',
                      payload: { type: 'dora' }
                    })
                  }
                />
              ) : (
                <TileButton
                  key={i}
                  tile={dora[i]}
                  onClick={() =>
                    dispatch({ type: 'remove-dora-tile', payload: i })
                  }
                />
              )
            )}
            <div className="w-full" />
            <div className="w-full" />
            <div className="w-full" />
            <div className="w-full" />
          </div>
        </ConfigItem>
        <ConfigItem label={t('tile-input.hand')}>
          <div className="flex flex-1 gap-px">
            {[...Array(14 - Math.min(4, melds.length) * 3)].map((_, i) =>
              i >= hand.length ? (
                <TileButton
                  key={i}
                  dim
                  focusIndicator={
                    inputFocus.type === 'hand' && i === hand.length
                  }
                  overlayText={
                    inputFocus.type === 'hand'
                      ? inputString[i - hand.length]
                      : void 0
                  }
                  onClick={() =>
                    dispatch({
                      type: 'set-input-focus',
                      payload: { type: 'hand' }
                    })
                  }
                />
              ) : (
                <TileButton
                  key={i}
                  tile={hand[i]}
                  tsumoIndicator={
                    hand.length % 3 === 2 && i === hand.length - 1
                  }
                  onClick={() =>
                    dispatch({ type: 'remove-hand-tile', payload: i })
                  }
                />
              )
            )}
            {[...melds].reverse().map((meld, i) => (
              <React.Fragment key={i}>
                <div className="basis-1/3" />
                {meld.type === 'pon' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(3)].map(() => void 0)
                      : instantiateMeld(meld, red)
                    ).map((tile, j) => (
                      <TileButton
                        tile={tile}
                        key={j}
                        dim={meld.tile === null}
                        focusIndicator={
                          inputFocus.type === 'meld' &&
                          inputFocus.i === melds.length - 1 - i
                        }
                        overlayText={
                          inputFocus.type === 'meld' && inputFocus.i === j
                            ? inputString[0]
                            : void 0
                        }
                        onClick={() =>
                          dispatch(
                            inputFocus.type === 'meld' &&
                              inputFocus.i === melds.length - 1 - i
                              ? meld.tile === null
                                ? {
                                    type: 'remove-meld',
                                    payload: melds.length - 1 - i
                                  }
                                : {
                                    type: 'update-meld',
                                    payload: {
                                      i: inputFocus.i,
                                      meld: { type: 'pon', tile: null }
                                    }
                                  }
                              : {
                                  type: 'set-input-focus',
                                  payload: {
                                    type: 'meld',
                                    i: melds.length - 1 - i
                                  }
                                }
                          )
                        }
                      />
                    ))}
                  </>
                )}
                {meld.type === 'chii' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(3)].map(() => void 0)
                      : instantiateMeld(meld, red)
                    ).map((tile, j) => (
                      <TileButton
                        tile={tile}
                        key={j}
                        dim={meld.tile === null}
                        focusIndicator={
                          inputFocus.type === 'meld' &&
                          inputFocus.i === melds.length - 1 - i &&
                          ((meld.tile === null && j === 0) ||
                            meld.tile !== null)
                        }
                        overlayText={
                          inputFocus.type === 'meld' && inputFocus.i === j
                            ? inputString[0]
                            : void 0
                        }
                        onClick={() =>
                          dispatch(
                            inputFocus.type === 'meld' &&
                              inputFocus.i === melds.length - 1 - i
                              ? meld.tile === null
                                ? {
                                    type: 'remove-meld',
                                    payload: melds.length - 1 - i
                                  }
                                : {
                                    type: 'update-meld',
                                    payload: {
                                      i: inputFocus.i,
                                      meld: {
                                        type: 'chii',
                                        tile: null,
                                        includeRed: false
                                      }
                                    }
                                  }
                              : {
                                  type: 'set-input-focus',
                                  payload: {
                                    type: 'meld',
                                    i: melds.length - 1 - i
                                  }
                                }
                          )
                        }
                      />
                    ))}
                  </>
                )}
                {meld.type === 'kan' && (
                  <>
                    {(meld.tile === null
                      ? [...Array(4)].map(() => void 0)
                      : instantiateMeld(meld, red)
                    ).map((tile, j, tiles) => (
                      <TileButton
                        tile={
                          meld.closed && meld.tile !== null
                            ? j === 0 || j === 3
                              ? { type: 'back' }
                              : tiles[j + 1]
                            : tile
                        }
                        key={j}
                        dim={meld.tile === null}
                        focusIndicator={
                          inputFocus.type === 'meld' &&
                          inputFocus.i === melds.length - 1 - i
                        }
                        overlayText={
                          inputFocus.type === 'meld' && inputFocus.i === j
                            ? inputString[0]
                            : void 0
                        }
                        onClick={() =>
                          dispatch(
                            inputFocus.type === 'meld' &&
                              inputFocus.i === melds.length - 1 - i
                              ? meld.tile === null
                                ? {
                                    type: 'remove-meld',
                                    payload: melds.length - 1 - i
                                  }
                                : {
                                    type: 'update-meld',
                                    payload: {
                                      i: inputFocus.i,
                                      meld: {
                                        type: 'kan',
                                        tile: null,
                                        closed: meld.closed
                                      }
                                    }
                                  }
                              : {
                                  type: 'set-input-focus',
                                  payload: {
                                    type: 'meld',
                                    i: melds.length - 1 - i
                                  }
                                }
                          )
                        }
                      />
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        </ConfigItem>
        <div className="flex flex-wrap items-center gap-1">
          <Dropdown
            label={
              <div className="py-1">
                <MdMenu />
              </div>
            }
            open={openTileMenu}
            onSetOpen={setOpenTileMenu}
          >
            <div className="flex flex-col py-1">
              <button
                className="flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent"
                onClick={() => {
                  dispatch({ type: 'clear-input', payload: null });
                  setOpenTileMenu(false);
                }}
                disabled={
                  hand.length === 0 && melds.length === 0 && dora.length === 0
                }
              >
                <MdRefresh />
                <div className="flex-1 truncate text-left">
                  {t('tile-input.clear-inputs')}
                </div>
                <div className="text-sm opacity-70">
                  {formatKeys('Ctrl+Backspace', 'Cmd+Backspace')}
                </div>
              </button>
              <div className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
              {([5, 8, 11, 14] as const).map(n => (
                <button
                  key={n}
                  className="flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-blue-500 hover:text-white"
                  onClick={() => {
                    dispatch({ type: 'set-input-random', payload: n });
                    setOpenTileMenu(false);
                  }}
                >
                  <MdShuffle />
                  <div className="flex-1 truncate text-left">
                    {t('tile-input.random', { count: n })}
                  </div>
                  <div className="text-sm opacity-70">
                    {formatKeys(
                      n === 5
                        ? 'Shift+S'
                        : n === 8
                        ? 'Shift+D'
                        : n === 11
                        ? 'Shift+F'
                        : 'Shift+G'
                    )}
                  </div>
                </button>
              ))}
              <button
                className="flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  dispatch({ type: 'set-input-random', payload: 'chinitsu' });
                  setOpenTileMenu(false);
                }}
              >
                <MdShuffle />
                <div className="flex-1 truncate text-left">
                  {t('tile-input.random-chinitsu')}
                </div>
                <div className="text-sm opacity-70">
                  {formatKeys('Shift+Z')}
                </div>
              </button>
              <div className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
              <button
                className="flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent"
                onClick={() => {
                  if (hand.length % 3 === 2) {
                    const a = [...hand];
                    const b = a.splice(a.length - 1, 1);
                    copy(`${tilesToMpsz(a)}${tilesToMpsz(b)}`);
                  } else copy(tilesToMpsz(hand));
                  setOpenTileMenu(false);
                }}
                disabled={hand.length === 0}
              >
                <IoMdCopy />
                <div className="flex-1 truncate text-left">
                  {t('tile-input.copy-hand-as-mpsz')}
                </div>
              </button>
              <div className="my-1 border-t border-neutral-300 dark:border-neutral-700" />
              <button
                className="flex flex-1 items-center gap-2 overflow-hidden p-2 hover:bg-blue-500 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-500 disabled:hover:bg-transparent"
                onClick={() => {
                  setOpenTileMenu(false);
                  setShowKeyboardHelp(true);
                }}
              >
                <MdKeyboard />
                <div className="flex-1 truncate text-left">
                  {t('tile-input.keyboard-shortcuts')}
                </div>
                <div className="text-sm opacity-70">{formatKeys('?')}</div>
              </button>
            </div>
          </Dropdown>
          <Button
            disabled={
              melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3
            }
            title={formatKeys('Shift+P')}
            onClick={() =>
              dispatch({
                type: 'add-meld',
                payload: { type: 'pon', tile: null }
              })
            }
          >
            {t('tile-input.pon')}
          </Button>
          <Button
            disabled={
              melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3
            }
            title={formatKeys('Shift+C')}
            onClick={() =>
              dispatch({
                type: 'add-meld',
                payload: { type: 'chii', tile: null, includeRed: false }
              })
            }
          >
            {t('tile-input.chii')}
          </Button>
          <Button
            disabled={
              melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3
            }
            title={formatKeys('Shift+M')}
            onClick={() =>
              dispatch({
                type: 'add-meld',
                payload: { type: 'kan', tile: null, closed: false }
              })
            }
          >
            {t('tile-input.minkan')}
          </Button>
          <Button
            disabled={
              melds.length >= 4 || 14 - melds.length * 3 - hand.length < 3
            }
            title={formatKeys('Shift+A')}
            onClick={() =>
              dispatch({
                type: 'add-meld',
                payload: { type: 'kan', tile: null, closed: true }
              })
            }
          >
            {t('tile-input.ankan')}
          </Button>
          {!(
            (red.m === 0 || red.m === 4) &&
            (red.p === 0 || red.p === 4) &&
            (red.s === 0 || red.s === 4)
          ) && (
            <Button
              disabled={(() => {
                if (inputFocus.type !== 'meld') return true;
                const meld = melds[inputFocus.i] as Meld;
                if (meld.tile === null) return true;
                if (meld.type === 'kan') return true;
                const toSwap: Meld | null =
                  meld.type === 'pon' &&
                  meld.tile.type !== 'z' &&
                  meld.tile.n === 5
                    ? {
                        ...meld,
                        tile: { ...meld.tile, red: !meld.tile.red }
                      }
                    : meld.type === 'chii'
                    ? meld.tile.n === 5
                      ? {
                          ...meld,
                          tile: { ...meld.tile, red: !meld.tile.red }
                        }
                      : meld.tile.n === 3 || meld.tile.n === 4
                      ? { ...meld, includeRed: !meld.includeRed }
                      : null
                    : null;
                return (
                  toSwap === null ||
                  !isAvailableTiles(
                    red,
                    [
                      ...hand,
                      ...melds.flatMap((m, i) =>
                        i === inputFocus.i ? [] : instantiateMeld(m, red)
                      ),
                      ...dora
                    ],
                    instantiateMeld(toSwap, red)
                  )
                );
              })()}
              title={formatKeys('Shift+R')}
              onClick={() =>
                dispatch({ type: 'toggle-current-meld-red', payload: null })
              }
            >
              {t('tile-input.toggle-red')}
            </Button>
          )}
        </div>
      </div>
      {showKeyboardHelp && (
        <KeyboardHelp onClose={() => setShowKeyboardHelp(false)} />
      )}
    </>
  );
};
