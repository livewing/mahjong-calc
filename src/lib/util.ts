export const product2 = <T, U>(a: T[], b: U[]): [T, U][] => {
  return a
    .map(a => b.map(b => [a, b]))
    .reduce((acc, cur) => [...acc, ...cur], []) as [T, U][];
};

export const memoize = <P extends unknown[], R>(
  f: (...params: P) => R,
  serialize: (...params: P) => string
): ((...params: P) => R) => {
  const memo: { [key: string]: R } = {};
  return (...params: P) => {
    const serialized = serialize(...params);
    if (typeof memo[serialized] === 'undefined')
      memo[serialized] = f(...params);
    return memo[serialized];
  };
};

export const uniqueSorted = <T>(
  a: T[],
  compare: (a: T, b: T) => boolean
): T[] => {
  if (a.length === 0) return [];

  const [first, ...rest] = a;
  return rest.reduce(
    (acc, cur) => (compare(acc[acc.length - 1], cur) ? acc : [...acc, cur]),
    [first]
  );
};

export const groupBy = <T, U extends string | number>(
  a: T[],
  f: (e: T, i: number) => U | null
) =>
  a.reduce((acc, cur, i) => {
    const key = f(cur, i);
    if (key === null) return acc;
    return { ...acc, [key]: [...(acc[key] ?? []), cur] };
  }, {} as { [_ in U]?: T[] });

export const countBy = <T>(a: T[], f: (e: T, i: number) => boolean) =>
  a.reduce((acc, cur, i) => acc + (f(cur, i) ? 1 : 0), 0);

export const countGroupBy = <T, U extends string | number>(
  a: T[],
  f: (e: T, i: number) => U | null
) =>
  a.reduce((acc, cur, i) => {
    const key = f(cur, i);
    if (key === null) return acc;
    return { ...acc, [key]: (acc[key] ?? 0) + 1 };
  }, {} as { [_ in U]?: number });

export const sumBy = <T>(
  a: T[],
  f: (e: T, i: number) => number,
  initialValue = 0
) => a.reduce((acc, cur, i) => acc + f(cur, i), initialValue);

export const minsBy = <T>(a: T[], f: (e: T, i: number) => number) =>
  a.reduce(
    (acc, cur, i) => {
      const c = f(cur, i);
      if (c < acc[0]) return [c, [cur]] as [number, T[]];
      if (c === acc[0]) return [acc[0], [...acc[1], cur]] as [number, T[]];
      return acc;
    },
    [Number.POSITIVE_INFINITY, []] as [number, T[]]
  );

export const shuffle = <T>(a: T[]) => {
  const ret = [...a];
  for (let i = ret.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ret[i], ret[j]] = [ret[j], ret[i]];
  }
  return ret;
};
