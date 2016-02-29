import { Children } from 'react';
import Sticky from './sticky';

export function copy(dest, source) {
  for (var rule in source) {
    dest[rule] = source[rule];
  };
  return dest;
}

export function findStickies(children) {
  let found = [];
  children.forEach((child) => {
    if (child.type === Sticky) found.push(child);
  });
  return found;
}
