import {
  QUERY_DEBUG_TOGGLE,
  QUERY_DISTINCT_TOGGLE,
  QUERY_NONEMPTY_TOGGLE,
  QUERY_PARENTS_TOGGLE,
  QUERY_SPARSE_TOGGLE
} from "../../actions/query";

export default {
  [QUERY_DEBUG_TOGGLE]: state => ({...state, debug: !state.debug}),

  [QUERY_DISTINCT_TOGGLE]: state => ({...state, distinct: !state.distinct}),

  [QUERY_NONEMPTY_TOGGLE]: state => ({...state, nonempty: !state.nonempty}),

  [QUERY_PARENTS_TOGGLE]: state => ({...state, parents: !state.parents}),

  [QUERY_SPARSE_TOGGLE]: state => ({...state, sparse: !state.sparse})
};
