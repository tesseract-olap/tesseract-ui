import {
  QUERY_CUTS_ADD,
  QUERY_CUTS_CLEAR,
  QUERY_CUTS_REMOVE,
  QUERY_CUTS_UPDATE
} from "../../actions/query";

export default function(state, action) {
  switch (action.type) {
    case QUERY_CUTS_ADD: {
      return {
        ...state,
        cuts: [].concat(state.cuts, action.payload)
      };
    }

    case QUERY_CUTS_CLEAR: {
      return {...state, cuts: []};
    }

    case QUERY_CUTS_REMOVE: {
      const drillable = action.payload;
      return {
        ...state,
        cuts: state.cuts.filter(item => item.drillable !== drillable)
      };
    }

    case QUERY_CUTS_UPDATE: {
      const updatedCut = action.payload;
      const cuts = state.cuts.slice();
      const index = cuts.findIndex(item => item.drillable === updatedCut.drillable);
      if (index > -1) {
        cuts[index] = updatedCut;
      }
      return {...state, cuts};
    }

    default:
      return state;
  }
}
