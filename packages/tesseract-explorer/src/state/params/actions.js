export const QUERY_BOOLEANS_TOGGLE = "explorer/QUERY/BOOLEANS/TOGGLE";
export const QUERY_CUBE_UPDATE = "explorer/QUERY/CUBE/UPDATE";
export const QUERY_CUTS_CLEAR = "explorer/QUERY/CUTS/CLEAR";
export const QUERY_CUTS_REMOVE = "explorer/QUERY/CUTS/REMOVE";
export const QUERY_CUTS_UPDATE = "explorer/QUERY/CUTS/UPDATE";
export const QUERY_DRILLDOWNS_CLEAR = "explorer/QUERY/DRILLDOWNS/CLEAR";
export const QUERY_DRILLDOWNS_REMOVE = "explorer/QUERY/DRILLDOWNS/REMOVE";
export const QUERY_DRILLDOWNS_UPDATE = "explorer/QUERY/DRILLDOWNS/UPDATE";
export const QUERY_FILTERS_CLEAR = "explorer/QUERY/FILTERS/CLEAR";
export const QUERY_FILTERS_REMOVE = "explorer/QUERY/FILTERS/REMOVE";
export const QUERY_FILTERS_UPDATE = "explorer/QUERY/FILTERS/UPDATE";
export const QUERY_GROWTH_CLEAR = "explorer/QUERY/GROWTH/CLEAR";
export const QUERY_GROWTH_REMOVE = "explorer/QUERY/GROWTH/REMOVE";
export const QUERY_GROWTH_SELECT = "explorer/QUERY/GROWTH/SELECT";
export const QUERY_GROWTH_UPDATE = "explorer/QUERY/GROWTH/UPDATE";
export const QUERY_INYECT = "explorer/QUERY/INYECT";
export const QUERY_LOCALE_UPDATE = "explorer/QUERY/LOCALE/UPDATE";
export const QUERY_MEASURES_CLEAR = "explorer/QUERY/MEASURES/CLEAR";
export const QUERY_MEASURES_UPDATE = "explorer/QUERY/MEASURES/UPDATE";
export const QUERY_PAGINATION_UPDATE = "explorer/QUERY/PAGINATION/UPDATE";
export const QUERY_RCA_CLEAR = "explorer/QUERY/RCA/CLEAR";
export const QUERY_RCA_REMOVE = "explorer/QUERY/RCA/REMOVE";
export const QUERY_RCA_SELECT = "explorer/QUERY/RCA/SELECT";
export const QUERY_RCA_UPDATE = "explorer/QUERY/RCA/UPDATE";
export const QUERY_SORTING_UPDATE = "explorer/QUERY/SORTING/UPDATE";
export const QUERY_TOPK_CLEAR = "explorer/QUERY/TOPK/CLEAR";
export const QUERY_TOPK_REMOVE = "explorer/QUERY/TOPK/REMOVE";
export const QUERY_TOPK_SELECT = "explorer/QUERY/TOPK/SELECT";
export const QUERY_TOPK_UPDATE = "explorer/QUERY/TOPK/UPDATE";

/** @param {Partial<TessExpl.Struct.QueryItem>} payload */
export const doRawInyect = payload => ({type: QUERY_INYECT, payload});

/**
 * @param {string} key
 * @param {boolean} [value]
 */
export const doBooleanToggle = (key, value) => ({
  type: QUERY_BOOLEANS_TOGGLE,
  payload: {key, value}
});

/**
 * @param {string} cube
 * @param {Record<string, TessExpl.Struct.MeasureItem>} measures
 */
export const doCubeUpdate = (cube, measures) => ({
  type: QUERY_CUBE_UPDATE,
  payload: {cube, measures}
});

/**
 * If no parameter is passed, this function clears the list.
 * If a parameter is passed, that parameter replaces the list.
 * @param {Record<string, TessExpl.Struct.CutItem>} [payload]
 */
export const doCutClear = payload => ({type: QUERY_CUTS_CLEAR, payload});

/** @param {string} payload */
export const doCutRemove = payload => ({type: QUERY_CUTS_REMOVE, payload});

