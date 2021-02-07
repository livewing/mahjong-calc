import React from 'react';
import type { FC } from 'react';
import type { TableConfig } from '../lib/config';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';
import { Stepper } from './ui/stepper';

interface TableConfigPanelProps {
  value: TableConfig;
  onChange?: undefined | ((config: TableConfig) => void);
}

const winds = ['east', 'south', 'west', 'north'] as const;

export const TableConfigPanel: FC<TableConfigPanelProps> = ({
  value,
  onChange
}) => (
  <Config header="場の設定">
    <ConfigRow name="場風">
      <Segment
        items={['東', '南', '西', '北']}
        index={winds.indexOf(value.round)}
        onChanged={v => onChange && onChange({ ...value, round: winds[v] })}
      />
    </ConfigRow>
    <ConfigRow name="自風">
      <Segment
        items={['東', '南', '西', '北']}
        index={winds.indexOf(value.seat)}
        onChanged={v => onChange && onChange({ ...value, seat: winds[v] })}
      />
    </ConfigRow>
    <ConfigRow name="積棒">
      <Stepper
        min={0}
        max={Number.MAX_SAFE_INTEGER}
        defaultValue={0}
        value={value.continue}
        onChanged={v => onChange && onChange({ ...value, continue: v })}
      />
    </ConfigRow>
    <ConfigRow name="供託">
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
