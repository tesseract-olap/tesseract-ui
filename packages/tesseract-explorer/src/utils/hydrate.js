import {SERIAL_BOOLEAN} from "../enums";
import {ensureArray} from "./array";
import {
  buildCut,
  buildDrilldown,
  buildFilter,
  buildMeasure,
  buildMember,
  buildGrowth,
  buildRca,
  buildTopk
} from "./structs";
import {keyBy, parseName} from "./transform";

/**
 * @param {TessExpl.Struct.SerializedQuery} query
 * @returns {TessExpl.Struct.QueryParams}
 */
export function hydrateState(query) {
  const getKey = i => i.key;

  return {
    cube: query.cube,
    cuts: keyBy(ensureArray(query.cuts).map(hydrateCut), getKey),
    drilldowns: keyBy(ensureArray(query.drilldowns).map(hydrateDrilldown), getKey),
    filters: keyBy(ensureArray(query.filters).map(hydrateFilter), getKey),
    growth: keyBy(ensureArray(query.growth).map(hydrateGrowth), getKey),
    locale: query.locale,
    measures: keyBy(ensureArray(query.measures).map(hydrateMeasure), i => i.measure),
    rca: keyBy(ensureArray(query.rca).map(hydrateRca), getKey),
    topk: keyBy(ensureArray(query.topk).map(hydrateTopk), getKey),
    booleans: {
      debug: Boolean(query.booleans & SERIAL_BOOLEAN.DEBUG),
      distinct: Boolean(query.booleans & SERIAL_BOOLEAN.DISTINCT),
      nonempty: Boolean(query.booleans & SERIAL_BOOLEAN.NONEMPTY),
      parents: Boolean(query.booleans & SERIAL_BOOLEAN.PARENTS),
      sparse: Boolean(query.booleans & SERIAL_BOOLEAN.SPARSE)
    }
  };
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.CutItem}
 */
export function hydrateCut(item) {
  const [fullName, ...members] = item.split(",");
  return buildCut({
    ...parseName(fullName),
    active: true,
    members: members.filter(Boolean).map(key => buildMember({active: true, key}))
  });
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.DrilldownItem}
 */
export function hydrateDrilldown(item) {
  const {dimension, hierarchy, level} = parseName(item);
  return buildDrilldown({active: true, dimension, hierarchy, level});
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.FilterItem}
 */
export function hydrateFilter(item) {
  const [measure, comparison, inputtedValue] = item.split(",");
  return buildFilter({
    active: true,
    comparison,
    inputtedValue,
    interpretedValue: Number.parseFloat(inputtedValue),
    measure
  });
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.GrowthItem}
 */
export function hydrateGrowth(item) {
  const [level, measure] = item.split(",");
  return buildGrowth({active: true, level, measure});
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.MeasureItem}
 */
export function hydrateMeasure(item) {
  return buildMeasure({active: true, measure: item});
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.RcaItem}
 */
export function hydrateRca(item) {
  const [level1, level2, measure] = item.split(",");
  return buildRca({active: true, level1, level2, measure});
}

/**
 * @param {string} item
 * @returns {TessExpl.Struct.TopkItem}
 */
export function hydrateTopk(item) {
  const [amount, level, measure, order] = item.split(",");
  return buildTopk({active: true, amount, level, measure, order});
}
