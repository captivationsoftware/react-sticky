export function copy(dest, source) {
  for (var rule in source) {
    dest[rule] = source[rule];
  };
  return dest;
}
