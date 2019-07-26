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

/**
 * @template T
 * @param {T[]} array
 * @param {string} key
 * @param {boolean} descendent
 */
export function sortByKey(array, key, descendent = true) {
  if (!Array.isArray(array) || array.length < 2) {
    return array;
  }

  let sorterFunction;
  const firstItem = array[0];
  if (isFinite(firstItem[key]) && !isNaN(firstItem[key])) {
    sorterFunction = descendent ? (a, b) => b[key] - a[key] : (a, b) => a[key] - b[key];
  }
  else {
    sorterFunction = descendent
      ? (a, b) => `${b[key]}`.localeCompare(`${a[key]}`)
      : (a, b) => `${a[key]}`.localeCompare(`${b[key]}`);
  }
  return array.sort(sorterFunction);
}
