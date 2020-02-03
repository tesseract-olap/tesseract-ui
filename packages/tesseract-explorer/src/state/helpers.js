/**
 * Creates a shallow copy of the `target` object, and removes its `key` property.
 * @template T
 * @param {T} records
 * @param {keyof T} key
 */
export function omitRecord(records, key) {
  const clone = {...records};
  delete clone[key];
  return clone;
}

/**
 * Creates a shallow copy of the `target` object, and removes its `key` property.
 * @template {IQueryItem} T
 * @param {Record<string, T>} records
 * @param {T} item
 */
export function oneRecordActive(records, item) {
  /** @type {typeof records} */
  const clone = {};
  Object.values(records).forEach(item => {
    clone[item.key] = {...item, active: false};
  });
  clone[item.key] = item;
  return clone;
}

/**
 * @template T
 * @type {(map: Record<string, T>) => string[]}
 */
export function getKeys(map) {
  return Object.keys(map);
}
/**
 * @template T
 * @type {(map: Record<string, T>) => T[]}
 */
export function getValues(map) {
  return Object.values(map);
}
