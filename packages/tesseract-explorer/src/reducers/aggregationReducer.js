import {AGGREGATION_UPDATE} from "../actions/aggregation";
import {QUERY_CUBE_UPDATE} from "../actions/query";

/** @type {import(".").AggregationState} */
const initialState = {
  aggregateUrl: "",
  data: [],
  jsCall: "",
  logicLayerUrl: "",
  options: {}
};

/** @type {import("redux").Reducer<import(".").AggregationState>} */
function aggregationReducer(state = initialState, action) {
  switch (action.type) {
    case QUERY_CUBE_UPDATE:
      return initialState;

    case AGGREGATION_UPDATE:
      const {aggregation, urls} = action.payload;
      return {
        aggregateUrl: aggregation.url,
        data: aggregation.data,
        jsCall: urls.jsCall,
        logicLayerUrl: urls.llUrl,
        options: aggregation.options
      };

    default:
      return state;
  }
}

export default aggregationReducer;
