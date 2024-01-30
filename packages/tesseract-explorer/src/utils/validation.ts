import {filterMap} from "./array";
import {CutItem, FilterItem, QueryParams} from "./structs";
import {stringifyName} from "./transform";

/**
 * Void function
 */
export function noop() {}

/**
 * Checks if the provided string matches one of the options.
 */
export function isOneOf<T extends string>(str: any, options: T[]): str is T {
  return options.includes(str);
}

/**
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
 */
export function shallowEqualForProps<T extends {}>(...props: Array<keyof T>) {
  return (prev: T, next: T): boolean => props.every(key => prev[key] === next[key]);
}

/**
 */
export function isNumeric(str): str is number {
  return isFinite(str) && !isNaN(str);
}

/**
 */
export function isQuery(query): query is QueryParams {
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
const validQueryConditions = [{
  error: "queries.error_not_query",
  condition: isQuery as ((query: QueryParams) => boolean)
}, {
  error: "queries.error_no_measures",
  condition: (query: QueryParams) =>
    Object.values(query.measures).reduce(activeItemCounter, 0) > 0
}, {
  error: "queries.error_no_drilldowns",
  condition: (query: QueryParams) =>
    Object.values(query.drilldowns).reduce(activeItemCounter, 0) > 0
}, {
  error: "queries.error_one_hierarchy_per_dimension",
  condition: (query: QueryParams) => {
    const dimensions = new Map<string, string>();
    return Object.values(query.drilldowns).every(dd => {
      if (isActiveItem(dd)) {
        const hierarchy = dimensions.get(dd.dimension);
        dimensions.set(dd.dimension, dd.hierarchy);
        return !hierarchy || hierarchy === dd.hierarchy;
      }
      return true;
    });
  }
}, {
  error: "queries.error_one_cut_per_dimension",
  condition: (query: QueryParams) => {
    const levels = filterMap(Object.values(query.cuts), item =>
      isActiveItem(item) ? stringifyName(item) : null
    );
    const uniqueLevels = new Set(levels);
    return levels.length === uniqueLevels.size;
  }
}];

/**
 * Validates whether the provided object is a valid Query object
 * that can be used to make a request.
 */
export function isValidQuery(query): boolean {
  return validQueryConditions.every(queryCondition => queryCondition.condition(query));
}

/**
 * Validates whether the provided object is a valid Query object
 * that can be used to make a request.
 * Also returns an error message of the first failed condition.
 */
export function isValidQueryVerbose(query): {isValid: boolean, error: undefined | string} {
  let error;
  const allConditionsPass = validQueryConditions.every(queryCondition => {
    const passed = queryCondition.condition(query);
    if (!passed) error = queryCondition.error;
    return passed;
  });
  return {isValid: allConditionsPass, error};
}

/**
 * Checks if the provided CutItem will be applied
 * if the query that contains it is executed.
 */
export function isActiveCut(item: CutItem) {
  return isActiveItem(item) && item.members.length > 0;
}

/**
 * Checks if the provided QueryParamItem is active.
 */
export function isActiveItem(item: {active: boolean}) {
  return item.active;
}

/**
 */
export function isFilterItem(obj): obj is FilterItem {
  return obj.measure && obj.comparison && isNumeric(obj.interprettedValue);
}

/**
 */
export function activeItemCounter(sum: number, item: {active: boolean}): number {
  return sum + (isActiveItem(item) ? 1 : 0);
}
