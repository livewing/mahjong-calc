import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { formatKeys } from '../lib/os';
import { Tile } from './tile';
import { Button } from './ui/Button';

interface KeyboardHelpProps {
  onClose?: () => void;
}

export const KeyboardHelp: FC<KeyboardHelpProps> = ({
  onClose = () => void 0
}) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 z-10 h-full w-full">
      <button
        type="button"
        className="absolute inset-0 h-full w-full cursor-default select-none bg-transparent backdrop-blur-sm [-webkit-tap-highlight-color:transparent]"
        onClick={onClose}
      />
      <div className="mt-24 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 rounded-md border border-neutral-500/50 bg-white/50 p-2 backdrop-blur-md dark:bg-black/50">
          <div className="text-lg font-bold">
            {t('keyboard-shortcuts.title')}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-right">←↓↑→</div>
            <div>{t('keyboard-shortcuts.switch-focus')}</div>
            <div className="text-right">{formatKeys('Backspace')}</div>
            <div>{t('keyboard-shortcuts.delete-tile')}</div>
            <div className="flex items-center justify-end">12m34p56s0m</div>
            <div className="flex w-44 gap-px">
              <Tile tile={{ type: 'm', n: 1 }} />
              <Tile tile={{ type: 'm', n: 2 }} />
              <Tile tile={{ type: 'p', n: 3 }} />
              <Tile tile={{ type: 'p', n: 4 }} />
              <Tile tile={{ type: 's', n: 5, red: false }} />
              <Tile tile={{ type: 's', n: 6 }} />
              <Tile tile={{ type: 'm', n: 5, red: true }} />
            </div>
            <div className="flex items-center justify-end">1234567z</div>
            <div className="flex w-44 gap-px">
              <Tile tile={{ type: 'z', n: 1 }} />
              <Tile tile={{ type: 'z', n: 2 }} />
              <Tile tile={{ type: 'z', n: 3 }} />
              <Tile tile={{ type: 'z', n: 4 }} />
              <Tile tile={{ type: 'z', n: 5 }} />
              <Tile tile={{ type: 'z', n: 6 }} />
              <Tile tile={{ type: 'z', n: 7 }} />
            </div>
            <div className="text-right">{formatKeys('Shift+P')}</div>
            <div>{t('keyboard-shortcuts.pon')}</div>
            <div className="text-right">{formatKeys('Shift+C')}</div>
            <div>{t('keyboard-shortcuts.chii')}</div>
            <div className="text-right">{formatKeys('Shift+M')}</div>
            <div>{t('keyboard-shortcuts.minkan')}</div>
            <div className="text-right">{formatKeys('Shift+A')}</div>
            <div>{t('keyboard-shortcuts.ankan')}</div>
            <div className="text-right">{formatKeys('Shift+R')}</div>
            <div>{t('keyboard-shortcuts.toggle-red')}</div>
          </div>
          <Button onClick={onClose}>{t('keyboard-shortcuts.close')}</Button>
        </div>
      </div>
    </div>
  );
};
