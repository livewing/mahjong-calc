import React from 'react';
import type { FC } from 'react';
import { tile_to_string } from '../../lib/tile';
import type { TileOrBack, TileString } from '../../lib/tile';

import tile1m from './1m.png';
import tile2m from './2m.png';
import tile3m from './3m.png';
import tile4m from './4m.png';
import tile5m from './5m.png';
import tile6m from './6m.png';
import tile7m from './7m.png';
import tile8m from './8m.png';
import tile9m from './9m.png';

import tile1p from './1p.png';
import tile2p from './2p.png';
import tile3p from './3p.png';
import tile4p from './4p.png';
import tile5p from './5p.png';
import tile6p from './6p.png';
import tile7p from './7p.png';
import tile8p from './8p.png';
import tile9p from './9p.png';

import tile1s from './1s.png';
import tile2s from './2s.png';
import tile3s from './3s.png';
import tile4s from './4s.png';
import tile5s from './5s.png';
import tile6s from './6s.png';
import tile7s from './7s.png';
import tile8s from './8s.png';
import tile9s from './9s.png';

import tile1z from './1z.png';
import tile2z from './2z.png';
import tile3z from './3z.png';
import tile4z from './4z.png';
import tile5z from './5z.png';
import tile6z from './6z.png';
import tile7z from './7z.png';

import tileBack from './back.png';

interface TileImageProps {
  tile: TileOrBack;
}

const table: { [P in TileString]: string } = {
  '1m': tile1m,
  '2m': tile2m,
  '3m': tile3m,
  '4m': tile4m,
  '5m': tile5m,
  '6m': tile6m,
  '7m': tile7m,
  '8m': tile8m,
  '9m': tile9m,
  '1p': tile1p,
  '2p': tile2p,
  '3p': tile3p,
  '4p': tile4p,
  '5p': tile5p,
  '6p': tile6p,
  '7p': tile7p,
  '8p': tile8p,
  '9p': tile9p,
  '1s': tile1s,
  '2s': tile2s,
  '3s': tile3s,
  '4s': tile4s,
  '5s': tile5s,
  '6s': tile6s,
  '7s': tile7s,
  '8s': tile8s,
  '9s': tile9s,
  '1z': tile1z,
  '2z': tile2z,
  '3z': tile3z,
  '4z': tile4z,
  '5z': tile5z,
  '6z': tile6z,
  '7z': tile7z
};

export const TileImage: FC<TileImageProps> = ({ tile }) => {
  if (tile.type === 'back') return <img src={tileBack} alt="back" />;
  const s = tile_to_string(tile);
  return <img src={table[s]} alt={s} />;
};
