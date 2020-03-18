import {QUERY_CUBE_UPDATE, QUERY_INYECT} from "../actions/query";
import {
  queryGrowthInitialState,
  queryRcaInitialState,
  queryInitialState,
  queryTopkInitialState
} from "./initialState";
import booleanReducers from "./queryReducers/booleans";
import cutReducers from "./queryReducers/cut";
import drilldownReducers from "./queryReducers/drilldown";
import filterReducers from "./queryReducers/filter";
import otherReducers from "./queryReducers/other";

const actions = {
  ...booleanReducers,
  ...cutReducers,
  ...drilldownReducers,
  ...filterReducers,
  ...otherReducers,

  [QUERY_INYECT]: (state, {payload = {}}) => ({
    ...queryInitialState,
    ...payload,
    growth: {...queryGrowthInitialState, ...state.growth, ...payload.growth},
    rca: {...queryRcaInitialState, ...state.rca, ...payload.rca},
    topk: {...queryTopkInitialState, ...state.topk, ...payload.topk}
  }),

  [QUERY_CUBE_UPDATE]: (state, {payload}) => {
    const {cube, measures} = payload;
    if (cube !== state.cube || measures.length !== state.measures.length) {
      const parentState = cube !== state.cube ? queryInitialState : state;
      return {...parentState, cube, measures};
    }
    return state;
  }
};

/** @type {import("redux").Reducer<import(".").QueryState>} */
function queryReducer(state = queryInitialState, action) {
  const {type} = action;
  return type in actions ? actions[type](state, action) : state;
}

export default queryReducer;
