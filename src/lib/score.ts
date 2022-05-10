const calculateRawBasePoint = (fu: number, han: number) => fu * 2 ** (2 + han);

export const calculateBasePoint = (
  fu: number,
  han: number,
  roundedMangan: boolean,
  accumlatedYakuman: boolean
) => {
  const bp = calculateRawBasePoint(fu === 25 ? 25 : ceil10(fu), han);
  return accumlatedYakuman && han >= 13
    ? 8000
    : han >= 11
    ? 6000
    : han >= 8
    ? 4000
    : han >= 6
    ? 3000
    : han >= 5 || bp >= (roundedMangan ? 1920 : 2000)
    ? 2000
    : bp;
};

const ceil = (r: number) => (n: number) => Math.ceil(n / r) * r;

export const ceil10 = ceil(10);
export const ceil100 = ceil(100);

const tuples = [
  '',
  'double-',
  'triple-',
  'quadruple-',
  'quintuple-',
  'sextuple-',
  'septuple-',
  'octuple-',
  'nonuple-',
  'decuple-'
];
export const yakumanTupleKey = (n: number): string =>
  n <= 10 ? `result.${tuples[n - 1]}yakuman` : 'result.more-yakuman';
