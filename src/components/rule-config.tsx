import React from 'react';
import { useTranslation } from 'react-i18next';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';
import type { FC } from 'react';
import type { RuleConfig } from '../lib/config';

interface RuleConfigPanelProps {
  value: RuleConfig;
  onChange?: undefined | ((config: RuleConfig) => void);
}

export const RuleConfigPanel: FC<RuleConfigPanelProps> = ({
  value,
  onChange
}) => {
  const { t } = useTranslation();

  return (
    <Config header={t('rule-config.title')}>
      <ConfigRow name={t('rule-config.counted-yakuman')}>
        <Segment
          items={[
            t('rule-config.off'),
            t('rule-config.gte-han', { count: 13 })
          ]}
          index={value.countedYakuman ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, countedYakuman: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.multiple-yakuman')}>
        <Segment
          items={[t('rule-config.off'), t('rule-config.on')]}
          index={value.multipleYakuman ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, multipleYakuman: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.round-up-mangan')}>
        <Segment
          items={[
            t('rule-config.off'),
            t('rule-config.round-up-basic-point', { count: 1920 })
          ]}
          index={value.roundUpMangan ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, roundUpMangan: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.double-wind-fu')}>
        <Segment
          items={[
            t('rule-config.fu', { count: 2 }),
            t('rule-config.fu', { count: 4 })
          ]}
          index={value.doubleWindFu === 4 ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, doubleWindFu: v === 1 ? 4 : 2 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.kokushi-13')}>
        <Segment
          items={[t('rule-config.yakuman'), t('rule-config.double-yakuman')]}
          index={value.kokushi13DoubleYakuman ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, kokushi13DoubleYakuman: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.suanko-tanki')}>
        <Segment
          items={[t('rule-config.yakuman'), t('rule-config.double-yakuman')]}
          index={value.suankoTankiDoubleYakuman ? 1 : 0}
          onChanged={v =>
            onChange &&
            onChange({ ...value, suankoTankiDoubleYakuman: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.daisushi')}>
        <Segment
          items={[t('rule-config.yakuman'), t('rule-config.double-yakuman')]}
          index={value.daisushiDoubleYakuman ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, daisushiDoubleYakuman: v === 1 })
          }
        />
      </ConfigRow>
      <ConfigRow name={t('rule-config.pure-churen')}>
        <Segment
          items={[t('rule-config.yakuman'), t('rule-config.double-yakuman')]}
          index={value.pureChurenDoubleYakuman ? 1 : 0}
          onChanged={v =>
            onChange && onChange({ ...value, pureChurenDoubleYakuman: v === 1 })
          }
        />
      </ConfigRow>
    </Config>
  );
};
