export interface TableConfig {
  round: 'east' | 'south' | 'west' | 'north';
  seat: 'east' | 'south' | 'west' | 'north';
  continue: number;
  deposit: number;
}

export interface HandConfig {
  dora: number;
  riichi: 'none' | 'riichi' | 'double-riichi';
  ippatsu: boolean;
  rinshan: boolean;
  chankan: boolean;
  last: boolean; // 海底 or 河底
  blessing: boolean; // 天和 or 地和
}

export interface RuleConfig {
  countedYakuman: boolean;
  multipleYakuman: boolean;
  roundUpMangan: boolean;
  doubleWindFu: 2 | 4;
  kokushi13DoubleYakuman: boolean;
  suankoTankiDoubleYakuman: boolean;
  daisushiDoubleYakuman: boolean;
  pureChurenDoubleYakuman: boolean;
}
