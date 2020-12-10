/**
 * Converts an array of tidy data into a pivotted table.
 * Outputs a CSV-like string.
 * @param {any[]} data
 * @param {string} cName Property on the columns side
 * @param {string} rName Property on the rows side
 * @param {string} vName Property with the value
 * @param {string} [colJoint=","] Joint character for the columns
 * @param {string} [rowJoint="\n"] Joint character for the columns
 */
export function csvSerialize(
  data,
  cName,
  rName,
  vName,
  colJoint = ",",
  rowJoint = "\n"
) {
  const quoteSafe = value => {
    const str = `${value}`.trim();
    return str.indexOf(colJoint) > -1 ? JSON.stringify(str) : str;
  };

  /** @type {Map<string, Map<string, number>>} */
  const groupedData = regroup(
    data,
    group => sumBy(group, vName),
    d => d[cName],
    d => d[rName]
  );

  // Array of the members in the column axis
  const headers = Array.from(groupedData.keys(), quoteSafe);

  // Array of numeric arrays. Outer array represents columns, inners represent rows. [||||]
  // TODO: Currently just converted to string, should use value formatter.
  const values = Array.from(groupedData.values(), col =>
    Array.from(col.values(), quoteSafe)
  );

  // Array of rows; first item is member in row axis, followed by each value for that row.
  const rows = Array.from([...groupedData.values()][0], (row, rowIndex) =>
    [row[0], ...values.map(col => col[rowIndex])]
      .map(quoteSafe)
      .join(colJoint)
  );

  return [[rName, ...headers].join(colJoint), ...rows].join(rowJoint);
}

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T | ((i: T) => string)} accesor
 * @param {Record<string, T[]>} target
 */
export function groupBy(array, accesor, target = {}) {
  const accesorFn = typeof accesor === "function" ? accesor : i => i[accesor];
  for (const value of array) {
    const key = accesorFn(value);
    if (target.hasOwnProperty(key)) {
      target[key].push(value);
    }
    else {
      target[key] = [value];
    }
  }
  return target;
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
  for (const value of array) {
    const key = accesorFn(value);
    target[key] = value;
  }
  return target;
}

/**
 * Transforms a level array descriptor into a level object descriptor
 * @param {string[]} arr
 * @returns {TessExpl.Struct.LevelRef}
 */
export function levelArrayToRef(arr) {
  return {dimension: arr[0], hierarchy: arr[1], level: arr[2]};
}

/**
 * Transforms a level object descriptor into a level array descriptor
 * @param {TessExpl.Struct.LevelDescriptor} ref
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
 * @template T
 * @template U
 * @param {T[]} values
 * @param {(group: T[]) => U} reduce
 * @param {(data: T) => string} keyGetter
 * @param  {...(data: T) => string} keys
 * @returns {Map<string, U> | Map<string, Map<string, U>>}
 */
export function regroup(values, reduce, keyGetter, ...keys) {
  const groups = new Map();
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const key = keyGetter(value);
    const group = groups.get(key);
    group ? group.push(value) : groups.set(key, [value]);
  }
  const iter = groups.entries();
  for (let item = iter.next(); !item.done; item = iter.next()) {
    const group = item.value;
    const value = keys.length === 0
      ? reduce(group[1])
      : regroup(group[1], reduce, ...keys);
    groups.set(group[0], value);
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
 * @param {TessExpl.Struct.LevelDescriptor} ref
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
  const accesorFn = typeof accesor === "function" ? accesor : i => i[accesor];
  return data.reduce((sum, i) => sum + accesorFn(i), 0);
}
