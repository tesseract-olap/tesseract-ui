import {findByProperty, replaceFromArray} from "../../utils/array";
import {
  QUERY_CUBE_UPDATE,
  QUERY_CUTS_CLEAR,
  QUERY_CUTS_CREATE,
  QUERY_CUTS_REMOVE,
  QUERY_CUTS_REPLACE,
  QUERY_CUTS_UPDATE,
  QUERY_DEBUG_TOGGLE,
  QUERY_DISTINCT_TOGGLE,
  QUERY_DRILLDOWNS_CLEAR,
  QUERY_DRILLDOWNS_CREATE,
  QUERY_DRILLDOWNS_REMOVE,
  QUERY_DRILLDOWNS_UPDATE,
  QUERY_FILTERS_CLEAR,
  QUERY_FILTERS_CREATE,
  QUERY_FILTERS_REMOVE,
  QUERY_GROWTH_CLEAR,
  QUERY_GROWTH_UPDATE,
  QUERY_INYECT,
  QUERY_LOCALE_UPDATE,
  QUERY_MEASURES_TOGGLE,
  QUERY_NONEMPTY_TOGGLE,
  QUERY_PARENTS_TOGGLE,
  QUERY_RCA_CLEAR,
  QUERY_RCA_UPDATE,
  QUERY_SPARSE_TOGGLE,
  QUERY_TOPK_CLEAR,
  QUERY_TOPK_UPDATE
} from "./actions";

/** @type {GrowthItem} */
export const initialGrowthItem = {};

/** @type {RcaItem} */
export const initialRcaItem = {};

/** @type {TopkItem} */
export const initialTopkItem = {
  order: "desc"
};

/** @type {QueryState} */
export const queryInitialState = {
  cube: "",
  cuts: [],
  debug: false,
  distinct: true,
  drilldowns: [],
  filters: [],
  growth: initialGrowthItem,
  locale: "",
  measures: [],
  nonempty: true,
  parents: false,
  rca: initialRcaItem,
  sparse: false,
  topk: initialTopkItem
};

const actions = {
  [QUERY_INYECT]: (state, {payload}) => ({
    ...queryInitialState,
    ...payload,
    growth: {...initialGrowthItem, ...state.growth},
    rca: {...initialRcaItem, ...state.rca},
    topk: {...initialTopkItem, ...state.topk}
  }),

  [QUERY_CUBE_UPDATE]: (state, {payload}) => {
    const {cube, measures} = payload;
    if (cube !== state.cube || measures.length !== state.measures.length) {
      const parentState = cube !== state.cube ? queryInitialState : state;
      return {...parentState, cube, measures};
    }
    return state;
  },

  [QUERY_CUTS_CREATE]: (state, {payload: item}) => ({
    ...state,
    cuts: [].concat(state.cuts, item)
  }),

  [QUERY_CUTS_CLEAR]: state => ({...state, cuts: []}),

  [QUERY_CUTS_REMOVE]: (state, {payload}) => ({
    ...state,
    cuts: state.cuts.filter(item => item.key !== payload.key)
  }),

  [QUERY_CUTS_UPDATE]: (state, {payload: item}) => ({
    ...state,
    cuts: replaceFromArray(state.cuts, item, findByProperty("key"))
  }),

  [QUERY_CUTS_REPLACE]: (state, {payload: cuts}) => ({...state, cuts}),

  [QUERY_DEBUG_TOGGLE]: state => ({...state, debug: !state.debug}),

  [QUERY_DISTINCT_TOGGLE]: state => ({...state, distinct: !state.distinct}),

  [QUERY_DRILLDOWNS_CLEAR]: state => ({...state, drilldowns: []}),

  [QUERY_DRILLDOWNS_CREATE]: (state, {payload}) => ({
    ...state,
    drilldowns: state.drilldowns.concat(payload)
  }),

  [QUERY_DRILLDOWNS_REMOVE]: (state, {payload}) => ({
    ...state,
    drilldowns: state.drilldowns.filter(item => item.key !== payload.key)
  }),

  [QUERY_DRILLDOWNS_UPDATE]: (state, {payload}) => ({
    ...state,
    drilldowns: replaceFromArray(state.drilldowns, payload, findByProperty("key"))
  }),

  [QUERY_FILTERS_CREATE]: (state, {payload}) => ({
    ...state,
    filters: state.filters.concat(payload)
  }),

  [QUERY_FILTERS_REMOVE]: (state, {payload}) => ({
    ...state,
    filters: state.filters.filter(item => item.key !== payload.key)
  }),

  [QUERY_FILTERS_CLEAR]: state => ({...state, filters: []}),

  [QUERY_GROWTH_CLEAR]: state => ({...state, growth: initialGrowthItem}),

  [QUERY_GROWTH_UPDATE]: (state, {payload: growth}) => ({
    ...state,
    growth: {
      level: growth.level || state.growth.level,
      measure: growth.measure || state.growth.measure
    }
  }),

  [QUERY_LOCALE_UPDATE]: (state, {payload: locale}) => ({...state, locale}),

  [QUERY_MEASURES_TOGGLE]: (state, {payload: item}) => {
    const newItem = {...item, active: !item.active};
    return {
      ...state,
      measures: replaceFromArray(state.measures, newItem, findByProperty("key"))
    };
  },

  [QUERY_NONEMPTY_TOGGLE]: state => ({...state, nonempty: !state.nonempty}),

  [QUERY_PARENTS_TOGGLE]: state => ({...state, parents: !state.parents}),

  [QUERY_RCA_CLEAR]: state => ({...state, rca: initialRcaItem}),

  [QUERY_RCA_UPDATE]: (state, {payload: rca}) => ({
    ...state,
    rca: {
      level1: rca.level1 || state.rca.level1,
      level2: rca.level2 || state.rca.level2,
      measure: rca.measure || state.rca.measure
    }
  }),

  [QUERY_SPARSE_TOGGLE]: state => ({...state, sparse: !state.sparse}),

  [QUERY_TOPK_CLEAR]: state => ({...state, topk: initialTopkItem}),

  [QUERY_TOPK_UPDATE]: (state, {payload: topk}) => ({
    ...state,
    topk: {
      amount: "amount" in topk ? topk.amount : state.topk.amount,
      level: topk.level || state.topk.level,
      measure: topk.measure || state.topk.measure,
      order: topk.order || state.topk.order || "desc"
    }
  })
};

/** @type {import("redux").Reducer<QueryState>} */
export function queryReducer(state = queryInitialState, action) {
  const effector = actions[action.type];
  return effector ? effector(state, action) : state;
}
