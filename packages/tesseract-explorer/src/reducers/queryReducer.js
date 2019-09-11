import {QUERY_CUBE_UPDATE, QUERY_INYECT} from "../actions/query";
import cutsReducer from "./queryCutReducer";
import drilldownsReducer from "./queryDrilldownReducer";
import generalReducer, {
  initialGrowthState,
  initialRcaState,
  initialTopkState
} from "./queryGeneralReducer";

/** @type {import(".").QueryState} */
export const initialState = {
  cube: "",
  cuts: [],
  debug: false,
  distinct: true,
  drilldowns: [],
  filters: [],
  growth: initialGrowthState,
  measures: [],
  nonempty: true,
  parents: false,
  rca: initialRcaState,
  sparse: false,
  topk: initialTopkState
};

/** @type {import("redux").Reducer<import(".").QueryState>} */
function queryReducer(state = initialState, action) {
  if (action.type === QUERY_INYECT) {
    state = {
      ...initialState,
      ...action.payload,
      growth: {...initialGrowthState, ...state.growth},
      rca: {...initialRcaState, ...state.rca},
      topk: {...initialTopkState, ...state.topk}
    };
  }
  else if (action.type === QUERY_CUBE_UPDATE) {
    const {cube, measures} = action.payload;
    if (cube !== state.cube || measures.length !== state.measures.length) {
      const parentState = cube !== state.cube ? initialState : state;
      state = {...parentState, cube, measures};
    }
  }
  else {
    state = generalReducer(state, action);
    state = drilldownsReducer(state, action);
    state = cutsReducer(state, action);
  }

  return state || initialState;
}

export default queryReducer;
