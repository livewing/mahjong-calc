import React from 'react';
import { useTranslation } from 'react-i18next';
import { Config, ConfigRow } from './ui/config';
import { Select } from './ui/select';
import type { FC } from 'react';

export const AppConfigPanel: FC = () => {
  const { t, i18n } = useTranslation();
  const languages = Object.keys(i18n.store.data);

  return (
    <Config header={t('app-config.title')} fixedWidth>
      <ConfigRow name={t('app-config.language')}>
        <Select
          items={languages.map(lng =>
            i18n.exists('locale:name', { lng, fallbackLng: [] })
              ? `${t('locale:name', { lng })} (${lng})`
              : lng
          )}
          index={languages.indexOf(i18n.language) ?? 0}
          onChanged={i => i18n.changeLanguage(languages[i])}
        />
      </ConfigRow>
    </Config>
  );
};
