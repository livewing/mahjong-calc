export const isApple = /Macintosh|iPhone|iPad/i.test(navigator.userAgent);
export const formatKeys = (keys: string, appleKeys = keys) =>
  isApple
    ? appleKeys
        .replace('Shift', '⇧')
        .replace('Cmd', '⌘')
        .replace('Backspace', '⌫')
        .replace('+', '')
    : keys;
