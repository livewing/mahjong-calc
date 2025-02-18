import type { Tile } from '../../../../lib/tile';
import { unreachable } from '../../../../lib/util';
import m0 from './0m.svg?react';
import p0 from './0p.svg?react';
import s0 from './0s.svg?react';
import m1 from './1m.svg?react';
import p1 from './1p.svg?react';
import s1 from './1s.svg?react';
import z1 from './1z.svg?react';
import m2 from './2m.svg?react';
import p2 from './2p.svg?react';
import s2 from './2s.svg?react';
import z2 from './2z.svg?react';
import m3 from './3m.svg?react';
import p3 from './3p.svg?react';
import s3 from './3s.svg?react';
import z3 from './3z.svg?react';
import m4 from './4m.svg?react';
import p4 from './4p.svg?react';
import s4 from './4s.svg?react';
import z4 from './4z.svg?react';
import m5 from './5m.svg?react';
import p5 from './5p.svg?react';
import s5 from './5s.svg?react';
import z5 from './5z.svg?react';
import m6 from './6m.svg?react';
import p6 from './6p.svg?react';
import s6 from './6s.svg?react';
import z6 from './6z.svg?react';
import m7 from './7m.svg?react';
import p7 from './7p.svg?react';
import s7 from './7s.svg?react';
import z7 from './7z.svg?react';
import m8 from './8m.svg?react';
import p8 from './8p.svg?react';
import s8 from './8s.svg?react';
import m9 from './9m.svg?react';
import p9 from './9p.svg?react';
import s9 from './9s.svg?react';

export const tileImage = (tile: Tile) => {
  switch (tile.type) {
    case 'm':
      switch (tile.n) {
        case 1:
          return m1;
        case 2:
          return m2;
        case 3:
          return m3;
        case 4:
          return m4;
        case 5:
          return tile.red ? m0 : m5;
        case 6:
          return m6;
        case 7:
          return m7;
        case 8:
          return m8;
        case 9:
          return m9;
        default:
          return unreachable();
      }
    case 'p':
      switch (tile.n) {
        case 1:
          return p1;
        case 2:
          return p2;
        case 3:
          return p3;
        case 4:
          return p4;
        case 5:
          return tile.red ? p0 : p5;
        case 6:
          return p6;
        case 7:
          return p7;
        case 8:
          return p8;
        case 9:
          return p9;
        default:
          return unreachable();
      }
    case 's':
      switch (tile.n) {
        case 1:
          return s1;
        case 2:
          return s2;
        case 3:
          return s3;
        case 4:
          return s4;
        case 5:
          return tile.red ? s0 : s5;
        case 6:
          return s6;
        case 7:
          return s7;
        case 8:
          return s8;
        case 9:
          return s9;
        default:
          return unreachable();
      }
    case 'z':
      switch (tile.n) {
        case 1:
          return z1;
        case 2:
          return z2;
        case 3:
          return z3;
        case 4:
          return z4;
        case 5:
          return z5;
        case 6:
          return z6;
        case 7:
          return z7;
      }
  }
};
