import React, { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../contexts/store';
import Stick100 from '../../images/point-stick/100.svg';
import Stick1000 from '../../images/point-stick/1000.svg';
import { SimpleStepper } from './SimpleStepper';

const HeaderButton: FC<{
  children?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}> = ({ children, active = false, onClick }) => (
  <button
    className={
      active
        ? 'px-4 py-2 bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600 transition'
        : 'px-4 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition'
    }
    onClick={onClick}
  >
    {children}
  </button>
);

export const ScoringTableHeader: FC = () => {
  const [{ currentScoringTableTab, table }, dispatch] = useStore();
  const [openTableSettings, setOpenTableSettings] = useState(false);
  const { t } = useTranslation();

  const isDealer = table.seat === 'east';

  return (
    <div className="sticky top-12 sm:px-2 flex justify-center items-start bg-white/80 dark:bg-neutral-800/80 backdrop-blur shadow z-20 transition">
      <HeaderButton
        onClick={() =>
          dispatch({
            type: 'set-table',
            payload: {
              ...table,
              seat: table.seat === 'east' ? 'south' : 'east'
            }
          })
        }
      >
        {t(isDealer ? 'scoring-table.dealer' : 'scoring-table.non-dealer')}
      </HeaderButton>
      <div className="flex flex-col">
        <HeaderButton
          active={openTableSettings}
          onClick={() => setOpenTableSettings(o => !o)}
        >
          <div className="flex gap-4">
            {currentScoringTableTab === 'diff' && (
              <div className="flex gap-1">
                <Stick1000 className="w-16 drop-shadow" />
                <div className="w-6">{table.deposit}</div>
              </div>
            )}
            <div className="flex gap-1">
              <Stick100 className="w-16 drop-shadow" />
              <div className="w-6">{table.continue}</div>
            </div>
          </div>
        </HeaderButton>
        {openTableSettings && (
          <div className="flex gap-4 px-2 py-1 bg-neutral-200 dark:bg-neutral-700">
            {currentScoringTableTab === 'diff' && (
              <SimpleStepper
                canDecrement={table.deposit > 0}
                onChange={d =>
                  dispatch({
                    type: 'set-table',
                    payload: { ...table, deposit: table.deposit + d }
                  })
                }
              />
            )}
            <SimpleStepper
              canDecrement={table.continue > 0}
              onChange={d =>
                dispatch({
                  type: 'set-table',
                  payload: { ...table, continue: table.continue + d }
                })
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
