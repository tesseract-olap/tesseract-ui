import {splitName} from "./transform";
import {isFilterItem} from "./validation";

/**
 * Simplifies a fullname for UI display.
 * The returned value mustn't be used as identifier, as is not reversable.
 * @param {string | string[]} nameParts
 * @param {string} joint
 */
export function abbreviateFullName(nameParts, joint = "/") {
  if (!nameParts) {
    return "";
  }

  if (typeof nameParts === "string") {
    nameParts = splitName(nameParts);
  }

  const target = [];
  let n = nameParts.length;
  while (n--) {
    const token = nameParts[n];
    if (target.indexOf(token) === -1) {
      target.unshift(token);
    }
  }

  return target.join(joint);
}

/**
 * @param {TessExpl.Struct.FilterItem} filter
 * @returns {string}
 */
export function summaryFilter(filter) {
  if (!isFilterItem(filter)) return "";
  return `${filter.measure} ${filter.comparison} ${filter.interpretedValue}`;
}
