export const BEM = (block: string) => (
  element?: string | undefined,
  modifier?: string | undefined
): string => {
  let className = block;
  if (typeof element === 'string') className += `__${element}`;
  if (typeof modifier === 'string') className += `--${modifier}`;
  return className;
};
