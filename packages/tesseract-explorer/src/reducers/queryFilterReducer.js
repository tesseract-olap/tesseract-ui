import {
  QUERY_FILTERS_CREATE,
  QUERY_FILTERS_CLEAR,
  QUERY_FILTERS_REMOVE
} from "../actions/query";

export default function(state, action) {
  switch (action.type) {
    case QUERY_FILTERS_CREATE: {
      return {
        ...state,
        filters: [].concat(state.filters, action.payload)
      };
    }

    case QUERY_FILTERS_REMOVE: {
      const {key} = action.payload;
      return {
        ...state,
        filters: state.filters.filter(item => item.key !== key)
      };
    }

    case QUERY_FILTERS_CLEAR: {
      return {...state, filters: []};
    }

    default:
      return state;
  }
}
