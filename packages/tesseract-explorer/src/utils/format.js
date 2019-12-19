import pluralize from "pluralize";
import {splitName} from "./transform";
import {validGrowthState, validRcaState, validTopkState} from "./validation";

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
 * @param {GrowthItem} growth
 * @returns {string}
 */
export function summaryGrowth(growth) {
  if (!validGrowthState(growth)) return "";
  const measureName = growth.measure;
  const levelName = abbreviateFullName(growth.level);
  return `Growth of ${measureName} by ${levelName}`;
}

/**
 * @param {RcaItem} rca
 * @returns {string}
 */
export function summaryRca(rca) {
  if (!validRcaState(rca)) return "";
  const measureName = rca.measure;
  const level1Name = abbreviateFullName(rca.level1);
  const level2Name = abbreviateFullName(rca.level2);
  return `RCA for ${level1Name} on ${measureName} by ${level2Name}`;
}

/**
 * @param {TopkItem} topk
 * @returns {string}
 */
export function summaryTopk(topk) {
  if (!validTopkState(topk)) return "";
  const measureName = pluralize(topk.measure, topk.amount);
  const levelName = abbreviateFullName(topk.level);
  return `Top ${topk.amount} ${measureName} by ${levelName} (${topk.order})`;
}
