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
    </button>
  );
};
