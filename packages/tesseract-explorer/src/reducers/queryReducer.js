import {QUERY_CUBE_UPDATE, QUERY_INYECT} from "../actions/query";
import {serializePermalink} from "../utils/format";
import cutsReducer from "./queryCutReducer";
import drilldownsReducer from "./queryDrilldownReducer";
import generalReducer, {
  initialGrowthState,
  initialRcaState,
  initialTopState
} from "./queryGeneralReducer";

/**
 * @typedef QueryState
 * @property {string} cube
 * @property {import(".").CutItem[]} cuts
 * @property {import(".").DrilldownItem[]} drilldowns
 * @property {import(".").FilterItem[]} filters
 * @property {typeof initialGrowthState} growth
 * @property {import(".").MeasureItem[]} measures
 * @property {boolean} parents
 * @property {string} permalink
 * @property {typeof initialRcaState} rca
 * @property {boolean} sparse
 * @property {typeof initialTopState} top
 */

/** @type {QueryState} */
export const initialState = {
  cube: "",
  cuts: [],
  drilldowns: [],
  filters: [],
  growth: initialGrowthState,
  measures: [],
  parents: false,
  permalink: "",
  rca: initialRcaState,
  sparse: false,
  top: initialTopState
};

/** @type {import("redux").Reducer<QueryState>} */
function queryReducer(state = initialState, action) {
  const originalState = state;

  if (action.type === QUERY_INYECT) {
    state = {...initialState, ...action.payload};
    // create a validator/normalizator
    state.top.order = state.top.order || "desc";
  }
  else if (action.type === QUERY_CUBE_UPDATE) {
    const {cube, measures} = action.payload;
    state = state.cube === cube ? state : {...initialState, cube, measures};
  }
  else {
    state = generalReducer(state, action);
    state = drilldownsReducer(state, action);
    state = cutsReducer(state, action);
  }

  if (state !== originalState) {
    state.permalink = serializePermalink(state);
  }

  return state;
}

export default queryReducer;
