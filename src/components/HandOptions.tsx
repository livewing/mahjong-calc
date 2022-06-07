import { useTranslation } from 'react-i18next';
import { useStore } from '../contexts/store';
import { ConfigItem } from './ui/ConfigItem';
import { Segment } from './ui/Segment';
import type { FC } from 'react';

const riichiOptions = ['none', 'riichi', 'double-riichi'] as const;

export const HandOptions: FC = () => {
  const [{ table, handOptions }, dispatch] = useStore();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <ConfigItem label={t('hand-options.riichi')}>
            <Segment
              items={riichiOptions.map(o => t(`hand-options.${o}`))}
              index={riichiOptions.indexOf(handOptions.riichi)}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: {
                    ...handOptions,
                    riichi: riichiOptions[i as 0 | 1 | 2]
                  }
                })
              }
            />
          </ConfigItem>
        </div>
        <div className="flex-1">
          <ConfigItem label={t('hand-options.ippatsu')}>
            <Segment
              items={[t('hand-options.none'), t('hand-options.ippatsu')]}
              index={handOptions.ippatsu ? 1 : 0}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: { ...handOptions, ippatsu: i === 1 }
                })
              }
            />
          </ConfigItem>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <ConfigItem label={t('hand-options.rinshan')}>
            <Segment
              items={[t('hand-options.none'), t('hand-options.rinshan')]}
              index={handOptions.rinshan ? 1 : 0}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: { ...handOptions, rinshan: i === 1 }
                })
              }
            />
          </ConfigItem>
        </div>
        <div className="flex-1">
          <ConfigItem label={t('hand-options.chankan')}>
            <Segment
              items={[t('hand-options.none'), t('hand-options.chankan')]}
              index={handOptions.chankan ? 1 : 0}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: { ...handOptions, chankan: i === 1 }
                })
              }
            />
          </ConfigItem>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="flex-1">
          <ConfigItem label={t('hand-options.haitei-hotei')}>
            <Segment
              items={[t('hand-options.none'), t('hand-options.haitei-hotei')]}
              index={handOptions.haitei ? 1 : 0}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: { ...handOptions, haitei: i === 1 }
                })
              }
            />
          </ConfigItem>
        </div>
        <div className="flex-1">
          <ConfigItem
            label={t(
              table.seat === 'east'
                ? 'hand-options.tenho'
                : 'hand-options.chiho'
            )}
          >
            <Segment
              items={[
                t('hand-options.none'),
                t(
                  table.seat === 'east'
                    ? 'hand-options.tenho'
                    : 'hand-options.chiho'
                )
              ]}
              index={handOptions.tenho ? 1 : 0}
              onChange={i =>
                dispatch({
                  type: 'set-hand-options',
                  payload: { ...handOptions, tenho: i === 1 }
                })
              }
            />
          </ConfigItem>
        </div>
      </div>
    </div>
  );
};
