/**
 * @typedef {{dimension: string, hierarchy: string, level: string} | {dimension: string, hierarchy: string, name: string}} LevelDescriptor
 */

/**
 * Transforms a level array descriptor into a level object descriptor
 * @param {string[]} arr
 * @returns {{dimension: string, hierarchy: string, level: string}}
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
 * @param {string[]} nameParts
 * @returns {string}
 */
export function joinName(nameParts) {
  return nameParts.some(token => token.indexOf(".") > -1)
    ? nameParts.map(token => `[${token}]`).join(".")
    : nameParts.join(".");
}

/**
 * Parses a fullName into a descriptor
 * @param {string|string[]} name
 */
export function parseName(name) {
  if (typeof name === "string") {
    name = splitName(name);
  }
  return levelArrayToRef(name);
}

/**
 * Converts a descriptor into a fullName string
 * @param {LevelDescriptor} ref
 */
export function stringifyName(ref) {
  return joinName(levelRefToArray(ref));
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
