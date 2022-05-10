export const yakuNames = [
  'riichi',
  'ippatsu',
  'tsumo',
  'tanyao',
  'pinfu',
  'iipeko',
  'field-wind',
  'seat-wind',
  'white',
  'green',
  'red',
  'rinshan',
  'chankan',
  'haitei',
  'hotei',
  'sanshoku-dojun',
  'sanshoku-doko',
  'ittsu',
  'chanta',
  'chitoitsu',
  'toitoi',
  'sananko',
  'honroto',
  'sankantsu',
  'shosangen',
  'double-riichi',
  'honitsu',
  'junchan',
  'ryampeko',
  'chinitsu',
  'dora',
  'red-dora'
] as const;

export interface NormalYaku {
  type: 'yaku';
  name: typeof yakuNames[number];
  han: number;
}

export const yakumanNames = [
  'kokushi',
  'kokushi-13',
  'suanko',
  'suanko-tanki',
  'daisangen',
  'tsuiso',
  'shosushi',
  'daisushi',
  'ryuiso',
  'chinroto',
  'sukantsu',
  'churen',
  'pure-churen',
  'tenho',
  'chiho'
] as const;

export interface Yakuman {
  type: 'yakuman';
  name: typeof yakumanNames[number];
  point: number;
}

export type Yaku = NormalYaku | Yakuman;
