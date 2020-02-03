import {buildQuery} from "../../utils/structs";
import {omitRecord} from "../helpers";
import effectsCurrentParams from "../params/reducer";
import effectsCurrentResult from "../results/reducer";
import {QUERIES_CLEAR, QUERIES_REMOVE, QUERIES_SELECT, QUERIES_UPDATE} from "./actions";

/** @type {QueriesState} */
export const queriesInitialState = {
  current: "default",
  itemMap: {
    default: buildQuery({key: "default"})
  }
};

/** @type {import("redux").Reducer<QueriesState>} */
export function queriesReducer(state = queriesInitialState, {type: actionType, payload}) {
  const effector = effects[actionType];
  if (effector) {
    return effector(state, payload);
  }
  const currentQuery = state.itemMap[state.current];
  const effectorParams = effectsCurrentParams[actionType];
  if (effectorParams) {
    return effects[QUERIES_UPDATE](state, {
      ...currentQuery,
      isDirty: true,
      params: effectorParams(currentQuery.params, payload)
    });
  }
  const effectorResult = effectsCurrentResult[actionType];
  if (effectorResult) {
    return effects[QUERIES_UPDATE](state, {
      ...currentQuery,
      isDirty: payload.hasOwnProperty("data") || payload.hasOwnProperty("error")
        ? false
        : currentQuery.isDirty,
      result: effectorResult(currentQuery.result, payload)
    });
  }
  return state;
}

const effects = {
  [QUERIES_CLEAR]: (state, itemMap = {}) => {
    const current = itemMap[state.current] ? state.current : Object.keys(itemMap)[0];
    return {current, itemMap};
  },

  /** @type {(state: QueriesState, payload: string) => QueriesState} */
  [QUERIES_SELECT]: (state, current) => ({current, itemMap: state.itemMap}),

  /** @type {(state: QueriesState, payload: string) => QueriesState} */
  [QUERIES_REMOVE]: (state, queryItemKey) => {
    const itemMap = omitRecord(state.itemMap, queryItemKey);
    const current = itemMap[state.current] ? state.current : Object.keys(itemMap)[0];
    return {current, itemMap};
  },

  /** @type {(state: QueriesState, payload: QueryItem) => QueriesState} */
  [QUERIES_UPDATE]: (state, queryItem) => ({
    ...state,
    itemMap: {...state.itemMap, [queryItem.key]: queryItem}
  })
};
