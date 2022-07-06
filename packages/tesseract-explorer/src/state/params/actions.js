import {QUERY_BOOLEANS_TOGGLE, QUERY_CUBE_UPDATE, QUERY_CUTS_CLEAR, QUERY_CUTS_REMOVE, QUERY_CUTS_UPDATE, QUERY_DRILLDOWNS_CLEAR, QUERY_DRILLDOWNS_REMOVE, QUERY_DRILLDOWNS_UPDATE, QUERY_INYECT, QUERY_LOCALE_UPDATE, QUERY_MEASURES_CLEAR, QUERY_MEASURES_UPDATE, QUERY_PAGINATION_UPDATE, QUERY_SORTING_UPDATE, QUERY_FULL_RESULTS_PAGINATION_UPDATE} from "./reducer";

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
 * Replaces the currently selected cube.
 * Also allows to set preselected measures.
 * @param {string} cube
 * @param {string[]} measures
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

/** @param {string} payload */
export const doLocaleUpdate = payload => ({type: QUERY_LOCALE_UPDATE, payload});

/**
 * Deselects all measures.
 */
export const doMeasureClear = () => ({type: QUERY_MEASURES_CLEAR});

/**
 * Changes the selection state of a specific measure.
 * @param {string} payload - Name of the measure to toggle.
 */
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
 * @param {string} sortKey
 * @param {string} sortDir
 */
export const doSortingUpdate = (sortKey, sortDir) => ({
  type: QUERY_SORTING_UPDATE,
  payload: {sortKey, sortDir}
});

/**
 * @param {number} pagiLimit
** @param {boolean} fullResults
 */
export const doFullResultsPagination = (pagiLimit, fullResults) => ({
  type: QUERY_FULL_RESULTS_PAGINATION_UPDATE,
  payload: {pagiLimit, fullResults}
});
