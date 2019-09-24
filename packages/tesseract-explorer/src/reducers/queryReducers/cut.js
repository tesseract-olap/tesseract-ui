import {
  QUERY_CUTS_CREATE,
  QUERY_CUTS_CLEAR,
  QUERY_CUTS_REMOVE,
  QUERY_CUTS_REPLACE,
  QUERY_CUTS_UPDATE
} from "../../actions/query";
import {findByProperty, replaceFromArray} from "../../utils/array";

export default {
  [QUERY_CUTS_CREATE]: (state, {payload: item}) => ({
    ...state,
    cuts: [].concat(state.cuts, item)
  }),

  [QUERY_CUTS_CLEAR]: state => ({...state, cuts: []}),

  [QUERY_CUTS_REMOVE]: (state, {payload}) => ({
    ...state,
    cuts: state.cuts.filter(item => item.key !== payload.key)
  }),

  [QUERY_CUTS_UPDATE]: (state, {payload: item}) => ({
    ...state,
    cuts: replaceFromArray(state.cuts, item, findByProperty("key"))
  }),

  [QUERY_CUTS_REPLACE]: (state, {payload: cuts}) => ({...state, cuts})
};
