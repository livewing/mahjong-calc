import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import Stick100 from '../images/point-stick/100.svg?react';
import Stick1000 from '../images/point-stick/1000.svg?react';
import type { Wind } from '../lib/table';
import { ConfigItem } from './ui/ConfigItem';
import { Segment } from './ui/Segment';
import { Stepper } from './ui/Stepper';

const winds: Wind[] = ['east', 'south', 'west', 'north'];

export const TableSettings: FC = () => {
  const [{ table }, dispatch] = useStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <ConfigItem label={t('table-settings.round-wind')}>
            <Segment
              items={winds.map(w => t(`table-settings.${w}`))}
              index={winds.indexOf(table.round)}
              onChange={i =>
                dispatch({
                  type: 'set-table',
                  payload: { ...table, round: winds[i] as Wind }
                })
              }
            />
          </ConfigItem>
        </div>
        <div className="flex-1">
          <ConfigItem label={t('table-settings.seat-wind')}>
            <Segment
              items={winds.map(w => t(`table-settings.${w}`))}
              index={winds.indexOf(table.seat)}
              onChange={i =>
                dispatch({
                  type: 'set-table',
                  payload: { ...table, seat: winds[i] as Wind }
                })
              }
            />
          </ConfigItem>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <ConfigItem
            label={
              <div className="flex items-center gap-2">
                {t('table-settings.deposit')}
                <Stick1000 className="w-16 drop-shadow" />
              </div>
            }
          >
            <Stepper
              value={table.deposit}
              canDecrement={table.deposit > 0}
              onChange={value =>
                dispatch({
                  type: 'set-table',
                  payload: { ...table, deposit: value }
                })
              }
            />
          </ConfigItem>
        </div>
        <div className="flex-1">
          <ConfigItem
            label={
              <div className="flex items-center gap-2">
                {t('table-settings.continue')}
                <Stick100 className="w-16 drop-shadow" />
              </div>
            }
          >
            <Stepper
              value={table.continue}
              canDecrement={table.continue > 0}
              onChange={value =>
                dispatch({
                  type: 'set-table',
                  payload: { ...table, continue: value }
                })
              }
            />
          </ConfigItem>
        </div>
      </div>
    </div>
  );
};
