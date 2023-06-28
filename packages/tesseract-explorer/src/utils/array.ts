import {parseNumeric} from "./string";

type MaybeArray<T> = T | T[];

/**
 * Ensures the returned value is always an array,
 * and discards `null` and `undefined` elements inside it.
 */
export function asArray<T>(value: MaybeArray<T | undefined | null>): T[] {
  const target: (T | null | undefined)[] = [];
  return target.concat(value).filter(item => item != null) as T[];
}

/**
 * Performs a Map operation on the items in the array,
 * and if the result of the map is `null`, discards it.
 */
export function filterMap<T, U>(
  items: T[],
  callback: (item: T, index: number, array: T[]) => U | null
): U[] {
  const output = [] as U[];
  for (let i = 0; i < items.length; i++) {
    const result = callback(items[i], i, items);
    result !== null && output.push(result);
  }
  return output;
}

/**
 * Adds `item` from array `list`.
 */
export function itemAdd<T>(list: T[], item: T) {
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
 * Sorts a list of objects by a string property in alphabetical order.
 */
export function sortByKey<K extends string, T extends {[P in K]: string}>(
  array: T[],
  key: K,
  descendent: boolean = true
) {
  if (!Array.isArray(array) || array.length < 2) return array;

  if (parseNumeric(array[0][key], false)) {
    return array
      .map(item => tuple(parseNumeric(item[key], 0), item))
      .sort(descendent ? (a, b) => b[0] - a[0] : (a, b) => a[0] - b[0])
      .map(item => item[1]);
  }

  return array.sort(descendent
    ? (a, b) => `${b[key]}`.localeCompare(`${a[key]}`)
    : (a, b) => `${a[key]}`.localeCompare(`${b[key]}`)
  );
}

/**
 * Sorts a list of objects by a string property that could be parsed as a Date.
 */
export function sortByDate<K extends string, T extends {[P in K]: string}>(
  array: T[],
  key: K,
  descendent: boolean = true
) {
  if (!Array.isArray(array) || array.length < 2) return array;

  const sorterFunction = descendent
    ? (a: T, b: T) => Date.parse(b[key]) - Date.parse(a[key])
    : (a: T, b: T) => Date.parse(a[key]) - Date.parse(b[key]);

  return array.slice().sort(sorterFunction);
}

/**
 * Builds an array typed as a tuple of 2 objects.
 */
export function tuple<T, U>(one: T, two: U): [T, U] {
  return [one, two];
}

/**
 * Builds an array typed as a tuple of 3 objects.
 */
export function triad<T, U, V>(one: T, two: U, three: V): [T, U, V] {
  return [one, two, three];
}
