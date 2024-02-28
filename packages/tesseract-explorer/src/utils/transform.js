/**
 * @template T
 * @param {T} item
 */
export function identity(item) {
  return `${item}`;
}

/**
 * @template T, U
 * @param {keyof T | ((item: T) => U)} accesor
 * @returns {(item: T) => U}
 */
export function accesorFactory(accesor) {
  // @ts-ignore
  return typeof accesor === "function" ? accesor : i => i[accesor];
}

/**
 * Converts an array of tidy data into a pivotted table.
 * Outputs a CSV-like string.
 * @param {any[]} data
 * @param {string} cName Property on the columns side
 * @param {string} rName Property on the rows side
 * @param {string} vName Property with the value
 * @param {import("./types").Formatter | undefined} formatter A formatter function for the values
 * @param {string} [colJoint=","] Joint character for the columns
 * @param {string} [rowJoint="\n"] Joint character for the columns
 */
export function csvSerialize(
  data,
  cName,
  rName,
  vName,
  formatter = n => `${n}`,
  colJoint = ",",
  rowJoint = "\n"
) {
  const quoteSafe = value => {
    const str = `${value}`.trim();
    return str.includes(colJoint) ? JSON.stringify(str) : str;
  };

  // Array of the members in the column axis
  const cSortTable = sortingTableBy(data, cName);
  const cMembers = [...new Set(data.map(d => d[cName]))]
    .sort((a, b) => cSortTable.indexOf(a) - cSortTable.indexOf(b));

  // Array of the members in the row axis
  const rSortTable = sortingTableBy(data, rName);
  const rMembers = [...new Set(data.map(d => d[rName]))]
    .sort((a, b) => rSortTable.indexOf(a) - rSortTable.indexOf(b));

  /** @type {Map<string, Map<string, number>>} */
  const groupedData = regroup(
    data,
    group => sumBy(group, vName),
    d => d[cName],
    d => d[rName]
  );

  // Array of the members in the column axis
  const headers = Array.from(cMembers, quoteSafe);

  // Array of numeric arrays. Outer array represents columns, inners represent rows. [||||]
  const values = Array.from(cMembers, colName => {
    const col = groupedData.get(colName) || new Map([["", undefined]]);
    return Array.from(rMembers, rowName => {
      const value = col.get(rowName);
      return value != null ? formatter(value) : "";
    });
  });

  // Array of rows; first item is member in row axis, followed by each value for that row.
  const rows = Array.from(rMembers, (row, rowIndex) =>
    [row, ...values.map(col => col[rowIndex])]
      .map(quoteSafe)
      .join(colJoint)
  );

  return [[rName, ...headers].join(colJoint), ...rows].join(rowJoint);
}

/**
 * Groups the objects from an array in a Map where the key is determined by
 * an accesor function or a property of the object. The values of the Map are
 * always arrays with at least 1 object.
 * Returning `undefined` by the accesor ignores the object.
 * @template T
 * @param {T[]} array
 * @param {keyof T | ((i: T) => string | undefined | null)} accesor
 * @returns {Map<string, T[]>}
 */
export function groupBy(array, accesor) {
  const accesorFn = typeof accesor === "function" ? accesor : i => i[accesor];
  const groups = new Map();
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    const key = accesorFn(value);
    if (key == null) continue;
    const group = groups.get(key);
    group ? group.push(value) : groups.set(key, [value]);
  }
  return groups;
}

/**
 * @param {string[]} nameParts
 * @returns {string}
 */
export function joinName(nameParts) {
  return nameParts.some(token => token.indexOf(".") > -1)
    ? nameParts.map(token => `[${token}]`).join(".")
    : nameParts.join(".");
}

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T | ((i: T) => string)} accesor
 * @param {Record<string, T>} target
 */
export function keyBy(array, accesor, target = {}) {
  const accesorFn = typeof accesor === "function" ? accesor : i => i[accesor];
  for (let i = 0; i < array.length; i++) {
    const value = array[i];
    const key = accesorFn(value);
    target[key] = value;
  }
  return target;
}

