import {isActiveItem} from "./validation";

const defaultIndexOf = (haystack, needle) => haystack.indexOf(needle);

export const activeItemCounter = (sum, item) => sum + (isActiveItem(item) ? 1 : 0);

export function toggleFromArray(haystack, needle, finder = defaultIndexOf) {
  const index = finder(haystack, needle);
  const haystackClone = haystack.slice();
  if (index > -1) {
    haystackClone.splice(index, 1);
  }
  else {
    haystackClone.push(needle);
  }
  return haystackClone;
}

export function removeFromArray(haystack, needle, finder = defaultIndexOf) {
  const index = finder(haystack, needle);
  const haystackClone = haystack.slice();
  if (index > -1) {
    haystackClone.splice(index, 1);
  }
  return haystackClone;
}
