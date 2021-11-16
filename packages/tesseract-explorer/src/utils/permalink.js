import formUrlEncode from "form-urlencoded";
import {SERIAL_BOOLEAN} from "../enums";
import {ensureArray, filterMap} from "./array";
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
  const cuts = filterMap(Object.values(query.cuts), item =>
    isActiveCut(item) ? serializeCut(item) : null
  );

  const drilldowns = filterMap(Object.values(query.drilldowns), item =>
    isActiveItem(item) ? serializeDrilldown(item) : null
  );

  const filters = filterMap(Object.values(query.filters), item =>
    isActiveItem(item) ? serializeFilter(item) : null
  );

  const growth = filterMap(Object.values(query.growth), item =>
    isGrowthItem(item) ? serializeGrowth(item) : null
  );

  const measures = filterMap(Object.values(query.measures), item =>
    isActiveItem(item) ? item.measure : null
  );

  const rca = filterMap(Object.values(query.rca), item =>
    isRcaItem(item) ? serializeRca(item) : null
  );

  const topk = filterMap(Object.values(query.topk), item =>
    isTopkItem(item) ? serializeTopk(item) : null
  );

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
   * @param {TessExpl.Struct.DrilldownItem} item
   * @returns {string}
   */
  function serializeDrilldown(item) {
    return [stringifyName(item)].concat(
      filterMap(item.properties, prop =>
        isActiveItem(prop) ? prop.name : null
      )
    ).join(",");
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

  /** @type {Record<string, TessExpl.Struct.CutItem>} */
  const cuts = Object.create(null);

  /** @type {Record<string, TessExpl.Struct.DrilldownItem>} */
  const drilldowns = Object.create(null);

  return {
    booleans: parseBooleans(query.booleans || 0),
    cube: query.cube,
    cuts: ensureArray(query.cuts).reduce(cutReducer, cuts),
    drilldowns: ensureArray(query.drilldowns).reduce(drilldownReducer, drilldowns),
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
   * @param {Record<string, TessExpl.Struct.CutItem>} cuts
   * @param {string} item
   */
  function cutReducer(cuts, item) {
    const [fullName, ...members] = item.split(",");
    const cut = buildCut({...parseName(fullName), active: true, members});

    // fullName is normalized into descriptor, so this is better for comparison
    const matchingCut = Object.values(cuts).find(item =>
      item.dimension === cut.dimension &&
      item.hierarchy === cut.hierarchy &&
      item.level === cut.level
    );
    if (matchingCut) {
      const memberSet = new Set([...matchingCut.members, ...cut.members]);
      cut.members = [...memberSet].sort();
    }
    cuts[cut.key] = cut;

    return cuts;
  }

  /**
   * @param {Record<string, TessExpl.Struct.DrilldownItem>} drilldowns
   * @param {string} item
   */
  function drilldownReducer(drilldowns, item) {
    const [fullName, ...props] = item.split(",");
    const nameParts = parseName(fullName);
    const properties = props.map(name => ({active: true, level: nameParts.level, name}));
    const ddn = buildDrilldown({...nameParts, active: true, properties, key: fullName});
    drilldowns[ddn.key] = ddn;
    return drilldowns;
  }

  /**
   * @param {number} item
   * @returns {Record<string, boolean>}
   */
  function parseBooleans(item) {

    /** @type {Record<string, boolean>} */
    const booleans = Object.create(null);

    Object.keys(SERIAL_BOOLEAN).forEach(key => {
      const value = item & SERIAL_BOOLEAN[key];
      if (value > 0) {
        booleans[key.toLowerCase()] = true;
      }
    });

    return booleans;
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
