import React from 'react';
import { Hora } from '../lib/yaku';
import { BEM } from '../lib/bem';
import { TileImage } from './tile-image';
import {
  compare_tile,
  is_dragon_tile,
  is_tanyao_tile,
  is_tile
} from '../lib/tile';
import { Toitsu } from '../lib/deconstructure';
import type { FC } from 'react';
import type { RuleConfig, TableConfig } from '../lib/config';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();

  return (
    <>
      {hora.form === 'mentsu' && (
        <div className={bem()}>
          <div className={bem('fu-items')}>
            <div className={bem('fu-item')}>
              <div></div>
              <div className={bem('fu-item-detail')}>
                {t('fu-detail.futei')} &mdash;{' '}
                {t('fu-detail.fu', { count: 20 })}
              </div>
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
                        {t('fu-detail.shuntsu')} &mdash;{' '}
                        {t('fu-detail.fu', { count: 0 })}
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
                          <>
                            {t('fu-detail.chunchan-anko')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 4 })}
                          </>
                        ) : (
                          <>
                            {t('fu-detail.yaochu-anko')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 8 })}
                          </>
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
                          <>
                            {t('fu-detail.double-wind-head')} &mdash;{' '}
                            {t('fu-detail.fu', {
                              count: ruleConfig.doubleWindFu
                            })}
                          </>
                        ) : part.tile.type === tableConfig.round ? (
                          <>
                            {t('fu-detail.field-wind-head')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 2 })}
                          </>
                        ) : part.tile.type === tableConfig.seat ? (
                          <>
                            {t('fu-detail.seat-wind-head')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 2 })}
                          </>
                        ) : is_dragon_tile(part.tile) ? (
                          <>
                            {t('fu-detail.dragon-head')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 2 })}
                          </>
                        ) : (
                          <>
                            {t('fu-detail.head')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 0 })}
                          </>
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
                        <>
                          {t('fu-detail.chunchan-minko')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 2 })}
                        </>
                      ) : (
                        <>
                          {t('fu-detail.yaochu-minko')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 4 })}
                        </>
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
                    <div className={bem('fu-item-detail')}>
                      {t('fu-detail.shuntsu')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
                    </div>
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
                          <>
                            {t('fu-detail.chunchan-ankan')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 16 })}
                          </>
                        ) : (
                          <>
                            {t('fu-detail.chunchan-minkan')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 8 })}
                          </>
                        )
                      ) : meld.concealed ? (
                        <>
                          {t('fu-detail.yaochu-ankan')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 32 })}
                        </>
                      ) : (
                        <>
                          {t('fu-detail.yaochu-minkan')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 16 })}
                        </>
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
                      {t('fu-detail.ryammen')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
                    </div>
                    <div className={bem('fu-item-detail-item')}>
                      {t('fu-detail.shuntsu')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
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
                      {t('fu-detail.kanchan')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 2 })}
                    </div>
                    <div className={bem('fu-item-detail-item')}>
                      {t('fu-detail.shuntsu')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
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
                      {t('fu-detail.penchan')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 2 })}
                    </div>
                    <div className={bem('fu-item-detail-item')}>
                      {t('fu-detail.shuntsu')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
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
                      {t('fu-detail.shampon')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 0 })}
                    </div>
                    <div className={bem('fu-item-detail-item')}>
                      {is_tanyao_tile(hora.tatsu.tile) ? (
                        hora.type === 'tsumo' ? (
                          <>
                            {t('fu-detail.chunchan-anko')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 4 })}
                          </>
                        ) : (
                          <>
                            {t('fu-detail.chunchan-minko')} &mdash;{' '}
                            {t('fu-detail.fu', { count: 2 })}
                          </>
                        )
                      ) : hora.type === 'tsumo' ? (
                        <>
                          {t('fu-detail.yaochu-anko')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 8 })}
                        </>
                      ) : (
                        <>
                          {t('fu-detail.yaochu-minko')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 4 })}
                        </>
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
                      {t('fu-detail.tanki')} &mdash;{' '}
                      {t('fu-detail.fu', { count: 2 })}
                    </div>
                    <div className={bem('fu-item-detail-item')}>
                      {hora.tatsu.type === tableConfig.round &&
                      tableConfig.seat === hora.tatsu.type ? (
                        <>
                          {t('fu-detail.double-wind-head')} &mdash;{' '}
                          {t('fu-detail.fu', {
                            count: ruleConfig.doubleWindFu
                          })}
                        </>
                      ) : hora.tatsu.type === tableConfig.round ? (
                        <>
                          {t('fu-detail.field-wind-head')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 2 })}
                        </>
                      ) : hora.tatsu.type === tableConfig.seat ? (
                        <>
                          {t('fu-detail.seat-wind-head')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 2 })}
                        </>
                      ) : is_dragon_tile(hora.tile) ? (
                        <>
                          {t('fu-detail.dragon-head')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 2 })}
                        </>
                      ) : (
                        <>
                          {t('fu-detail.head')} &mdash;{' '}
                          {t('fu-detail.fu', { count: 0 })}
                        </>
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
                    {t('fu-detail.menzen-ron')} &mdash;{' '}
                    {t('fu-detail.fu', { count: 10 })}
                  </div>
                </div>
              )}
            {hora.type === 'tsumo' && (
              <div className={bem('fu-item')}>
                <div></div>
                {hora.yaku.some(y => y.name === 'pinfu') ? (
                  <div className={bem('fu-item-detail')}>
                    {t('fu-detail.pinfu-tsumo')} &mdash;{' '}
                    {t('fu-detail.fu', { count: 0 })}
                  </div>
                ) : (
                  <div className={bem('fu-item-detail')}>
                    {t('fu-detail.tsumo')} &mdash;{' '}
                    {t('fu-detail.fu', { count: 2 })}
                  </div>
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
                    {t('fu-detail.kuipinfu-ron')} &mdash;{' '}
                    {t('fu-detail.fu', { count: 10 })}
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
              <div className={bem('fu-item-detail')}>
                {t('fu-detail.chitoitsu')} &mdash;{' '}
                {t('fu-detail.fu', { count: 25 })}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
