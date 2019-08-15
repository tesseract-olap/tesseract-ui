import formUrlDecode from "./form-urldecoded";
import formUrlEncode from "form-urlencoded";
import pluralize from "pluralize";
import {buildCut, buildDrilldown, buildFilter, buildMeasure, buildMember} from "./query";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopState
} from "./validation";

export function splitFullName(fullName) {
  return fullName
    ? `${fullName}`.split(".").map(token => token.replace(/^\[|\]$/g, ""))
    : undefined;
}

export function abbreviateFullName(fullName, joint = "/") {
  if (!fullName) return;

  const nameParts = splitFullName(fullName);
  let token = nameParts.shift();
  while (nameParts.length > 0 && nameParts[0] === token) {
    token = nameParts.shift();
  }
  nameParts.unshift(token);
  return nameParts.join(joint);
}

/** @param {import("../reducers").GrowthQueryState} growth */
export function summaryGrowth(growth) {
  if (!validGrowthState(growth)) return "";
  const measureName = growth.measure;
  const levelName = abbreviateFullName(growth.level);
  return `Growth of ${measureName} by ${levelName}`;
}

/** @param {import("../reducers").RcaQueryState} rca */
export function summaryRca(rca) {
  if (!validRcaState(rca)) return "";
  const measureName = rca.measure;
  const level1Name = abbreviateFullName(rca.level1);
  const level2Name = abbreviateFullName(rca.level2);
  return `RCA for ${level1Name} on ${measureName} by ${level2Name}`;
}

/** @param {import("../reducers").TopQueryState} top */
export function summaryTopItems(top) {
  if (!validTopState(top)) return "";
  const measureName = pluralize(top.measure, top.amount);
  const levelName = abbreviateFullName(top.level);
  return `Top ${top.amount} ${measureName} by ${levelName} (${top.order})`;
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
  const accesor = (key, obj = {}) => obj[key];
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
    growth: {
      level: accesor("level", query.growth),
      measure: accesor("measure", query.growth)
    },
    measures: (query.measures || []).map(item => buildMeasure(item)),
    parents: query.parents,
    permalink: "",
    rca: {
      level1: accesor("level1", query.rca),
      level2: accesor("level2", query.rca),
      measure: accesor("measure", query.rca)
    },
    sparse: query.sparse,
    top: {
      amount: accesor("amount", query.top),
      level: accesor("level", query.top),
      measure: accesor("measure", query.top),
      order: accesor("order", query.top) || "desc"
    }
  };
}

export const serializePermalink = query =>
  formUrlEncode(serializeState(query), {
    ignorenull: true,
    skipIndex: false,
    sorted: true
  });

export const hydratePermalink = searchString =>
  hydrateState(
    formUrlDecode(searchString, {
      ignorenull: true,
      skipIndex: false
    })
  );
