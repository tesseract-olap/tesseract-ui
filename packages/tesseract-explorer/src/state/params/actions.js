import {QUERY_BOOLEANS_TOGGLE, QUERY_CUBE_UPDATE, QUERY_CUTS_CLEAR, QUERY_CUTS_REMOVE, QUERY_CUTS_UPDATE, QUERY_DRILLDOWNS_CLEAR, QUERY_DRILLDOWNS_REMOVE, QUERY_DRILLDOWNS_UPDATE, QUERY_FILTERS_CLEAR, QUERY_FILTERS_REMOVE, QUERY_FILTERS_UPDATE, QUERY_INYECT, QUERY_LOCALE_UPDATE, QUERY_MEASURES_CLEAR, QUERY_MEASURES_UPDATE, QUERY_PAGINATION_UPDATE, QUERY_SORTING_UPDATE} from "./reducer";

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
