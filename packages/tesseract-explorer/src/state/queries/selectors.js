import {createSelector} from "reselect";
import {sortByDate} from "../../utils/array";

/** @type {(state: ExplorerState) => QueriesState} */
export function selectQueriesState(state) {
  return state.explorerQueries;
}

export const selectQueryMap = createSelector(
  selectQueriesState,
  queries => queries.itemMap
);

export const selectQueryItems = createSelector(selectQueryMap, queryMap =>
  sortByDate(Object.values(queryMap), "created", false)
);

export const selectQueryKeys = createSelector(selectQueryItems, starred =>
  starred.map(item => item.key)
);

export const selectCurrentQueryItem = createSelector(
  selectQueriesState,
  queries => queries.itemMap[queries.current]
);
