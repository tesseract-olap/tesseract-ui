export const isNumeric = str => isFinite(str) && !isNaN(str);

export const isQuery = query =>
  typeof query === "object" &&
  query !== null &&
  typeof query.cube === "string" &&
  query.cube.length > 0 &&
  Array.isArray(query.drilldowns) &&
  Array.isArray(query.measures);

/** @param {import("../reducers/queryReducer").QueryState} query */
export const isValidQuery = query =>
  isQuery(query) &&
  query.drilldowns.reduce(activeItemCounter, 0) > 0 &&
  query.measures.reduce(activeItemCounter, 0) > 0;

/** @param {import("../reducers").CutItem} item */
export const isActiveCut = item => isActiveItem(item) && item.members.some(isActiveItem);

/** @param {import("../reducers").QueryItem} item */
export const isActiveItem = item => item.active;

/** @param {import("../reducers").GrowthQueryState} growth */
export const validGrowthState = growth => growth.level && growth.measure;

/** @param {import("../reducers").RcaQueryState} rca */
export const validRcaState = rca => rca.level1 && rca.level2 && rca.measure;

/** @param {import("../reducers").TopkQueryState} topk */
export const validTopkState = topk => topk.amount > 0 && topk.level && topk.measure;

/** @type {(sum: number, item: import("../reducers").QueryItem) => number} */
export const activeItemCounter = (sum, item) => sum + (isActiveItem(item) ? 1 : 0);

// TODO
export function deepQueryValidation(query) {}

/** @param {import("../reducers/queryReducer").QueryState} query */
export function checkDrilldowns(query) {
  const drilldowns = query.drilldowns;
  const issues = new Set();

  const dimensions = new Set();
  for (let i = 0; i < drilldowns.length; i++) {
    const item = drilldowns[i];
    if (isActiveItem(item)) {
      const drillableNameParts = item.drillable.split(".");
      const dimName = drillableNameParts[0];
      if (dimensions.has(dimName)) {
        issues.add("Only one drilldown per dimension allowed.");
      }
      dimensions.add(dimName);
    }
  }

  if (drilldowns.length === 0 || dimensions.size === 0) {
    issues.add("The query needs at least one drilldown.");
  }

  return Array.from(issues);
}

/** @param {import("../reducers/queryReducer").QueryState} query */
export function checkMeasures(query) {
  const measures = query.measures;
  const issues = [];

  if (measures.length === 0) return issues;

  const activeMeasures = measures.reduce(activeItemCounter, 0);
  if (activeMeasures === 0) {
    issues.push("At least one measure must be selected.");
  }

  return issues;
}

/** @param {import("../reducers/queryReducer").QueryState} query */
export function checkCuts(query) {
  const cuts = query.cuts;
  const issues = [];

  const levels = new Set();
  for (let i = 0; i < cuts.length; i++) {
    const item = cuts[i];
    if (item.active) {
      const fullName = item.drillable;
      if (levels.has(fullName)) {
        issues.push(`Only one drilldown per level allowed: ${fullName}`);
      }
      levels.add(fullName);
    }
  }

  return issues;
}
