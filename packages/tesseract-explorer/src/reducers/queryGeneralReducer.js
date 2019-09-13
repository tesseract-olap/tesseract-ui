import {
  QUERY_DEBUG_TOGGLE,
  QUERY_DISTINCT_TOGGLE,
  QUERY_GROWTH_CLEAR,
  QUERY_GROWTH_UPDATE,
  QUERY_LOCALE_UPDATE,
  QUERY_MEASURES_TOGGLE,
  QUERY_NONEMPTY_TOGGLE,
  QUERY_PARENTS_TOGGLE,
  QUERY_RCA_CLEAR,
  QUERY_RCA_UPDATE,
  QUERY_SPARSE_TOGGLE,
  QUERY_TOPK_CLEAR,
  QUERY_TOPK_UPDATE
} from "../actions/query";
import {findByProperty, replaceFromArray} from "../utils/array";

/** @type {import(".").GrowthQueryState} */
export const initialGrowthState = {};

/** @type {import(".").RcaQueryState} */
export const initialRcaState = {};

/** @type {import(".").TopkQueryState} */
export const initialTopkState = {order: "desc"};

/** @type {import("redux").Reducer<import(".").QueryState>} */
export default function(state = {}, action) {
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

    case QUERY_TOPK_CLEAR: {
      return {...state, topk: initialTopkState};
    }

    case QUERY_TOPK_UPDATE: {
      const topk = action.payload;
      return {
        ...state,
        topk: {
          amount: "amount" in topk ? topk.amount : state.topk.amount,
          level: topk.level || state.topk.level,
          measure: topk.measure || state.topk.measure,
          order: topk.order || state.topk.order || "desc"
        }
      };
    }

    case QUERY_LOCALE_UPDATE:
      return {...state, locale: action.payload};

    case QUERY_DEBUG_TOGGLE:
      return {...state, debug: !state.debug};

    case QUERY_DISTINCT_TOGGLE:
      return {...state, distinct: !state.distinct};

    case QUERY_NONEMPTY_TOGGLE:
      return {...state, nonempty: !state.nonempty};

    case QUERY_PARENTS_TOGGLE:
      return {...state, parents: !state.parents};

    case QUERY_SPARSE_TOGGLE:
      return {...state, sparse: !state.sparse};

    default:
      return state;
  }
}
