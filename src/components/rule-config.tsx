import React from 'react';
import type { FC } from 'react';
import type { RuleConfig } from '../lib/config';
import { Config, ConfigRow } from './ui/config';
import { Segment } from './ui/segment';

interface RuleConfigPanelProps {
  value: RuleConfig;
  onChange?: undefined | ((config: RuleConfig) => void);
}

export const RuleConfigPanel: FC<RuleConfigPanelProps> = ({
  value,
  onChange
}) => (
  <Config header="ルール設定">
    <ConfigRow name="数え役満">
      <Segment
        items={['オフ', '13 飜以上']}
        index={value.countedYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, countedYakuman: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="役満の複合">
      <Segment
        items={['オフ', 'オン']}
        index={value.multipleYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, multipleYakuman: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="切り上げ満貫">
      <Segment
        items={['オフ', '基本点 1920 点']}
        index={value.roundUpMangan ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, roundUpMangan: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="連風牌の雀頭">
      <Segment
        items={['2 符', '4 符']}
        index={value.doubleWindFu === 4 ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, doubleWindFu: v === 1 ? 4 : 2 })
        }
      />
    </ConfigRow>
    <ConfigRow name="国士無双十三面待ち">
      <Segment
        items={['役満', 'ダブル役満']}
        index={value.kokushi13DoubleYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, kokushi13DoubleYakuman: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="四暗刻単騎待ち">
      <Segment
        items={['役満', 'ダブル役満']}
        index={value.suankoTankiDoubleYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, suankoTankiDoubleYakuman: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="大四喜">
      <Segment
        items={['役満', 'ダブル役満']}
        index={value.daisushiDoubleYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, daisushiDoubleYakuman: v === 1 })
        }
      />
    </ConfigRow>
    <ConfigRow name="純正九蓮宝燈">
      <Segment
        items={['役満', 'ダブル役満']}
        index={value.pureChurenDoubleYakuman ? 1 : 0}
        onChanged={v =>
          onChange && onChange({ ...value, pureChurenDoubleYakuman: v === 1 })
        }
      />
    </ConfigRow>
  </Config>
);
