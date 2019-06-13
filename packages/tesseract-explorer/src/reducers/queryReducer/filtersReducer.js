import {
  QUERY_FILTERS_ADD,
  QUERY_FILTERS_CLEAR,
  QUERY_FILTERS_REMOVE
} from "../../actions/query";

export default function(state, action) {
  switch (action.type) {
    case QUERY_FILTERS_ADD: {
      return {
        ...state,
        filters: [].concat(state.filters, action.payload)
      };
    }

    case QUERY_FILTERS_REMOVE: {
      const name = action.payload.name || action.payload;
      return {
        ...state,
        filters: state.filters.filter(item => item.name !== name)
      };
    }

    case QUERY_FILTERS_CLEAR: {
      return {...state, filters: []};
    }

    default:
      return state;
  }
}
