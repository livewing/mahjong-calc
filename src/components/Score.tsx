import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdArrowForward } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { sumOfFu } from '../lib/fu';
import {
  calculateBasePoint,
  ceil10,
  ceil100,
  yakumanTupleKey
} from '../lib/score';
import { sumBy } from '../lib/util';
import type { Hora } from '../lib/hora';

const limitTextKey = (base: number) =>
  base < 3000
    ? 'result.mangan'
    : base < 4000
    ? 'result.haneman'
    : base < 6000
    ? 'result.baiman'
    : base < 8000
    ? 'result.sambaiman'
    : yakumanTupleKey(Math.floor(base / 8000));

interface ScoreProps {
  info: Hora;
}

export const Score: FC<ScoreProps> = ({ info }) => {
  const [
    {
      appConfig: { showBazoro },
      currentRule: { roundedMangan, accumlatedYakuman, multipleYakuman },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  if (info.yaku.every(y => y.name === 'dora' || y.name === 'red-dora'))
    return null;

  const base =
    info.type === 'kokushi' || info.yaku.some(y => y.type === 'yakuman')
      ? info.yaku.reduce((acc, cur) => {
          const p = cur.type === 'yakuman' ? cur.point : 0;
          if (multipleYakuman) return acc + p;
          return Math.max(acc, p);
        }, 0) * 8000
      : info.yaku.every(y => y.name === 'dora' || y.name === 'red-dora')
      ? 0
      : calculateBasePoint(
          info.type === 'mentsu' ? sumOfFu(info.fu) : 25,
          sumBy(info.yaku, y => (y.type === 'yaku' ? y.han : 0)),
          roundedMangan,
          accumlatedYakuman
        );
  const isDealer = table.seat === 'east';

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="font-bold text-xl">{t('result.score')}</div>
      <div>
        {t('result.base-point')}
        {base < 2000 && (
          <>
            {' '}
            = <span className="italic">{t('result.fu-var')}</span> &times; 2
            <sup>
              {!showBazoro && '('}
              <span className="italic">{t('result.han-var')}</span>
              {!showBazoro && ' + 2)'}
            </sup>{' '}
            = {info.type === 'mentsu' ? ceil10(sumOfFu(info.fu)) : 25} &times; 2
            <sup>
              {!showBazoro && '('}
              {sumBy(info.yaku, y => (y.type === 'yaku' ? y.han : 0)) +
                (showBazoro ? 2 : 0)}
              {!showBazoro && ' + 2)'}
            </sup>
          </>
        )}{' '}
        = {base > 8000 && <>8000 &times; {Math.floor(base / 8000)} = </>}
        <span className="font-bold">{base}</span>
        {base >= 2000 && ` (${t(limitTextKey(base))})`}
      </div>
      {info.by === 'ron' &&
        (() => {
          const m = isDealer ? 6 : 4;
          const r = base * m;
          const c = ceil100(r);
          return (
            <div>
              {t('result.score')} ={' '}
              <span className="italic">{t('result.base-point')}</span> &times;{' '}
              {m} = {base} &times; {m} ={' '}
              <span className={r === c ? 'font-bold' : void 0}>{r}</span>
              {r !== c && (
                <>
                  {' '}
                  <MdArrowForward style={{ display: 'inline' }} />{' '}
                  <span className="font-bold">{c}</span>
                </>
              )}
            </div>
          );
        })()}
      {info.by === 'tsumo' &&
        isDealer &&
        (() => {
          const r = base * 2;
          const c = ceil100(r);
          return (
            <div>
              {t('result.non-dealer-pay')} ={' '}
              <span className="italic">{t('result.base-point')}</span> &times; 2
              = {base} &times; 2 ={' '}
              <span className={r === c ? 'font-bold' : void 0}>{r}</span>
              {r !== c && (
                <>
                  {' '}
                  <MdArrowForward style={{ display: 'inline' }} />{' '}
                  <span className="font-bold">{c}</span>
                </>
              )}
            </div>
          );
        })()}
      {info.by === 'tsumo' &&
        !isDealer &&
        (() => {
          const rn = base;
          const rd = base * 2;
          const cn = ceil100(rn);
          const cd = ceil100(rd);
          return (
            <>
              <div>
                {t('result.non-dealer-pay')} ={' '}
                <span className="italic">{t('result.base-point')}</span> ={' '}
                <span className={rn === cn ? 'font-bold' : void 0}>{rn}</span>
                {rn !== cn && (
                  <>
                    {' '}
                    <MdArrowForward style={{ display: 'inline' }} />{' '}
                    <span className="font-bold">{cn}</span>
                  </>
                )}
              </div>
              <div>
                {t('result.dealer-pays')} ={' '}
                <span className="italic">{t('result.base-point')}</span> &times;
                2 = {base} &times; 2 ={' '}
                <span className={rd === cd ? 'font-bold' : void 0}>{rd}</span>
                {rd !== cd && (
                  <>
                    {' '}
                    <MdArrowForward style={{ display: 'inline' }} />{' '}
                    <span className="font-bold">{cd}</span>
                  </>
                )}
              </div>
            </>
          );
        })()}
    </div>
  );
};
