import {
  QUERY_DRILLDOWNS_ADD,
  QUERY_DRILLDOWNS_CLEAR,
  QUERY_DRILLDOWNS_REMOVE,
  QUERY_DRILLDOWNS_UPDATE
} from "../../actions/query";

export default function(state, action) {
  switch (action.type) {
    case QUERY_DRILLDOWNS_ADD: {
      return {
        ...state,
        drilldowns: [].concat(state.drilldowns, action.payload)
      };
    }

    case QUERY_DRILLDOWNS_REMOVE: {
      const drillable = action.payload;
      return {
        ...state,
        drilldowns: state.drilldowns.filter(item => item.drillable !== drillable)
      };
    }

    case QUERY_DRILLDOWNS_UPDATE: {
      const updatedDrilldown = action.payload;
      const drilldowns = state.drilldowns.slice();
      const index = drilldowns.findIndex(
        item => item.drillable === updatedDrilldown.drillable
      );
      if (index > -1) {
        drilldowns[index] = updatedDrilldown;
      }
      return {...state, drilldowns};
    }

    case QUERY_DRILLDOWNS_CLEAR: {
      return {...state, drilldowns: []};
    }

    default:
      return state;
  }
}
