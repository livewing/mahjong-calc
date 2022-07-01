import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdAddChart, MdCalculate } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { calculateBasePoint, ceil100 } from '../lib/score';
import { MenuTab } from './ui/MenuTab';
import { ScoringTableHeader } from './ui/ScoringTableHeader';
import type { AppState } from '../lib/store/state';
import type { IconType } from 'react-icons';

const Header: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center p-2 text-center">
    {children}
  </div>
);

interface ContentProps {
  fu: number;
  han: number;
}
const Content: FC<ContentProps> = ({ fu, han }) => {
  const [
    {
      currentScoringTableTab,
      currentRule: { doubleWindFu, roundedMangan, honbaBonus },
      table
    }
  ] = useStore();
  const { t } = useTranslation();

  if ((fu < 30 && han === 1) || (fu === 110 && han === 1 && doubleWindFu === 2))
    return <div />;

  const base = calculateBasePoint(fu, han, roundedMangan, true);
  const isDealer = table.seat === 'east';
  const ron =
    fu === 20
      ? '-'
      : currentScoringTableTab === 'diff'
      ? `${-(
          (ceil100(base * (isDealer ? 6 : 4)) +
            table.continue * 3 * honbaBonus) *
            2 +
          1000 * table.deposit
        )}`
      : table.continue > 0
      ? `${t('scoring-table.ron-with-bonus', {
          a: ceil100(base * (isDealer ? 6 : 4)),
          b:
            ceil100(base * (isDealer ? 6 : 4)) + table.continue * 3 * honbaBonus
        })}`
      : `${ceil100(base * (isDealer ? 6 : 4))}`;
  const tsumo =
    (fu === 25 && han === 2) || (fu === 110 && han === 1)
      ? '-'
      : isDealer
      ? currentScoringTableTab === 'diff'
        ? `${-(
            (ceil100(base * 2) + table.continue * honbaBonus) * 4 +
            1000 * table.deposit
          )}`
        : table.continue > 0
        ? t('scoring-table.tsumo-with-bonus-dealer', {
            a: ceil100(base * 2),
            b: ceil100(base * 2) + table.continue * honbaBonus
          })
        : t('scoring-table.tsumo-dealer', { count: ceil100(base * 2) })
      : currentScoringTableTab === 'diff'
      ? t('scoring-table.tsumo-non-dealer-diff', {
          a: -(
            ceil100(base) * 3 +
            ceil100(base * 2) +
            table.continue * honbaBonus * 4 +
            1000 * table.deposit
          ),
          b: -(
            ceil100(base) * 2 +
            ceil100(base * 2) * 2 +
            table.continue * honbaBonus * 4 +
            1000 * table.deposit
          )
        })
      : table.continue > 0
      ? t('scoring-table.tsumo-with-bonus-non-dealer', {
          a: ceil100(base),
          b: ceil100(base * 2),
          c: ceil100(base) + table.continue * honbaBonus,
          d: ceil100(base * 2) + table.continue * honbaBonus
        })
      : t('scoring-table.tsumo-non-dealer', {
          a: ceil100(base),
          b: ceil100(base * 2)
        });
  const className =
    base >= 8000
      ? 'flex-1 px-2 py-1 bg-purple-600 text-white flex flex-col justify-center items-center'
      : base >= 6000
      ? 'flex-1 px-2 py-1 bg-red-600 text-white flex flex-col justify-center items-center'
      : base >= 4000
      ? 'flex-1 px-2 py-1 bg-orange-600 text-white flex flex-col justify-center items-center'
      : base >= 3000
      ? 'flex-1 px-2 py-1 bg-green-600 text-white flex flex-col justify-center items-center'
      : base >= 2000
      ? 'flex-1 px-2 py-1 bg-blue-600 text-white flex flex-col justify-center items-center'
      : base >= 1920
      ? 'flex-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-natural-900 dark:bg-natural-100 flex flex-col justify-center items-center'
      : 'flex-1 px-2 py-1 flex flex-col justify-center items-center';

  return (
    <div className="flex flex-col overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800">
      <div className={className}>
        <div
          className={
            ron === '-'
              ? 'flex-1 text-lg font-bold opacity-50'
              : 'flex-1 text-lg font-bold'
          }
        >
          {ron}
        </div>
        <div className={tsumo === '-' ? 'flex-1 opacity-50' : 'flex-1'}>
          {tsumo}
        </div>
      </div>
    </div>
  );
};

