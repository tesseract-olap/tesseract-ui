import {AGGREGATION_UPDATE} from "../actions/aggregation";
import {QUERY_CUBE_UPDATE} from "../actions/query";

/**
 * @typedef AggregationState
 * @property {string} aggregateUrl
 * @property {any[]} data
 * @property {string} jsCall
 * @property {string} logicLayerUrl
 * @property {string} permalink
 * @property {any} options
 */

/** @type {AggregationState} */
const initialState = {
  aggregateUrl: "",
  data: [],
  jsCall: "",
  logicLayerUrl: "",
  options: {},
  permalink: ""
};

/** @type {import("redux").Reducer<AggregationState>} */
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
        options: aggregation.options,
        permalink: urls.permalink
      };

    default:
      return state;
  }
}

export default aggregationReducer;
