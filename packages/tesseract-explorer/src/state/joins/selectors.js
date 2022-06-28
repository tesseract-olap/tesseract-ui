import {createSelector} from "reselect";
import {sortByDate} from "../../utils/array";

/**
 * @param {TessExpl.State.ExplorerState | {explorer: TessExpl.State.ExplorerState}} state
 * @returns {TessExpl.State.JoinsState}
 */
export function selectJoinsState(state) {
  return "explorer" in state ? state.explorer.explorerJoins : state.explorerJoins;
}

export const selectJoinMap = createSelector(
  selectJoinsState,
  queries => queries.itemMap
);

export const selectJoinItems = createSelector(selectJoinMap, queryMap =>
  sortByDate(Object.values(queryMap), "created", false)
);

export const selectJoinKeys = createSelector(selectJoinItems, starred =>
  starred.map(item => item.key)
);

export const selectCurrentJoinItem = createSelector(
  selectJoinsState,
  joins => joins.itemMap[joins.current]
);
