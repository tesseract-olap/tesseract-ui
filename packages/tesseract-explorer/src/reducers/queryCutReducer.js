import {
  QUERY_CUTS_CREATE,
  QUERY_CUTS_CLEAR,
  QUERY_CUTS_REMOVE,
  QUERY_CUTS_REPLACE,
  QUERY_CUTS_UPDATE
} from "../actions/query";
import {findByProperty, replaceFromArray} from "../utils/array";

/** @type {import("redux").Reducer<import("./queryReducer").QueryState>} */
export default function(state, action) {
  switch (action.type) {
    case QUERY_CUTS_CREATE: {
      const item = action.payload;
      return {
        ...state,
        cuts: [].concat(state.cuts, item)
      };
    }

    case QUERY_CUTS_CLEAR: {
      return {...state, cuts: []};
    }

    case QUERY_CUTS_REMOVE: {
      const {key} = action.payload;
      return {
        ...state,
        cuts: state.cuts.filter(item => item.key !== key)
      };
    }

    case QUERY_CUTS_UPDATE: {
      const item = action.payload;
      return {
        ...state,
        cuts: replaceFromArray(state.cuts, item, findByProperty("key"))
      };
    }

    case QUERY_CUTS_REPLACE: {
      return {...state, cuts: action.payload};
    }

    default:
      return state;
  }
}