const tabItems: {
  id: AppState['currentScoringTableTab'];
  icon: IconType;
}[] = [
  { id: 'score', icon: MdAddChart },
  { id: 'diff', icon: MdCalculate }
];

export const ScoringTable: FC = () => {
  const [
    {
      currentScoringTableTab,
      appConfig: { showBazoro },
      currentRule: { accumlatedYakuman }
    },
    dispatch
  ] = useStore();
  const { t } = useTranslation();
  const bazoro = showBazoro ? 2 : 0;

  return (
    <div>
      <ScoringTableHeader />
      <div className="flex flex-col gap-2 p-2 pr-[max(0.5rem,env(safe-area-inset-right))] pl-[max(0.5rem,env(safe-area-inset-left))]">
        <div className="sm:basis-1/4">
          <MenuTab
            items={tabItems.map(item => (
              <div key={item.id} className="flex items-center gap-2">
                <div>
                  <item.icon />
                </div>
                <div>{t(`scoring-table.${item.id}`)}</div>
              </div>
            ))}
            index={tabItems.findIndex(
              item => item.id === currentScoringTableTab
            )}
            row
            onSetIndex={i =>
              dispatch({
                type: 'set-current-scoring-table-tab',
                payload: (tabItems[i] as typeof tabItems[number]).id
              })
            }
          />
        </div>
        <div className="overflow-x-auto">
          <div className="mx-0 grid grid-cols-[max-content_repeat(4,_minmax(max-content,_1fr))] gap-px p-2">
            {(
              ['head', 20, 25, 30, 40, 50, 60, 70, 80, 90, 100, 110] as const
            ).map(fu => (
              <React.Fragment key={fu}>
                {fu === 'head' && (
                  <>
                    <div />
                    {([1, 2, 3, 4] as const).map(han => (
                      <Header key={han}>
                        <div className="font-bold">
                          {t('scoring-table.han', {
                            count: han + bazoro
                          })}
                        </div>
                      </Header>
                    ))}
                  </>
                )}
                {fu !== 'head' && (
                  <>
                    <Header>
                      <div className="flex flex-col items-center justify-center">
                        <div className="font-bold">
                          {t('scoring-table.fu', { count: fu })}
                        </div>
                        {fu === 20 && (
                          <div className="text-sm text-neutral-500">
                            {t('scoring-table.pinfu-tsumo')}
                          </div>
                        )}
                        {fu === 25 && (
                          <div className="text-sm text-neutral-500">
                            {t('scoring-table.chitoitsu')}
                          </div>
                        )}
                      </div>
                    </Header>
                    {([1, 2, 3, 4] as const).map(han => (
                      <Content key={han} fu={fu} han={han} />
                    ))}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mx-0 grid grid-cols-[repeat(5,_minmax(max-content,_1fr))] gap-px p-2">
            <Header>
              <div className="font-bold">
                {t('scoring-table.han', { count: 5 + bazoro })}
              </div>
            </Header>
            <Header>
              <div className="font-bold">
                {t('scoring-table.han-2', { a: 6 + bazoro, b: 7 + bazoro })}
              </div>
            </Header>
            <Header>
              <div className="font-bold">
                {t('scoring-table.han-range', {
                  a: 8 + bazoro,
                  b: 10 + bazoro
                })}
              </div>
            </Header>
            <Header>
              <div className="font-bold">
                {accumlatedYakuman
                  ? t('scoring-table.han-2', {
                      a: 11 + bazoro,
                      b: 12 + bazoro
                    })
                  : t('scoring-table.gte-han', { count: 11 + bazoro })}
              </div>
            </Header>
            <Header>
              <div className="font-bold">
                {accumlatedYakuman
                  ? t('scoring-table.gte-han-yakuman', { count: 13 + bazoro })
                  : t('scoring-table.yakuman')}
              </div>
            </Header>
            <Content fu={0} han={5} />
            <Content fu={0} han={6} />
            <Content fu={0} han={8} />
            <Content fu={0} han={11} />
            <Content fu={0} han={13} />
          </div>
        </div>
      </div>
    </div>
  );
};
