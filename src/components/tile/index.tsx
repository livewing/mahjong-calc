import type { FC } from 'react';
import { useStore } from '../../contexts/store';
import { usePrefersColorScheme } from '../../hooks/dom';
import type { TileOrBack } from '../../lib/tile';
import Back from './images/back.svg?react';
import { tileImage as darkTileImage } from './images/dark';
import DarkBG from './images/dark/bg.svg?react';
import { tileImage as lightTileImage } from './images/light';
import LightBG from './images/light/bg.svg?react';

interface TileProps {
  tile: TileOrBack;
  color?: 'light' | 'dark' | undefined;
  dim?: boolean | undefined;
}

export const Tile: FC<TileProps> = ({ tile, color, dim = false }) => {
  const [
    {
      appConfig: { theme, tileColor: tileConfigColor }
    }
  ] = useStore();
  const systemColor = usePrefersColorScheme();
  const appColor = theme === 'auto' ? systemColor : theme;
  const tileColor =
    color ??
    (tileConfigColor === 'light' || tileConfigColor === 'dark'
      ? tileConfigColor
      : tileConfigColor === 'auto'
        ? appColor
        : appColor === 'light'
          ? 'dark'
          : 'light');

  const Background =
    tile.type === 'back' ? Back : tileColor === 'light' ? LightBG : DarkBG;
  const TileImage =
    tile.type === 'back'
      ? null
      : tileColor === 'light'
        ? lightTileImage(tile)
        : darkTileImage(tile);
  return (
    <div
      className={
        dim
          ? 'relative flex-1 opacity-50 transition'
          : 'relative flex-1 transition'
      }
    >
      <Background />
      {TileImage !== null && (
        <TileImage className="absolute inset-0 scale-90" />
      )}
    </div>
  );
};