/**
 * Transforms a level array descriptor into a level object descriptor
 * @param {string[]} arr
 * @returns {TessExpl.Struct.LevelDescriptor}
 */
export function levelArrayToRef(arr) {
  return {dimension: arr[0], hierarchy: arr[1], level: arr[2]};
}

/**
 * Transforms a level object descriptor into a level array descriptor
 * @param {TessExpl.Struct.LevelReference} ref
 * @returns {string[]}
 */
export function levelRefToArray(ref) {
  return [ref.dimension, ref.hierarchy, "level" in ref ? ref.level : ref.name];
}

/**
 * Parses a fullName into a descriptor
 * @param {string|string[]} name
 */
export function parseName(name) {
  if (typeof name === "string") {
    name = splitName(name);
  }
  if (name.length === 1) {
    name.unshift(name[0]);
  }
  if (name.length === 2) {
    name.unshift(name[0]);
  }
  return levelArrayToRef(name);
}

/**
 * @template U
 * @typedef {Map<string, U | NestedMap<U>>} NestedMap
 */

/**
 * @template T
 * @template U
 * @param {T[]} values
 * @param {(group: T[]) => U} reduce
 * @param  {...(keyof T | ((data: T) => string | undefined | null))} keyGetters
 * @returns {NestedMap<U>}
 */
export function regroup(values, reduce, ...keyGetters) {
  const groups = new Map();
  if (keyGetters.length > 0) {
    const [keyGetter, ...restGetters] = keyGetters;
    const iter = groupBy(values, keyGetter).entries();
    for (let item = iter.next(); !item.done; item = iter.next()) {
      const group = item.value;
      const value = restGetters.length === 0
        ? reduce(group[1])
        : regroup(group[1], reduce, ...restGetters);
      groups.set(group[0], value);
    }
  }
  return groups;
}

/**
 * Tries to build a RegExp object. If there's a problem when doing so,
 * tries again escaping the pattern before doing it.
 * @param {string} pattern
 * @param {string} [flags]
 */
export function safeRegExp(pattern, flags) {
  let regex;
  try {
    regex = new RegExp(pattern, flags);
  }
  catch (e) {
    pattern = pattern.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    regex = new RegExp(pattern, flags);
  }
  return regex;
}

/**
 * @template T
 * @param {T[]} data
 * @param {string} name
 * @returns {string[]}
 */
export function sortingTableBy(data, name) {
  const idName = [`ID ${name}`, `${name} ID`].find(key => key in data[0]) || name;
  const memberKeys = keyBy(data, d => d[idName]);
  return Object.values(memberKeys)
    .sort((a, b) => {
      const assumingNumeric = a[idName] - b[idName];
      return isNaN(assumingNumeric)
        ? `${a[idName]}`.localeCompare(`${b[idName]}`)
        : assumingNumeric;
    })
    .map(d => d[name]);
}

/**
 * @param {string} name
 * @returns {string[]}
 */
export function splitName(name) {
  const nameParts =
    name.indexOf("].[") > -1
      ? name.replace(/^\[|\]$/g, "").split("].[")
      : name.split(".");
  if (nameParts.length === 1) {
    nameParts.unshift(nameParts[0]);
  }
  if (nameParts.length === 2) {
    nameParts.unshift(nameParts[0]);
  }
  return nameParts;
}

/**
 * Converts a descriptor into a fullName string
 * @param {TessExpl.Struct.LevelReference} ref
 */
export function stringifyName(ref) {
  const nameParts = levelRefToArray(ref);
  if (nameParts[0] === nameParts[1]) {
    nameParts.splice(0, 1);
  }
  if (nameParts[0] === nameParts[1]) {
    nameParts.splice(0, 1);
  }
  return joinName(nameParts);
}

/**
 * @template T
 * @param {T[]} data
 * @param {keyof T | ((item: T) => number)} accesor
 * @returns {number}
 */
export function sumBy(data, accesor) {
  const accesorFn = accesorFactory(accesor);
  return data.reduce((sum, i) => sum + accesorFn(i), 0);
}
