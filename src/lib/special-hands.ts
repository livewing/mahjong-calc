import type { LegalHand } from './hand';
import { count_tiles } from './tile';

export const kokushi_tile_string = [
  '1m',
  '9m',
  '1p',
  '9p',
  '1s',
  '9s',
  '1z',
  '2z',
  '3z',
  '4z',
  '5z',
  '6z',
  '7z'
] as const;

export const count_kokushi_shanten = (legal: LegalHand['legal']): number => {
  const counts = count_tiles(legal);

  const variant_count = kokushi_tile_string
    .map(s => typeof counts[s] !== 'undefined' && (counts[s] as number) >= 1)
    .reduce((acc, cur) => (acc += cur ? 1 : 0), 0);
  const has_toitsu = kokushi_tile_string.some(
    s => typeof counts[s] !== 'undefined' && (counts[s] as number) >= 2
  );

  return 13 - variant_count - (has_toitsu ? 1 : 0);
};

export const count_chitoitsu_shanten = (legal: LegalHand['legal']): number => {
  const counts = count_tiles(legal);
  const c = (Object.keys(counts) as (keyof typeof counts)[]).map(
    k => counts[k] || 0
  );

  return (
    6 -
    c.filter(n => n >= 2).length +
    (7 - Math.min(7, c.filter(n => n >= 1).length))
  );
};
