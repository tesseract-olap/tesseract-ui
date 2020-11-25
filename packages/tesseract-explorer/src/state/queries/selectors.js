import {createSelector} from "reselect";
import {sortByDate} from "../../utils/array";

/**
 * @param {TessExpl.State.ExplorerState | {explorer: TessExpl.State.ExplorerState}} state
 * @returns {TessExpl.State.QueriesState}
 */
export function selectQueriesState(state) {
  return "explorer" in state ? state.explorer.explorerQueries : state.explorerQueries;
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