/** @param {TessExpl.Struct.CutItem} payload */
export const doCutUpdate = payload => ({type: QUERY_CUTS_UPDATE, payload});

/**
 * If no parameter is passed, this function clears the list.
 * If a parameter is passed, that parameter replaces the list.
 * @param {Record<string, TessExpl.Struct.DrilldownItem>} [payload]
 */
export const doDrilldownClear = payload => ({type: QUERY_DRILLDOWNS_CLEAR, payload});

/**
 * @param {string} payload The key that identifies the drilldown to remove.
 */
export const doDrilldownRemove = payload => ({type: QUERY_DRILLDOWNS_REMOVE, payload});

/**
 * @param {TessExpl.Struct.DrilldownItem} payload The entire drilldown object, already in its next state. Must contain a "key" property, which will be used to replace the previous state.
 */
export const doDrilldownUpdate = payload => ({type: QUERY_DRILLDOWNS_UPDATE, payload});

/**
 * If no parameter is passed, this function clears the list.
 * If a parameter is passed, that parameter replaces the list.
 * @param {Record<string, TessExpl.Struct.GrowthItem>} [payload]
 */
export const doGrowthClear = payload => ({type: QUERY_GROWTH_CLEAR, payload});

/** @param {string} payload */
export const doGrowthRemove = payload => ({type: QUERY_GROWTH_REMOVE, payload});

/** @param {TessExpl.Struct.GrowthItem} payload */
export const doGrowthSelect = payload => ({type: QUERY_GROWTH_SELECT, payload});

/** @param {TessExpl.Struct.GrowthItem} payload */
export const doGrowthUpdate = payload => ({type: QUERY_GROWTH_UPDATE, payload});

/** @param {string} payload */
export const doLocaleUpdate = payload => ({type: QUERY_LOCALE_UPDATE, payload});

/** @param {Record<string, TessExpl.Struct.MeasureItem>} [payload] */
export const doMeasureClear = payload => ({type: QUERY_MEASURES_CLEAR, payload});

/** @param {TessExpl.Struct.MeasureItem} payload */
export const doMeasureToggle = payload => ({type: QUERY_MEASURES_UPDATE, payload});

/**
 * @param {number} pagiLimit
 * @param {number} pagiOffset
 */
export const doPaginationUpdate = (pagiLimit, pagiOffset) => ({
  type: QUERY_PAGINATION_UPDATE,
  payload: {pagiLimit, pagiOffset}
});

/**
 * If no parameter is passed, this function clears the list.
 * If a parameter is passed, that parameter replaces the list.
 * @param {Record<string, TessExpl.Struct.RcaItem>} [payload]
 */
export const doRcaClear = payload => ({type: QUERY_RCA_CLEAR, payload});

/** @param {string} payload rca.key */
export const doRcaRemove = payload => ({type: QUERY_RCA_REMOVE, payload});

/** @param {TessExpl.Struct.RcaItem} payload */
export const doRcaSelect = payload => ({type: QUERY_RCA_SELECT, payload});

/** @param {TessExpl.Struct.RcaItem} payload */
export const doRcaUpdate = payload => ({type: QUERY_RCA_UPDATE, payload});

/**
 * @param {string} sortKey
 * @param {string} sortDir
 */
export const doSortingUpdate = (sortKey, sortDir) => ({
  type: QUERY_SORTING_UPDATE,
  payload: {sortKey, sortDir}
});

/**
 * If no parameter is passed, this function clears the list.
 * If a parameter is passed, that parameter replaces the list.
 * @param {Record<string, TessExpl.Struct.TopkItem>} [payload]
 */
export const doTopkClear = payload => ({type: QUERY_TOPK_CLEAR, payload});

/** @param {string} payload topk.key */
export const doTopkRemove = payload => ({type: QUERY_TOPK_REMOVE, payload});

/** @param {TessExpl.Struct.TopkItem} payload */
export const doTopkSelect = payload => ({type: QUERY_TOPK_SELECT, payload});

/** @param {TessExpl.Struct.TopkItem} payload */
export const doTopkUpdate = payload => ({type: QUERY_TOPK_UPDATE, payload});
