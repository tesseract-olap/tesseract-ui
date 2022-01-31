import {stringifyName} from "./transform";

/**
 * @param {any} prev
 * @param {any} next
 * @param {string[]} [keys]
 */
export function shallowEqualExceptFns(
  prev,
  next,
  keys = Object.keys({...prev, ...next})
) {
  // eslint-disable-next-line eqeqeq
  return keys.every(key => typeof prev[key] === "function" || prev[key] == next[key]);
}

/**
 * Returns a shallow equal function for use with React.memo, where the compared
 * properties are specified beforehand.
 * @template T
 * @param  {...keyof T} props
 * @returns {(prev: T, next: T) => boolean}
 */
export function shallowEqualForProps(...props) {
  return (prev, next) => props.every(key => prev[key] === next[key]);
}

/**
 * @param {any} str
 * @returns {str is number}
 */
export function isNumeric(str) {
  return isFinite(str) && !isNaN(str);
}

/**
 * @param {any} query
 * @returns {query is TessExpl.Struct.QueryParams}
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
 * List of conditions that make a Query valid.
 */
const validQueryConditions = [
  {
    condition: isQuery,
    error: "queries.error_not_query"
  },
  {
    condition: query => Object.values(query.measures).reduce(activeItemCounter, 0) > 0,
    error: "queries.error_no_measures"
  },
  {
    condition: query => Object.values(query.drilldowns).reduce(activeItemCounter, 0) > 0,
    error: "queries.error_no_drilldowns"
  }
];

/**
 * Validates whether the provided object is a valid Query object that can be used to make a request.
 * @param {any} query - query to validate
 * @returns {boolean}
 */
export function isValidQuery(query) {
  return validQueryConditions.every(queryCondition => queryCondition.condition(query));
}

/**
 * Validates whether the provided object is a valid Query object that can be used to make a request.
 * Also returns an error message of the first failed condition.
 * @param {any} query - query to validate
 * @returns {{isValid: boolean, error: undefined | string}}
 */
export function isValidQueryVerbose(query) {
  let error;
  const allConditionsPass = validQueryConditions.every(queryCondition => {
    const passed = queryCondition.condition(query);
    if (!passed) error = queryCondition.error;
    return passed;
  });
  return {isValid: allConditionsPass, error};
}

/** @param {TessExpl.Struct.CutItem} item */
export function isActiveCut(item) {
  return isActiveItem(item) && item.members.length > 0;
}

/** @param {{active: boolean}} item */
export function isActiveItem(item) {
  return item.active;
}

/**
 * @param {any} obj
 * @returns {obj is TessExpl.Struct.FilterItem}
 */
export function isFilterItem(obj) {
  return obj.measure && obj.comparison && isNumeric(obj.interprettedValue);
}

/**
 * @param {any} obj
 * @returns {obj is TessExpl.Struct.GrowthItem}
 */
export function isGrowthItem(obj) {
  return obj && obj.level && obj.measure;
}

/**
 * @param {any} obj
 * @returns {obj is TessExpl.Struct.RcaItem}
 */
export function isRcaItem(obj) {
  return obj && obj.level1 && obj.level2 && obj.level1 !== obj.level2 && obj.measure;
}

/**
 * @param {any} obj
 * @returns {obj is TessExpl.Struct.TopkItem}
 */
export function isTopkItem(obj) {
  return obj && obj.amount > 0 && obj.level && obj.measure;
}

/**
 * @type {(sum: number, item: TessExpl.Struct.IQueryItem) => number}
 * @returns {number}
 */
export function activeItemCounter(sum, item) {
  return sum + (isActiveItem(item) ? 1 : 0);
}

/**
 * @param {TessExpl.Struct.QueryParams} query
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
 * @param {TessExpl.Struct.QueryParams} query
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
 * @param {TessExpl.Struct.QueryParams} query
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
