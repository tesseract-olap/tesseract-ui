import {
  QUERY_DRILLDOWNS_CLEAR,
  QUERY_DRILLDOWNS_CREATE,
  QUERY_DRILLDOWNS_REMOVE,
  QUERY_DRILLDOWNS_UPDATE
} from "../actions/query";
import {replaceFromArray, findByProperty} from "../utils/array";

export default function(state, action) {
  switch (action.type) {
    case QUERY_DRILLDOWNS_CLEAR: {
      return {...state, drilldowns: []};
    }

    case QUERY_DRILLDOWNS_CREATE: {
      return {
        ...state,
        drilldowns: [].concat(state.drilldowns, action.payload)
      };
    }

    case QUERY_DRILLDOWNS_REMOVE: {
      const {key} = action.payload;
      return {
        ...state,
        drilldowns: state.drilldowns.filter(item => item.key !== key)
      };
    }

    case QUERY_DRILLDOWNS_UPDATE: {
      const item = action.payload;
      return {
        ...state,
        drilldowns: replaceFromArray(state.drilldowns, item, findByProperty("key"))
      };
    }

    default:
      return state;
  }
}
