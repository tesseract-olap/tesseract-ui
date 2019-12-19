import {AGGREGATION_UPDATE} from "./actions";
import {QUERY_CUBE_UPDATE} from "../query/actions";

/** @type {AggregationState} */
export const aggregationInitialState = {
  aggregateUrl: "",
  data: [],
  emptyDataset: false,
  jsCall: "",
  logicLayerUrl: "",
  options: {}
};

/** @type {import("redux").Reducer<AggregationState>} */
export function aggregationReducer(state = aggregationInitialState, action) {
  switch (action.type) {
    case QUERY_CUBE_UPDATE:
      return aggregationInitialState;

    case AGGREGATION_UPDATE:
      const {aggregation, urls} = action.payload;
      return {
        aggregateUrl: aggregation.url,
        data: aggregation.data,
        emptyDataset: aggregation.data.length === 0,
        jsCall: urls.jsCall,
        logicLayerUrl: urls.llUrl,
        options: aggregation.options
      };

    default:
      return state;
  }
}
