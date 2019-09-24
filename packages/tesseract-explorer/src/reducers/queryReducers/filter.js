import {
  QUERY_FILTERS_CREATE,
  QUERY_FILTERS_CLEAR,
  QUERY_FILTERS_REMOVE
} from "../../actions/query";

/**
 * @typedef {import("redux").AnyAction} FilterAction
 * @property {import(".").FilterItem} payload
 */

/**
 * @typedef {{[action: string]: (state: import("..").QueryState, action: FilterAction) => state}}
 */
export default {
  [QUERY_FILTERS_CREATE]: (state, {payload}) => ({
    ...state,
    filters: state.filters.concat(payload)
  }),

  [QUERY_FILTERS_REMOVE]: (state, {payload}) => ({
    ...state,
    filters: state.filters.filter(item => item.key !== payload.key)
  }),

  [QUERY_FILTERS_CLEAR]: (state) => ({...state, filters: []})
};
