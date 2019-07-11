const defaultIndexOf = (haystack, needle) => haystack.indexOf(needle);
export const findByProperty = property => (haystack, needle) =>
  haystack.findIndex(item => item[property] === needle[property]);

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

export function replaceFromArray(haystack, needle, finder = defaultIndexOf) {
  const index = finder(haystack, needle);
  const haystackClone = haystack.slice();
  if (index > -1) {
    haystackClone[index] = needle;
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
