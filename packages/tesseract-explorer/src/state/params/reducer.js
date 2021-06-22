import {buildQuery} from "../../utils/structs";
import {omitRecord} from "../helpers";


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


export const paramsEffectors = {

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {{key: string, value?: boolean}} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_BOOLEANS_TOGGLE]: (params, {key, value}) => ({
    ...params,
    booleans: {
      ...params.booleans,
      [key]: typeof value === "boolean" ? value : !params.booleans[key]
    }
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {{cube: string, measures: Record<string, TessExpl.Struct.MeasureItem>}} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_CUBE_UPDATE]: (params, {cube, measures}) => cube !== params.cube
    ? buildQuery({params: {cube, measures}}).params
    : Object.keys(measures).length !== Object.keys(params.measures).length
      ? {...params, cube, measures}
      : params,

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.CutItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_CUTS_CLEAR]: (params, payload = {}) => ({...params, cuts: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_CUTS_REMOVE]: (params, payload) => ({
    ...params,
    cuts: omitRecord(params.cuts, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.CutItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_CUTS_UPDATE]: (params, payload) => ({
    ...params,
    cuts: {...params.cuts, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.DrilldownItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_DRILLDOWNS_CLEAR]: (params, payload = {}) => ({...params, drilldowns: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_DRILLDOWNS_REMOVE]: (params, payload) => ({
    ...params,
    drilldowns: omitRecord(params.drilldowns, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.DrilldownItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_DRILLDOWNS_UPDATE]: (params, payload) => ({
    ...params,
    drilldowns: {...params.drilldowns, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.FilterItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  /**  */
  [QUERY_FILTERS_CLEAR]: (params, payload = {}) => ({...params, filters: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_FILTERS_REMOVE]: (params, payload) => ({
    ...params,
    filters: omitRecord(params.filters, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.FilterItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_FILTERS_UPDATE]: (params, payload) => ({
    ...params,
    filters: {...params.filters, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.GrowthItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_GROWTH_CLEAR]: (params, payload = {}) => ({...params, growth: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_GROWTH_REMOVE]: (params, payload) => ({
    ...params,
    growth: omitRecord(params.growth, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.GrowthItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_GROWTH_SELECT]: (params, payload) => ({
    ...params,
    growth: oneRecordActive(params.growth, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.GrowthItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_GROWTH_UPDATE]: (params, payload) => ({
    ...params,
    growth: {...params.growth, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Partial<TessExpl.Struct.QueryParams>} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_INYECT]: (params, payload) => ({...params, ...payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_LOCALE_UPDATE]: (params, payload) => ({...params, locale: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.MeasureItem>} measures
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_MEASURES_CLEAR]: (params, measures) => {
    if (!measures) {
      measures = {};
      Object.values(params.measures).forEach(item => {
        measures[item.key] = {...item, active: false};
      });
    }
    return {...params, measures};
  },

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.MeasureItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_MEASURES_UPDATE]: (params, payload) => ({
    ...params,
    measures: {...params.measures, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {{pagiLimit: number, pagiOffset: number}} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_PAGINATION_UPDATE]: (params, payload) => ({
    ...params,
    pagiLimit: payload.pagiLimit,
    pagiOffset: payload.pagiOffset
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.RcaItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_RCA_CLEAR]: (params, payload = {}) => ({...params, rca: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_RCA_REMOVE]: (params, payload) => ({...params, rca: omitRecord(params.rca, payload)}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.RcaItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_RCA_SELECT]: (params, payload) => ({
    ...params,
    rca: oneRecordActive(params.rca, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.RcaItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_RCA_UPDATE]: (params, payload) => ({
    ...params,
    rca: {...params.rca, [payload.key]: payload}
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {{sortKey: string, sortDir: "asc" | "desc"}} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_SORTING_UPDATE]: (params, payload) => ({
    ...params,
    sortDir: payload.sortDir,
    sortKey: payload.sortKey
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {Record<string, TessExpl.Struct.TopkItem>} [payload]
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_TOPK_CLEAR]: (params, payload = {}) => ({...params, topk: payload}),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {string} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_TOPK_REMOVE]: (params, payload) => ({
    ...params,
    topk: omitRecord(params.topk, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.TopkItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_TOPK_SELECT]: (params, payload) => ({
    ...params,
    topk: oneRecordActive(params.topk, payload)
  }),

  /**
   * @param {TessExpl.Struct.QueryParams} params
   * @param {TessExpl.Struct.TopkItem} payload
   * @returns {TessExpl.Struct.QueryParams}
   */
  [QUERY_TOPK_UPDATE]: (params, payload) => ({
    ...params,
    topk: {...params.topk, [payload.key]: payload}
  })
};
