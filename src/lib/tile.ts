export interface NumberTile {
  type: 'character' | 'dots' | 'bamboo';
  number: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}
export interface WindTile {
  type: 'east' | 'south' | 'west' | 'north';
}
export interface DragonTile {
  type: 'white' | 'green' | 'red';
}
export interface BackTile {
  type: 'back';
}
export type Tile = NumberTile | WindTile | DragonTile;
export type TileOrBack = Tile | BackTile;

export type NumberTileString = `${NumberTile['number']}${'m' | 'p' | 's'}`;
export type WindTileString = `${1 | 2 | 3 | 4}z`;
export type DragonTileString = `${5 | 6 | 7}z`;
export type TileString = NumberTileString | WindTileString | DragonTileString;

export const tile_to_string = (tile: Tile): TileString => {
  switch (tile.type) {
    case 'character':
      return `${tile.number}m` as NumberTileString;
    case 'dots':
      return `${tile.number}p` as NumberTileString;
    case 'bamboo':
      return `${tile.number}s` as NumberTileString;
    case 'east':
      return '1z';
    case 'south':
      return '2z';
    case 'west':
      return '3z';
    case 'north':
      return '4z';
    case 'white':
      return '5z';
    case 'green':
      return '6z';
    case 'red':
      return '7z';
  }
};

export const string_to_tile = (str: TileString): Tile => {
  const number = parseInt(str[0]) as NumberTile['number'];
  const alpha = str[1];

  if (alpha === 'm') {
    return { type: 'character', number };
  } else if (alpha === 'p') {
    return { type: 'dots', number };
  } else if (alpha === 's') {
    return { type: 'bamboo', number };
  } else if (alpha === 'z') {
    switch (number) {
      case 1:
        return { type: 'east' };
      case 2:
        return { type: 'south' };
      case 3:
        return { type: 'west' };
      case 4:
        return { type: 'north' };
      case 5:
        return { type: 'white' };
      case 6:
        return { type: 'green' };
      case 7:
        return { type: 'red' };
    }
  }

  throw new Error();
};

export const tile_equals = (left: Tile, right: Tile): boolean =>
  compare_tile(left, right) === 0;

type TileCount = Partial<{ [_ in TileString]: number }>;
export const count_tiles = (tiles: Tile[]): TileCount => {
  const d: TileCount = {};
  for (const t of tiles) {
    const s = tile_to_string(t);
    if (typeof d[s] === 'undefined') {
      d[s] = 1;
    } else if (typeof d[s] === 'number') {
      (d[s] as number) += 1;
    }
  }
  return d;
};

export const compare_tile = (a: Tile, b: Tile): -1 | 0 | 1 => {
  const sa = tile_to_string(a);
  const sb = tile_to_string(b);
  const rsa = `${sa[1]}${sa[0]}`;
  const rsb = `${sb[1]}${sb[0]}`;
  if (rsa < rsb) return -1;
  else if (rsa > rsb) return 1;
  return 0;
};

export const compare_tiles = (a: Tile[], b: Tile[]): -1 | 0 | 1 => {
  if (a.length < b.length) {
    return -1;
  } else if (a.length > b.length) {
    return 1;
  }

  for (let i = 0; i < a.length; i++) {
    const r = compare_tile(a[i], b[i]);
    if (r !== 0) {
      return r;
    }
  }
  return 0;
};

export const is_tile = (tile: unknown): tile is Tile => {
  if (typeof tile !== 'object') return false;
  if (tile === null) return false;
  const t = tile as Tile;
  if (!('type' in t) || typeof t.type !== 'string') return false;
  if (
    t.type === 'east' ||
    t.type === 'south' ||
    t.type === 'west' ||
    t.type === 'north' ||
    t.type === 'white' ||
    t.type === 'green' ||
    t.type === 'red'
  )
    return true;

  if (t.type === 'character' || t.type === 'dots' || t.type === 'bamboo') {
    if (!('number' in t) || typeof t.number !== 'number') return false;
    if (Number.isInteger(t.number) && t.number >= 1 && t.number <= 9)
      return true;
  }

  return false;
};

export const is_wind_tile = (tile: Tile): tile is WindTile =>
  tile.type === 'east' ||
  tile.type === 'south' ||
  tile.type === 'west' ||
  tile.type === 'north';

export const is_dragon_tile = (tile: Tile): tile is DragonTile =>
  tile.type === 'white' || tile.type === 'green' || tile.type === 'red';

export const is_honor_tile = (tile: Tile): tile is WindTile | DragonTile =>
  is_wind_tile(tile) || is_dragon_tile(tile);

export const is_roto_tile = (tile: Tile): boolean =>
  !is_honor_tile(tile) && (tile.number === 1 || tile.number === 9);

export const is_tanyao_tile = (tile: Tile): boolean =>
  !is_honor_tile(tile) && !is_roto_tile(tile);

export const is_honitsu = (tiles: Tile[]): boolean => {
  const c = tiles.filter(t => t.type === 'character').length;
  const d = tiles.filter(t => t.type === 'dots').length;
  const b = tiles.filter(t => t.type === 'bamboo').length;
  const h = tiles.filter(is_honor_tile).length;
  return (
    h > 0 &&
    ((c > 0 && d === 0 && b === 0) ||
      (c === 0 && d > 0 && b === 0) ||
      (c === 0 && d === 0 && b > 0))
  );
};

export const is_chinitsu = (tiles: Tile[]): NumberTile['type'] | undefined => {
  for (const type of ['character', 'dots', 'bamboo'] as const) {
    if (tiles.every(t => t.type === type)) return type;
  }
  return void 0;
};
