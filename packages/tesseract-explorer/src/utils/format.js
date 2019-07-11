import formUrlEncode from "form-urlencoded";
import pluralize from "pluralize";
import {parse} from "query-string";
import {buildCut, buildDrilldown, buildFilter, buildMeasure, buildMember} from "./query";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";

export function abbreviateFullName(fullName) {
  if (!fullName) return;

  const nameParts = `${fullName}`.split(".");
  let token = nameParts.shift();
  while (nameParts.length > 0 && nameParts[0] === token) {
    token = nameParts.shift();
  }
  nameParts.unshift(token);
  return nameParts.join("/");
}

/** @param {import("../reducers/queryReducer").TopQueryState} top */
export function getTopItemsSummary(top) {
  if (!validTopState(top)) return;
  const measureName = pluralize(top.measure, top.amount);
  const levelName = abbreviateFullName(top.level);
  return `Showing the top ${top.amount} ${measureName} by ${levelName} (${top.order})`;
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

/** @param {import("../reducers").CutItem} item */
export const serializeCut = item =>
  item.drillable + "." + item.members.filter(isActiveItem).map(m => m.key).join(",");

/** @param {import("../reducers").FilterItem} item */
export const serializeFilter = item =>
  `${item.measure},${item.comparison},${item.interpretedValue}`;

/**
 * @param {import("../reducers/queryReducer").QueryState} query
 * @returns {SerializedQuery}
 */
export function serializeState(query) {
  const cuts = query.cuts.filter(isActiveCut).map(serializeCut);
  const drilldowns = query.drilldowns.filter(isActiveItem).map(i => i.drillable);
  const filters = query.filters.filter(isActiveItem).map(serializeFilter);
  const measures = query.measures.filter(isActiveItem).map(i => i.measure);

  return {
    cube: query.cube,
    cuts: cuts.length > 0 ? cuts : undefined,
    drilldowns: drilldowns.length > 0 ? drilldowns : undefined,
    filters: filters.length > 0 ? filters : undefined,
    growth: validGrowthState(query.growth) ? query.growth : undefined,
    measures: measures.length > 0 ? measures : undefined,
    parents: query.parents,
    rca: validRcaState(query.rca) ? query.rca : undefined,
    sparse: query.sparse,
    top: validTopState(query.top) ? query.top : undefined
  };
}

/**
 * @param {SerializedQuery} query
 * @returns {import("../reducers/queryReducer").QueryState}
 */
export function hydrateState(query) {
  return {
    cube: query.cube,
    cuts: (query.cuts || []).map(item => {
      const drillableParts = item.split(".");
      const members = drillableParts.pop().split(",");
      return buildCut(drillableParts.join("."), {
        active: true,
        members: members.map(key => buildMember(key, {active: true}))
      });
    }),
    drilldowns: (query.drilldowns || []).map(item => buildDrilldown(item)),
    filters: (query.filters || []).map(item => buildFilter(item)),
    growth: {},
    measures: (query.measures || []).map(item => buildMeasure(item)),
    parents: query.parents,
    rca: {},
    sparse: query.sparse,
    top: {}
  };
}

export const serializePermalink = query =>
  formUrlEncode(serializeState(query), {
    sorted: true,
    ignorenull: true,
    skipIndex: true
  });

export const hydratePermalink = searchString =>
  hydrateState(
    // @ts-ignore
    parse(searchString, {
      decode: true,
      arrayFormat: "bracket",
      parseBooleans: true
    })
  );
