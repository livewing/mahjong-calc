import { useStore } from '../../contexts/store';
import { usePrefersColorScheme } from '../../hooks/dom';
import { Tile as TileImage } from '../tile';
import type { TileOrBack } from '../../lib/tile';
import type { FC } from 'react';

interface TileButtonProps {
  tile?: TileOrBack | undefined;
  dim?: boolean | undefined;
  disabled?: boolean | undefined;
  focusIndicator?: boolean | undefined;
  tsumoIndicator?: boolean | undefined;
  onClick?: () => void | undefined;
}

export const TileButton: FC<TileButtonProps> = ({
  tile,
  dim = false,
  disabled = false,
  focusIndicator = false,
  tsumoIndicator = false,
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
      disabled={disabled}
      className="flex relative w-full drop-shadow focus:drop-shadow-md disabled:focus:drop-shadow transition disabled:cursor-not-allowed"
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
        <div className="absolute inset-x-0 -bottom-1 border-b-2 border-blue-500 animate-pulse" />
      )}
      {tsumoIndicator && (
        <div className="flex absolute -top-1.5 justify-center items-center w-full">
          <div className="w-1 h-1 bg-blue-500 rounded-full" />
        </div>
      )}
    </button>
  );
};
