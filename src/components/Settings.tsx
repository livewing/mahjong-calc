import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { IoMdDesktop } from 'react-icons/io';
import { MdChecklist, MdInfo } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { About } from './About';
import { AppearanceSettings } from './AppearanceSettings';
import { RuleSettings } from './RuleSettings';
import { MenuTab } from './ui/MenuTab';
import type { AppState } from '../lib/store/state';
import type { IconType } from 'react-icons';

const tabItems: {
  id: AppState['currentSettingsTab'];
  icon: IconType;
}[] = [
  { id: 'rule', icon: MdChecklist },
  { id: 'appearance', icon: IoMdDesktop },
  { id: 'about', icon: MdInfo }
];

export const Settings: FC = () => {
  const [{ currentSettingsTab }, dispatch] = useStore();
  const { t } = useTranslation();
  return (
    <div className="p-2 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] flex gap-2 flex-col sm:flex-row sm:container sm:mx-auto sm:gap-8">
      <div className="sm:basis-1/4">
        <MenuTab
          items={tabItems.map(item => (
            <div key={item.id} className="flex items-center gap-2">
              <div>
                <item.icon />
              </div>
              <div>{t(`settings.${item.id}`)}</div>
            </div>
          ))}
          index={tabItems.findIndex(item => item.id === currentSettingsTab)}
          onSetIndex={i =>
            dispatch({
              type: 'set-current-settings-tab',
              payload: tabItems[i].id
            })
          }
        />
      </div>
      <div className="sm:flex-1 sm:basis-3/4">
        {currentSettingsTab === 'rule' && <RuleSettings />}
        {currentSettingsTab === 'appearance' && <AppearanceSettings />}
        {currentSettingsTab === 'about' && <About />}
      </div>
    </div>
  );
};
