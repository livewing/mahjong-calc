import React, { type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { useStore } from '../../contexts/store';
import AutoInverted from '../../images/tile-color/auto-inverted.svg';
import Auto from '../../images/tile-color/auto.svg';
import Dark from '../../images/tile-color/dark.svg';
import Light from '../../images/tile-color/light.svg';
import type { AppConfig } from '../../lib/config';

const themeItems: {
  id: AppConfig['tileColor'];
  image: FC<React.SVGProps<SVGElement>>;
}[] = [
  { id: 'auto', image: Auto },
  { id: 'auto-inverted', image: AutoInverted },
  { id: 'light', image: Light },
  { id: 'dark', image: Dark }
];

export const TileColorSwitcher: FC = () => {
  const [{ appConfig }, dispatch] = useStore();
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-2 gap-1 md:flex">
      {themeItems.map(item => (
        <button
          key={item.id}
          className="flex flex-col flex-1 border border-neutral-300 dark:border-neutral-700 divide-y divide-neutral-300 dark:divide-neutral-700 bg-white dark:bg-black hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md shadow overflow-hidden select-none select-none focus:outline-none focus:ring-2 transition"
          onClick={() =>
            dispatch({
              type: 'set-app-config',
              payload: { ...appConfig, tileColor: item.id }
            })
          }
        >
          <item.image />
          <div className="flex items-center w-full p-2 gap-1">
            <div className="basis-4">
              {appConfig.tileColor === item.id && (
                <MdRadioButtonChecked className="text-blue-600 dark:text-blue-400" />
              )}
              {appConfig.tileColor !== item.id && <MdRadioButtonUnchecked />}
            </div>
            <div className="truncate">{t(`settings.${item.id}`)}</div>
          </div>
        </button>
      ))}
    </div>
  );
};
