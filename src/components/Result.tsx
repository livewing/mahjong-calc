import { useTranslation } from 'react-i18next';
import { compareTiles } from '../lib/tile';
import { sumBy } from '../lib/util';
import { DiscardItem } from './DiscardItem';
import { HoraItem } from './HoraItem';
import { Shanten } from './Shanten';
import { Tempai } from './Tempai';
import type { Result as ResultType } from '../lib/result';
import type React from 'react';
import type { FC } from 'react';

const Message: FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center py-4 text-neutral-700 dark:text-neutral-300">
    {children}
  </div>
);

interface ResultProps {
  result: ResultType;
}
export const Result: FC<ResultProps> = ({ result }) => {
  const { t } = useTranslation();

  if (result === null) {
    return <Message>{t('result.input-message')}</Message>;
  }

  if (result.type === 'just-hora') {
    return <Message>{t('result.hora')}</Message>;
  }

  if (result.type === 'hora-shanten') {
    if (result.info.type === 'hora') {
      if (result.info.hora.length === 0) {
        return <Message>{t('result.no-hora-tiles')}</Message>;
      }
      return (
        <div className="flex flex-col gap-2">
          {result.info.hora.map(hora => (
            <HoraItem
              key={JSON.stringify([hora.horaTile, hora.by])}
              info={hora}
            />
          ))}
        </div>
      );
    } else {
      return (
        <Shanten
          shanten={result.info.shanten}
          tileAvailabilities={result.info.tileAvailabilities}
        />
      );
    }
  }

  if (result.type === 'tempai') {
    if (result.tileAvailabilities.every(a => a.count === 0)) {
      return <Message>{t('result.no-hora-tiles')}</Message>;
    }
    return <Tempai tileAvailabilities={result.tileAvailabilities} />;
  }

  if (result.type === 'discard-shanten') {
    const shanten = result.discards.reduce(
      (acc, cur) =>
        Math.min(
          acc,
          cur.next.type === 'tempai'
            ? 0
            : cur.next.info.type === 'hora'
            ? 0
            : cur.next.info.shanten
        ),
      Number.POSITIVE_INFINITY
    );
    const discards = [...result.discards];
    if (
      discards.every(
        d => d.next.type === 'hora-shanten' && d.next.info.type === 'shanten'
      )
    ) {
      discards.sort((a, b) => {
        if (
          a.next.type !== 'hora-shanten' ||
          a.next.info.type !== 'shanten' ||
          b.next.type !== 'hora-shanten' ||
          b.next.info.type !== 'shanten'
        )
          throw new Error();

        const ac = sumBy(a.next.info.tileAvailabilities, a => a.count);
        const bc = sumBy(b.next.info.tileAvailabilities, a => a.count);

        if (ac === bc) return compareTiles(a.tile, b.tile);
        return bc - ac;
      });
    }

    return (
      <div className="flex flex-col gap-2">
        <div className="text-xl font-bold">
          {shanten === 0
            ? t('result.tempai')
            : t('result.shanten', { count: shanten })}
        </div>
        <div className="flex flex-col gap-2">
          {discards.map((d, i) => (
            <DiscardItem key={i} discard={d} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <code>
      <pre className="text-xs">{JSON.stringify(result, null, 2)}</pre>
    </code>
  );
};
