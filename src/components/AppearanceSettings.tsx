import React, { useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import { useStore } from '../contexts/store';
import { getResources } from '../lib/i18n';
import { Checkbox } from './ui/Checkbox';
import { ConfigItem } from './ui/ConfigItem';
import { Dropdown } from './ui/Dropdown';
import { ThemeSwitcher } from './ui/ThemeSwitcher';
import { TileColorSwitcher } from './ui/TileColorSwitcher';

const languages = Object.keys(getResources());

export const AppearanceSettings: FC = () => {
  const [{ appConfig }, dispatch] = useStore();
  const [openLanguageMenu, setOpenLanguageMenu] = useState(false);
  const { t, i18n } = useTranslation();

  return (
    <div className="flex flex-col gap-4">
      <ConfigItem label={t('settings.language')} labelFor="language-button">
        <Dropdown
          id="language-button"
          label={
            <div className="flex items-baseline gap-2">
              <div>{t('locale:name')}</div>
              <div className="text-xs text-neutral-500">{i18n.language}</div>
            </div>
          }
          open={openLanguageMenu}
          onSetOpen={setOpenLanguageMenu}
        >
          <div className="flex flex-col py-1">
            {languages.map(lng => (
              <button
                key={lng}
                className="group flex items-center gap-2 p-2 hover:bg-blue-500 hover:text-white"
                onClick={() => {
                  i18n.changeLanguage(lng);
                  setOpenLanguageMenu(false);
                }}
              >
                <MdCheck
                  className={
                    lng === i18n.language
                      ? 'visible text-blue-600 dark:text-blue-400 group-hover:text-white'
                      : 'invisible'
                  }
                />
                <div className="flex items-baseline gap-2">
                  <div>
                    {i18n.exists('locale:name', { lng, fallbackLng: [] })
                      ? `${t('locale:name', { lng })}`
                      : '???'}
                  </div>
                  <div className="text-xs text-neutral-500 group-hover:text-neutral-300">
                    {lng}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Dropdown>
      </ConfigItem>
      <ConfigItem label={t('settings.theme')}>
        <ThemeSwitcher />
      </ConfigItem>
      <ConfigItem label={t('settings.tile-color')}>
        <TileColorSwitcher />
      </ConfigItem>
      <ConfigItem label={t('settings.score')}>
        <Checkbox
          id="show-bazoro"
          checked={appConfig.showBazoro}
          onChange={showBazoro =>
            dispatch({
              type: 'set-app-config',
              payload: { ...appConfig, showBazoro }
            })
          }
        >
          {t('settings.show-bazoro')}
        </Checkbox>
      </ConfigItem>
    </div>
  );
};
