import {activeItemCounter} from "./array";

export const isActiveCut = item => isActiveItem(item) && item.members.length > 0;
export const isActiveItem = item => item.active;

export const validGrowthState = growth => growth.level && growth.measure;
export const validRcaState = rca => rca.level1 && rca.level2 && rca.measure;
export const validTopState = top => top.amount > 0 && top.level && top.measure;

export function checkDrilldowns(query) {
  const drilldowns = query.drilldowns;
  const issues = new Set();

  if (drilldowns.length === 0) {
    issues.add("The query needs at least one drilldown.");
  }

  const dimensions = new Set();
  for (let i = 0; i < drilldowns.length; i++) {
    const item = drilldowns[i];
    if (isActiveItem(item)) {
      const dimName = item.drillable.dimension.name;
      if (dimensions.has(dimName)) {
        issues.add("Only one drilldown per dimension allowed.");
      }
      dimensions.add(dimName);
    }
  }

  return Array.from(issues);
}

export function checkMeasures(query) {
  const measures = query.measures;
  const issues = [];

  const activeMeasures = measures.reduce(activeItemCounter, 0);
  if (activeMeasures === 0) {
    issues.push("At least one measure must be selected.");
  }

  return issues;
}

export function checkCuts(query) {
  const cuts = query.cuts;
  const issues = [];

  const dimensions = new Set();
  for (let i = 0; i < cuts.length; i++) {
    const item = cuts[i];
    if (item.active) {
      const dimName = item.drillable.dimension.name;
      if (dimensions.has(dimName)) {
        issues.push(`Only one drilldown per dimension allowed: ${dimName}`);
      }
      dimensions.add(dimName);
    }
  }

  return issues;
}
