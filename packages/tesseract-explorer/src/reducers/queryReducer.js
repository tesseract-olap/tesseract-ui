import {
  QUERY_CUBE_UPDATE,
  QUERY_INYECT,
  QUERY_MEASURES_TOGGLE,
  QUERY_PARENTS_TOGGLE,
  QUERY_SPARSE_TOGGLE,
  QUERY_RCA_UPDATE,
  QUERY_TOP_UPDATE,
  QUERY_RCA_CLEAR,
  QUERY_TOP_CLEAR,
  QUERY_GROWTH_CLEAR,
  QUERY_GROWTH_UPDATE
} from "../actions/query";
import {findByProperty, replaceFromArray} from "../utils/array";
import drilldownsReducer from "./queryDrilldownReducer";
import cutsReducer from "./queryCutReducer";

/**
 * @typedef QueryState
 * @property {string} cube
 * @property {import(".").CutItem[]} cuts
 * @property {import(".").DrilldownItem[]} drilldowns
 * @property {import(".").FilterItem[]} filters
 * @property {GrowthQueryState} growth
 * @property {import(".").MeasureItem[]} measures
 * @property {boolean} parents
 * @property {RcaQueryState} rca
 * @property {boolean} sparse
 * @property {TopQueryState} top
 */

/**
 * @typedef GrowthQueryState
 * @property {string} [level]
 * @property {string} [measure]
 */

/**
 * @typedef RcaQueryState
 * @property {string} [level1]
 * @property {string} [level2]
 * @property {string} [measure]
 */

/**
 * @typedef TopQueryState
 * @property {number} [amount]
 * @property {string} [level]
 * @property {string} [measure]
 * @property {"asc" | "desc"} [order]
 */

/** @type {QueryState} */
export const initialState = {
  cube: "",
  cuts: [],
  drilldowns: [],
  filters: [],
  measures: [],
  growth: {},
  rca: {},
  top: {
    order: "desc"
  },
  parents: false,
  sparse: false
};

/** @type {import("redux").Reducer<QueryState>} */
function queryReducer(state = initialState, action) {
  state = drilldownsReducer(state, action);
  state = cutsReducer(state, action);

  switch (action.type) {
    case QUERY_INYECT: {
      return {...initialState, ...action.payload};
    }

    case QUERY_CUBE_UPDATE: {
      const {cube, measures} = action.payload;
      return state.cube === cube ? state : {...initialState, cube, measures};
    }

    case QUERY_MEASURES_TOGGLE: {
      const item = action.payload;
      const newItem = {...item, active: !item.active};
      return {
        ...state,
        measures: replaceFromArray(state.measures, newItem, findByProperty("key"))
      };
    }

    case QUERY_GROWTH_CLEAR: {
      return {...state, growth: initialState.growth};
    }

    case QUERY_GROWTH_UPDATE: {
      const growth = action.payload;
      return {
        ...state,
        growth: {
          level: growth.level || state.growth.level,
          measure: growth.measure || state.growth.measure
        }
      };
    }

    case QUERY_RCA_CLEAR: {
      return {...state, rca: initialState.rca};
    }

    case QUERY_RCA_UPDATE: {
      const rca = action.payload;
      return {
        ...state,
        rca: {
          level1: rca.level1 || state.rca.level1,
          level2: rca.level2 || state.rca.level2,
          measure: rca.measure || state.rca.measure
        }
      };
    }

    case QUERY_TOP_CLEAR: {
      return {...state, top: initialState.top};
    }

    case QUERY_TOP_UPDATE: {
      const top = action.payload;
      return {
        ...state,
        top: {
          amount: "amount" in top ? top.amount : state.top.amount,
          level: top.level || state.top.level,
          measure: top.measure || state.top.measure,
          order: top.order || state.top.order
        }
      };
    }

    case QUERY_SPARSE_TOGGLE:
      return {...state, sparse: !state.sparse};

    case QUERY_PARENTS_TOGGLE:
      return {...state, parents: !state.parents};

    default:
      return state;
  }
}

export default queryReducer;
