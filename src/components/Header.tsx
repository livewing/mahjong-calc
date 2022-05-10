import React, { useEffect, useState, type FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdHelp, MdSettings, MdTableView, MdUpdate } from 'react-icons/md';
import { useStore } from '../contexts/store';

const buttonClasses = {
  default: 'flex items-center gap-1 p-1 hover:bg-blue-500 rounded transition',
  active:
    'flex items-center gap-1 p-1 bg-blue-500 hover:bg-blue-400 rounded transition'
} as const;

export const Header: FC = () => {
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const { t } = useTranslation();
  const [{ currentScreen }, dispatch] = useStore();
  useEffect(() => {
    (async () => {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        registration?.addEventListener('updatefound', () => {
          setShowUpdateButton(true);
        });
      }
    })();
  }, []);
  return (
    <header className="sticky top-0 h-12 flex justify-between items-center bg-blue-600 text-white p-2 pl-[max(0.5rem,env(safe-area-inset-left))] pr-[max(0.5rem,env(safe-area-inset-right))] z-30">
      <button
        disabled={currentScreen === 'main'}
        className="overflow-hidden"
        onClick={() =>
          dispatch({ type: 'set-current-screen', payload: 'main' })
        }
      >
        <h1 className="text-2xl truncate">{t('header.title')}</h1>
      </button>
      <div className="flex gap-1 items-center">
        {showUpdateButton && (
          <button
            className="flex items-center gap-1 p-1 bg-emerald-600 hover:bg-emerald-500 rounded transition"
            onClick={() => location.reload()}
          >
            <MdUpdate size="1.8rem" />
            <div className="hidden sm:block">{t('header.update')}</div>
          </button>
        )}
        <a
          href="https://github.com/livewing/mahjong-calc/blob/main/doc/how-to-use.md"
          target="_blank"
          rel="noreferrer"
          className={buttonClasses.default}
        >
          <MdHelp size="1.8rem" />
          <div className="hidden sm:block">{t('header.help')}</div>
        </a>
        <button
          className={
            currentScreen === 'scoring-table'
              ? buttonClasses.active
              : buttonClasses.default
          }
          onClick={() =>
            dispatch({
              type: 'set-current-screen',
              payload:
                currentScreen === 'scoring-table' ? 'main' : 'scoring-table'
            })
          }
        >
          <MdTableView size="1.8rem" />
          <div className="hidden sm:block">{t('header.scoring-table')}</div>
        </button>
        <button
          className={
            currentScreen === 'settings'
              ? buttonClasses.active
              : buttonClasses.default
          }
          onClick={() =>
            dispatch({
              type: 'set-current-screen',
              payload: currentScreen === 'settings' ? 'main' : 'settings'
            })
          }
        >
          <MdSettings size="1.8rem" />
          <div className="hidden sm:block">{t('header.settings')}</div>
        </button>
      </div>
    </header>
  );
};
