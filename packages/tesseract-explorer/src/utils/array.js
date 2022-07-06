/**
 * Ensures the returned value is always an array.
 * @template T
 * @param {T | T[] | undefined | null} [value]
 * @returns {T[]}
 */
export function ensureArray(value) {
  /** @type {T[]} */ const target = [];
  return target.concat(value).filter(item => item != null);
}

/**
 * @template T
 * @template U
 * @param {T[]} items
 * @param {(item: T, index: number, array: T[]) => U | null} callback
 * @returns {U[]}
 */
export function filterMap(items, callback) {
  /** @type {U[]} */ const output = [];
  for (let i = 0; i < items.length; i++) {
    const result = callback(items[i], i, items);
    result !== null && output.push(result);
  }
  return output;
}

/**
 * Adds `item` from array `list`.
 * @template T
 * @param {T[]} list
 * @param {T} item
 */
export function itemAdd(list, item) {
  return list.concat(item);
}

/**
 * Removes `item` from array `list`.
 * @template T
 * @param {T[]} list
 * @param {T} item
 */
export function itemRemove(list, item) {
  const index = list.indexOf(item);
  const newList = list.slice();
  newList.splice(index, 1);
  return newList;
}

/**
 * Adds or removes `item` from array `list`,
 * depending on if the item is already present.
 * @template T
 * @param {T[]} list
 * @param {T} item
 */
export function itemToggle(list, item) {
  return list.includes(item) ? itemRemove(list, item) : itemAdd(list, item);
}

/**
 * @template T
 * @param {T[] | Record<string, T>} items
 * @param {(value: T, key: string) => boolean} filter
 * @returns {IterableIterator<T>}
 */
export function itemIteratorFactory(items, filter) {
  const keys = Object.keys(items);

  let index = 0;
  const next = () => {
    let key, value;
    do {
      key = keys[index];
      value = items[key];
    } while (index++ < keys.length && !filter(value, key));
    return {done: key === undefined, value};
  };

  const iterator = {next, [Symbol.iterator]: () => iterator};
  return iterator;
}

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T} key
 * @param {boolean} descendent
 */
export function sortByKey(array, key, descendent = true) {
  if (!Array.isArray(array) || array.length < 2) return array;

  let sorterFunction;
  const firstItem = array[0];
  if (Number.isFinite(firstItem[key]) && !Number.isNaN(firstItem[key])) {
    sorterFunction = descendent ? (a, b) => b[key] - a[key] : (a, b) => a[key] - b[key];
  }
  else {
    sorterFunction = descendent
      ? (a, b) => `${b[key]}`.localeCompare(`${a[key]}`)
      : (a, b) => `${a[key]}`.localeCompare(`${b[key]}`);
  }
  return array.sort(sorterFunction);
}

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T} key
 * @param {boolean} descendent
 */
export function sortByDate(array, key, descendent = true) {
  if (!Array.isArray(array) || array.length < 2) return array;

  /** @type {(a: T, b: T) => number} */
  const sorterFunction = descendent
    ? (a, b) => Date.parse(b[key]) - Date.parse(a[key])
    : (a, b) => Date.parse(a[key]) - Date.parse(b[key]);
  return array.slice().sort(sorterFunction);
}

/**
 * @template T, U
 * @param {T} one
 * @param {U} two
 * @return {[T, U]}
 */
export function tuple(one, two) {
  return [one, two];
}

/**
 * @template T, U, V
 * @param {T} one
 * @param {U} two
 * @param {V} three
 * @returns {[T, U, V]}
 */
export function triad(one, two, three) {
  return [one, two, three];
}
