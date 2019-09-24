import {
  QUERY_GROWTH_CLEAR,
  QUERY_GROWTH_UPDATE,
  QUERY_LOCALE_UPDATE,
  QUERY_MEASURES_TOGGLE,
  QUERY_RCA_CLEAR,
  QUERY_RCA_UPDATE,
  QUERY_TOPK_CLEAR,
  QUERY_TOPK_UPDATE
} from "../../actions/query";
import {findByProperty, replaceFromArray} from "../../utils/array";
import {queryGrowthInitialState, queryRcaInitialState, queryTopkInitialState} from "../initialState";

export default {
  [QUERY_GROWTH_CLEAR]: state => ({...state, growth: queryGrowthInitialState}),

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

  [QUERY_RCA_CLEAR]: state => ({...state, rca: queryRcaInitialState}),

  [QUERY_RCA_UPDATE]: (state, {payload: rca}) => ({
    ...state,
    rca: {
      level1: rca.level1 || state.rca.level1,
      level2: rca.level2 || state.rca.level2,
      measure: rca.measure || state.rca.measure
    }
  }),

  [QUERY_TOPK_CLEAR]: state => ({...state, topk: queryTopkInitialState}),

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
