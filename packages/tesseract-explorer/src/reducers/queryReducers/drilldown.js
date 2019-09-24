import {
  QUERY_DRILLDOWNS_CLEAR,
  QUERY_DRILLDOWNS_CREATE,
  QUERY_DRILLDOWNS_REMOVE,
  QUERY_DRILLDOWNS_UPDATE
} from "../../actions/query";
import {replaceFromArray, findByProperty} from "../../utils/array";

export default {
  [QUERY_DRILLDOWNS_CLEAR]: state => ({...state, drilldowns: []}),

  [QUERY_DRILLDOWNS_CREATE]: (state, {payload}) => ({
    ...state,
    drilldowns: state.drilldowns.concat(payload)
  }),

  [QUERY_DRILLDOWNS_REMOVE]: (state, {payload}) => ({
    ...state,
    drilldowns: state.drilldowns.filter(item => item.key !== payload.key)
  }),

  [QUERY_DRILLDOWNS_UPDATE]: (state, {payload}) => ({
    ...state,
    drilldowns: replaceFromArray(state.drilldowns, payload, findByProperty("key"))
  })
};
