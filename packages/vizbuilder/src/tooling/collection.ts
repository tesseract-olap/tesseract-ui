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
 * Iterates over the values of a hashmap object, takes only the actives, and
 * returns an array with the transformation results.
 */
export function mapActives<T extends {active: boolean, key: string}, U>(
  dict: Record<string, T>,
  mapFn: (item: T, index: number, list: T[]) => U
): U[] {
  return Object.values(dict).filter(item => item.active).map(mapFn);
}
