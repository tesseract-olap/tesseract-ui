import {buildQuery} from "../../utils/structs";
import {omitRecord} from "../helpers";
import {paramsEffectors} from "../params/reducer";
import {resultsEffectors} from "../results/reducer";


export const JOINS_CLEAR = "explorer/JOINS/CLEAR";
export const JOINS_REMOVE = "explorer/JOINS/REMOVE";
export const JOINS_SELECT = "explorer/JOINS/SELECT";
export const JOINS_UPDATE = "explorer/JOINS/UPDATE";


/** @type {TessExpl.State.JoinsState} */
export const queriesInitialState = {
  current: "default",
  itemMap: {
    default: buildQuery({key: "default"})
  }
};


/** @type {import("redux").Reducer<TessExpl.State.JoinsState>} */
export function joinsReducer(state = queriesInitialState, {type: actionType, payload}) {
  const effector = queriesEffectors[actionType];
  if (typeof effector === "function") {
    return effector(state, payload);
  }

  const currentJoin = state.itemMap[state.current];
  const currentEffector = resultsEffectors[JOINS_UPDATE];

  const effectorParams = paramsEffectors[actionType];
  if (effectorParams) {
    return currentEffector(state, {
      ...currentJoin,
      isDirty: true,
      params: effectorParams(currentJoin.params, payload)
    });
  }

  const effectorResult = resultsEffectors[actionType];
  if (effectorResult) {
    return currentEffector(state, {
      ...currentJoin,
      isDirty: payload.hasOwnProperty("data") || payload.hasOwnProperty("error")
        ? false
        : currentJoin.isDirty,
      result: effectorResult(currentJoin.result, payload)
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
  [JOINS_CLEAR]: (state, itemMap = {}) => {
    const current = itemMap[state.current] ? state.current : Object.keys(itemMap)[0];
    return {current, itemMap};
  },

  /**
   * Selects a new current query in the UI.
   * @type {(state: TessExpl.State.QueriesState, payload: string) => TessExpl.State.QueriesState}
   */
  [JOINS_SELECT]: (state, current) => ({current, itemMap: state.itemMap}),

  /**
   * Removes a query from the application state. If this query was currently
   * selected, the selection changes to the first query in the map.
   * @type {(state: TessExpl.State.QueriesState, payload: string) => TessExpl.State.QueriesState}
   */
  [JOINS_REMOVE]: (state, queryItemKey) => {
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
  [JOINS_UPDATE]: (state, queryItem) => ({
    current: state.current,
    itemMap: {...state.itemMap, [queryItem.key]: queryItem}
  })
};
