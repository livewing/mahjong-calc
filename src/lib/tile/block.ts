import type {
  CharacterTileCountsIndex,
  NumberTileCountsIndex,
  TileCounts,
  TileCountsIndex
} from '.';

export interface Block {
  type: 'kotsu' | 'shuntsu' | 'ryammen' | 'penchan' | 'kanchan' | 'toitsu';
  tile: TileCountsIndex;
}

export interface NumberBlock {
  type: 'kotsu' | 'shuntsu' | 'ryammen' | 'penchan' | 'kanchan' | 'toitsu';
  tile: NumberTileCountsIndex;
}

export interface CharacterBlock {
  type: 'kotsu' | 'toitsu';
  tile: CharacterTileCountsIndex;
}

export const blockToTileCounts = (b: Block): TileCounts => {
  const empty = [...Array(34)];
  switch (b.type) {
    case 'kotsu':
      return empty.map((_, i) => (i === b.tile ? 3 : 0)) as TileCounts;
    case 'shuntsu':
      return empty.map((_, i) =>
        b.tile <= i && i < b.tile + 3 ? 1 : 0
      ) as TileCounts;
    case 'ryammen':
    case 'penchan':
      return empty.map((_, i) =>
        b.tile <= i && i < b.tile + 2 ? 1 : 0
      ) as TileCounts;
    case 'kanchan':
      return empty.map((_, i) =>
        b.tile === i || b.tile + 2 === i ? 1 : 0
      ) as TileCounts;
    case 'toitsu':
      return empty.map((_, i) => (i === b.tile ? 2 : 0)) as TileCounts;
  }
};
