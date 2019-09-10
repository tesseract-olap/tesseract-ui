import formUrlDecode from "form-urldecoded";
import formUrlEncode from "form-urlencoded";
import {ensureArray} from "./array";
import {buildCut, buildDrilldown, buildFilter, buildMeasure, buildMember} from "./query";
import {parseName, stringifyName} from "./transform";
import {
  isActiveCut,
  isActiveItem,
  validGrowthState,
  validRcaState,
  validTopkState
} from "./validation";

/**
 * @param {import("../reducers").QueryState} query
 * @returns {SerializedQuery}
 */
export function serializeState(query) {
  const cuts = query.cuts
    .filter(isActiveCut)
    .map(i =>
      [stringifyName(i)].concat(i.members.filter(isActiveItem).map(m => m.key)).join(",")
    );

  const filters = query.filters
    .filter(isActiveItem)
    .map(i => `${i.measure},${i.comparison},${i.interpretedValue}`);

  return {
    cube: query.cube,
    cuts: cuts.length > 0 ? cuts : undefined,
    debug: query.debug,
    distinct: query.distinct,
    drilldowns: query.drilldowns.filter(isActiveItem).map(stringifyName),
    filters: filters.length > 0 ? filters : undefined,
    growth: validGrowthState(query.growth) ? query.growth : undefined,
    measures: query.measures.filter(isActiveItem).map(i => i.measure),
    nonempty: query.nonempty,
    parents: query.parents,
    rca: validRcaState(query.rca) ? query.rca : undefined,
    sparse: query.sparse,
    topk: validTopkState(query.topk) ? query.topk : undefined
  };
}

/**
 * @param {SerializedQuery} query
 * @returns {import("../reducers").QueryState}
 */
export function hydrateState(query) {
  const accesor = (key, obj = {}) => obj[key];
  const random = () => Math.random().toString(16).slice(2);

  /** @param {string} item */
  const parseCut = item => {
    const [fullName, ...members] = item.split(",");
    return buildCut({
      ...parseName(fullName),
      active: true,
      key: random(),
      members: members.filter(Boolean).map(key => buildMember({active: true, key}))
    });
  };

  /** @param {string} item */
  const parseFilter = item => {
    const [measure, comparison, inputtedValue] = item.split(",");
    return buildFilter({
      active: true,
      comparison,
      inputtedValue,
      interpretedValue: Number.parseFloat(inputtedValue),
      key: random(),
      measure
    });
  };

  return {
    cube: query.cube,
    cuts: ensureArray(query.cuts).map(parseCut),
    debug: query.debug,
    distinct: query.distinct,
    drilldowns: ensureArray(query.drilldowns).map(fn =>
      buildDrilldown({...parseName(fn), active: true, key: random()})
    ),
    filters: ensureArray(query.filters).map(parseFilter),
    growth: {
      level: accesor("level", query.growth),
      measure: accesor("measure", query.growth)
    },
    measures: ensureArray(query.measures).map(measure =>
      buildMeasure({active: true, key: random(), measure})
    ),
    nonempty: query.nonempty,
    parents: query.parents,
    rca: {
      level1: accesor("level1", query.rca),
      level2: accesor("level2", query.rca),
      measure: accesor("measure", query.rca)
    },
    sparse: query.sparse,
    topk: {
      amount: accesor("amount", query.topk),
      level: accesor("level", query.topk),
      measure: accesor("measure", query.topk),
      order: accesor("order", query.topk) || "desc"
    }
  };
}

export const serializePermalink = query =>
  formUrlEncode(serializeState(query), {
    ignorenull: true,
    skipIndex: false,
    sorted: true
  });

export const hydratePermalink = searchString => hydrateState(formUrlDecode(searchString));
