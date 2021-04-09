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

/**
 * @param {TessExpl.Struct.GrowthItem} growth
 */
export function summaryGrowth(growth) {
  return {
    level: abbreviateFullName(growth.level),
    measure: growth.measure
  };
}

/**
 * @param {TessExpl.Struct.RcaItem} rca
 */
export function summaryRca(rca) {
  return {
    level1: abbreviateFullName(rca.level1),
    level2: abbreviateFullName(rca.level2),
    measure: rca.measure
  };
}

/**
 * @param {TessExpl.Struct.TopkItem} topk
 */
export function summaryTopk(topk) {
  return {
    amount: topk.amount,
    level: abbreviateFullName(topk.level),
    measure: topk.measure,
    order: topk.order
  };
}
