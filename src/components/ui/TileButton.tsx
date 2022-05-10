import React, { type FC } from 'react';
import { useStore } from '../../contexts/store';
import { usePrefersColorScheme } from '../../hooks/dom';
import { Tile as TileImage } from '../tile';
import type { TileOrBack } from '../../lib/tile';

interface TileButtonProps {
  tile?: TileOrBack;
  dim?: boolean;
  disabled?: boolean;
  focusIndicator?: boolean;
  tsumoIndicator?: boolean;
  onClick?: () => void;
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
      className="relative flex w-full drop-shadow focus:drop-shadow-md disabled:focus:drop-shadow disabled:cursor-not-allowed transition"
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
        <div className="absolute flex justify-center items-center -top-1.5 w-full">
          <div className="bg-blue-500 rounded-full w-1 h-1" />
        </div>
      )}
    </button>
  );
};
