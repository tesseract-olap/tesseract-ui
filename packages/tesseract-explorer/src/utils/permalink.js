import formUrlEncode from "form-urlencoded";
import {SERIAL_BOOLEAN} from "../enums";
import {ensureArray} from "./array";
import {buildCut, buildDrilldown, buildFilter, buildGrowth, buildMeasure, buildRca, buildTopk} from "./structs";
import {keyBy, parseName, stringifyName} from "./transform";
import {isActiveCut, isActiveItem, isGrowthItem, isRcaItem, isTopkItem} from "./validation";

/**
 * @param {TessExpl.Struct.QueryParams} params
 * @returns {string}
 */
export function serializePermalink(params) {
  return formUrlEncode(serializeStateToSearchParams(params), {
    ignorenull: true,
    skipIndex: false,
    sorted: true
  });
}

/**
 * @param {TessExpl.Struct.QueryParams} query
 * @returns {TessExpl.Struct.SerializedQuery}
 */
function serializeStateToSearchParams(query) {
  const cuts = Object.values(query.cuts).filter(isActiveCut).map(serializeCut);

  const drilldowns = Object.values(query.drilldowns).filter(isActiveItem).map(stringifyName);

  const filters = Object.values(query.filters).filter(isActiveItem).map(serializeFilter);

  const growth = Object.values(query.growth).filter(isGrowthItem).map(serializeGrowth);

  const measures = Object.values(query.measures).filter(isActiveItem).map(i => i.measure);

  const rca = Object.values(query.rca).filter(isRcaItem).map(serializeRca);

  const topk = Object.values(query.topk).filter(isTopkItem).map(serializeTopk);

  const booleans = Object.keys(query.booleans).reduce((sum, key) => {
    const value = query.booleans[key] && SERIAL_BOOLEAN[key.toUpperCase()];
    return sum + (value || 0);
  }, 0);

  return {
    cube: query.cube,
    cuts: cuts.length > 0 ? cuts : undefined,
    drilldowns: drilldowns.length > 0 ? drilldowns : undefined,
    filters: filters.length > 0 ? filters : undefined,
    growth: growth.length > 0 ? growth : undefined,
    locale: query.locale ? query.locale : undefined,
    measures: measures.length > 0 ? measures : undefined,
    rca: rca.length > 0 ? rca : undefined,
    topk: topk.length > 0 ? topk : undefined,
    booleans: booleans > 0 ? booleans : undefined
  };

  /**
   * @param {TessExpl.Struct.CutItem} item
   * @returns {string}
   */
  function serializeCut(item) {
    return [stringifyName(item)].concat(item.members).join(",");
  }

  /**
   * @param {TessExpl.Struct.FilterItem} item
   * @returns {string}
   */
  function serializeFilter(item) {
    return `${item.measure},${item.comparison},${item.interpretedValue}`;
  }

  /**
   * @param {TessExpl.Struct.GrowthItem} item
   * @returns {string}
   */
  function serializeGrowth(item) {
    return `${item.level},${item.measure}`;
  }

  /**
   * @param {TessExpl.Struct.RcaItem} item
   * @returns {string}
   */
  function serializeRca(item) {
    return `${item.level1},${item.level2},${item.measure}`;
  }

  /**
   * @param {TessExpl.Struct.TopkItem} item
   * @returns {string}
   */
  function serializeTopk(item) {
    return `${item.amount},${item.level},${item.measure},${item.order}`;
  }
}

/**
 * @param {TessExpl.Struct.SerializedQuery} query
 * @returns {TessExpl.Struct.QueryParams}
 */
export function parseStateFromSearchParams(query) {
  const getKey = i => i.key;

  /** @type {Record<string, boolean>} */
  const booleans = {};
  Object.keys(SERIAL_BOOLEAN).forEach(key => {
    const value = (query.booleans || 0) & SERIAL_BOOLEAN[key];
    if (value > 0) {
      booleans[key.toLowerCase()] = true;
    }
  });

  return {
    booleans,
    cube: query.cube,
    cuts: keyBy(ensureArray(query.cuts).map(parseCut), getKey),
    drilldowns: keyBy(ensureArray(query.drilldowns).map(parseDrilldown), getKey),
    filters: keyBy(ensureArray(query.filters).map(parseFilter), getKey),
    growth: keyBy(ensureArray(query.growth).map(parseGrowth), getKey),
    locale: query.locale,
    measures: keyBy(ensureArray(query.measures).map(parseMeasure), getKey),
    pagiLimit: undefined,
    pagiOffset: undefined,
    rca: keyBy(ensureArray(query.rca).map(parseRca), getKey),
    sortDir: "desc",
    sortKey: undefined,
    topk: keyBy(ensureArray(query.topk).map(parseTopk), getKey)
  };

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.CutItem}
   */
  function parseCut(item) {
    const [fullName, ...members] = item.split(",");
    return buildCut({...parseName(fullName), active: true, members});
  }

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.DrilldownItem}
   */
  function parseDrilldown(item) {
    const {dimension, hierarchy, level} = parseName(item);
    return buildDrilldown({active: true, dimension, hierarchy, level});
  }

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.FilterItem}
   */
  function parseFilter(item) {
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
  function parseGrowth(item) {
    const [level, measure] = item.split(",");
    return buildGrowth({active: true, level, measure});
  }

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.MeasureItem}
   */
  function parseMeasure(item) {
    return buildMeasure({active: true, measure: item});
  }

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.RcaItem}
   */
  function parseRca(item) {
    const [level1, level2, measure] = item.split(",");
    return buildRca({active: true, level1, level2, measure});
  }

  /**
   * @param {string} item
   * @returns {TessExpl.Struct.TopkItem}
   */
  function parseTopk(item) {
    const [amount, level, measure, order] = item.split(",");
    return buildTopk({active: true, amount, level, measure, order});
  }
}
