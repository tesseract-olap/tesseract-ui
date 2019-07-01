import pluralize from "pluralize";

import {getCube} from "./debug";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";

export function getTopItemsSummary(top) {
  if (!validTopState(top)) return;

  const pluralMsrName = pluralize(top.measure.name, top.amount);
  return `Showing the top ${top.amount} ${pluralMsrName} by ${top.level
    .name} (${top.order})`;
}

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

export function serializeCut(cutItem) {
  return cutItem.drillable.fullName + "." + cutItem.members.map(m => m.key).join(",");
}

/**
 * @param {import("../reducers/queryReducer").QueryState} query
 * @returns {import("../reducers/queryReducer").SerializedQuery}
 */
export function serializeState(query) {
  const keyAccesor = item => item.key;

  const cube = getCube(query);
  const plainQuery = {
    cube: cube && cube.name,
    measures: query.measures.filter(isActiveItem).map(keyAccesor),
    drilldowns: query.drilldowns.filter(isActiveItem).map(keyAccesor),
    cuts: query.cuts.filter(isActiveCut).map(serializeCut),
    filter: query.filters.filter(isActiveItem),
    parents: query.parents
  };

  if (validGrowthState(query.growth)) {
    plainQuery.growth = {
      level: query.growth.level.fullName,
      measure: query.growth.measure.name
    };
  }

  if (validRcaState(query.rca)) {
    plainQuery.rca = {
      level1: query.rca.level1.fullName,
      level2: query.rca.level2.fullName,
      measure: query.rca.measure.name
    };
  }

  if (validTopState(query.top)) {
    plainQuery.top = {
      amount: query.top.amount,
      order: query.top.order,
      level: query.top.level.fullName,
      measure: query.top.measure.name
    };
  }

  return plainQuery;
}

export function parseState(cube, serializedState) {
  return Promise.resolve({});
}
