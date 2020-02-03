import {stringifyName} from "./transform";

export function shallowEqualExceptFns(
  prev,
  next,
  keys = Object.keys({...prev, ...next})
) {
  return keys.every(key => typeof prev[key] === "function" || prev[key] == next[key]);
}

export function isNumeric(str) {
  return isFinite(str) && !isNaN(str);
}

/**
 * @param {any} query
 * @returns {query is QueryParams}
 */
export function isQuery(query) {
  return (
    typeof query === "object" &&
    query !== null &&
    typeof query.cube === "string" &&
    query.cube.length > 0 &&
    typeof query.drilldowns === "object" &&
    query.drilldowns !== null &&
    typeof query.measures === "object" &&
    query.measures !== null
  );
}

/**
 * @param {any} query
 * @returns {query is QueryParams}
 */
export function isValidQuery(query) {
  return (
    isQuery(query) &&
    Object.values(query.drilldowns).reduce(activeItemCounter, 0) > 0 &&
    Object.values(query.measures).reduce(activeItemCounter, 0) > 0
  );
}

/** @param {CutItem} item */
export function isActiveCut(item) {
  return isActiveItem(item) && item.members.some(isActiveItem);
}

/** @param {{active: boolean}} item */
export function isActiveItem(item) {
  return item.active;
}

/**
 * @param {any} obj
 * @returns {obj is GrowthItem}
 */
export function isGrowthItem(obj) {
  return obj && obj.level && obj.measure;
}

/**
 * @param {any} obj
 * @returns {obj is RcaItem}
 */
export function isRcaItem(obj) {
  return obj && obj.level1 && obj.level2 && obj.level1 !== obj.level2 && obj.measure;
}

/**
 * @param {any} obj
 * @returns {obj is TopkItem}
 */
export function isTopkItem(obj) {
  return obj && obj.amount > 0 && obj.level && obj.measure;
}

/**
 * @type {(sum: number, item: IQueryItem) => number}
 * @returns {number}
 */
export function activeItemCounter(sum, item) {
  return sum + (isActiveItem(item) ? 1 : 0);
}

// TODO
export function deepQueryValidation(query) {}

/**
 * @param {QueryParams} query
 */
export function checkDrilldowns(query) {
  const drilldowns = Object.values(query.drilldowns);
  const issues = new Set();

  const dimensions = new Set();
  for (let i = 0; i < drilldowns.length; i++) {
    const item = drilldowns[i];
    if (isActiveItem(item)) {
      if (dimensions.has(item.dimension)) {
        issues.add("Only one drilldown per dimension allowed.");
      }
      dimensions.add(item.dimension);
    }
  }

  if (dimensions.size === 0) {
    issues.add("The query needs at least one drilldown.");
  }

  return Array.from(issues);
}

/**
 * @param {QueryParams} query
 */
export function checkMeasures(query) {
  const measures = Object.values(query.measures);
  const issues = [];

  if (measures.length === 0) return issues;

  const activeMeasures = measures.reduce(activeItemCounter, 0);
  if (activeMeasures === 0) {
    issues.push("At least one measure must be selected.");
  }

  return issues;
}

/**
 * @param {QueryParams} query
 */
export function checkCuts(query) {
  const cuts = Object.values(query.cuts);
  const issues = [];

  const levels = new Set();
  for (let i = 0; i < cuts.length; i++) {
    const item = cuts[i];
    if (item.active) {
      const fullName = stringifyName(item);
      if (levels.has(fullName)) {
        issues.push(`Only one cut per level allowed: ${fullName}`);
      }
      levels.add(fullName);
    }
  }

  return issues;
}
