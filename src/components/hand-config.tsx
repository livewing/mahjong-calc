import React from 'react';
import type { FC } from 'react';
import type { HandConfig, TableConfig } from '../lib/config';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';
import { Stepper } from './ui/stepper';

interface HandConfigPanelProps {
  value: HandConfig;
  tableConfig: TableConfig;
  onChange?: undefined | ((config: HandConfig) => void);
  onReset?: undefined | (() => void);
}

const riichiOpts = ['none', 'riichi', 'double-riichi'] as const;

export const HandConfigPanel: FC<HandConfigPanelProps> = ({
  value,
  tableConfig,
  onChange,
  onReset
}) => {
  return (
    <Config header="手牌・役の設定" onReset={onReset}>
      <ConfigRow name="ドラ">
        <Stepper
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          defaultValue={0}
          value={value.dora}
          onChanged={v => onChange && onChange({ ...value, dora: v })}
        />
      </ConfigRow>
      <ConfigRow name="立直">
        <Segment
          items={['なし', '立直', 'ダブル立直']}
          index={riichiOpts.indexOf(value.riichi)}
          onChanged={v =>
            onChange && onChange({ ...value, riichi: riichiOpts[v] })
          }
        />
      </ConfigRow>
      <ConfigRow name="一発">
        <Segment
          items={['なし', '一発']}
          index={value.ippatsu ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, ippatsu: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name="嶺上開花">
        <Segment
          items={['なし', '嶺上開花']}
          index={value.rinshan ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, rinshan: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name="搶槓">
        <Segment
          items={['なし', '搶槓']}
          index={value.chankan ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, chankan: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name="海底 / 河底">
        <Segment
          items={['なし', '海底 / 河底']}
          index={value.last ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, last: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name={tableConfig.seat === 'east' ? '天和' : '地和'}>
        <Segment
          items={['なし', tableConfig.seat === 'east' ? '天和' : '地和']}
          index={value.blessing ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, blessing: v === 1 })}
        />
      </ConfigRow>
    </Config>
  );
};
