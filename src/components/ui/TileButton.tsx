import type { FC } from 'react';
import { useStore } from '../../contexts/store';
import { usePrefersColorScheme } from '../../hooks/dom';
import type { TileOrBack } from '../../lib/tile';
import { Tile as TileImage } from '../tile';

interface TileButtonProps {
  tile?: TileOrBack | undefined;
  dim?: boolean | undefined;
  disabled?: boolean | undefined;
  focusIndicator?: boolean | undefined;
  tsumoIndicator?: boolean | undefined;
  overlayText?: string | undefined;
  onClick?: (() => void) | undefined;
}

export const TileButton: FC<TileButtonProps> = ({
  tile,
  dim = false,
  disabled = false,
  focusIndicator = false,
  tsumoIndicator = false,
  overlayText = '',
  onClick
}) => {
  const [
    {
      appConfig: { theme }
    }
  ] = useStore();
  const systemColor = usePrefersColorScheme();
  const appColor = theme === 'auto' ? systemColor : theme;

  return (
    <button
      type="button"
      disabled={disabled}
      className="relative flex w-full drop-shadow transition focus:drop-shadow-md disabled:cursor-not-allowed disabled:focus:drop-shadow"
      onClick={onClick}
    >
      <TileImage
        tile={tile ?? { type: 'z', n: 5 }}
        color={
          typeof tile === 'undefined'
            ? appColor === 'light'
              ? 'dark'
              : 'light'
            : void 0
        }
        dim={dim || disabled}
      />
      {focusIndicator && (
        <div className="absolute inset-x-0 -bottom-1 animate-pulse border-b-2 border-blue-500" />
      )}
      {tsumoIndicator && (
        <div className="absolute -top-1.5 flex w-full items-center justify-center">
          <div className="h-1 w-1 rounded-full bg-blue-500" />
        </div>
      )}
      {overlayText.length > 0 && (
        <div className="absolute inset-0 flex h-full w-full select-none items-center justify-center">
          <div className="rounded bg-white px-1 font-bold leading-none text-blue-500">
            {overlayText}
          </div>
        </div>
      )}
    </button>
  );
};
