import {rollups} from "d3-array";

/**
 * @template T
 * @param {T[]} array
 * @param {keyof T | ((i: T) => string)} accesor
 * @param {Record<string, T[]>} target
 */
export function groupBy(array, accesor, target = {}) {
  const accesorFn = typeof accesor === "function" ? accesor : i => i[accesor];
  for (let value of array) {
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
  for (let value of array) {
    const key = accesorFn(value);
    target[key] = value;
  }
  return target;
}

/**
 * Transforms a level array descriptor into a level object descriptor
 * @param {string[]} arr
 * @returns {LevelRef}
 */
export function levelArrayToRef(arr) {
  return {dimension: arr[0], hierarchy: arr[1], level: arr[2]};
}

/**
 * Transforms a level object descriptor into a level array descriptor
 * @param {LevelDescriptor} ref
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
 *
 * @param {any[]} data
 * @param {string} cName Property on the columns side
 * @param {string} rName Property on the rows side
 * @param {string} vName Property with the value
 * @param {string} [colJoint=","] Joint character for the columns
 * @param {string} [rowJoint="\n"] Joint character for the columns
 */
export function pivotData(data, cName, rName, vName, colJoint = ",", rowJoint = "\n") {
  const quoteSafe = value => {
    const str = `${value}`.trim();
    return str.indexOf(colJoint) > -1 ? JSON.stringify(str) : str;
  };

  const groupedData = rollups(data, d => d[0][vName], d => d[cName], d => d[rName]);
  const headers = [rName].concat(groupedData.map(col => quoteSafe(col[0])));
  const values = groupedData.map(col => col[1].map(row => quoteSafe(row[1])));
  const rows = groupedData[0][1].map((row, rowIndex) =>
    [quoteSafe(row[0])].concat(values.map(col => col[rowIndex])).join(colJoint)
  );
  return [headers.join(colJoint)].concat(rows).join(rowJoint);
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
  } catch (e) {
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
 * @param {LevelDescriptor} ref
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
