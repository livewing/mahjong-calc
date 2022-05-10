export type Wind = 'east' | 'south' | 'west' | 'north';

export interface Table {
  round: Wind;
  seat: Wind;
  continue: number;
  deposit: number;
}
