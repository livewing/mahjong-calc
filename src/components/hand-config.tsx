import React from 'react';
import { useTranslation } from 'react-i18next';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';
import { Stepper } from './ui/stepper';
import type { FC } from 'react';
import type { HandConfig, TableConfig } from '../lib/config';

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
  const { t } = useTranslation();

  return (
    <Config header={t('hand-config.title')} onReset={onReset}>
      <ConfigRow name={t('hand-config.dora')}>
        <Stepper
          min={0}
          max={Number.MAX_SAFE_INTEGER}
          defaultValue={0}
          value={value.dora}
          onChanged={v => onChange && onChange({ ...value, dora: v })}
        />
      </ConfigRow>
      <ConfigRow name={t('hand-config.riichi')}>
        <Segment
          items={[
            t('hand-config.none'),
            t('hand-config.riichi'),
            t('hand-config.double-riichi')
          ]}
          index={riichiOpts.indexOf(value.riichi)}
          onChanged={v =>
            onChange && onChange({ ...value, riichi: riichiOpts[v] })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('hand-config.ippatsu')}>
        <Segment
          items={[t('hand-config.none'), t('hand-config.ippatsu')]}
          index={value.ippatsu ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, ippatsu: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name={t('hand-config.rinshan')}>
        <Segment
          items={[t('hand-config.none'), t('hand-config.rinshan')]}
          index={value.rinshan ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, rinshan: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name={t('hand-config.chankan')}>
        <Segment
          items={[t('hand-config.none'), t('hand-config.chankan')]}
          index={value.chankan ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, chankan: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow name={t('hand-config.haitei-hotei')}>
        <Segment
          items={[t('hand-config.none'), t('hand-config.haitei-hotei')]}
          index={value.last ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, last: v === 1 })}
        />
      </ConfigRow>
      <ConfigRow
        name={
          tableConfig.seat === 'east'
            ? t('hand-config.tenho')
            : t('hand-config.chiho')
        }
      >
        <Segment
          items={[
            t('hand-config.none'),
            tableConfig.seat === 'east'
              ? t('hand-config.tenho')
              : t('hand-config.chiho')
          ]}
          index={value.blessing ? 1 : 0}
          onChanged={v => onChange && onChange({ ...value, blessing: v === 1 })}
        />
      </ConfigRow>
    </Config>
  );
};
