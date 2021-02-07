export function product2<T, U>(a: T[], b: U[]): [T, U][] {
  return a
    .map(a => b.map(b => [a, b]))
    .reduce((acc, cur) => [...acc, ...cur], []) as [T, U][];
}
export function product3<T, U, V>(a: T[], b: U[], c: V[]): [T, U, V][] {
  return product2(a, product2(b, c)).map(([a, bc]) => [a, ...bc]);
}
