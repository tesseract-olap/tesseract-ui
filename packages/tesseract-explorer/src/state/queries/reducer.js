import {buildQuery} from "../../utils/structs";
import {omitRecord} from "../helpers";
import {paramsEffectors} from "../params/reducer";
import {resultsEffectors} from "../results/reducer";


export const QUERIES_CLEAR = "explorer/QUERIES/CLEAR";
export const QUERIES_REMOVE = "explorer/QUERIES/REMOVE";
export const QUERIES_SELECT = "explorer/QUERIES/SELECT";
export const QUERIES_UPDATE = "explorer/QUERIES/UPDATE";


/** @type {TessExpl.State.QueriesState} */
export const queriesInitialState = {
  current: "default",
  itemMap: {
    default: buildQuery({key: "default"})
  }
};


/** @type {import("redux").Reducer<TessExpl.State.QueriesState>} */
export function queriesReducer(state = queriesInitialState, {type: actionType, payload}) {
  const effector = queriesEffectors[actionType];
  if (typeof effector === "function") {
    return effector(state, payload);
  }

  const currentQuery = state.itemMap[state.current];
  const currentEffector = queriesEffectors[QUERIES_UPDATE];

  const effectorParams = paramsEffectors[actionType];
  if (effectorParams) {
    return currentEffector(state, {
      ...currentQuery,
      isDirty: true,
      params: effectorParams(currentQuery.params, payload)
    });
  }

  const effectorResult = resultsEffectors[actionType];
  if (effectorResult) {
    return currentEffector(state, {
      ...currentQuery,
      isDirty: payload.hasOwnProperty("data") || payload.hasOwnProperty("error")
        ? false
        : currentQuery.isDirty,
      result: effectorResult(currentQuery.result, payload)
    });
  }

  return state;
}

const queriesEffectors = {

  /**
   * By default, removes all queries from the application state.
   * If passed a payload, replaces the query map from the application state with
   * its contents, and selects a new current query in the UI.
   * @type {(state: TessExpl.State.QueriesState, payload?: any) => TessExpl.State.QueriesState}
   */
  [QUERIES_CLEAR]: (state, itemMap = {}) => {
    const current = itemMap[state.current] ? state.current : Object.keys(itemMap)[0];
    return {current, itemMap};
  },

  /**
   * Selects a new current query in the UI.
   * @type {(state: TessExpl.State.QueriesState, payload: string) => TessExpl.State.QueriesState}
   */
  [QUERIES_SELECT]: (state, current) => ({current, itemMap: state.itemMap}),

  /**
   * Removes a query from the application state. If this query was currently
   * selected, the selection changes to the first query in the map.
   * @type {(state: TessExpl.State.QueriesState, payload: string) => TessExpl.State.QueriesState}
   */
  [QUERIES_REMOVE]: (state, queryItemKey) => {
    const amount = Object.keys(state.itemMap).length;
    if (amount < 2) return state;

    const itemMap = omitRecord(state.itemMap, queryItemKey);
    const current = itemMap[state.current] ? state.current : Object.keys(itemMap)[0];
    return {current, itemMap};
  },

  /**
   * Updates the contents of a query.
   * The payload replaces the query in the state, instead of extending it.
   * @type {(state: TessExpl.State.QueriesState, payload: TessExpl.Struct.QueryItem) => TessExpl.State.QueriesState}
   */
  [QUERIES_UPDATE]: (state, queryItem) => ({
    current: state.current,
    itemMap: {...state.itemMap, [queryItem.key]: queryItem}
  })
};
