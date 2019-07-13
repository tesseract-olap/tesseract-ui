import {
  QUERY_GROWTH_CLEAR,
  QUERY_GROWTH_UPDATE,
  QUERY_MEASURES_TOGGLE,
  QUERY_PARENTS_TOGGLE,
  QUERY_RCA_CLEAR,
  QUERY_RCA_UPDATE,
  QUERY_SPARSE_TOGGLE,
  QUERY_TOP_CLEAR,
  QUERY_TOP_UPDATE
} from "../actions/query";
import {findByProperty, replaceFromArray} from "../utils/array";

/** @type {import(".").GrowthQueryState} */
export const initialGrowthState = {};

/** @type {import(".").RcaQueryState} */
export const initialRcaState = {};

/** @type {import(".").TopQueryState} */
export const initialTopState = {order: "desc"};

/** @type {import("redux").Reducer<import("./queryReducer").QueryState>} */
export default function(state, action) {
  switch (action.type) {
    case QUERY_MEASURES_TOGGLE: {
      const item = action.payload;
      const newItem = {...item, active: !item.active};
      return {
        ...state,
        measures: replaceFromArray(state.measures, newItem, findByProperty("key"))
      };
    }

    case QUERY_GROWTH_CLEAR: {
      return {...state, growth: initialGrowthState};
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
      return {...state, rca: initialRcaState};
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
      return {...state, top: initialTopState};
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
