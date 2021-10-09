import React from 'react';
import { useTranslation } from 'react-i18next';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';
import { Stepper } from './ui/stepper';
import type { FC } from 'react';
import type { TableConfig } from '../lib/config';

interface TableConfigPanelProps {
  value: TableConfig;
  onChange?: undefined | ((config: TableConfig) => void);
}

const winds = ['east', 'south', 'west', 'north'] as const;

export const TableConfigPanel: FC<TableConfigPanelProps> = ({
  value,
  onChange
}) => {
  const { t } = useTranslation();

  return (
    <Config header={t('table-config.title')}>
      <ConfigRow name={t('table-config.field-wind')}>
        <Segment
          items={[
            t('table-config.east'),
            t('table-config.south'),
            t('table-config.west'),
            t('table-config.north')
          ]}
          index={winds.indexOf(value.round)}
          onChanged={v => onChange && onChange({ ...value, round: winds[v] })}
        />
      </ConfigRow>
      <ConfigRow name={t('table-config.seat-wind')}>
        <Segment
          items={[
            t('table-config.east'),
            t('table-config.south'),
            t('table-config.west'),
            t('table-config.north')
          ]}
          index={winds.indexOf(value.seat)}
          onChanged={v => onChange && onChange({ ...value, seat: winds[v] })}
        />
      </ConfigRow>
      <ConfigRow name={t('table-config.continue')}>
        <Stepper
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          defaultValue={0}
          value={value.continue}
          onChanged={v => onChange && onChange({ ...value, continue: v })}
        />
      </ConfigRow>
      <ConfigRow name={t('table-config.deposit')}>
        <Stepper
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          defaultValue={0}
          value={value.deposit}
          onChanged={v => onChange && onChange({ ...value, deposit: v })}
        />
      </ConfigRow>
    </Config>
  );
};
