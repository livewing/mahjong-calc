import { useTranslation } from 'react-i18next';
import { useStore } from '../../contexts/store';
import { ConfigItem } from './ConfigItem';
import { Segment } from './Segment';
import type { Rule } from '../../lib/rule';
import type { FC } from 'react';

interface RuleEditorProps {
  rule: Rule;
  onChange?: (rule: Rule) => void;
}
export const RuleEditor: FC<RuleEditorProps> = ({
  rule,
  onChange = () => void 0
}) => {
  const [
    {
      appConfig: { showBazoro }
    }
  ] = useStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col flex-1 gap-4 sm:flex-row sm:gap-8">
      <div className="flex flex-col flex-1 gap-4">
        <ConfigItem label={t('settings.red-m')}>
          <Segment
            items={[0, 1, 2, 3, 4]}
            index={rule.red.m}
            onChange={i =>
              onChange({
                ...rule,
                red: { ...rule.red, m: i as 0 | 1 | 2 | 3 | 4 }
              })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.red-p')}>
          <Segment
            items={[0, 1, 2, 3, 4]}
            index={rule.red.p}
            onChange={i =>
              onChange({
                ...rule,
                red: { ...rule.red, p: i as 0 | 1 | 2 | 3 | 4 }
              })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.red-s')}>
          <Segment
            items={[0, 1, 2, 3, 4]}
            index={rule.red.s}
            onChange={i =>
              onChange({
                ...rule,
                red: { ...rule.red, s: i as 0 | 1 | 2 | 3 | 4 }
              })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.honba-bonus')}>
          <Segment
            items={[
              t('settings.point', { count: 300 }),
              t('settings.point', { count: 1500 })
            ]}
            index={rule.honbaBonus === 100 ? 0 : 1}
            onChange={i =>
              onChange({ ...rule, honbaBonus: i === 0 ? 100 : 500 })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.rounded-mangan')}>
          <Segment
            items={[
              t('settings.off'),
              t('settings.round-up-basic-point', { count: 1920 })
            ]}
            index={rule.roundedMangan ? 1 : 0}
            onChange={i => onChange({ ...rule, roundedMangan: i === 1 })}
          />
        </ConfigItem>
        <ConfigItem label={t('settings.double-wind-fu')}>
          <Segment
            items={[
              t('settings.fu', { count: 2 }),
              t('settings.fu', { count: 4 })
            ]}
            index={rule.doubleWindFu === 2 ? 0 : 1}
            onChange={i => onChange({ ...rule, doubleWindFu: i === 0 ? 2 : 4 })}
          />
        </ConfigItem>
      </div>
      <div className="flex flex-col flex-1 gap-4">
        <ConfigItem label={t('settings.accumlated-yakuman')}>
          <Segment
            items={[
              t('settings.off'),
              t('settings.gte-han', { count: showBazoro ? 15 : 13 })
            ]}
            index={rule.accumlatedYakuman ? 1 : 0}
            onChange={i => onChange({ ...rule, accumlatedYakuman: i === 1 })}
          />
        </ConfigItem>
        <ConfigItem label={t('settings.multiple-yakuman')}>
          <Segment
            items={[t('settings.off'), t('settings.on')]}
            index={rule.multipleYakuman ? 1 : 0}
            onChange={i => onChange({ ...rule, multipleYakuman: i === 1 })}
          />
        </ConfigItem>
        <ConfigItem label={t('settings.kokushi-13')}>
          <Segment
            items={[t('settings.yakuman'), t('settings.double-yakuman')]}
            index={rule.kokushi13DoubleYakuman ? 1 : 0}
            onChange={i =>
              onChange({ ...rule, kokushi13DoubleYakuman: i === 1 })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.suanko-tanki')}>
          <Segment
            items={[t('settings.yakuman'), t('settings.double-yakuman')]}
            index={rule.suankoTankiDoubleYakuman ? 1 : 0}
            onChange={i =>
              onChange({ ...rule, suankoTankiDoubleYakuman: i === 1 })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.daisushi')}>
          <Segment
            items={[t('settings.yakuman'), t('settings.double-yakuman')]}
            index={rule.daisushiDoubleYakuman ? 1 : 0}
            onChange={i =>
              onChange({ ...rule, daisushiDoubleYakuman: i === 1 })
            }
          />
        </ConfigItem>
        <ConfigItem label={t('settings.pure-churen')}>
          <Segment
            items={[t('settings.yakuman'), t('settings.double-yakuman')]}
            index={rule.pureChurenDoubleYakuman ? 1 : 0}
            onChange={i =>
              onChange({ ...rule, pureChurenDoubleYakuman: i === 1 })
            }
          />
        </ConfigItem>
      </div>
    </div>
  );
};
