import { useTranslation } from 'react-i18next';
import { MdRadioButtonChecked, MdRadioButtonUnchecked } from 'react-icons/md';
import { useStore } from '../../contexts/store';
import AutoInverted from '../../images/tile-color/auto-inverted.svg';
import Auto from '../../images/tile-color/auto.svg';
import Dark from '../../images/tile-color/dark.svg';
import Light from '../../images/tile-color/light.svg';
import type { AppConfig } from '../../lib/config';
import type React from 'react';
import type { FC } from 'react';

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
          className="flex overflow-hidden flex-col flex-1 bg-white hover:bg-neutral-200 dark:bg-black dark:hover:bg-neutral-800 rounded-md border border-neutral-300 dark:border-neutral-700 divide-y divide-neutral-300 dark:divide-neutral-700 focus:outline-none focus:ring-2 shadow transition select-none"
          onClick={() =>
            dispatch({
              type: 'set-app-config',
              payload: { ...appConfig, tileColor: item.id }
            })
          }
        >
          <item.image />
          <div className="flex gap-1 items-center p-2 w-full">
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
