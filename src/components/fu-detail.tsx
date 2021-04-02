import React from 'react';
import type { FC } from 'react';
import { Hora } from '../lib/yaku';
import { BEM } from '../lib/bem';
import { TileImage } from './tile-image';
import {
  compare_tile,
  is_dragon_tile,
  is_tanyao_tile,
  is_tile
} from '../lib/tile';
import type { RuleConfig, TableConfig } from '../lib/config';
import { Toitsu } from '../lib/deconstructure';

const bem = BEM('fu-detail');

interface FuDetailProps {
  hora: Hora;
  tableConfig: TableConfig;
  ruleConfig: RuleConfig;
}

export const FuDetail: FC<FuDetailProps> = ({
  hora,
  tableConfig,
  ruleConfig
}) => (
  <>
    {hora.form === 'mentsu' && (
      <div className={bem()}>
        <div className={bem('fu-items')}>
          <div className={bem('fu-item')}>
            <div></div>
            <div className={bem('fu-item-detail')}>副底 &mdash; 20 符</div>
          </div>
          {hora.parts
            .sort((a, b) => {
              const [c, d] = [a, b].map(h =>
                h.type === 'kotsu' || h.type === 'toitsu' ? h.tile : h.first
              );
              return compare_tile(c, d);
            })
            .map((part, i) => (
              <div key={i} className={bem('fu-item')}>
                {part.type === 'shuntsu' && (
                  <>
                    <div className={bem('fu-item-tiles')}>
                      <TileImage tile={part.first} />
                      <TileImage
                        tile={{
                          type: part.first.type,
                          number: (part.first.number + 1) as
                            | 2
                            | 3
                            | 4
                            | 5
                            | 6
                            | 7
                            | 8
                        }}
                      />
                      <TileImage
                        tile={{
                          type: part.first.type,
                          number: (part.first.number + 2) as
                            | 3
                            | 4
                            | 5
                            | 6
                            | 7
                            | 8
                            | 9
                        }}
                      />
                    </div>
                    <div className={bem('fu-item-detail')}>
                      順子 &mdash; 0 符
                    </div>
                  </>
                )}
                {part.type === 'kotsu' && (
                  <>
                    <div className={bem('fu-item-tiles')}>
                      <TileImage tile={part.tile} />
                      <TileImage tile={part.tile} />
                      <TileImage tile={part.tile} />
                    </div>
                    <div className={bem('fu-item-detail')}>
                      {is_tanyao_tile(part.tile) ? (
                        <>中張牌暗刻 &mdash; 4 符</>
                      ) : (
                        <>么九牌暗刻 &mdash; 8 符</>
                      )}
                    </div>
                  </>
                )}
                {part.type === 'toitsu' && (
                  <>
                    <div className={bem('fu-item-tiles')}>
                      <TileImage tile={part.tile} />
                      <TileImage tile={part.tile} />
                    </div>
                    <div className={bem('fu-item-detail')}>
                      {part.tile.type === tableConfig.round &&
                      tableConfig.seat === part.tile.type ? (
                        <>連風牌雀頭 &mdash; {ruleConfig.doubleWindFu} 符</>
                      ) : part.tile.type === tableConfig.round ? (
                        <>場風牌雀頭 &mdash; 2 符</>
                      ) : part.tile.type === tableConfig.seat ? (
                        <>自風牌雀頭 &mdash; 2 符</>
                      ) : is_dragon_tile(part.tile) ? (
                        <>三元牌雀頭 &mdash; 2 符</>
                      ) : (
                        <>雀頭 &mdash; 0 符</>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          {hora.melds.map((meld, i) => (
            <div key={i} className={bem('fu-item')}>
              {meld.type === 'pong' && (
                <>
                  <div className={bem('fu-item-tiles')}>
                    <TileImage tile={meld.tile} />
                    <TileImage tile={meld.tile} />
                    <TileImage tile={meld.tile} />
                  </div>
                  <div className={bem('fu-item-detail')}>
                    {is_tanyao_tile(meld.tile) ? (
                      <>中張牌明刻 &mdash; 2 符</>
                    ) : (
                      <>么九牌明刻 &mdash; 4 符</>
                    )}
                  </div>
                </>
              )}
              {meld.type === 'chow' && (
                <>
                  <div className={bem('fu-item-tiles')}>
                    <TileImage tile={meld.first} />
                    <TileImage
                      tile={{
                        type: meld.first.type,
                        number: (meld.first.number + 1) as
                          | 2
                          | 3
                          | 4
                          | 5
                          | 6
                          | 7
                          | 8
                      }}
                    />
                    <TileImage
                      tile={{
                        type: meld.first.type,
                        number: (meld.first.number + 2) as
                          | 3
                          | 4
                          | 5
                          | 6
                          | 7
                          | 8
                          | 9
                      }}
                    />
                  </div>
                  <div className={bem('fu-item-detail')}>順子 &mdash; 0 符</div>
                </>
              )}
              {meld.type === 'kong' && (
                <>
                  <div className={bem('fu-item-tiles')}>
                    <TileImage
                      tile={meld.concealed ? { type: 'back' } : meld.tile}
                    />
                    <TileImage tile={meld.tile} />
                    <TileImage tile={meld.tile} />
                    <TileImage
                      tile={meld.concealed ? { type: 'back' } : meld.tile}
                    />
                  </div>
                  <div className={bem('fu-item-detail')}>
                    {is_tanyao_tile(meld.tile) ? (
                      meld.concealed ? (
                        <>中張牌暗槓 &mdash; 16 符</>
                      ) : (
                        <>中張牌明槓 &mdash; 8 符</>
                      )
                    ) : meld.concealed ? (
                      <>么九牌暗槓 &mdash; 32 符</>
                    ) : (
                      <>么九牌明槓 &mdash; 16 符</>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
          {hora.tatsu.type === 'ryammen' && (
            <>
              <div className={bem('fu-item')}>
                <div className={bem('fu-item-tiles')}>
                  <TileImage tile={hora.tatsu.first} />
                  <TileImage
                    tile={{
                      type: hora.tatsu.first.type,
                      number: (hora.tatsu.first.number + 1) as
                        | 2
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                    }}
                  />
                </div>
                <div className={bem('fu-item-detail')}>
                  <div className={bem('fu-item-detail-item')}>
                    両面待ち &mdash; 0 符
                  </div>
                  <div className={bem('fu-item-detail-item')}>
                    順子 &mdash; 0 符
                  </div>
                </div>
              </div>
            </>
          )}
          {hora.tatsu.type === 'kanchan' && (
            <>
              <div className={bem('fu-item')}>
                <div className={bem('fu-item-tiles')}>
                  <TileImage tile={hora.tatsu.first} />
                  <TileImage
                    tile={{
                      type: hora.tatsu.first.type,
                      number: (hora.tatsu.first.number + 2) as
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                        | 9
                    }}
                  />
                </div>
                <div className={bem('fu-item-detail')}>
                  <div className={bem('fu-item-detail-item')}>
                    嵌張待ち &mdash; 2 符
                  </div>
                  <div className={bem('fu-item-detail-item')}>
                    順子 &mdash; 0 符
                  </div>
                </div>
              </div>
            </>
          )}
          {hora.tatsu.type === 'penchan' && (
            <>
              <div className={bem('fu-item')}>
                <div className={bem('fu-item-tiles')}>
                  <TileImage tile={hora.tatsu.first} />
                  <TileImage
                    tile={{
                      type: hora.tatsu.first.type,
                      number: (hora.tatsu.first.number + 1) as
                        | 2
                        | 3
                        | 4
                        | 5
                        | 6
                        | 7
                        | 8
                    }}
                  />
                </div>
                <div className={bem('fu-item-detail')}>
                  <div className={bem('fu-item-detail-item')}>
                    辺張待ち &mdash; 2 符
                  </div>
                  <div className={bem('fu-item-detail-item')}>
                    順子 &mdash; 0 符
                  </div>
                </div>
              </div>
            </>
          )}
          {hora.tatsu.type === 'toitsu' && (
            <>
              <div className={bem('fu-item')}>
                <div className={bem('fu-item-tiles')}>
                  <TileImage tile={hora.tatsu.tile} />
                  <TileImage tile={hora.tatsu.tile} />
                </div>
                <div className={bem('fu-item-detail')}>
                  <div className={bem('fu-item-detail-item')}>
                    双碰待ち &mdash; 0 符
                  </div>
                  <div className={bem('fu-item-detail-item')}>
                    {is_tanyao_tile(hora.tatsu.tile) ? (
                      hora.type === 'tsumo' ? (
                        <>中張牌暗刻 &mdash; 4 符</>
                      ) : (
                        <>中張牌明刻 &mdash; 2 符</>
                      )
                    ) : hora.type === 'tsumo' ? (
                      <>么九牌暗刻 &mdash; 8 符</>
                    ) : (
                      <>么九牌明刻 &mdash; 4 符</>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {is_tile(hora.tatsu) && (
            <>
              <div className={bem('fu-item')}>
                <div className={bem('fu-item-tiles')}>
                  <TileImage tile={hora.tatsu} />
                </div>
                <div className={bem('fu-item-detail')}>
                  <div className={bem('fu-item-detail-item')}>
                    単騎待ち &mdash; 2 符
                  </div>
                  <div className={bem('fu-item-detail-item')}>
                    {hora.tatsu.type === tableConfig.round &&
                    tableConfig.seat === hora.tatsu.type ? (
                      <>連風牌雀頭 &mdash; {ruleConfig.doubleWindFu} 符</>
                    ) : hora.tatsu.type === tableConfig.round ? (
                      <>場風牌雀頭 &mdash; 2 符</>
                    ) : hora.tatsu.type === tableConfig.seat ? (
                      <>自風牌雀頭 &mdash; 2 符</>
                    ) : is_dragon_tile(hora.tile) ? (
                      <>三元牌雀頭 &mdash; 2 符</>
                    ) : (
                      <>雀頭 &mdash; 0 符</>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
          {hora.melds.every(m => m.type === 'kong' && m.concealed) &&
            hora.type === 'ron' && (
              <div className={bem('fu-item')}>
                <div></div>
                <div className={bem('fu-item-detail')}>
                  門前ロン &mdash; 10 符
                </div>
              </div>
            )}
          {hora.type === 'tsumo' && (
            <div className={bem('fu-item')}>
              <div></div>
              {hora.yaku.some(y => y.name === 'pinfu') ? (
                <div className={bem('fu-item-detail')}>
                  平和ツモ &mdash; 0 符
                </div>
              ) : (
                <div className={bem('fu-item-detail')}>ツモ &mdash; 2 符</div>
              )}
            </div>
          )}
          {hora.type === 'ron' &&
            hora.melds.length > 0 &&
            hora.melds.every(m => m.type === 'chow') &&
            hora.tatsu.type === 'ryammen' &&
            hora.parts.every(p => p.type !== 'kotsu') &&
            !hora.parts
              .filter((p): p is Toitsu => p.type === 'toitsu')
              .every(
                t =>
                  t.tile.type === tableConfig.round ||
                  t.tile.type === tableConfig.seat ||
                  is_dragon_tile(t.tile)
              ) && (
              <div className={bem('fu-item')}>
                <div></div>
                <div className={bem('fu-item-detail')}>
                  食い平和ロン &mdash; 10 符
                </div>
              </div>
            )}
        </div>
      </div>
    )}
    {hora.form === 'chitoitsu' && (
      <div className={bem()}>
        <div className={bem('fu-items')}>
          <div className={bem('fu-item')}>
            <div></div>
            <div className={bem('fu-item-detail')}>七対子 &mdash; 25 符</div>
          </div>
        </div>
      </div>
    )}
  </>
);
